import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimitRequest } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const limit = rateLimitRequest(req, { key: 'ad-track', limit: 120, windowMs: 60 * 1000 });
  if (limit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfter ?? 60) }
    });
  }

  try {
    const { campaignId, type } = await req.json();

    if (!campaignId || !['impression', 'click'].includes(type)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.campaign.update({
        where: { id: campaignId },
        data: { [type === 'impression' ? 'impressions' : 'clicks']: { increment: 1 } },
      }),
      prisma.adEvent.create({
        data: { campaignId, type },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ad tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
