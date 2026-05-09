import React from 'react';
import Link from 'next/link';
import { ImgPH } from '@/components/shared/ImgPH';
import { Tag } from '@/components/shared/Tag';
import { Headline } from '@/components/shared/Headline';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { SafeImage } from '@/components/shared/SafeImage';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import type { Article, User, Section, AgendaEvent, Alert, Series, PodcastEpisode } from '@prisma/client';

type ArticleWithRelations = Article & {
  authors: User[];
  section: Section;
};

type SeriesWithArticles = Series & {
  articles: Article[];
};

interface DesktopHomeProps {
  articles?: ArticleWithRelations[];
  newsletterCount?: number;
  agendaEvents?: AgendaEvent[];
  columnists?: (User & { articles: { title: string; slug: string }[] })[];
  mostRead?: ArticleWithRelations[];
  politica?: ArticleWithRelations[];
  economia?: ArticleWithRelations[];
  cidades?: ArticleWithRelations[];
  activeAlert?: Alert | null;
  featuredSeries?: SeriesWithArticles | null;
  activePodcast?: PodcastEpisode | null;
}

/**
 * DesktopHome — Vista de desktop do portal.
 * Implementa grid editorial 320px-sidebar e alta densidade de informação.
 */
export function DesktopHome({ 
  articles = [], 
  newsletterCount = 4812,
  agendaEvents = [],
  columnists = [],
  mostRead = [],
  activeAlert,
  featuredSeries,
  activePodcast,
  politica = [],
  economia = [],
  cidades = []
}: DesktopHomeProps) {
  const hero = articles[0];
  const secondary = articles.slice(1, 4);

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      {/* 1. Breaking/live strip */}
      {activeAlert && (
        <div className="border-b border-vp-border bg-vp-surface px-7 py-2 flex items-center gap-3.5">
          <Tag variant="live">AO VIVO</Tag>
          <span className="font-sans text-[12px] text-vp-text font-bold">
            {activeAlert.message}
          </span>
          <span className="text-vp-text-3 font-sans text-[11px] ml-auto">
            atualizado há 4 min
          </span>
        </div>
      )}

      {/* 2. Top leaderboard ad */}
      <div className="px-7 pt-4">
        <div className="vp-ad h-[90px] w-full flex items-center justify-center text-vp-text-4 font-mono text-[11px]">
          728 × 90 — LEADERBOARD
        </div>
      </div>

      {/* 3. Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-8 px-7 py-6">
        {/* Left column */}
        <div className="flex flex-col">
          {/* Hero Section */}
          <section className="grid grid-cols-[1.1fr_1fr] gap-7 pb-7 border-b border-vp-border">
            {hero && (
              <>
                <div>
                  <Eyebrow className="mb-2">{hero.eyebrow || `${hero.section?.name} · Exclusivo`}</Eyebrow>
                  <Headline as="h1" size="hero" href={`/materia/${hero.slug}`} className="!text-[46px] mb-3.5 leading-[1.05]">
                    {hero.title}
                  </Headline>
                  <p className="font-serif text-[17px] text-vp-text-2 leading-[1.5] mb-4">
                    {hero.lead}
                  </p>
                  <div className="byline">
                    Por <strong className="text-vp-text">{hero.authors?.map(a => a.name).join(' e ') || 'Redação'}</strong> · {hero.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(hero.publishedAt)) : ''}
                  </div>
                </div>
                <div>
                  {hero.heroImage ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm group">
                      <SafeImage src={hero.heroImage} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                  ) : (
                    <ImgPH label="capa" height={380} />
                  )}
                  <p className="font-serif italic text-[11px] text-vp-text-3 mt-2">
                    {hero.heroCaption || 'Foto: Voz Pública'}
                  </p>
                </div>
              </>
            )}
          </section>

          {/* Secondary 3-up row */}
          <section className="grid grid-cols-3 gap-6 py-7 border-b border-vp-border">
            {secondary.map((art, i) => (
              <article key={art.id}>
                <div className="relative h-[150px] mb-3 overflow-hidden rounded-sm group">
                  {art.heroImage ? (
                    <SafeImage src={art.heroImage} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  ) : (
                    <ImgPH label={art.section?.name} height={150} />
                  )}
                </div>
                <Eyebrow className="text-[10px] mb-1.5">{art.section?.name}</Eyebrow>
                <Headline size="h3" href={`/materia/${art.slug}`} className="!text-[19px] mb-2 leading-snug">
                  {art.title}
                </Headline>
                <p className="font-serif text-[14px] text-vp-text-2 leading-[1.45] line-clamp-3">
                  {art.lead}
                </p>
                <div className="byline mt-2.5">
                  Há {i + 1}h · {art.readTimeMin || 4} min de leitura
                </div>
              </article>
            ))}
          </section>

          {/* Pantanal Special */}
          {featuredSeries && (
            <section className="py-7 border-b border-vp-border">
              <div className="flex items-baseline gap-4 mb-4.5">
                <h2 className="font-display text-[24px] font-bold text-vp-text">Especial · {featuredSeries.name}</h2>
                <div className="h-[1px] bg-vp-border flex-1" />
                <Link href={`/especial/${featuredSeries.id}`} className="font-sans text-[11px] text-vp-accent font-bold uppercase tracking-widest no-underline hover:underline">
                  Ver tudo →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-7">
                <article>
                  <div className="relative h-[260px] mb-3.5 overflow-hidden rounded-sm">
                    {featuredSeries.articles[0]?.heroImage ? (
                      <SafeImage src={featuredSeries.articles[0].heroImage} alt="" fill className="object-cover" />
                    ) : (
                      <ImgPH label="série" height={260} />
                    )}
                  </div>
                  <Eyebrow>Série Especial</Eyebrow>
                  <Headline size="h2" href={`/materia/${featuredSeries.articles[0]?.slug}`} className="!text-[26px] my-2 leading-[1.1]">
                    {featuredSeries.articles[0]?.title}
                  </Headline>
                  <p className="font-serif text-[15px] text-vp-text-2 leading-[1.5]">
                    {featuredSeries.articles[0]?.lead}
                  </p>
                </article>
                <div className="grid gap-4.5">
                  {featuredSeries.articles.slice(1, 5).map((art, i) => (
                    <article key={art.id} className={`grid grid-cols-[70px_1fr] gap-3.5 pb-3.5 ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                      {art.heroImage ? (
                        <div className="relative w-[70px] h-[70px] rounded-sm overflow-hidden">
                          <SafeImage src={art.heroImage} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <ImgPH label="" width={70} height={70} className="rounded-sm" />
                      )}
                      <div>
                        <Headline size="small" href={`/materia/${art.slug}`} className="!text-[15px] mb-1.5 leading-tight">
                          {art.title}
                        </Headline>
                        <div className="byline text-[10px]">
                          Série Pantanal · há {i + 3}h
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Topical Columns (Politics, Econ, Cities) */}
          <section className="grid grid-cols-3 gap-6 py-7 border-b border-vp-border">
            {[
              { label: 'Política', data: politica },
              { label: 'Economia', data: economia },
              { label: 'Cidades', data: cidades }
            ].map((col) => (
              <div key={col.label}>
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
                  <h3 className="font-sans text-[11px] text-vp-text uppercase tracking-[0.14em] font-bold">
                    {col.label}
                  </h3>
                </div>
                <div className="flex flex-col gap-3.5">
                  {col.data.slice(0, 3).map((art, i) => (
                    <div key={art.id} className={`pb-3.5 ${i < 2 ? 'border-b border-vp-border' : ''}`}>
                      <Headline size="small" href={`/materia/${art.slug}`} className="!text-[16px] mb-1.5 leading-snug">
                        {art.title}
                      </Headline>
                      <div className="byline text-[10px]">
                        por {art.authors?.[0]?.name || 'Redação'} · há {i + 2}h
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Opinion & Columnists */}
          <section className="py-7 border-b border-vp-border">
            <div className="flex items-baseline gap-4 mb-5">
              <h2 className="font-display text-[24px] font-bold text-vp-text">Opinião &amp; Colunistas</h2>
              <div className="h-[1px] bg-vp-border flex-1" />
            </div>
            <div className="grid grid-cols-4 gap-5">
              {columnists.slice(0, 4).map((col) => (
                <article key={col.id} className="grid grid-cols-[52px_1fr] gap-3">
                  <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-vp-surface relative">
                    {col.image ? (
                      <SafeImage src={col.image} alt={col.name} fill className="object-cover" />
                    ) : (
                      <ImgPH label="" width={52} height={52} className="rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-sans text-[10px] text-vp-accent uppercase tracking-widest font-bold mb-1">
                      OPINIÃO
                    </div>
                    <Headline size="small" href={`/materia/${col.articles?.[0]?.slug}`} className="!text-[15px] italic mb-1 leading-tight">
                      “{col.articles?.[0]?.title}”
                    </Headline>
                    <div className="font-sans text-[11px] text-vp-text-2 font-bold">{col.name}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Most Read + Podcast */}
          <section className="grid grid-cols-2 gap-9 py-7">
            <div>
              <h3 className="font-sans text-[11px] text-vp-text uppercase tracking-[0.14em] font-bold mb-4">
                Mais lidas da semana
              </h3>
              <div className="flex flex-col gap-3.5">
                {mostRead.slice(0, 5).map((art, i) => (
                  <div key={art.id} className={`grid grid-cols-[36px_1fr] gap-3.5 pb-3 ${i < 4 ? 'border-b border-vp-border' : ''}`}>
                    <span className="font-display text-[28px] font-bold text-vp-accent leading-none">{i+1}</span>
                    <Headline size="small" href={`/materia/${art.slug}`} className="!text-[15px] leading-snug">
                      {art.title}
                    </Headline>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-sans text-[11px] text-vp-text uppercase tracking-[0.14em] font-bold mb-4">
                Podcast · Voz Alta
              </h3>
              {activePodcast && (
                <div className="flex flex-col">
                  {activePodcast.coverImage ? (
                    <div className="relative w-full h-[200px] mb-3.5 overflow-hidden rounded-sm">
                      <SafeImage src={activePodcast.coverImage} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <ImgPH label="podcast" height={200} className="mb-3.5" />
                  )}
                  <div className="font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-2">
                    Episódio {activePodcast.id.slice(-3)} · {activePodcast.duration || '38 min'}
                  </div>
                  <Headline size="h3" href={`/podcast/${activePodcast.id}`} className="!text-[22px] mb-2 leading-tight">
                    {activePodcast.title}
                  </Headline>
                  <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-4">
                    {activePodcast.description}
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-vp-surface border border-vp-border rounded-sm">
                    <button className="w-[38px] h-[38px] rounded-full bg-vp-accent flex items-center justify-center text-vp-bg font-bold">▶</button>
                    <div className="flex-1">
                      <div className="h-[3px] bg-vp-border-2 rounded-full relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[32%] bg-vp-accent rounded-full" />
                      </div>
                      <div className="flex justify-between mt-1.5 font-mono text-[10px] text-vp-text-4">
                        <span>12:14</span><span>{activePodcast.duration || '38:22'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Donation banner */}
          <div className="bg-vp-surface border border-vp-border p-5">
            <Eyebrow className="mb-2 text-[10px]">Sem donos. Sem paywall.</Eyebrow>
            <h3 className="font-display text-[22px] font-bold text-vp-text mb-2.5 leading-[1.15]">
              Jornalismo de MS que você pode confiar.
            </h3>
            <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5] mb-4">
              Somos sustentados por leitores. {newsletterCount.toLocaleString('pt-BR')} apoiadores até hoje.
            </p>
            <Link href="/apoiar">
              <button className="vp-btn vp-btn-primary w-full py-3 font-bold uppercase tracking-widest text-[12px]">
                Apoie o Voz Pública →
              </button>
            </Link>
          </div>

          {/* Sidebar ad */}
          <div className="vp-ad h-[250px] w-full flex items-center justify-center text-vp-text-4 font-mono text-[11px]">
            300 × 250
          </div>

          {/* Agenda */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
              <h3 className="font-sans text-[11px] text-vp-text uppercase tracking-[0.14em] font-bold">
                Agenda pública
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {agendaEvents.slice(0, 4).map((ev, i) => (
                <div key={ev.id} className={`grid grid-cols-[44px_1fr] gap-2.5 pb-2.5 ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                  <span className="font-mono text-[13px] text-vp-accent font-bold">{ev.time}</span>
                  <div>
                    <div className="font-sans text-[10px] text-vp-text-3 uppercase tracking-widest font-bold">
                      {ev.organ}
                    </div>
                    <div className="font-serif text-[13px] text-vp-text-2 leading-tight">
                      {ev.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter sidebar */}
          <div className="bg-vp-surface p-5 border border-vp-border">
            <h3 className="font-display text-[19px] font-bold text-vp-text mb-2">
              Newsletter · A Semana em MS
            </h3>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-3">
              Sábado de manhã, de graça. O que importou em Mato Grosso do Sul.
            </p>
            <div className="flex flex-col gap-2">
              <input className="vp-input w-full py-2.5 text-[13px]" placeholder="seu@email.com.br" />
              <button className="vp-btn vp-btn-primary w-full py-2.5 font-bold uppercase tracking-widest text-[11px]">
                Quero receber
              </button>
            </div>
          </div>

          {/* Skyscraper ad */}
          <div className="vp-ad h-[600px] w-full flex items-center justify-center text-vp-text-4 font-mono text-[11px]">
            300 × 600 — SKYSCRAPER
          </div>
        </aside>
      </div>

      <NewsletterSection />
      <SiteFooter />
    </div>
  );
}
