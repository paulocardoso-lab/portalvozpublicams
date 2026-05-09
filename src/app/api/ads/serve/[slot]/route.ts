import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slot: string }> }
) {
  const { slot } = await params;

  try {
    // Buscar uma campanha ativa para este slot
    // Idealmente, poderíamos fazer uma rotação aleatória ou baseada em peso
    const campaign = await prisma.campaign.findFirst({
      where: {
        slot,
        status: 'ACTIVE',
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() }
      }
    });

    if (!campaign) {
      // Return a harmless placeholder when no active campaign exists
      return NextResponse.json({ slot, message: 'No active campaign', campaign: null }, { status: 200 })
    }

    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
