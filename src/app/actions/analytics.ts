'use server';

import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { rateLimitAction } from '@/lib/rate-limit';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeVisitorId(visitorId: string | undefined) {
  const trimmed = visitorId?.trim();
  if (!trimmed || trimmed.length < 16 || trimmed.length > 128) return null;
  return crypto.createHash('sha256').update(trimmed).digest('hex');
}

export async function recordView(articleId: string, visitorId?: string) {
  try {
    const limit = await rateLimitAction({ key: 'article-view', limit: 80, windowMs: 60 * 1000 });
    if (limit.limited) return { success: false };

    const today = startOfDay(new Date());
    const visitorHash = normalizeVisitorId(visitorId);

    const visitor = visitorHash
      ? prisma.siteVisitorDaily.create({
          data: { date: today, visitorHash },
        }).catch((error: { code?: string }) => {
          if (error?.code === 'P2002') return null;
          throw error;
        })
      : null;

    const createdVisitor = visitor ? await visitor : null;

    await Promise.all([
      prisma.article.update({
        where: { id: articleId },
        data: { views: { increment: 1 } },
      }),
      prisma.articleViewDaily.upsert({
        where: {
          articleId_date: {
            articleId,
            date: today,
          },
        },
        update: { views: { increment: 1 } },
        create: { articleId, date: today, views: 1 },
      }),
      prisma.siteMetric.upsert({
        where: { date: today },
        update: {
          views: { increment: 1 },
          visitors: visitorHash && createdVisitor ? { increment: 1 } : undefined,
        },
        create: {
          date: today,
          views: 1,
          visitors: createdVisitor ? 1 : 0,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error recording view:', error);
    return { success: false };
  }
}
