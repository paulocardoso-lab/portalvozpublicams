import React from 'react';
import { prisma } from '@/lib/prisma';
import { DesktopHome } from './DesktopHome';
import { MobileHome } from './MobileHome';

export async function Home() {
  let articles: any[] = [];
  let columnists: any[] = [];
  let activeAlert: any = null;
  let featuredSeries: any = null;
  let activePodcast: any = null;
  let agendaEvents: any[] = [];
  let politica: any[] = [];
  let economia: any[] = [];
  let cidades: any[] = [];
  let mostRead: any[] = [];
  const newsletterCount = 1240;

  try {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

    const [
      fetchedArticles,
      fetchedColumnists,
      fetchedAlert,
      fetchedSeries,
      fetchedPodcast,
      fetchedAgenda,
      fetchedPolitica,
      fetchedEconomia,
      fetchedCidades,
      fetchedMostRead
    ] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { authors: true, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }),
      prisma.user.findMany({
        where: { role: { in: ['COLUMNIST', 'REPORTER'] }, status: 'ACTIVE' },
        include: { articles: { where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 1 } },
        take: 4,
      }),
      prisma.alert.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.series.findFirst({
        include: { articles: { where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 4 } }
      }),
      prisma.podcastEpisode.findFirst({
        where: { isActive: true },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.agendaEvent.findMany({
        where: { date: { gte: todayStart, lt: todayEnd } },
        orderBy: { time: 'asc' },
        take: 5,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED', section: { slug: 'politica' } },
        include: { authors: true, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED', section: { slug: 'economia' } },
        include: { authors: true, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED', section: { slug: 'cidades' } },
        include: { authors: true, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: 5,
      })
    ]);

    articles = fetchedArticles || [];
    columnists = fetchedColumnists || [];
    activeAlert = fetchedAlert;
    featuredSeries = fetchedSeries;
    activePodcast = fetchedPodcast;
    agendaEvents = fetchedAgenda || [];
    politica = fetchedPolitica || [];
    economia = fetchedEconomia || [];
    cidades = fetchedCidades || [];
    mostRead = fetchedMostRead || [];
  } catch (error) {
    console.error('Home data fetch error:', error);
  }

  return (
    <main className="w-full">
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
