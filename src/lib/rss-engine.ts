import Parser from 'rss-parser';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import type { Prisma, RSSLogStatus } from '@prisma/client';
import prisma from './prisma';
import { slugify } from './utils';
import { rewriteArticleContent } from './ai-service';
import { downloadAndUploadImage } from './storage';

const parser = new Parser();
const RSS_SYSTEM_USER_ID = 'rss-system-user-0000000000000001';
const MAX_DEAD_LETTER_ATTEMPTS = 3;

type RSSItem = Parser.Item;
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
        where: { feedId: feed.id, message: item.link, status: 'SUCCESS' }
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

// ── Article processing ────────────────────────────────────────────────────────

async function processArticle(item: RSSItem, feed: RSSFeedWithSection) {
  const link = item.link;
  if (!link) throw new Error('Item RSS sem link.');

  let articleData: { title?: string | null; excerpt?: string | null; textContent?: string | null } | null = null;
  let rawHeroImage: string | null = null;

  try {
    const response = await withRetry(
      () => fetch(link, { signal: AbortSignal.timeout(15000) }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r;
      }),
      { attempts: 2, baseDelayMs: 1500 }
    );

    const html = await response.text();
    const { document } = parseHTML(html);
    const reader = new Readability(document as unknown as Document);
    articleData = reader.parse();
    rawHeroImage = (document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null)?.content || null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`RSS article fetch fallback for ${link}:`, error);
    }
  }

  const fallbackText = item.contentSnippet || item.content || item.summary || item.title || link;
  const sourceTitle = item.title || articleData?.title || 'Sem título';
  const sourceLead = articleData?.excerpt || item.contentSnippet || item.summary || '';
  const sourceText = articleData?.textContent || fallbackText;

  if (!sourceText) throw new Error('Item RSS sem conteúdo aproveitável.');

  const { title: aiTitle, lead: aiLead, tags } = await rewriteArticleContent(
    sourceTitle,
    sourceLead,
    sourceText
  );

  const slug = slugify(aiTitle);
  let heroImageUrl = rawHeroImage;
  const normalizedTags = (Array.isArray(tags) ? tags : [])
    .map((tag: string) => ({ name: tag.trim(), slug: slugify(tag) }))
    .filter((tag: { name: string; slug: string }) => tag.name && tag.slug);

  if (rawHeroImage) {
    heroImageUrl = await downloadAndUploadImage(rawHeroImage);
  }

  const paragraphs = sourceText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30)
    .slice(0, 20);

  const bodyContent = paragraphs.length > 0
    ? paragraphs.map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] }))
    : [{ type: 'paragraph', content: [{ type: 'text', text: sourceText }] }];

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
      message: link,
      itemsTotal: 1,
      itemsCreated: 1,
    },
  });
}
