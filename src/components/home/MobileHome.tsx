import React from 'react';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileEditoriaScroller } from '@/components/layout/MobileEditoriaScroller';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { ImgPH } from '@/components/shared/ImgPH';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Tag } from '@/components/shared/Tag';
import { Headline } from '@/components/shared/Headline';
import { AdSlot } from '@/components/shared/AdSlot';
import Link from 'next/link';

interface MobileHomeProps {
  articles?: any[];
  activeAlert?: any;
  featuredSeries?: any;
  mostRead?: any[];
}

/**
 * MobileHome — Estrutura completa da home page para dispositivos móveis.
 * Dados dinâmicos provenientes do banco de dados.
 */
export function MobileHome({ 
  articles = [], 
  activeAlert, 
  featuredSeries,
  mostRead = [] 
}: MobileHomeProps) {
  
  const hero = articles[0];
  const listItems = articles.slice(1, 4);

  return (
    <div className="bg-vp-bg min-h-screen flex flex-col md:hidden">
      <MobileMasthead />
      <MobileEditoriaScroller />

      {/* 1. Alert strip (if active) */}
      {activeAlert && (
        <div className="px-4 py-[10px] flex gap-[10px] items-center border-b border-vp-border bg-vp-surface">
          <Tag variant="live">AO VIVO</Tag>
          <span className="font-sans text-[12px] text-vp-text font-bold leading-[1.3]">
            {activeAlert.title}
          </span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto vp-scroll pb-16">
        {/* 2. Hero Article */}
        {hero && (
          <article className="px-4 py-[18px] border-b border-vp-border">
            {hero.image && (
              <div className="relative aspect-[16/9] mb-3 overflow-hidden bg-vp-surface">
                <img 
                  src={hero.image} 
                  alt={hero.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            {!hero.image && <ImgPH label="capa" height={200} className="mb-3" />}
            
            <Eyebrow className="text-[10px]">
              {hero.section?.name || 'Geral'} {hero.isExclusive ? '· Exclusivo' : ''}
            </Eyebrow>
            <Headline as="h1" size="h3" href={`/${hero.slug}`} className="my-2">
              {hero.title}
            </Headline>
            <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-2.5">
              {hero.subtitle || hero.excerpt}
            </p>
            <div className="byline text-[11px] text-vp-text-3 font-sans">
              {hero.authors?.map((a: any) => a.name).join(' e ') || 'Redação'} · {new Date(hero.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </article>
        )}

        {/* 3. Donate banner */}
        <div className="bg-vp-surface px-4 py-4 border-b border-vp-border">
          <Eyebrow variant="muted" className="mb-1 text-[10px]">Sem donos. Sem paywall.</Eyebrow>
          <div className="font-display font-bold text-[17px] text-vp-text leading-[1.2] mb-2.5">
            Jornalismo independente feito por quem vive em Mato Grosso do Sul.
          </div>
          <Link href="/apoiar">
            <button className="vp-btn vp-btn-primary w-full text-[12px] font-bold">
              Apoiar o Voz Pública
            </button>
          </Link>
        </div>

        {/* 4. List items */}
        <section>
          {listItems.map((article, i) => (
            <article key={article.id} className="px-4 py-[14px] border-b border-vp-border grid grid-cols-[1fr_90px] gap-3">
              <div>
                <Eyebrow className="text-[9px] mb-1">{article.section?.name}</Eyebrow>
                <Headline size="small" href={`/${article.slug}`} className="mb-1.5 leading-[1.2]">
                  {article.title}
                </Headline>
                <div className="byline text-[11px] text-vp-text-3 font-sans">
                  há {Math.floor((Date.now() - new Date(article.publishedAt).getTime()) / 3600000)}h · {article.readingTime || 4} min
                </div>
              </div>
              {article.image ? (
                <img src={article.image} alt="" className="w-full h-[80px] object-cover bg-vp-surface" />
              ) : (
                <ImgPH height={80} />
              )}
            </article>
          ))}
        </section>

        {/* 5. Inline ad */}
        <div className="p-4 bg-vp-bg border-b border-vp-border">
          <AdSlot id="mobile-inline" className="w-full" />
        </div>

        {/* 6. Section header / Featured Series */}
        {featuredSeries && (
          <section className="pb-4">
            <div className="px-4 pt-[18px] pb-2.5 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 flex-shrink-0" />
              <h3 className="font-sans text-[11px] text-vp-text uppercase tracking-[0.14em] font-bold">
                Especial · {featuredSeries.title}
              </h3>
              <Link href={`/especial/${featuredSeries.slug}`} className="font-sans text-[11px] text-vp-accent font-bold ml-auto no-underline">
                Ver tudo →
              </Link>
            </div>
            {featuredSeries.articles?.[0] && (
              <article className="px-4 pb-4 border-b border-vp-border">
                <ImgPH label="série" height={170} className="mb-2.5" />
                <Eyebrow className="text-[10px] mb-1.5">Série Especial</Eyebrow>
                <Headline size="card" href={`/${featuredSeries.articles[0].slug}`} className="mb-2 leading-[1.15]">
                  {featuredSeries.articles[0].title}
                </Headline>
                <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5]">
                  {featuredSeries.articles[0].subtitle || featuredSeries.articles[0].excerpt}
                </p>
              </article>
            )}
          </section>
        )}

        {/* 7. Mais lidas */}
        {mostRead.length > 0 && (
          <section className="px-4 pt-4 pb-8">
            <h3 className="font-sans text-[11px] text-vp-text uppercase tracking-[0.14em] font-bold mb-3">
              Mais lidas hoje
            </h3>
            {mostRead.map((h, i) => (
              <div key={h.id} className={`grid grid-cols-[24px_1fr] gap-2.5 py-2.5 ${i < mostRead.length - 1 ? 'border-b border-vp-border' : ''}`}>
                <span className="font-display font-bold text-[22px] text-vp-accent leading-none">{i+1}</span>
                <Headline size="small" href={`/${h.slug}`} hoverAccent={false} className="!text-[14px] leading-[1.25]">
                  {h.title}
                </Headline>
              </div>
            ))}
          </section>
        )}
      </main>

      <MobileTabBar active="home" />
    </div>
  );
}

