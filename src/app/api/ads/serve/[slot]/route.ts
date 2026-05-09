import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slot: string } }
) {
  const slot = params.slot;

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
      return NextResponse.json({ error: 'No active campaign for this slot' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
