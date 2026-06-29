'use server';

import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { rateLimitAction } from '@/lib/rate-limit';
import { cookies, headers } from 'next/headers';
import { startOfDay, isValidVisitorId } from '@/lib/analytics-helpers';
import { parseDevice, parseReferrer } from '@/lib/view-event';

const VISITOR_COOKIE = 'vp_visitor_id';
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

async function getVisitorHash() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  if (!isValidVisitorId(visitorId)) {
    visitorId = crypto.randomUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    });
  }

  return crypto.createHash('sha256').update(visitorId as string).digest('hex');
}

export async function recordView(articleId: string) {
  try {
    const limit = await rateLimitAction({ key: 'article-view', limit: 80, windowMs: 60 * 1000 });
    if (limit.limited) return { success: false };

    const today = startOfDay(new Date());
    const visitorHash = await getVisitorHash();

    const visitor = prisma.siteVisitorDaily.create({
      data: { date: today, visitorHash },
    }).catch((error: { code?: string }) => {
      if (error?.code === 'P2002') return null;
      throw error;
    });

    const createdVisitor = await visitor;

    const headerStore = await headers();
    const ua = headerStore.get('user-agent');
    const device = parseDevice(ua);
    const referrer = parseReferrer(headerStore.get('referer'));
    const country = headerStore.get('x-vercel-ip-country') ?? headerStore.get('cf-ipcountry') ?? null;

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
          visitors: createdVisitor ? { increment: 1 } : undefined,
        },
        create: {
          date: today,
          views: 1,
          visitors: createdVisitor ? 1 : 0,
        },
      }),
      // Fire-and-forget: raw event for investigative analytics
      prisma.articleViewEvent.create({
        data: { articleId, device, referrer, country },
      }).catch(() => null),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error recording view:', error);
    return { success: false };
  }
}
