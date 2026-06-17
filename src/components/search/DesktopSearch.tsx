import React from 'react';
import type { Article, Section } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Headline } from '@/components/shared/Headline';
import { formatPortalDate } from '@/lib/portal-time';

type ArticleWithRelations = Article & {
  section: Section | null;
  authors: { id: string; name: string; slug: string | null; avatar: string | null }[];
};

interface DesktopSearchProps {
  query: string;
  results: ArticleWithRelations[];
}

/**
 * DesktopSearch — Página de busca para desktop.
 * Layout com filtros laterais e lista de resultados otimizada.
 */
export function DesktopSearch({ query, results }: DesktopSearchProps) {
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      <div className="max-w-[1200px] mx-auto w-full px-[28px] py-[32px]">
        {/* Search Bar Area */}
        <form action="/busca" method="GET" className="flex gap-3 mb-2.5">
          <input 
            name="q"
            defaultValue={query}
            placeholder="O que você procura?"
            className="vp-input flex-1 font-display text-[28px] py-3.5 px-5 bg-vp-bg border-2 focus:border-vp-accent outline-none"
            autoFocus
          />
          <button type="submit" className="vp-btn vp-btn-primary px-8 font-bold uppercase tracking-widest text-[14px]">
            Buscar
          </button>
        </form>
        
        <div className="byline mb-8">
          Cerca de <strong className="text-vp-text">{results.length} resultados</strong> encontrados
        </div>

        <div className="grid grid-cols-[200px_1fr] gap-[32px]">
          {/* Filters Sidebar */}
          <aside className="flex flex-col gap-6 self-start font-sans text-[13px]">
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-black text-vp-text mb-3">Tipo</h4>
              <div className="flex flex-col gap-2">
                {['Reportagem', 'Coluna', 'Vídeo', 'Podcast', 'Dados'].map((x, i) => (
                  <label key={x} className="flex items-center gap-2.5 text-vp-text-2 cursor-pointer hover:text-vp-text transition-colors">
                    <input type="checkbox" defaultChecked={i < 3} className="vp-checkbox" />
                    {x}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-black text-vp-text mb-3">Editoria</h4>
              <div className="flex flex-col gap-2">
                {['Pantanal', 'Política', 'Cidades', 'Economia', 'Cultura'].map(x => (
                  <label key={x} className="flex items-center gap-2.5 text-vp-text-2 cursor-pointer hover:text-vp-text transition-colors">
                    <input type="checkbox" className="vp-checkbox" />
                    {x}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-black text-vp-text mb-3">Período</h4>
              <div className="flex flex-col gap-2">
                {['Últimos 7 dias', 'Último mês', 'Último ano', 'Tudo'].map((x, i) => (
                  <label key={x} className="flex items-center gap-2.5 text-vp-text-2 cursor-pointer hover:text-vp-text transition-colors">
                    <input type="radio" name="period" defaultChecked={i === 3} className="vp-radio" />
                    {x}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex flex-col">
            {results.length > 0 ? (
              results.map((art) => (
                <article key={art.id} className="py-5 border-b border-vp-border group">
                  <div className="font-sans text-[10px] text-vp-text-3 uppercase tracking-widest mb-1.5 font-bold">
                    {art.section?.name || 'Geral'} · {art.eyebrow || 'Reportagem'} · {art.publishedAt ? formatPortalDate(art.publishedAt, { day: 'numeric', month: 'short' }) : ''}
                  </div>
                  <Headline size="h3" href={`/materia/${art.slug}`} className="!text-[24px] mb-2 group-hover:text-vp-accent transition-colors">
                    {art.title}
                  </Headline>
                  <p className="font-serif text-[15px] text-vp-text-2 leading-[1.6] line-clamp-2">
                    {art.lead}
                  </p>
                </article>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-vp-border rounded-sm">
                <p className="font-serif italic text-vp-text-3">
                  Nenhum resultado encontrado para sua busca.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
