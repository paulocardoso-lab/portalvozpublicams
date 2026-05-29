import React from 'react';
import Link from 'next/link';
import type { Article, Section } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Headline } from '@/components/shared/Headline';
import { SafeImage } from '@/components/shared/SafeImage';
import { AdSlot } from '@/components/shared/AdSlot';
import { renderArticleBody } from '@/lib/article-renderer';

type ArticleWithRelations = Article & {
  authors: { id: string; name: string; slug: string | null; avatar: string | null }[];
  section: Section;
};

/**
 * DesktopArticle — Vista de leitura de matéria para desktop.
 * Layout clássico de 3 colunas com share lateral fixo e tipografia editorial densa.
 */
export function DesktopArticle({ article }: { article: ArticleWithRelations }) {
  if (!article) return null;

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      {/* Breadcrumb */}
      <nav className="px-[28px] py-[14px] border-b border-vp-border font-sans text-[11px] text-vp-text-3 tracking-[0.06em] uppercase">
        <Link href="/" className="hover:text-vp-accent transition-colors">Editorias</Link>
        <span className="mx-2 text-vp-text-4">/</span>
        <Link href={`/editoria/${article.section?.slug}`} className="text-vp-accent hover:underline">{article.section?.name || 'Geral'}</Link>
        {article.eyebrow && (
          <>
            <span className="mx-2 text-vp-text-4">/</span>
            <span className="text-vp-text-2">{article.eyebrow}</span>
          </>
        )}
      </nav>

      <article className="grid grid-cols-[200px_1fr_260px] gap-[36px] px-[48px] py-[36px] max-w-[1400px] mx-auto w-full">
        {/* Left — Sticky Share Actions */}
        <aside className="sticky top-[160px] self-start flex flex-col gap-4">
          <div className="font-sans text-[10px] uppercase tracking-widest text-vp-text-3 font-bold mb-1">Compartilhar</div>
          {[
            { label: 'WhatsApp', icon: 'WA' },
            { label: 'Facebook', icon: 'FB' },
            { label: 'X / Twitter', icon: 'X' },
            { label: 'LinkedIn', icon: 'IN' },
            { label: 'Copiar link', icon: 'URL' },
            { label: 'Imprimir', icon: 'PRT' }
          ].map(s => (
            <button key={s.label} className="font-sans text-[12px] text-vp-text-2 border-l border-vp-border pl-3 text-left hover:text-vp-accent hover:border-vp-accent transition-all">
              {s.label}
            </button>
          ))}
          <div className="mt-4 p-3 border border-vp-border bg-vp-surface/50 text-[11px] font-sans text-vp-text-3 leading-[1.5]">
            Esta reportagem é aberta e sem paywall. Se considera importante, <Link href="/apoiar" className="text-vp-accent font-bold hover:underline">contribua</Link>.
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="max-w-[680px]">
          <Eyebrow className="mb-3.5">
            {article.eyebrow || article.section?.name} · {article.readTimeMin || 8} min de leitura
          </Eyebrow>
          
          <Headline as="h1" size="article" className="mb-4.5 font-black tracking-tight">
            {article.title}
          </Headline>
          
          <p className="font-serif text-[20px] italic text-vp-text-2 leading-[1.45] mb-6">
            {article.lead}
          </p>

          <div className="flex items-center gap-[18px] py-4.5 border-y border-vp-border mb-7">
            <div className="relative w-[44px] h-[44px] rounded-full overflow-hidden bg-vp-surface">
              {article.authors?.[0]?.avatar ? (
                <SafeImage src={article.authors[0].avatar} alt="" fill className="object-cover" />
              ) : (
                <ImgPH label="" width={44} height={44} className="rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-sans text-[13px] text-vp-text font-bold">
                Por {article.authors?.map(a => a.name).join(' e ') || 'Redação'}
              </div>
              <div className="byline text-[11px] mt-0.5">
                {article.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(article.publishedAt)) : ''}
              </div>
            </div>
          </div>

          {article.heroImage ? (
            <div className="relative aspect-[16/9] w-full mb-3.5 overflow-hidden rounded-sm">
              <SafeImage src={article.heroImage} alt="" fill className="object-cover" priority />
            </div>
          ) : (
            <ImgPH label="foto destaque" height={460} className="mb-3.5" />
          )}
          
          <p className="font-serif italic text-[13px] text-vp-text-3 mb-7 border-l-2 border-vp-accent pl-3">
            {article.heroCaption || 'Foto: Voz Pública'}
          </p>

          <div className="vp-article-content mb-12">
            {/* O conteúdo injetado terá drop-cap via CSS ::first-letter se o globals.css for respeitado */}
            <div dangerouslySetInnerHTML={{ __html: renderArticleBody(article.body) }} />
          </div>

          {/* Chapter Navigation */}
          <div className="mt-8 border border-vp-border bg-vp-surface">
            <div className="p-4 border-b border-vp-border bg-vp-surface-2 font-display text-[16px] font-bold">
              Nesta reportagem
            </div>
            {['01 · O leito que engoliu o rio', '02 · Os donos da margem', '03 · O plano que nunca saiu do papel', '04 · Ciência: o que está em jogo', '05 · O que pode ser feito'].map((c, i) => (
              <div key={i} className={`p-4 border-b border-vp-border flex justify-between font-sans text-[14px] cursor-pointer group ${i === 4 ? 'border-b-0' : ''}`}>
                <span className="text-vp-text-2 group-hover:text-vp-accent transition-colors">{c}</span>
                <span className="font-mono text-[11px] text-vp-text-3 uppercase tracking-wider">{['4 min', '6 min', '3 min', '5 min', '4 min'][i]}</span>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div className="mt-8 p-5 border border-vp-border bg-vp-accent/5 rounded-sm">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold text-vp-accent mb-2">Metodologia</h4>
            <p className="font-serif text-[14px] leading-[1.6] text-vp-text-2">
              Esta reportagem analisou 3.214 autos de infração, dados hidrológicos da ANA e imagens de satélite Sentinel-2. Consultamos 22 fontes especializadas para este especial.
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-6 self-start">
          <AdSlot id="sidebar-top" className="w-full" />
          
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold text-vp-text mb-4">Leia também</h3>
            <div className="flex flex-col gap-4">
              {[
                'Os donos das terras que mais desmatam no Pantanal',
                'O mapa do fogo: MS em tempo real',
                'Pesquisadores deixam Embrapa Pantanal por cortes'
              ].map((h, i) => (
                <div key={i} className={`pb-4 ${i < 2 ? 'border-b border-vp-border' : ''}`}>
                  <Headline size="small" className="leading-snug mb-1.5">{h}</Headline>
                  <div className="byline text-[10px]">há {i + 2} dias</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-vp-surface p-5 border border-vp-border">
            <div className="font-sans text-[10px] uppercase tracking-widest text-vp-accent font-bold mb-2">Apoie esta reportagem</div>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-4">
              8 meses de apuração foram pagos por leitores. Seja um dos 4.812 apoiadores.
            </p>
            <button className="vp-btn vp-btn-primary w-full py-2.5 font-bold uppercase tracking-widest text-[11px]">
              Contribuir
            </button>
          </div>
        </aside>
      </article>

      <SiteFooter />
    </div>
  );
}
