import React from 'react';
import { prisma } from '@/lib/prisma';
import { DesktopHome } from './DesktopHome';
import { MobileHome } from './MobileHome';

export async function Home() {
  // Fetch data for both views
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      authors: true,
      section: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 10,
  });

  const columnists = await prisma.user.findMany({
    where: { 
      role: { in: ['COLUMNIST', 'REPORTER'] },
      status: 'ACTIVE'
    },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 1,
      }
    },
    take: 4,
  });

  const activeAlert = await prisma.alert.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const featuredSeries = await prisma.series.findFirst({
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      }
    }
  });

  const activePodcast = await prisma.podcastEpisode.findFirst({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' },
  });

  const agendaEvents = await prisma.agendaEvent.findMany({
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      }
    },
    orderBy: { time: 'asc' },
    take: 5,
  });

  const politica = await prisma.article.findMany({
    where: { status: 'PUBLISHED', section: { slug: 'politica' } },
    include: { authors: true, section: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  const economia = await prisma.article.findMany({
    where: { status: 'PUBLISHED', section: { slug: 'economia' } },
    include: { authors: true, section: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  const cidades = await prisma.article.findMany({
    where: { status: 'PUBLISHED', section: { slug: 'cidades' } },
    include: { authors: true, section: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  // Most read (simulated for now by views)
  const mostRead = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { views: 'desc' },
    take: 5,
  });

  const newsletterCount = 1240; // Simulated static count

  return (
    <main className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopHome 
          articles={articles}
          columnists={columnists as any}
          activeAlert={activeAlert}
          featuredSeries={featuredSeries as any}
          activePodcast={activePodcast}
          agendaEvents={agendaEvents}
          politica={politica}
          economia={economia}
          cidades={cidades}
          mostRead={mostRead}
          newsletterCount={newsletterCount}
        />
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <MobileHome 
          articles={articles}
          activeAlert={activeAlert}
          featuredSeries={featuredSeries as any}
          activePodcast={activePodcast}
        />
      </div>
    </main>
  );
}
