import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { retentionDays } from '@/lib/analytics-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (process.env.NODE_ENV === 'production' && (!expected || authHeader !== expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const days = retentionDays();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);

  try {
    const deletedVisitors = await prisma.siteVisitorDaily.deleteMany({
      where: { date: { lt: cutoff } },
    });

    return NextResponse.json({
      ok: true,
      retentionDays: days,
      cutoff: cutoff.toISOString(),
      deletedVisitors: deletedVisitors.count,
    });
  } catch (error) {
    console.error('cleanup-analytics cron error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
