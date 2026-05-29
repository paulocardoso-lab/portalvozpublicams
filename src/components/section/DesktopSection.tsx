import React from 'react';
import Link from 'next/link';
import type { Section, Article } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { Tag } from '@/components/shared/Tag';
import { Headline } from '@/components/shared/Headline';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { SafeImage } from '@/components/shared/SafeImage';

type ArticleWithRelations = Article & {
  authors: { id: string; name: string; slug: string | null; avatar: string | null }[];
};

interface DesktopSectionProps {
  section: Section;
  articles: ArticleWithRelations[];
}

/**
 * DesktopSection — Página de editoria para desktop.
 * Layout com hero de seção, subnav e grid de notícias.
 */
export function DesktopSection({ section, articles }: DesktopSectionProps) {
  const featured = articles[0];
  const list = articles.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      {/* Section Hero */}
      <div className="border-b-2 border-vp-text px-[28px] py-[40px]">
        <div className="max-w-[1300px] mx-auto">
          <Eyebrow className="mb-2.5">Editoria</Eyebrow>
          <h1 className="font-display text-[72px] tracking-tight font-black mb-3.5 leading-[1.05] text-vp-text">
            {section.name}
          </h1>
          <p className="font-serif text-[18px] text-vp-text-2 max-w-[640px] leading-[1.5]">
            {section.description || `Cobertura contínua de ${section.name} em Mato Grosso do Sul — política, sociedade e as vozes do estado.`}
          </p>
          <div className="mt-4.5 flex items-center gap-4.5 font-sans text-[12px] text-vp-text-3">
            <span>{articles.length} reportagens</span>
            <span className="w-1 h-1 bg-vp-border rounded-full" />
            <span>Voz Pública MS</span>
          </div>
        </div>
      </div>

      {/* Subnav */}
      <div className="border-b border-vp-border px-[28px] flex gap-[22px] font-sans text-[12px] text-vp-text-2 uppercase tracking-[0.08em]">
        {['Todos', 'Investigações', 'Dados', 'Séries', 'Vídeo', 'Opinião'].map((t, i) => (
          <button
            key={t}
            className={`py-[14px] border-b-2 font-bold transition-all hover:text-vp-accent ${
              i === 0 ? 'border-vp-accent text-vp-accent' : 'border-transparent'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_300px] gap-[32px] px-[28px] py-[28px] max-w-[1400px] mx-auto w-full">
        <div>
          {/* Featured Article */}
          {featured && (
            <article className="grid grid-cols-2 gap-[28px] pb-[28px] border-b border-vp-border">
              <Link href={`/${featured.slug}`} className="block">
                {featured.heroImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-sm group">
                    <SafeImage
                      src={featured.heroImage}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <ImgPH label="destaque" height={340} />
                )}
              </Link>
              <div className="flex flex-col justify-center">
                <Eyebrow className="mb-2.5">{featured.eyebrow || 'Destaque'}</Eyebrow>
                <Headline size="h2" href={`/${featured.slug}`} className="!text-[38px] mb-3.5 leading-[1.05]">
                  {featured.title}
                </Headline>
                <p className="font-serif text-[16px] text-vp-text-2 leading-[1.5] mb-4 line-clamp-3">
                  {featured.lead}
                </p>
                <div className="byline text-[11px]">
                  {featured.authors.map(a => a.name).join(' e ')} · {featured.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(featured.publishedAt)) : ''}
                </div>
              </div>
            </article>
          )}

          {/* Article List */}
          <div className="flex flex-col">
            {list.map((art, i) => (
              <article key={art.id} className="grid grid-cols-[200px_1fr_auto] gap-[22px] py-[22px] border-b border-vp-border items-start group">
                <Link href={`/${art.slug}`} className="block">
                  {art.heroImage ? (
                    <div className="relative h-[130px] overflow-hidden rounded-sm group-hover:opacity-90 transition-opacity">
                      <SafeImage src={art.heroImage} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <ImgPH label={art.eyebrow || section.name} height={130} />
                  )}
                </Link>
                <div>
                  <Eyebrow className="text-[10px] mb-1.5">{art.eyebrow || 'Reportagem'}</Eyebrow>
                  <Headline size="h3" href={`/${art.slug}`} className="!text-[22px] mb-2 leading-tight">
                    {art.title}
                  </Headline>
                  <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] line-clamp-2">
                    {art.lead}
                  </p>
                  <div className="byline mt-2.5">
                    por {art.authors.map(a => a.name).join(', ')} · {art.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(art.publishedAt)) : ''}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 text-right">
                  <span className="meta">{art.readTimeMin || 5} min</span>
                  <span className="meta text-[10px]">128 COMENT.</span>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-1 py-[28px] font-sans text-[13px]">
            {['1', '2', '3', '4', '…', '29'].map((n, i) => (
              <button
                key={i}
                className={`vp-btn min-w-[36px] px-2.5 py-1.5 rounded-none border transition-colors ${
                  i === 0
                    ? 'bg-vp-surface border-vp-border-2 text-vp-text'
                    : 'bg-transparent border-transparent text-vp-text-3 hover:bg-vp-surface hover:text-vp-text'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 self-start">
          <div className="vp-ad h-[250px] w-full flex items-center justify-center text-vp-text-4 font-mono text-[11px]">
            300 × 250
          </div>
          
          <div className="bg-vp-surface p-4 border border-vp-border">
            <h4 className="font-display text-[18px] font-bold text-vp-text mb-4">
              Repórteres desta editoria
            </h4>
            <div className="flex flex-col gap-3">
              {['Marina Ribeiro', 'Carlos Benites', 'Lucas Fragoso', 'Ana Figueira'].map((name, i) => (
                <div key={name} className={`flex items-center gap-3 py-1 ${i > 0 ? 'border-t border-vp-border pt-3' : ''}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-vp-bg shrink-0">
                    <ImgPH label="" width={32} height={32} />
                  </div>
                  <div className="font-sans text-[13px] text-vp-text-2 font-bold">{name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="vp-ad h-[600px] w-full flex items-center justify-center text-vp-text-4 font-mono text-[11px]">
            300 × 600
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
