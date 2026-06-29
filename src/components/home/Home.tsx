import React from 'react';
import { prisma } from '@/lib/prisma';
import { DesktopHome } from './DesktopHome';
import { MobileHome } from './MobileHome';
import type { AgendaEvent, Alert, PodcastEpisode, Charge } from '@prisma/client';
import type { ArticleWithRelations, ArticleWithSection, SeriesWithArticles } from './DesktopHome';
import { getSiteSettings } from '@/app/actions/settings';
import { getActiveCharge } from '@/app/actions/charges';
import { getActiveVoices } from '@/app/actions/voices';
import { isDonationsEnabled } from '@/lib/donation-config';
import type { Voice } from '@prisma/client';

const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
} as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function getMostReadByPeriod(startDate: Date, take = 5) {
  const ranked = await prisma.articleViewDaily.groupBy({
    by: ['articleId'],
    where: { date: { gte: startDate } },
    _sum: { views: true },
    orderBy: { _sum: { views: 'desc' } },
    take,
  });

  const ids = ranked.map((item) => item.articleId);
  if (ids.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: { id: { in: ids }, status: 'PUBLISHED' },
    include: { section: true },
  });

  const byId = new Map(articles.map((article) => [article.id, article]));
  return ids
    .map((id) => byId.get(id))
    .filter((article): article is (typeof articles)[number] => Boolean(article));
}

export async function Home() {
  let articles: ArticleWithRelations[] = [];
  let columnists: {
    id: string;
    name: string;
    slug: string | null;
    image: string | null;
    avatar: string | null;
    bio: string | null;
    columnTitle: string | null;
    displayOrder: number;
    articles: { title: string; slug: string }[];
  }[] = [];
  let activeAlert: Alert | null = null;
  let featuredSeries: SeriesWithArticles | null = null;
  let activePodcast: PodcastEpisode | null = null;
  let agendaEvents: AgendaEvent[] = [];
  let politica: ArticleWithRelations[] = [];
  let economia: ArticleWithRelations[] = [];
  let cidades: ArticleWithRelations[] = [];
  let mostReadWeek: ArticleWithSection[] = [];
  let mostReadToday: ArticleWithSection[] = [];
  let mostReadWeekIsFallback = false;
  let mostReadTodayIsFallback = false;
  let supporterCount = 0;
  let siteSettings: Record<string, string> = {};
  let activeCharge: Charge | null = null;
  let activeVoices: Voice[] = [];
  let donationsEnabled = true;

  try {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));
    const weekStart = startOfDay(new Date());
    weekStart.setDate(weekStart.getDate() - 6);

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
      fetchedMostReadFallback,
      fetchedMostReadWeek,
      fetchedMostReadToday,
      fetchedSupporterCount
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
          columnTitle: true,
          displayOrder: true,
          articles: {
            where: { status: 'PUBLISHED' },
            select: { title: true, slug: true },
            orderBy: { publishedAt: 'desc' },
            take: 1
          }
        },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
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
        orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
        take: 5,
      }),
      getMostReadByPeriod(weekStart, 5),
      getMostReadByPeriod(todayStart, 5),
      prisma.subscription.count({ where: { status: 'ACTIVE' } })
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
    mostReadWeek = fetchedMostReadWeek.length > 0 ? fetchedMostReadWeek : fetchedMostReadFallback || [];
    mostReadToday = fetchedMostReadToday.length > 0 ? fetchedMostReadToday : fetchedMostReadFallback || [];
    mostReadWeekIsFallback = fetchedMostReadWeek.length === 0;
    mostReadTodayIsFallback = fetchedMostReadToday.length === 0;
    supporterCount = fetchedSupporterCount || 0;
    siteSettings = await getSiteSettings().catch(() => ({}));
    [activeCharge, activeVoices, donationsEnabled] = await Promise.all([
      getActiveCharge().catch(() => null),
      getActiveVoices(4).catch(() => []),
      isDonationsEnabled().catch(() => true),
    ]);
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
          mostRead={mostReadWeek}
          mostReadTitle={mostReadWeekIsFallback ? 'Mais lidas' : 'Mais lidas da semana'}
          supporterCount={supporterCount}
          siteSettings={siteSettings}
          activeCharge={activeCharge}
          activeVoices={activeVoices}
          donationsEnabled={donationsEnabled}
        />
      </div>

      <div className="block lg:hidden">
        <MobileHome
          articles={articles}
          activeAlert={activeAlert}
          featuredSeries={featuredSeries}
          mostRead={mostReadToday}
          mostReadTitle={mostReadTodayIsFallback ? 'Mais lidas' : 'Mais lidas hoje'}
          donationsEnabled={donationsEnabled}
        />
      </div>
    </main>
  );
}
