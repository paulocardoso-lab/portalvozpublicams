import Parser from 'rss-parser';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import type { Prisma } from '@prisma/client';
import prisma from './prisma';
import { slugify } from './utils';
import { rewriteArticleContent } from './ai-service';
import { downloadAndUploadImage } from './storage';

const parser = new Parser();

type RSSItem = Parser.Item;
type RSSFeedWithSection = Prisma.RSSFeedGetPayload<{ include: { targetSection: true } }>;

export type RSSSyncSummary = {
  feedId: string;
  feedName: string;
  items: number;
  created: number;
  skipped: number;
  failed: number;
  errors: string[];
};

export async function syncFeed(feedId: string) {
  const feed = await prisma.rSSFeed.findUnique({
    where: { id: feedId },
    include: { targetSection: true }
  });

  if (!feed) {
    throw new Error('Fonte RSS não encontrada.');
  }

  const summary: RSSSyncSummary = {
    feedId: feed.id,
    feedName: feed.name,
    items: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  if (!feed.isActive) {
    summary.errors.push('Fonte RSS está desativada.');
    return summary;
  }

  try {
    const rss = await parser.parseURL(feed.url);
    summary.items = rss.items.length;
    
    for (const item of rss.items) {
      if (!item.link) {
        summary.skipped += 1;
        continue;
      }

      // Verificar se já existe log para este link (evitar duplicados)
      const existing = await prisma.rSSLog.findFirst({
        where: { feedId: feed.id, message: item.link, status: 'SUCCESS' }
      });
      if (existing) {
        summary.skipped += 1;
        continue;
      }

      try {
        await processArticle(item, feed);
        summary.created += 1;
      } catch (err) {
        console.error(`Failed to process ${item.link}:`, err);
        summary.failed += 1;
        summary.errors.push(item.link);
        await prisma.rSSLog.create({
          data: {
            feedId: feed.id,
            status: 'FAILED',
            message: `${item.link} :: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
          }
        });
      }
    }

    await prisma.rSSFeed.update({
      where: { id: feedId },
      data: { lastSync: new Date() }
    });

    return summary;
  } catch (error) {
    console.error(`RSS sync error for ${feed.name}:`, error);
    summary.failed += 1;
    summary.errors.push(error instanceof Error ? error.message : 'Erro geral ao ler o feed.');
    await prisma.rSSLog.create({
      data: {
        feedId: feed.id,
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Erro geral ao ler o feed.',
      }
    });
    return summary;
  }
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
    if (process.env.NODE_ENV !== "production") {
      console.warn(`RSS article fetch fallback for ${link}:`, error);
    }
  }

  const fallbackText = item.contentSnippet || item.content || item.summary || item.title || link;
  const sourceTitle = item.title || articleData?.title || 'Sem título';
  const sourceLead = articleData?.excerpt || item.contentSnippet || item.summary || '';
  const sourceText = articleData?.textContent || fallbackText;

  if (!sourceText) throw new Error('Item RSS sem conteúdo aproveitável.');

  // INTEGRAÇÃO COM IA (Gemini)
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
  
  // Criar matéria no banco
  const article = await prisma.article.create({
    data: {
      title: aiTitle,
      slug: `${slug}-${crypto.randomUUID().slice(0, 8)}`,
      lead: aiLead,
      body: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: sourceText }]
          }
        ]
      },
      status: feed.autoPublish ? 'PUBLISHED' : 'DRAFT',
      sectionId: feed.targetSectionId,
      publishedAt: new Date(),
      heroImage: heroImageUrl,
      tags: {
        connectOrCreate: normalizedTags.map((tag: { name: string; slug: string }) => ({
          where: { slug: tag.slug },
          create: { name: tag.name, slug: tag.slug }
        }))
      }
    }
  });

  await prisma.rSSLog.create({
    data: {
      feedId: feed.id,
      articleId: article.id,
      status: 'SUCCESS',
      message: link,
    }
  });
}
