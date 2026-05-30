import React from 'react';
import { prisma } from '@/lib/prisma';
import { DesktopHome } from './DesktopHome';
import { MobileHome } from './MobileHome';
import type { AgendaEvent, Alert, PodcastEpisode } from '@prisma/client';
import type { ArticleWithRelations, ArticleWithSection, SeriesWithArticles } from './DesktopHome';

const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
} as const;

export async function Home() {
  let articles: ArticleWithRelations[] = [];
  let columnists: {
    id: string;
    name: string;
    slug: string | null;
    image: string | null;
    avatar: string | null;
    bio: string | null;
    articles: { title: string; slug: string }[];
  }[] = [];
  let activeAlert: Alert | null = null;
  let featuredSeries: SeriesWithArticles | null = null;
  let activePodcast: PodcastEpisode | null = null;
  let agendaEvents: AgendaEvent[] = [];
  let politica: ArticleWithRelations[] = [];
  let economia: ArticleWithRelations[] = [];
  let cidades: ArticleWithRelations[] = [];
  let mostRead: ArticleWithSection[] = [];
  let newsletterCount = 0;

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
      fetchedMostRead,
      fetchedNewsletterCount
    ] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { authors: { select: publicAuthorSelect }, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }),
      prisma.user.findMany({
        where: { role: { in: ['COLUMNIST', 'REPORTER'] }, status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          avatar: true,
          bio: true,
          articles: {
            where: { status: 'PUBLISHED' },
            select: { title: true, slug: true },
            orderBy: { publishedAt: 'desc' },
            take: 1
          }
        },
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
        include: { authors: { select: publicAuthorSelect }, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED', section: { slug: 'economia' } },
        include: { authors: { select: publicAuthorSelect }, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED', section: { slug: 'cidades' } },
        include: { authors: { select: publicAuthorSelect }, section: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        include: { section: true },
        orderBy: { views: 'desc' },
        take: 5,
      }),
      prisma.newsletterSubscriber.count()
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
    newsletterCount = fetchedNewsletterCount || 0;
  } catch (error) {
    console.error('Home data fetch error:', error);
  }

  return (
    <main className="w-full">
      <div className="hidden lg:block">
        <DesktopHome 
          articles={articles}
          columnists={columnists}
          activeAlert={activeAlert}
          featuredSeries={featuredSeries}
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
          featuredSeries={featuredSeries}
          mostRead={mostRead}
        />
      </div>
    </main>
  );
}
