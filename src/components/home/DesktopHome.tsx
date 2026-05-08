import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { AdSlot } from '@/components/shared/AdSlot';
import { NewsletterCounter } from '@/components/shared/NewsletterCounter';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import Image from 'next/image';
import { SafeImage } from '@/components/shared/SafeImage';

import { Article, User, Section, AgendaEvent, Alert, Series, PodcastEpisode } from '@prisma/client';

type ArticleWithRelations = Article & {
  authors: User[];
  section: Section;
};

type SeriesWithArticles = Series & {
  articles: Article[];
};

export function DesktopHome({ 
  articles = [], 
  newsletterCount = 0,
  agendaEvents = [],
  columnists = [],
  mostRead = [],
  activeAlert = null,
  featuredSeries = null,
  activePodcast = null,
  politica = [],
  economia = [],
  cidades = []
}: { 
  articles?: ArticleWithRelations[],
  newsletterCount?: number,
  agendaEvents?: AgendaEvent[],
  columnists?: (User & { articles: { title: string; slug: string }[] })[],
  mostRead?: Article[],
  politica?: ArticleWithRelations[],
  economia?: ArticleWithRelations[],
  cidades?: ArticleWithRelations[],
  activeAlert?: Alert | null,
  featuredSeries?: SeriesWithArticles | null,
  activePodcast?: PodcastEpisode | null
}) {
  const hero = articles[0];
  const secondary = articles.slice(1, 4);

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      {/* Breaking/live strip — Fiel ao Home.jsx */}
      {activeAlert && (
        <div className="border-b border-vp-border bg-vp-surface px-[28px] py-[9px] flex items-center gap-[14px] font-sans text-[12px]">
          <span className="vp-tag vp-tag-live">AO VIVO</span>
          <span className="text-vp-text font-semibold">{activeAlert.message}</span>
          <span className="text-vp-text-3 ml-auto">atualizado há 4 min</span>
        </div>
      )}

      {/* Top leaderboard ad */}
      <div className="px-[28px] pt-[16px]">
        <div className="vp-ad h-[90px]">728 × 90 — LEADERBOARD</div>
      </div>

      {/* Main grid — Layout exato da referência (1fr 320px, gap 32, padding 24 28) */}
      <div className="grid grid-cols-[1fr_320px] gap-[32px] px-[28px] py-[24px]">
        {/* Left / main column */}
        <div className="flex flex-col">
          {/* Hero — 1.2fr 1fr, gap 32 */}
          <section className="grid grid-cols-[1.2fr_1fr] gap-[32px] pb-[32px] border-b border-vp-border">
            {hero ? (
              <>
                <div>
                  <span className="eyebrow">{hero.eyebrow || hero.section?.name || 'Exclusivo'}</span>
                  <Link href={`/${hero.slug}`} className="no-underline">
                    <h1 className="vp-headline text-[48px] font-black mt-[12px] mb-[16px] leading-[1.05]">
                      {hero.title}
                    </h1>
                  </Link>
                  <p className="font-serif text-[18px] text-vp-text-2 leading-[1.5] mb-[18px]">
                    {hero.lead}
                  </p>
                  <div className="byline">
                    Por {hero.authors?.length > 0 ? hero.authors.map((a, i) => (
                      <React.Fragment key={a.id}>
                        <strong className="text-vp-text">{a.name}</strong>
                        {i < hero.authors.length - 1 && ' e '}
                      </React.Fragment>
                    )) : <strong className="text-vp-text">Redação</strong>} · {hero.publishedAt && !isNaN(new Date(hero.publishedAt).getTime()) ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(hero.publishedAt)) : '22 de abril, 06:00'}
                  </div>
                </div>
                <div>
                  {hero.heroImage ? (
                    <div className="relative w-full h-[400px] overflow-hidden rounded-sm">
                      <SafeImage src={hero.heroImage} alt={hero.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <ImgPH label="capa" height={400} />
                  )}
                  <div className="meta mt-[10px] italic">{hero.heroCaption || 'Foto: Voz Pública'}</div>
                </div>
              </>
            ) : (
              <div className="col-span-2 py-20 text-center text-vp-text-3 font-serif italic">Carregando manchete...</div>
            )}
          </section>

          {/* Secondary row — 3 up, gap 24 */}
          <section className="grid grid-cols-3 gap-[24px] py-[28px] border-b border-vp-border">
            {secondary.map((x) => (
              <article key={x.id}>
                {x.heroImage ? (
                  <div className="relative w-full h-[160px] overflow-hidden rounded-sm mb-[14px]">
                    <SafeImage src={x.heroImage} alt={x.title} fill className="object-cover" />
                  </div>
                ) : (
                  <ImgPH label={x.section?.name || 'Cidades'} height={160} className="mb-[14px]" />
                )}
                <span className="eyebrow text-[10px]">{x.eyebrow || x.section?.name}</span>
                <Link href={`/${x.slug}`} className="no-underline">
                  <h3 className="vp-headline text-[20px] font-black mt-[8px] mb-[10px] leading-[1.2]">
                    {x.title}
                  </h3>
                </Link>
                <p className="font-serif text-[15px] text-vp-text-2 leading-[1.45] line-clamp-3">{x.lead}</p>
                <div className="byline mt-[12px]">Há 2h · 4 min de leitura</div>
              </article>
            ))}
          </section>

          {/* Pantanal / Especial em destaque — 2 cols (1 big, 4 small) */}
          <section className="py-[28px] border-b border-vp-border">
            <div className="flex items-baseline gap-[16px] mb-[18px]">
              <h2 className="font-display text-[24px]">Especial · {featuredSeries?.name || 'Pantanal'}</h2>
              <div className="rule flex-1" />
              <Link href="/especiais" className="meta text-vp-accent tracking-[0.1em] uppercase">Ver tudo →</Link>
            </div>

            <div className="grid grid-cols-2 gap-[28px]">
              <article>
                {featuredSeries?.articles?.[0]?.heroImage ? (
                  <div className="relative w-full h-[260px] overflow-hidden rounded-sm mb-[14px]">
                    <SafeImage src={featuredSeries.articles[0].heroImage} alt={featuredSeries.articles[0].title} fill className="object-cover" />
                  </div>
                ) : (
                  <ImgPH label="série · pantanal" height={260} className="mb-[14px]" />
                )}
                <span className="eyebrow">Série · {featuredSeries?.name || 'Pantanal'}</span>
                <Link href={`/${featuredSeries?.articles?.[0]?.slug || '#'}`} className="no-underline">
                  <h3 className="vp-headline text-[26px] mt-[8px] mb-[10px]">
                    {featuredSeries?.articles?.[0]?.title || 'O colapso do principal afluente do Pantanal sul.'}
                  </h3>
                </Link>
                <p className="font-serif text-[15px] text-vp-text-2 leading-[1.5]">
                  {featuredSeries?.articles?.[0]?.lead || 'Nossa equipe documentou o impacto do desmatamento e da erosão.'}
                </p>
              </article>

              <div className="grid gap-[18px]">
                {featuredSeries?.articles?.slice(1, 5).map((art, i) => (
                  <article key={art.id} className={`grid grid-cols-[70px_1fr] gap-[14px] pb-[14px] ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                    <ImgPH label="" height={70} width={70} className="aspect-square" />
                    <div>
                      <Link href={`/${art.slug}`} className="no-underline">
                        <h4 className="vp-headline text-[15px] mb-[6px]">{art.title}</h4>
                      </Link>
                      <div className="byline">Série Especial · há {i + 1}h</div>
                    </div>
                  </article>
                )) || <div className="text-vp-text-3 italic">Carregando mais da série...</div>}
              </div>
            </div>
          </section>

          {/* Billboard ad */}
          <section className="py-[20px] border-b border-vp-border">
            <div className="vp-ad h-[120px] relative">970 × 120 — BILLBOARD</div>
          </section>

          {/* 3-column topical row */}
          <section className="grid grid-cols-3 gap-[24px] py-[28px] border-b border-vp-border">
            {[
              { name: 'Política', items: politica },
              { name: 'Economia', items: economia },
              { name: 'Cidades', items: cidades },
            ].map(col => (
              <div key={col.name}>
                <div className="flex items-center gap-[8px] mb-[14px]">
                  <span className="w-[6px] h-[6px] bg-vp-accent rotate-45" />
                  <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">{col.name}</h3>
                </div>
                <ul className="list-none p-0 m-0 grid gap-[14px]">
                  {col.items.slice(0, 3).map((art, i) => (
                    <li key={art.id} className={`pb-[14px] ${i < 2 ? 'border-b border-vp-border' : ''}`}>
                      <Link href={`/${art.slug}`} className="no-underline">
                        <h4 className="vp-headline text-[16px] mb-[6px]">{art.title}</h4>
                      </Link>
                      <div className="byline">há {i + 3}h · por {art.authors?.[0]?.name || 'Redação'}</div>
                    </li>
                  ))}
                  {col.items.length === 0 && <li className="text-vp-text-3 italic text-[12px]">Sem atualizações.</li>}
                </ul>
              </div>
            ))}
          </section>

          {/* Opinion/Columnists row — 4 up */}
          <section className="py-[28px] border-b border-vp-border">
            <div className="flex items-baseline gap-[16px] mb-[20px]">
              <h2 className="font-display text-[24px]">Opinião &amp; Colunistas</h2>
              <div className="rule flex-1" />
            </div>
            <div className="grid grid-cols-4 gap-[20px]">
              {columnists.slice(0, 4).map((c, i) => (
                <article key={c.id} className="grid grid-cols-[52px_1fr] gap-[12px]">
                  <ImgPH label="" width={52} height={52} className="rounded-full" />
                  <div>
                    <div className="eyebrow text-[10px]">Opinião</div>
                    <Link href={`/${c.articles?.[0]?.slug || '#'}`} className="no-underline">
                      <h4 className="vp-headline text-[15px] my-[4px] italic">“{c.articles?.[0]?.title || 'A análise da semana'}”</h4>
                    </Link>
                    <div className="byline font-semibold text-vp-text-2">{c.name}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Bottom row — Mais lidas + Podcast */}
          <section className="grid grid-cols-2 gap-[36px] py-[28px]">
            <div>
              <h3 className="font-sans text-[12px] uppercase tracking-[0.14em] font-black mb-[24px] flex items-center gap-[12px]">
                <span className="w-[12px] h-[1px] bg-vp-accent" />
                Mais lidas hoje
              </h3>
              <div className="grid gap-[20px]">
                {mostRead.slice(0, 5).map((h, i) => (
                  <Link key={h.id} href={`/${h.slug}`} className="no-underline group">
                    <div className="grid grid-cols-[36px_1fr] gap-[16px] items-start">
                      <span className="font-display text-[32px] font-black text-vp-border-2 group-hover:text-vp-accent transition-colors leading-none">{i + 1}</span>
                      <div>
                        <h4 className="font-display text-[15px] font-bold leading-[1.3] group-hover:underline">
                          {h.title}
                        </h4>
                        <div className="byline text-[10px] mt-[4px]">{(h as any).section?.name}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-[16px]">Podcast · Voz Alta</h3>
              {activePodcast ? (
                <>
                  <div className="relative w-full h-[200px] mb-[14px]">
                    {activePodcast.coverImage ? (
                      <SafeImage src={activePodcast.coverImage} alt={activePodcast.title} fill className="object-cover rounded-sm" />
                    ) : (
                      <ImgPH label="podcast" height={200} />
                    )}
                  </div>
                  <div className="meta uppercase text-[11px]">Episódio {activePodcast.id.slice(-3)} · {activePodcast.duration || '30 min'}</div>
                  <Link href={`/podcast/${activePodcast.id}`} className="no-underline">
                    <h4 className="vp-headline text-[22px] mt-[8px] mb-[10px]">{activePodcast.title}</h4>
                  </Link>
                  <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-[14px]">{activePodcast.description}</p>
                  <div className="flex items-center gap-[10px] p-[12px] bg-vp-surface border border-vp-border">
                    <button className="w-[38px] h-[38px] rounded-full bg-vp-accent flex items-center justify-center text-[#1a1a19] cursor-pointer border-none">▶</button>
                    <div className="flex-1">
                      <div className="h-[3px] bg-vp-border-2 rounded-sm relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[32%] bg-vp-accent" />
                      </div>
                      <div className="flex justify-between mt-[6px] font-mono text-[10px] text-vp-text-4">
                        <span>12:14</span><span>{activePodcast.duration || '38:22'}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-10 border border-dashed border-vp-border text-center text-vp-text-4 italic">Podcast Voz Alta: em breve.</div>
              )}
            </div>
          </section>
        </div>

        {/* Right sidebar — Exato como na referência */}
        <aside className="grid gap-[24px] self-start">
          {/* Donation banner */}
          <div className="bg-vp-surface border border-vp-border p-[20px]">
            <div className="eyebrow mb-[8px]">Sem donos. Sem paywall.</div>
            <h3 className="font-display text-[22px] mb-[10px] leading-[1.15]">
              Jornalismo de MS que você pode confiar.
            </h3>
            <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5] mb-[14px]">
              Somos sustentados por leitores. {newsletterCount} apoiadores até hoje.
            </p>
            <button className="vp-btn vp-btn-primary w-full">Apoie o Voz Pública →</button>
          </div>

          {/* Sidebar ad */}
          <div className="vp-ad h-[250px]">300 × 250</div>

          {/* Agenda */}
          <div>
            <div className="flex items-center gap-[8px] mb-[12px]">
              <span className="w-[6px] h-[6px] bg-vp-accent rotate-45" />
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">Agenda pública</h3>
            </div>
            <ul className="list-none p-0 m-0 grid gap-[12px] text-[13px]">
              {agendaEvents.slice(0, 4).map((ev, i) => (
                <li key={ev.id} className={`grid grid-cols-[44px_1fr] gap-[10px] pb-[10px] ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                  <span className="font-mono text-vp-accent font-bold">{ev.time}</span>
                  <div>
                    <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-vp-text-4">{ev.organ}</div>
                    <div className="text-vp-text-2 font-serif">{ev.description}</div>
                  </div>
                </li>
              ))}
              {agendaEvents.length === 0 && <li className="text-vp-text-4 italic">Sem eventos previstos.</li>}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-vp-surface p-[20px] border border-vp-border">
            <h3 className="font-display text-[19px] mb-[8px]">Newsletter · A Semana em MS</h3>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-[12px]">Sábado de manhã, de graça. O que importou em Mato Grosso do Sul.</p>
            <input className="vp-input mb-[8px]" placeholder="seu@email.com.br" />
            <button className="vp-btn vp-btn-primary w-full">Quero receber</button>
          </div>

          {/* Sidebar ad 2 */}
          <div className="vp-ad h-[600px]">300 × 600 — SKYSCRAPER</div>
        </aside>
      </div>

      <NewsletterSection />
      <SiteFooter />
    </div>
  );
}
