import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

function weightedRandom<T extends { weight: number }>(items: T[]): T | null {
  if (!items.length) return null;
  const total = items.reduce((s, i) => s + i.weight, 0);
  let rand = Math.random() * total;
  for (const item of items) {
    rand -= item.weight;
    if (rand <= 0) return item;
  }
  return items[items.length - 1];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  const { slot } = await params;
  const now = new Date();

  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        slot,
        status: 'ACTIVE',
        creative: { not: '' },
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      select: {
        id: true,
        name: true,
        client: true,
        slot: true,
        creative: true,
        targetUrl: true,
        impressions: true,
        clicks: true,
        weight: true,
        startsAt: true,
        endsAt: true,
        status: true,
      },
    });

    const campaign = weightedRandom(campaigns);

    if (!campaign) {
      return NextResponse.json({ slot, campaign: null }, { status: 200 });
    }

    return NextResponse.json(campaign);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
