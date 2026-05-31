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

type RSSItem = Parser.Item;
type RSSFeedWithSection = Prisma.RSSFeedGetPayload<{ include: { targetSection: true } }>;

export type RSSSyncSummary = {
  feedId: string;
  feedName: string;
  items: number;
  created: number;
  skipped: number;
  failed: number;
  durationMs: number;
  errors: string[];
};

export type RSSPreviewItem = {
  title: string;
  link: string;
  pubDate?: string;
};

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
    durationMs: 0,
    errors: [],
  };

  if (!feed.isActive) {
    summary.errors.push('Fonte RSS está desativada.');
    return summary;
  }

  let finalStatus: RSSLogStatus = 'SUCCESS';

  try {
    const rss = await parser.parseURL(feed.url);
    const items = rss.items.slice(0, feed.maxItemsPerSync);
    summary.items = items.length;

    for (const item of items) {
      if (!item.link) { summary.skipped += 1; continue; }

      // Filtro de palavras-chave (whitelist)
      if (feed.keywordFilter.length > 0) {
        const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
        const matches = feed.keywordFilter.some((kw) => text.includes(kw.toLowerCase()));
        if (!matches) { summary.skipped += 1; continue; }
      }

      // Blacklist de palavras-chave
      if (feed.blacklistKeywords.length > 0) {
        const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
        const blocked = feed.blacklistKeywords.some((kw) => text.includes(kw.toLowerCase()));
        if (blocked) { summary.skipped += 1; continue; }
      }

      const existing = await prisma.rSSLog.findFirst({
        where: { feedId: feed.id, message: item.link, status: 'SUCCESS' }
      });
      if (existing) { summary.skipped += 1; continue; }

      try {
        await processArticle(item, feed);
        summary.created += 1;
      } catch (err) {
        console.error(`Failed to process ${item.link}:`, err);
        summary.failed += 1;
        summary.errors.push(item.link);
      }
    }

    if (summary.failed > 0 && summary.created === 0) finalStatus = 'FAILED';
    else if (summary.failed > 0) finalStatus = 'PARTIAL';

    // Atualiza consecutiveFailures e lastSync
    const isFailure = finalStatus === 'FAILED';
    await prisma.rSSFeed.update({
      where: { id: feedId },
      data: {
        lastSync: new Date(),
        consecutiveFailures: isFailure ? { increment: 1 } : 0,
        // Auto-desabilita após 5 falhas consecutivas
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

async function processArticle(item: RSSItem, feed: RSSFeedWithSection) {
  const link = item.link;
  if (!link) throw new Error('Item RSS sem link.');

  let articleData: { title?: string | null; excerpt?: string | null; textContent?: string | null } | null = null;
  let rawHeroImage: string | null = null;

  try {
    const response = await fetch(link, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

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

  // Divide o texto em parágrafos reais
  const paragraphs = sourceText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30)
    .slice(0, 20);

  const bodyContent = paragraphs.length > 0
    ? paragraphs.map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] }))
    : [{ type: 'paragraph', content: [{ type: 'text', text: sourceText }] }];

  // Determina status: autoPublish ignora requiresReview; caso contrário vai para IN_REVIEW
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

  // Log individual de sucesso por artigo (para rastreabilidade)
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
