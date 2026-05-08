import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { syncFeed } from '@/lib/rss-engine';

// Vercel Cron: https://vercel.com/docs/cron-jobs
export async function GET(request: Request) {
  // Verificar token de segurança (configurar no Vercel)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const activeFeeds = await prisma.rSSFeed.findMany({
      where: { isActive: true },
      select: { id: true }
    });

    const results = [];
    for (const feed of activeFeeds) {
      await syncFeed(feed.id);
      results.push({ id: feed.id, status: 'SYNCED' });
    }

    return NextResponse.json({ 
      success: true, 
      processed: activeFeeds.length,
      results 
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
