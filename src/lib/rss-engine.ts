import Parser from 'rss-parser';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import prisma from './prisma';
import { slugify } from './utils';
import { rewriteArticleContent } from './ai-service';
import { downloadAndUploadImage } from './storage';

const parser = new Parser();

export async function syncFeed(feedId: string) {
  const feed = await prisma.rSSFeed.findUnique({
    where: { id: feedId },
    include: { targetSection: true }
  });

  if (!feed || !feed.isActive) return;

  try {
    const rss = await parser.parseURL(feed.url);
    
    for (const item of rss.items) {
      if (!item.link) continue;

      // Verificar se já existe log para este link (evitar duplicados)
      const existing = await prisma.rSSLog.findFirst({
        where: { feedId: feed.id, message: item.link }
      });
      if (existing) continue;

      try {
        await processArticle(item, feed);
      } catch (err) {
        console.error(`Failed to process ${item.link}:`, err);
        await prisma.rSSLog.create({
          data: {
            feedId: feed.id,
            status: 'FAILED',
            message: item.link,
          }
        });
      }
    }

    await prisma.rSSFeed.update({
      where: { id: feedId },
      data: { lastSync: new Date() }
    });

  } catch (error) {
    console.error(`RSS sync error for ${feed.name}:`, error);
  }
}

async function processArticle(item: any, feed: any) {
  const response = await fetch(item.link);
  const html = await response.text();
  const dom = new JSDOM(html, { url: item.link });
  
  const reader = new Readability(dom.window.document);
  const articleData = reader.parse();

  if (!articleData) throw new Error('Could not parse article content');

  // INTEGRAÇÃO COM IA (Gemini)
  const { title: aiTitle, lead: aiLead, tags } = await rewriteArticleContent(
    item.title || articleData.title || 'Sem título',
    articleData.excerpt || '',
    articleData.textContent || ''
  );

  const slug = slugify(aiTitle);
  
  const rawHeroImage = (dom.window.document.querySelector('meta[property="og:image"]') as any)?.content || null;
  let heroImageUrl = rawHeroImage;

  if (rawHeroImage) {
    heroImageUrl = await downloadAndUploadImage(rawHeroImage);
  }
  
  // Criar matéria no banco
  const article = await prisma.article.create({
    data: {
      title: aiTitle,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      lead: aiLead,
      body: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: articleData.textContent }]
          }
        ]
      },
      status: feed.autoPublish ? 'PUBLISHED' : 'DRAFT',
      sectionId: feed.targetSectionId,
      publishedAt: new Date(),
      heroImage: heroImageUrl,
      tags: {
        connectOrCreate: tags.map((t: string) => ({
          where: { name: t },
          create: { name: t, slug: slugify(t) }
        }))
      }
    }
  });

  await prisma.rSSLog.create({
    data: {
      feedId: feed.id,
      articleId: article.id,
      status: 'SUCCESS',
      message: item.link,
    }
  });
}
