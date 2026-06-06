import Parser from 'rss-parser';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import type { Prisma, RSSLogStatus } from '@prisma/client';
import prisma from './prisma';
import { slugify } from './utils';
import { rewriteArticleContent, humanizeArticleContent } from './ai-service';
import { downloadAndUploadImage } from './storage';
import { selectRSSHeroImage } from './rss-image-extractor';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure', { keepArray: false }],
    ],
  },
});
const RSS_SYSTEM_USER_ID = 'rss-system-user-0000000000000001';
const MAX_DEAD_LETTER_ATTEMPTS = 3;

type RSSItem = Parser.Item & {
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string };
};
type RSSFeedWithSection = Prisma.RSSFeedGetPayload<{ include: { targetSection: true } }>;

export type RSSSyncSummary = {
  feedId: string;
  feedName: string;
  items: number;
  created: number;
  skipped: number;
  failed: number;
  deadLettered: number;
  durationMs: number;
  errors: string[];
};

export type RSSPreviewItem = {
  title: string;
  link: string;
  pubDate?: string;
};

// ── Levenshtein similarity ────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarityRatio(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a.toLowerCase(), b.toLowerCase()) / maxLen;
}

// ── Retry with exponential backoff ────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  { attempts = 3, baseDelayMs = 1000 }: { attempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** i));
      }
    }
  }
  throw lastError;
}

function resolveArticleUrl(item: RSSItem): string {
  const link = item.link || '';

  // Google News links encode the real URL inside the path — extract the source
  // link from the <a> in item.content when available
  if (link.includes('news.google.com') && item.content) {
    const match = item.content.match(/href=["'](https?:\/\/(?!news\.google\.com)[^"']+)["']/i);
    if (match?.[1]) return match[1];
  }

  return link;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function previewFeed(url: string): Promise<RSSPreviewItem[]> {
  const rss = await parser.parseURL(url);
  return rss.items.slice(0, 3).map((item) => ({
    title: item.title || '(sem título)',
    link: item.link || '',
    pubDate: item.pubDate,
  }));
}

export async function syncFeed(feedId: string): Promise<RSSSyncSummary> {
  const startedAt = Date.now();

  const feed = await prisma.rSSFeed.findUnique({
    where: { id: feedId },
    include: { targetSection: true }
  });

  if (!feed) throw new Error('Fonte RSS não encontrada.');

  const summary: RSSSyncSummary = {
    feedId: feed.id,
    feedName: feed.name,
    items: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    deadLettered: 0,
    durationMs: 0,
    errors: [],
  };

  if (!feed.isActive) {
    summary.errors.push('Fonte RSS está desativada.');
    return summary;
  }

  let finalStatus: RSSLogStatus = 'SUCCESS';

  // Pré-carrega títulos recentes para deduplicação por similaridade
  const recentArticles = await prisma.article.findMany({
    where: { sectionId: feed.targetSectionId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { title: true },
  });
  const recentTitles = recentArticles.map((a) => a.title.toLowerCase());

  try {
    const rss = await withRetry(() => parser.parseURL(feed.url), { attempts: 3, baseDelayMs: 2000 });
    const items = rss.items.slice(0, feed.maxItemsPerSync);
    summary.items = items.length;

    for (const item of items) {
      if (!item.link) { summary.skipped += 1; continue; }

      // Whitelist
      if (feed.keywordFilter.length > 0) {
        const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
        if (!feed.keywordFilter.some((kw) => text.includes(kw.toLowerCase()))) {
          summary.skipped += 1; continue;
        }
      }

      // Blacklist
      if (feed.blacklistKeywords.length > 0) {
        const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
        if (feed.blacklistKeywords.some((kw) => text.includes(kw.toLowerCase()))) {
          summary.skipped += 1; continue;
        }
      }

      // Dedup por URL (log individual de sucesso)
      const alreadyLogged = await prisma.rSSLog.findFirst({
        where: {
          feedId: feed.id,
          status: 'SUCCESS',
          OR: [
            { message: item.link },
            { message: { startsWith: `${item.link} |` } },
          ],
        }
      });
      if (alreadyLogged) { summary.skipped += 1; continue; }

      // Dedup por similaridade de título (>= 85% similar = duplicata)
      if (item.title) {
        const normalized = item.title.toLowerCase();
        const isDuplicate = recentTitles.some(
          (t) => similarityRatio(normalized, t) >= 0.85
        );
        if (isDuplicate) { summary.skipped += 1; continue; }
      }

      // Verifica dead-letter: já tentou MAX_DEAD_LETTER_ATTEMPTS vezes sem sucesso?
      const deadLetter = await prisma.rSSDeadLetter.findUnique({
        where: { feedId_url: { feedId: feed.id, url: item.link } },
      });
      if (deadLetter && deadLetter.attempts >= MAX_DEAD_LETTER_ATTEMPTS && !deadLetter.resolvedAt) {
        summary.skipped += 1; continue;
      }

      try {
        await processArticle(item, feed);
        summary.created += 1;
        recentTitles.push((item.title || '').toLowerCase());

        // Remove do dead-letter se estava lá (resolvido)
        if (deadLetter) {
          await prisma.rSSDeadLetter.update({
            where: { id: deadLetter.id },
            data: { resolvedAt: new Date() },
          });
        }
      } catch (err) {
        console.error(`Failed to process ${item.link}:`, err);
        summary.failed += 1;
        summary.errors.push(item.link);

        const errorMsg = err instanceof Error ? err.message : String(err);
        const newAttempts = (deadLetter?.attempts ?? 0) + 1;

        await prisma.rSSDeadLetter.upsert({
          where: { feedId_url: { feedId: feed.id, url: item.link } },
          create: {
            feedId: feed.id,
            url: item.link,
            title: item.title ?? null,
            attempts: 1,
            lastError: errorMsg,
          },
          update: {
            attempts: { increment: 1 },
            lastError: errorMsg,
            resolvedAt: null,
          },
        });

        if (newAttempts >= MAX_DEAD_LETTER_ATTEMPTS) {
          summary.deadLettered += 1;
        }
      }
    }

    if (summary.failed > 0 && summary.created === 0) finalStatus = 'FAILED';
    else if (summary.failed > 0) finalStatus = 'PARTIAL';

    const isFailure = finalStatus === 'FAILED';
    await prisma.rSSFeed.update({
      where: { id: feedId },
      data: {
        lastSync: new Date(),
        consecutiveFailures: isFailure ? { increment: 1 } : 0,
        ...(isFailure && feed.consecutiveFailures + 1 >= 5
          ? { isActive: false, disabledAt: new Date() }
          : {}),
      },
    });

  } catch (error) {
    console.error(`RSS sync error for ${feed.name}:`, error);
    finalStatus = 'FAILED';
    summary.failed += 1;
    summary.errors.push(error instanceof Error ? error.message : 'Erro geral ao ler o feed.');

    await prisma.rSSFeed.update({
      where: { id: feedId },
      data: {
        consecutiveFailures: { increment: 1 },
        ...(feed.consecutiveFailures + 1 >= 5
          ? { isActive: false, disabledAt: new Date() }
          : {}),
      },
    });
  }

  summary.durationMs = Date.now() - startedAt;

  await prisma.rSSLog.create({
    data: {
      feedId: feed.id,
      status: finalStatus,
      message: summary.errors.length > 0 ? summary.errors.join(' | ') : null,
      itemsTotal:   summary.items,
      itemsCreated: summary.created,
      itemsSkipped: summary.skipped,
      itemsFailed:  summary.failed,
      durationMs:   summary.durationMs,
    },
  });

  return summary;
}

// ── Content extraction helpers ────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extracts clean text paragraphs from the best available source.
 * Priority: Readability HTML → Readability textContent → RSS item.content → item.contentSnippet
 */
function extractParagraphs(
  readabilityHtml: string | null | undefined,
  readabilityText: string | null | undefined,
  item: RSSItem
): string[] {
  // 1. Extract from Readability HTML — splits on <p> tags (best quality)
  if (readabilityHtml) {
    const chunks = readabilityHtml
      .split(/<\/p>|<br\s*\/?>/i)
      .map(chunk => stripHtml(chunk).trim())
      .filter(p => p.length > 40);

    if (chunks.length >= 2) {
      return chunks.slice(0, 30);
    }
  }

  // 2. Extract from Readability textContent — split on double newlines
  if (readabilityText && readabilityText.trim().length > 200) {
    const chunks = readabilityText
      .split(/\n{2,}/)
      .map(p => p.replace(/\n/g, ' ').trim())
      .filter(p => p.length > 40);

    if (chunks.length >= 2) {
      return chunks.slice(0, 30);
    }

    // Single-newline split as last resort on textContent
    const singleSplit = readabilityText
      .split(/\n/)
      .map(p => p.trim())
      .filter(p => p.length > 60);

    if (singleSplit.length >= 2) {
      return singleSplit.slice(0, 30);
    }
  }

  // 3. RSS item.content HTML (often includes full article HTML in well-structured feeds)
  if (item.content && item.content.length > 200) {
    const chunks = item.content
      .split(/<\/p>|<br\s*\/?>/i)
      .map(chunk => stripHtml(chunk).trim())
      .filter(p => p.length > 40);

    if (chunks.length >= 2) {
      return chunks.slice(0, 30);
    }

    // Plain text fallback from RSS content
    const plain = stripHtml(item.content);
    if (plain.length > 200) {
      return plain
        .split(/\n{2,}/)
        .map(p => p.replace(/\n/g, ' ').trim())
        .filter(p => p.length > 40)
        .slice(0, 30);
    }
  }

  // 4. contentSnippet / summary — last resort, produces minimal body
  const snippet = (item.contentSnippet || item.summary || '').trim();
  if (snippet.length > 40) {
    return [snippet];
  }

  return [];
}

// ── Article processing ────────────────────────────────────────────────────────

async function processArticle(item: RSSItem, feed: RSSFeedWithSection) {
  if (!item.link) throw new Error('Item RSS sem link.');

  const link = resolveArticleUrl(item);

  let articleData: { title?: string | null; excerpt?: string | null; textContent?: string | null; content?: string | null } | null = null;
  let sourceDocument: Document | null = null;

  try {
    const response = await withRetry(
      () => fetch(link, {
        signal: AbortSignal.timeout(20000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        },
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r;
      }),
      { attempts: 3, baseDelayMs: 2000 }
    );

    const html = await response.text();
    const { document } = parseHTML(html);
    sourceDocument = document as unknown as Document;
    const reader = new Readability(document as unknown as Document);
    articleData = reader.parse();
  } catch (error) {
    console.warn(`RSS fetch failed for ${link}:`, error instanceof Error ? error.message : error);
  }

  const heroImageSelection = selectRSSHeroImage({
    item,
    document: sourceDocument,
    sourceUrl: link,
  });
  const rawHeroImage = heroImageSelection.url;

  // ── Build body paragraphs ────────────────────────────────────────────────────
  // Priority: Readability HTML content → Readability textContent → RSS item.content → contentSnippet
  const bodyParagraphs = extractParagraphs(articleData?.content, articleData?.textContent, item);

  // Source text for AI rewrite: use Readability textContent when available (richer than snippet)
  const sourceTextForAI = (articleData?.textContent || '').trim() ||
    stripHtml(item.content || '') ||
    item.contentSnippet || item.summary || '';

  const sourceTitle = item.title || articleData?.title || 'Sem título';
  const sourceLead  = articleData?.excerpt || item.contentSnippet || item.summary || '';

  if (bodyParagraphs.length === 0 && !sourceTextForAI) {
    throw new Error('Item RSS sem conteúdo aproveitável.');
  }

  // Run rewrite (title/lead/tags) and humanization (body) in parallel
  const rawBodyParagraphs = bodyParagraphs.length > 0
    ? bodyParagraphs
    : [sourceTextForAI || sourceLead || sourceTitle].filter(Boolean);

  const [
    { title: aiTitle, lead: aiLead, tags },
    humanizedParagraphs,
  ] = await Promise.all([
    rewriteArticleContent(sourceTitle, sourceLead, sourceTextForAI),
    humanizeArticleContent(sourceTitle, rawBodyParagraphs),
  ]);

  const slug = slugify(aiTitle);
  let heroImageUrl = rawHeroImage;
  const normalizedTags = (Array.isArray(tags) ? tags : [])
    .map((tag: string) => ({ name: tag.trim(), slug: slugify(tag) }))
    .filter((tag: { name: string; slug: string }) => tag.name && tag.slug);

  if (rawHeroImage) {
    heroImageUrl = await downloadAndUploadImage(rawHeroImage);
  }

  // Build Tiptap body with humanized paragraphs + source attribution node at the end
  const paragraphNodes = humanizedParagraphs.map((p) => ({
    type: 'paragraph',
    content: [{ type: 'text', text: p }],
  }));

  // Extract readable source name from URL hostname
  let sourceName: string;
  try {
    sourceName = new URL(link).hostname.replace(/^www\./, '');
  } catch {
    sourceName = link;
  }

  const attributionNode = {
    type: 'sourceAttribution',
    attrs: {
      sourceName,
      sourceUrl: link,
    },
  };

  const bodyContent = [...paragraphNodes, attributionNode];

  const articleStatus = feed.autoPublish
    ? 'PUBLISHED'
    : feed.requiresReview
      ? 'IN_REVIEW'
      : 'DRAFT';

  const article = await prisma.article.create({
    data: {
      title: aiTitle,
      slug: `${slug}-${crypto.randomUUID().slice(0, 8)}`,
      lead: aiLead,
      body: { type: 'doc', content: bodyContent },
      status: articleStatus,
      sectionId: feed.targetSectionId,
      publishedAt: feed.autoPublish ? new Date() : null,
      heroImage: heroImageUrl,
      sourceUrl: link,
      authors: { connect: { id: RSS_SYSTEM_USER_ID } },
      tags: {
        connectOrCreate: normalizedTags.map((tag: { name: string; slug: string }) => ({
          where: { slug: tag.slug },
          create: { name: tag.name, slug: tag.slug },
        })),
      },
    },
  });

  await prisma.rSSLog.create({
    data: {
      feedId: feed.id,
      articleId: article.id,
      status: 'SUCCESS',
      message: `${link} | heroImage=${heroImageSelection.source ?? 'none'} | rejectedImages=${heroImageSelection.rejected.length}`,
      itemsTotal: 1,
      itemsCreated: 1,
    },
  });
}
