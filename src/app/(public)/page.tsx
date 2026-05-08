import React from 'react';
import { MobileHome } from '@/components/home/MobileHome';
import { DesktopHome } from '@/components/home/DesktopHome';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Revalida a cada 5 minutos

export default async function Home() {
  // Buscar matérias recentes para a Home
  const results = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { 
        authors: true,
        section: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 12
    }),
    prisma.newsletterSubscriber.count(),
    prisma.agendaEvent.findMany({
      where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
      orderBy: { time: 'asc' },
      take: 5
    }),
    prisma.user.findMany({
      where: { role: 'COLUMNIST', status: 'ACTIVE' },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          take: 1,
          select: { title: true, slug: true }
        }
      },
      take: 6
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', section: { slug: 'politica' } },
      include: { authors: true, section: true },
      orderBy: { publishedAt: 'desc' },
      take: 3
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', section: { slug: 'economia' } },
      include: { authors: true, section: true },
      orderBy: { publishedAt: 'desc' },
      take: 3
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', section: { slug: 'cidades' } },
      include: { authors: true, section: true },
      orderBy: { publishedAt: 'desc' },
      take: 3
    }),
    prisma.alert.findFirst({
      where: { isActive: true }
    }),
    prisma.siteSetting.findUnique({
      where: { key: 'FEATURED_SERIES_ID' }
    }),
    prisma.podcastEpisode.findFirst({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' }
    })
  ]);

  const [articles, newsletterCount, agendaEvents, columnists, mostRead, politica, economia, cidades, activeAlert, featuredSeriesSetting, activePodcast] = results;

  let featuredSeries = null;
  if (featuredSeriesSetting?.value) {
    featuredSeries = await prisma.series.findUnique({
      where: { id: featuredSeriesSetting.value },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          take: 5
        }
      }
    });
  }

  return (
    <>
      <div className="md:hidden">
        <MobileHome 
          articles={articles} 
          activeAlert={activeAlert} 
          featuredSeries={featuredSeries}
          activePodcast={activePodcast}
        />
      </div>
      <div className="hidden md:block">
        <DesktopHome 
          articles={articles} 
          newsletterCount={newsletterCount} 
          agendaEvents={agendaEvents} 
          columnists={columnists}
          mostRead={mostRead}
          politica={politica}
          economia={economia}
          cidades={cidades}
          activeAlert={activeAlert}
          featuredSeries={featuredSeries}
          activePodcast={activePodcast}
        />
      </div>
    </>
  );
}
