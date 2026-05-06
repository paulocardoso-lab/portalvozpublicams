import React from 'react';
import Link from 'next/link';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileEditoriaScroller } from '@/components/home/MobileEditoriaScroller';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { ImgPH } from '@/components/shared/ImgPH';

import { Article, User, Section, Alert, Series, PodcastEpisode } from '@prisma/client';

type ArticleWithRelations = Article & {
  authors: User[];
  section: Section;
};

type SeriesWithArticles = Series & {
  articles: Article[];
};

export function MobileHome({ 
  articles = [],
  activeAlert = null,
  featuredSeries = null,
  activePodcast = null
}: { 
  articles?: ArticleWithRelations[],
  activeAlert?: Alert | null,
  featuredSeries?: SeriesWithArticles | null,
  activePodcast?: PodcastEpisode | null
}) {
  const hero = articles[0];
  const listItems = articles.slice(1, 6);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg relative max-w-[480px] mx-auto border-x border-vp-border">
      <MobileMasthead />
      <MobileEditoriaScroller />

      {/* Live strip dynamic */}
      {activeAlert && (
        <Link href={activeAlert.link || '#'} className={`px-4 py-2.5 flex gap-2.5 items-center border-b border-vp-border no-underline ${activeAlert.link ? 'cursor-pointer hover:bg-vp-surface-2' : ''}`}>
          <span className={`vp-tag shrink-0 ${activeAlert.type === 'LIVE' ? 'vp-tag-live' : activeAlert.type === 'BREAKING' ? 'bg-[#ffaa00] text-black border-[#ffaa00]' : 'bg-[#444] text-white border-[#444]'}`}>
            {activeAlert.type === 'LIVE' ? 'AO VIVO' : activeAlert.type === 'BREAKING' ? 'URGENTE' : 'AVISO'}
          </span>
          <span className="font-sans text-[12px] font-semibold text-vp-text leading-tight truncate">
            {activeAlert.message}
          </span>
        </Link>
      )}

      <div className="flex-1 overflow-y-auto vp-scroll">
        {/* Hero */}
        {hero ? (
          <Link href={`/${hero.slug}`} className="block no-underline">
            <article className="px-4 py-[18px] border-b border-vp-border">
              <ImgPH label={hero.eyebrow || hero.section.name} height={200} style={{ marginBottom: 12 }} />
              <span className="eyebrow text-[10px]">{hero.eyebrow || hero.section.name}</span>
              <h1 className="font-display text-[24px] leading-[1.1] my-2 tracking-[-0.01em]">
                {hero.title}
              </h1>
              <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-2.5">
                {hero.lead}
              </p>
              <div className="byline">
                {hero.authors.map(a => a.name).join(' e ')} · {hero.publishedAt ? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(hero.publishedAt)) : 'Agora'}
              </div>
            </article>
          </Link>
        ) : (
          <div className="p-10 text-center text-vp-text-3 italic font-serif">Carregando destaques...</div>
        )}

        {/* Donate banner */}
        <div className="bg-vp-surface p-4 border-b border-vp-border">
          <div className="eyebrow mb-1 text-[10px]">Sem donos. Sem paywall.</div>
          <div className="font-display text-[17px] leading-[1.2] mb-2.5 text-wrap balance">
            Apoiadores sustentam este jornalismo independente. Você pode ser o próximo.
          </div>
          <Link href="/apoiar" className="block w-full no-underline">
            <button className="vp-btn vp-btn-primary w-full text-[12px]">Apoiar o Voz Pública →</button>
          </Link>
        </div>

        {/* List items */}
        {listItems.map((x) => (
          <Link key={x.id} href={`/${x.slug}`} className="block no-underline">
            <article className="px-4 py-3.5 border-b border-vp-border grid grid-cols-[1fr_90px] gap-3">
              <div>
                <span className="eyebrow text-[9px]">{x.eyebrow || x.section.name}</span>
                <h3 className="font-display text-[16px] leading-[1.2] my-1">{x.title}</h3>
                <div className="byline text-[11px]">
                  {x.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(x.publishedAt)) : 'Recente'} · {x.readTimeMin || 4} min
                </div>
              </div>
              <ImgPH label="" height={80} />
            </article>
          </Link>
        ))}

        {/* Inline ad */}
        <div className="p-3 bg-vp-bg">
          <div className="vp-ad h-[100px]">320 × 100</div>
        </div>

        {/* Section header dinâmica: Especial */}
        {featuredSeries ? (
          <>
            <div className="px-4 pt-[18px] pb-2.5 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">Especial · {featuredSeries.name}</h3>
              <Link href="/especiais" className="meta ml-auto text-vp-accent cursor-pointer hover:underline no-underline">Ver tudo →</Link>
            </div>
            {featuredSeries.articles.length > 0 && (
              <Link href={`/${featuredSeries.articles[0].slug}`} className="block no-underline">
                <article className="px-4 pb-4 border-b border-vp-border">
                  <ImgPH label={`série · ${featuredSeries.name}`} height={170} style={{ marginBottom: 10 }} />
                  <span className="eyebrow text-[10px]">Parte 1 de {featuredSeries.totalParts}</span>
                  <h3 className="font-display text-[19px] leading-[1.15] my-1.5">{featuredSeries.articles[0].title}</h3>
                  <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5] line-clamp-2">{featuredSeries.articles[0].lead}</p>
                </article>
              </Link>
            )}
          </>
        ) : null}

        {/* Podcast dinâmico no mobile */}
        {activePodcast && (
          <div className="bg-vp-surface border-y border-vp-border my-2">
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <span className="text-[10px] text-vp-accent">🎧</span>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">Podcast · Voz Alta</h3>
            </div>
            <Link href={activePodcast.embedUrl || '#'} target="_blank" className="block px-4 pb-4 no-underline">
              <div className="flex gap-4 items-center">
                {activePodcast.coverImage ? (
                  <img src={activePodcast.coverImage} alt="Capa" className="w-14 h-14 object-cover rounded-[2px]" />
                ) : (
                  <div className="w-14 h-14 bg-vp-bg border border-vp-border flex items-center justify-center text-[8px] text-vp-text-3">CAPA</div>
                )}
                <div className="flex-1">
                  <h4 className="font-display text-[15px] leading-tight mb-1">{activePodcast.title}</h4>
                  <div className="text-[10px] text-vp-text-3 uppercase tracking-wider">{activePodcast.duration || 'Ouça agora'}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-vp-accent text-vp-bg flex items-center justify-center pl-0.5 shadow-sm">
                  ▶
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Mais lidas */}
        <div className="p-4">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-3">Mais lidas hoje</h3>
          {['Raio-X: o patrimônio dos 24 deputados de MS','Como o PCC se instalou nas cidades de fronteira','Mapa do fogo: Pantanal em tempo real'].map((h,i) => (
            <Link key={i} href={`/top-${i}`} className="block no-underline">
              <div className={`grid grid-cols-[24px_1fr] gap-2.5 py-2.5 ${i < 2 ? 'border-b border-vp-border' : ''}`}>
                <span className="font-display text-[22px] text-vp-accent leading-none font-bold">{i+1}</span>
                <h4 className="font-display text-[14px] leading-[1.25]">{h}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MobileTabBar active="home" />
    </div>
  );
}
