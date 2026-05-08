import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { AdSlot } from '@/components/shared/AdSlot';
import { NewsletterCounter } from '@/components/shared/NewsletterCounter';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import Image from 'next/image';

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
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <SiteHeader />

      {/* Breaking/live strip dynamic */}
      {activeAlert && (
        <Link href={activeAlert.link || '#'} className={`border-b border-vp-border bg-vp-surface px-7 py-2.5 flex items-center gap-3.5 font-sans text-[12px] no-underline ${activeAlert.link ? 'cursor-pointer hover:bg-vp-surface-2' : 'cursor-default'}`}>
          <span className={`vp-tag shrink-0 ${activeAlert.type === 'LIVE' ? 'vp-tag-live' : activeAlert.type === 'BREAKING' ? 'bg-[#ffaa00] text-black border-[#ffaa00]' : 'bg-[#444] text-white border-[#444]'}`}>
            {activeAlert.type === 'LIVE' ? 'AO VIVO' : activeAlert.type === 'BREAKING' ? 'URGENTE' : 'AVISO'}
          </span>
          <span className="text-vp-text font-semibold hover:text-vp-accent transition-colors">
            {activeAlert.message}
          </span>
          {activeAlert.updatedAt && (
            <span className="text-vp-text-3 ml-auto shrink-0 hidden md:inline">
              atualizado às {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(activeAlert.updatedAt))}
            </span>
          )}
        </Link>
      )}

      {/* Top leaderboard ad */}
      <div className="px-7 pt-4">
        <AdSlot id="home-leaderboard" className="h-[90px]" fallbackText="728 × 90 — LEADERBOARD" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-8 px-7 py-6 max-w-[1440px] mx-auto w-full">
        {/* Left / main column */}
        <div>
          {/* Hero */}
          <section className="pb-7 border-b border-vp-border">
            {hero ? (
              <Link href={`/${hero.slug}`} className="grid grid-cols-[1.1fr_1fr] gap-7 no-underline">
                <div>
                  <span className="eyebrow text-[10px]">{hero.eyebrow || hero.section.name}</span>
                  <h1 className="font-display text-[46px] leading-[1.05] mt-2.5 mb-3.5 tracking-[-0.01em] hover:text-vp-accent transition-colors">
                    {hero.title}
                  </h1>
                  <p className="font-serif text-[17px] text-vp-text-2 leading-[1.5] mb-4 text-pretty">
                    {hero.lead}
                  </p>
                  <div className="byline text-[11px]">
                    Por {hero.authors.map((a, i) => (
                      <React.Fragment key={a.id}>
                        <strong className="text-vp-text">{a.name}</strong>
                        {i < hero.authors.length - 1 && ' e '}
                      </React.Fragment>
                    ))} · {hero.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(hero.publishedAt)) : 'Recente'}
                  </div>
                </div>
                <div>
                  {hero.heroImage ? (
                    <div className="relative w-full h-[380px] overflow-hidden rounded-sm">
                      <Image 
                        src={hero.heroImage} 
                        alt={hero.title} 
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                      />
                    </div>
                  ) : (
                    <ImgPH label={hero.eyebrow || 'capa'} height={380} />
                  )}
                  {hero.heroCaption && <div className="meta mt-2 italic text-[11px]">{hero.heroCaption}</div>}
                </div>
              </Link>
            ) : (
              <div className="py-20 text-center text-vp-text-3 font-serif italic">Nenhuma matéria publicada no momento.</div>
            )}
          </section>

          {/* Secondary row — 3 up */}
          <section className="grid grid-cols-3 gap-6 py-7 border-b border-vp-border">
            {secondary.map((x, i) => (
              <article key={x.id}>
                <Link href={`/${x.slug}`} className="no-underline">
                  {x.heroImage ? (
                    <div className="relative w-full h-[150px] overflow-hidden rounded-sm mb-3">
                      <Image 
                        src={x.heroImage} 
                        alt={x.title} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <ImgPH label={x.eyebrow || x.section.name} height={150} style={{ marginBottom: 12 }} />
                  )}
                  <span className="eyebrow text-[10px]">{x.eyebrow || x.section.name}</span>
                  <h3 className="font-display text-[19px] leading-[1.15] mt-1.5 mb-2 hover:text-vp-accent cursor-pointer transition-colors">{x.title}</h3>
                  <p className="font-serif text-[14px] text-vp-text-2 leading-[1.45] text-pretty line-clamp-3">{x.lead}</p>
                </Link>
                <div className="byline text-[11px] mt-2.5">
                  {x.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(x.publishedAt)) : 'Recente'} · {x.readTimeMin || 4} min de leitura
                </div>
              </article>
            ))}
            {secondary.length === 0 && Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-vp-surface h-[250px]" />
            ))}
          </section>

          {/* Pantanal / investigação em destaque */}
          {featuredSeries && (
            <section className="py-7 border-b border-vp-border">
              <div className="flex items-baseline gap-4 mb-4.5">
                <h2 className="font-display text-[24px]">Especial · {featuredSeries.name}</h2>
                <div className="flex-1 h-[1px] bg-vp-border" />
                <Link href="/especiais" className="text-[11px] text-vp-accent tracking-[0.1em] uppercase cursor-pointer hover:underline no-underline">Ver tudo →</Link>
              </div>

              <div className="grid grid-cols-2 gap-7">
                {featuredSeries.articles.length > 0 ? (
                  <article>
                    <Link href={`/${featuredSeries.articles[0].slug}`} className="no-underline">
                      {featuredSeries.articles[0].heroImage ? (
                        <div className="relative w-full h-[260px] overflow-hidden rounded-sm mb-3.5">
                          <Image 
                            src={featuredSeries.articles[0].heroImage} 
                            alt={featuredSeries.articles[0].title} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <ImgPH label={`série · ${featuredSeries.name}`} height={260} style={{ marginBottom: 14 }} />
                      )}
                      <span className="eyebrow text-[10px]">Parte 1 de {featuredSeries.totalParts}</span>
                      <h3 className="font-display text-[26px] leading-[1.15] mt-2 mb-2.5 hover:text-vp-accent cursor-pointer">
                        {featuredSeries.articles[0].title}
                      </h3>
                      <p className="font-serif text-[15px] text-vp-text-2 leading-[1.5] text-pretty">
                        {featuredSeries.articles[0].lead}
                      </p>
                    </Link>
                  </article>
                ) : (
                  <div className="text-vp-text-3 italic font-serif py-10">Nenhum artigo publicado na série.</div>
                )}
                
                <div className="grid gap-4.5">
                  {featuredSeries.articles.slice(1).map((art: Article, i: number) => (
                    <article key={art.id} className={`pb-3.5 ${i < featuredSeries.articles.length - 2 ? 'border-b border-vp-border' : ''}`}>
                      <Link href={`/${art.slug}`} className="grid grid-cols-[70px_1fr] gap-3.5 no-underline">
                        {art.heroImage ? (
                          <div className="relative w-[70px] h-[70px] overflow-hidden rounded-sm shrink-0">
                            <Image 
                              src={art.heroImage} 
                              alt={art.title} 
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <ImgPH label="" height={70} width={70} style={{ aspectRatio: '1/1' }} />
                        )}
                        <div>
                          <h4 className="font-display text-[15px] leading-[1.2] mb-1.5 hover:text-vp-accent cursor-pointer">{art.title}</h4>
                          <div className="byline text-[11px]">Série Especial · {art.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(art.publishedAt)) : 'Recente'}</div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Inline sponsor native */}
          <section className="py-5 border-b border-vp-border">
            <div className="vp-ad h-[120px] relative">970 × 120 — BILLBOARD</div>
          </section>

          {/* Cidades / Política / Economia — 3 columns */}
          <section className="grid grid-cols-3 gap-6 py-7 border-b border-vp-border">
            {[
              { name: 'Política', slug: 'politica', items: politica },
              { name: 'Economia', slug: 'economia', items: economia },
              { name: 'Cidades', slug: 'cidades', items: cidades },
            ].map(col => (
              <div key={col.name}>
                <Link href={`/editoria/${col.slug}`} className="flex items-center gap-2 mb-3.5 no-underline group">
                  <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
                  <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold group-hover:text-vp-accent transition-colors">{col.name}</h3>
                </Link>
                <ul className="list-none p-0 m-0 grid gap-3.5">
                  {col.items.length === 0 && <li className="text-vp-text-3 italic text-[12px]">Nenhuma matéria recente.</li>}
                  {col.items.map((art, i) => (
                    <li key={art.id} className={`pb-3.5 ${i < col.items.length-1 ? 'border-b border-vp-border' : ''}`}>
                      <Link href={`/${art.slug}`} className="no-underline">
                        <h4 className="font-display text-[16px] leading-[1.2] mb-1.5 hover:text-vp-accent cursor-pointer text-balance">{art.title}</h4>
                      </Link>
                      <div className="byline text-[11px]">
                        por {art.authors[0]?.name || 'Redação'} · {art.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(art.publishedAt)) : 'Recente'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Colunistas */}
          <section className="py-7 border-b border-vp-border">
            <div className="flex items-baseline gap-4 mb-5">
              <h2 className="font-display text-[24px]">Opinião &amp; Colunistas</h2>
              <div className="flex-1 h-[1px] bg-vp-border" />
            </div>
            <div className="grid grid-cols-4 gap-5">
              {columnists.length === 0 && <div className="text-vp-text-3 italic col-span-4">Nenhum colunista cadastrado.</div>}
              {columnists.map((c) => (
                <article key={c.id} className="grid grid-cols-[52px_1fr] gap-3">
                  {c.avatar ? (
                    <div className="relative w-[52px] h-[52px] overflow-hidden rounded-full shrink-0">
                      <Image 
                        src={c.avatar} 
                        alt={c.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <ImgPH label="" width={52} height={52} style={{ borderRadius: '50%' }} />
                  )}
                  <div>
                    <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-vp-accent font-bold">Coluna</div>
                    <Link href={`/colunista/${c.slug || c.id}`} className="no-underline">
                      <h4 className="font-display text-[15px] leading-[1.25] my-1 font-serif italic hover:text-vp-accent cursor-pointer">
                        “{c.articles[0]?.title || "Em breve..."}”
                      </h4>
                    </Link>
                    <div className="byline font-semibold text-vp-text-2 text-[11px]">{c.name}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Mais lidas + Podcast */}
          <section className="grid grid-cols-2 gap-9 py-7">
            <div>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-4">Mais lidas da semana</h3>
              <ol className="list-none p-0 m-0 grid gap-3.5">
                {mostRead.length === 0 && <li className="text-vp-text-3 italic text-[13px]">Aguardando dados...</li>}
                {mostRead.map((art, i) => (
                  <li key={art.id} className={`grid grid-cols-[36px_1fr] gap-3.5 pb-3 ${i < mostRead.length - 1 ? 'border-b border-vp-border' : ''}`}>
                    <span className="font-display text-[28px] font-bold text-vp-accent leading-none">{i+1}</span>
                    <Link href={`/${art.slug}`} className="no-underline">
                      <h4 className="font-display text-[15px] leading-[1.25] hover:text-vp-accent cursor-pointer">{art.title}</h4>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-4">Podcast · Voz Alta</h3>
              {activePodcast ? (
                <>
                  {activePodcast.coverImage ? (
                    <div className="relative w-full h-[200px] overflow-hidden rounded-[2px] mb-3.5 border border-vp-border">
                      <Image 
                        src={activePodcast.coverImage} 
                        alt={activePodcast.title} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <ImgPH label="capa do episódio" height={200} style={{ marginBottom: 14 }} />
                  )}
                  <div className="font-sans text-[11px] text-vp-text-3 tracking-[0.08em] uppercase">
                    {activePodcast.duration ? `${activePodcast.duration}` : 'Novo episódio'} 
                    {activePodcast.publishedAt && ` · ${new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(activePodcast.publishedAt))}`}
                  </div>
                  <h4 className="font-display text-[22px] leading-[1.2] my-2 hover:text-vp-accent cursor-pointer line-clamp-2">
                    {activePodcast.title}
                  </h4>
                  {activePodcast.description && (
                    <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-3.5 line-clamp-2">
                      {activePodcast.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2.5 p-3 bg-vp-surface border border-vp-border">
                    <a 
                      href={activePodcast.embedUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-vp-accent border-none text-[#1a1a19] cursor-pointer flex items-center justify-center pl-1 no-underline"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </a>
                    <div className="flex-1">
                      <div className="h-[3px] bg-vp-border-2 rounded-sm relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[0%] bg-vp-accent" />
                      </div>
                      <div className="flex justify-between mt-1.5 font-mono text-[10px] text-vp-text-3 uppercase">
                        <span>Ouça agora</span>
                        <span>{activePodcast.duration || ''}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-10 border border-dashed border-vp-border text-center text-vp-text-3 italic text-[13px]">
                  Novos episódios em breve.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="grid gap-6 self-start">
          {/* Doação banner */}
          <div className="bg-vp-surface border border-vp-border p-5">
            <div className="eyebrow mb-2 text-[10px]">Sem donos. Sem paywall.</div>
            <h3 className="font-display text-[22px] mb-2.5 leading-[1.15]">
              Jornalismo de MS que você pode confiar.
            </h3>
            <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5] mb-3.5">
              Somos sustentados por leitores. <NewsletterCounter initialCount={newsletterCount} />
            </p>
            <Link href="/apoiar" className="no-underline">
              <button className="vp-btn vp-btn-primary w-full text-[13px]">Apoie o Voz Pública →</button>
            </Link>
          </div>

          {/* Sidebar ad */}
          <div className="vp-ad h-[250px]">300 × 250</div>

          {/* Agenda */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">Agenda pública</h3>
            </div>
            <ul className="list-none p-0 m-0 grid gap-3 text-[13px]">
              {agendaEvents.length === 0 && <li className="text-vp-text-3 italic">Nenhum compromisso hoje.</li>}
              {agendaEvents.map((ev, i) => (
                <li key={ev.id} className={`grid grid-cols-[44px_1fr] gap-2.5 pb-2.5 ${i < agendaEvents.length - 1 ? 'border-b border-vp-border' : ''}`}>
                  <span className="font-mono text-[13px] text-vp-accent font-bold">{ev.time}</span>
                  <div>
                    <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-vp-text-3">{ev.organ}</div>
                    <div className="text-vp-text-2 font-serif text-[13px]">{ev.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-vp-surface p-5 border border-vp-border">
            <h3 className="font-display text-[19px] mb-2 leading-[1.2]">Newsletter · A Semana em MS</h3>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-3">Sábado de manhã, de graça. O que importou em Mato Grosso do Sul.</p>
            <input className="vp-input w-full mb-2 text-[13px]" placeholder="seu@email.com.br" />
            <Link href="/newsletter" className="no-underline">
              <button className="vp-btn vp-btn-primary w-full text-[13px]">Quero receber</button>
            </Link>
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
