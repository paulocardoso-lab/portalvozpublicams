'use server';

import prisma from '@/lib/prisma';

export async function recordView(articleId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Run updates in parallel
    await Promise.all([
      // 1. Increment article views
      prisma.article.update({
        where: { id: articleId },
        data: { views: { increment: 1 } },
      }),
      // 2. Increment site-wide daily metrics
      prisma.siteMetric.upsert({
        where: { date: today },
        update: { views: { increment: 1 } },
        create: { date: today, views: 1 },
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error recording view:', error);
    return { success: false };
  }
}
