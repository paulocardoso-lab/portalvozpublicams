import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get('campaignId');
  const days = Math.min(parseInt(searchParams.get('days') ?? '30', 10), 365);
  const format = searchParams.get('format') ?? 'json';

  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const where = campaignId
    ? { campaignId, createdAt: { gte: since } }
    : { createdAt: { gte: since } };

  const [events, campaigns] = await Promise.all([
    prisma.adEvent.findMany({
      where,
      select: { campaignId: true, type: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.campaign.findMany({
      select: { id: true, name: true, client: true, slot: true },
    }),
  ]);

  const campaignMap = Object.fromEntries(campaigns.map(c => [c.id, c]));

  // Group by date + campaignId
  type Row = { date: string; campaignId: string; name: string; client: string; slot: string; impressions: number; clicks: number };
  const rows: Record<string, Row> = {};

  for (const ev of events) {
    const date = ev.createdAt.toISOString().slice(0, 10);
    const key = `${date}__${ev.campaignId}`;
    if (!rows[key]) {
      const c = campaignMap[ev.campaignId];
      rows[key] = { date, campaignId: ev.campaignId, name: c?.name ?? '—', client: c?.client ?? '—', slot: c?.slot ?? '—', impressions: 0, clicks: 0 };
    }
    if (ev.type === 'impression') rows[key].impressions++;
    else if (ev.type === 'click') rows[key].clicks++;
  }

  const data = Object.values(rows).sort((a, b) => a.date.localeCompare(b.date));

  if (format === 'csv') {
    const header = 'Data,Campanha,Cliente,Slot,Impressões,Cliques,CTR\n';
    const body = data.map(r => {
      const ctr = r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(2) : '0.00';
      return `${r.date},"${r.name}","${r.client}",${r.slot},${r.impressions},${r.clicks},${ctr}%`;
    }).join('\n');

    return new NextResponse(header + body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ads-report-${new Date().toISOString().slice(0,10)}.csv"`,
      },
    });
  }

  return NextResponse.json(data);
}
