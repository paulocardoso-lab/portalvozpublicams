import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { campaignId, type } = await req.json();

    if (!campaignId || !['impression', 'click'].includes(type)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (type === 'impression') {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { impressions: { increment: 1 } },
      });
    } else {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ad tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
