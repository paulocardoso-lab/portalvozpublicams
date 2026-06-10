import React from 'react';
import Link from 'next/link';
import type { Section, Article } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { Headline } from '@/components/shared/Headline';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { SafeImage } from '@/components/shared/SafeImage';
import { AdSlot } from '@/components/shared/AdSlot';

type ArticleWithRelations = Article & {
  authors: { id: string; name: string; slug: string | null; avatar: string | null }[];
  _count: { comments: number };
};

interface DesktopSectionProps {
  section: Section;
  articles: ArticleWithRelations[];
  total: number;
  page: number;
  totalPages: number;
}

function buildPageNumbers(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  if (page > 3) pages.push('…');
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    pages.push(p);
  }
  if (page < totalPages - 2) pages.push('…');
  pages.push(totalPages);
  return pages;
}

export function DesktopSection({ section, articles, total, page, totalPages }: DesktopSectionProps) {
  const featured = articles[0];
  const list = articles.slice(1);
  const pageNumbers = buildPageNumbers(page, totalPages);

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
            <span>{total} {total === 1 ? 'reportagem' : 'reportagens'}</span>
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
          {articles.length === 0 ? (
            <div className="py-20 text-center text-vp-text-3 font-serif italic">
              Nenhuma matéria publicada nesta editoria ainda.
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <article className="grid grid-cols-2 gap-7 pb-7 border-b border-vp-border">
                  <Link href={`/materia/${featured.slug}`} className="block">
                    {featured.heroImage ? (
                      <div className="relative aspect-16/10 overflow-hidden rounded-sm group">
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
                    <Headline size="h2" href={`/materia/${featured.slug}`} className="text-[38px]! mb-3.5 leading-[1.05]">
                      {featured.title}
                    </Headline>
                    <p className="font-serif text-[16px] text-vp-text-2 leading-normal mb-4 line-clamp-3">
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
                {list.map((art) => (
                  <article key={art.id} className="grid grid-cols-[200px_1fr_auto] gap-5.5 py-5.5 border-b border-vp-border items-start group">
                    <Link href={`/materia/${art.slug}`} className="block">
                      {art.heroImage ? (
                        <div className="relative h-32.5 overflow-hidden rounded-sm group-hover:opacity-90 transition-opacity">
                          <SafeImage src={art.heroImage} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <ImgPH label={art.eyebrow || section.name} height={130} />
                      )}
                    </Link>
                    <div>
                      <Eyebrow className="text-[10px] mb-1.5">{art.eyebrow || 'Reportagem'}</Eyebrow>
                      <Headline size="h3" href={`/materia/${art.slug}`} className="text-[22px]! mb-2 leading-tight">
                        {art.title}
                      </Headline>
                      <p className="font-serif text-[14px] text-vp-text-2 leading-normal line-clamp-2">
                        {art.lead}
                      </p>
                      <div className="byline mt-2.5">
                        por {art.authors.map(a => a.name).join(', ')} · {art.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(art.publishedAt)) : ''}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 text-right">
                      <span className="meta">{art.readTimeMin || 5} min</span>
                      {art._count.comments > 0 && (
                        <span className="meta text-[10px]">{art._count.comments} COMENT.</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Paginação real */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-1 py-7 font-sans text-[13px]">
                  {pageNumbers.map((n, i) =>
                    n === '…' ? (
                      <span key={`ellipsis-${i}`} className="min-w-9 px-2.5 py-1.5 text-center text-vp-text-3">
                        …
                      </span>
                    ) : (
                      <Link
                        key={n}
                        href={`/editoria/${section.slug}?page=${n}`}
                        className={`vp-btn min-w-9 px-2.5 py-1.5 rounded-none border transition-colors text-center ${
                          n === page
                            ? 'bg-vp-surface border-vp-border-2 text-vp-text'
                            : 'bg-transparent border-transparent text-vp-text-3 hover:bg-vp-surface hover:text-vp-text'
                        }`}
                      >
                        {n}
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 self-start">
          <AdSlot id="sidebar-top" className="w-full" />
          <AdSlot id="sidebar-bottom" className="w-full" />
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
