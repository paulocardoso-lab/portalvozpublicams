import React from 'react';
import { Article, User, Section } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import Image from 'next/image';
import { SafeImage } from '@/components/shared/SafeImage';

type ArticleWithRelations = Article & {
  authors: User[];
  section: Section;
};

export function DesktopArticle({ article }: { article: ArticleWithRelations }) {
  if (!article) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="px-7 py-3.5 border-b border-vp-border font-sans text-[11px] text-vp-text-3 tracking-[0.06em] uppercase">
        <span className="cursor-pointer hover:underline">Editorias</span> <span className="mx-2 text-vp-text-4">/</span>
        <span className="text-vp-accent cursor-pointer hover:underline">{article.section?.name || 'Geral'}</span>
        {article.eyebrow && (
          <>
            <span className="mx-2 text-vp-text-4">/</span>
            <span className="cursor-pointer hover:underline">{article.eyebrow}</span>
          </>
        )}
      </div>

      <article className="grid grid-cols-[200px_minmax(0,680px)_260px] justify-center gap-12 px-12 py-9 mx-auto w-full">
        {/* Left — sticky share */}
        <aside className="sticky top-[160px] self-start grid gap-4">
          <div className="meta tracking-[0.1em] uppercase text-[10px] mb-1">Compartilhar</div>
          {['WhatsApp', 'Facebook', 'X / Twitter', 'LinkedIn', 'Copiar link', 'Imprimir'].map(s => (
            <a key={s} className="font-sans text-[12px] text-vp-text-2 border-l border-vp-border pl-3 cursor-pointer hover:text-vp-accent hover:border-vp-accent transition-colors">
              {s}
            </a>
          ))}
          <div className="mt-2.5 p-3 border border-vp-border text-[11px] font-sans text-vp-text-3 leading-[1.5]">
            Esta reportagem é aberta e sem paywall. Se considera importante, <a className="text-vp-accent cursor-pointer hover:underline">contribua</a>.
          </div>
        </aside>

        {/* Main — article body */}
        <div className="max-w-[680px]">
          <span className="eyebrow">{article.eyebrow || article.section?.name || 'Investigação'} · {article.readTimeMin || 14} min de leitura</span>
          <h1 className="font-display text-[52px] leading-[1.05] mt-3.5 mb-4.5 tracking-[-0.015em] text-balance">
            {article.title}
          </h1>
          <p className="font-serif text-[20px] italic text-vp-text-2 leading-[1.45] mb-5.5 text-pretty">
            {article.lead}
          </p>

          <div className="flex items-center gap-4.5 pt-4.5 border-y border-vp-border pb-3.5 mb-7">
            {article.authors[0]?.avatar ? (
              <div className="relative w-[44px] h-[44px] overflow-hidden rounded-full shrink-0">
                <SafeImage src={article.authors[0].avatar} alt="" fill className="object-cover" />
              </div>
            ) : (
              <ImgPH label="" width={44} height={44} className="rounded-full" />
            )}
            <div className="flex-1">
              <div className="font-sans text-[13px] text-vp-text font-semibold">
                Por {article.authors?.length > 0 ? article.authors.map(a => a.name).join(' e ') : 'Redação'}
              </div>
              <div className="byline text-[11px] mt-0.5">
                {article.publishedAt && !isNaN(new Date(article.publishedAt).getTime()) ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(article.publishedAt)) : '22 de abril de 2026, 06:00'}
                {article.updatedAt && !isNaN(new Date(article.updatedAt).getTime()) && article.updatedAt > (article.publishedAt || new Date()) && ` · Atualizado há 2h`}
              </div>
            </div>
          </div>

          {article.heroImage ? (
            <div className="relative w-full aspect-[16/9] mb-3 overflow-hidden rounded-sm group">
              <SafeImage src={article.heroImage} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
            </div>
          ) : (
            <ImgPH label="foto destaque" height={460} className="mb-3" />
          )}
          {article.heroCaption && (
            <div className="meta font-serif italic text-[13px] mb-7 text-vp-text-3 border-l-2 border-vp-accent pl-3">
              {article.heroCaption}
            </div>
          )}

          <div 
            className="article-body mb-10"
            dangerouslySetInnerHTML={{ 
              __html: typeof article.body === 'string' 
                ? article.body 
                : JSON.stringify(article.body) 
            }}
          />

          {/* Chapter nav — Fiel ao Article.jsx */}
          <div className="mt-7 border border-vp-border bg-vp-surface">
            {['01 · O leito que engoliu o rio', '02 · Os donos da margem', '03 · O plano que nunca saiu do papel', '04 · Ciência: o que está em jogo', '05 · O que pode ser feito'].map((c, i) => (
              <div key={i} className={`p-[14px_18px] border-b border-vp-border flex justify-between font-sans text-[14px] cursor-pointer ${i === 0 ? 'text-vp-accent' : 'text-vp-text-2 hover:text-vp-text'} ${i === 4 ? 'border-b-0' : ''}`}>
                <span>{c}</span>
                <span className="meta">{['4 min', '6 min', '3 min', '5 min', '4 min'][i]}</span>
              </div>
            ))}
          </div>

          {/* Methodology — Fiel ao Article.jsx */}
          <div className="mt-7 p-5 border border-vp-border bg-vp-accent-soft">
            <div className="eyebrow mb-2">Metodologia</div>
            <p className="font-serif text-[14px] leading-[1.6] text-vp-text-2">
              Esta reportagem analisou autos de infração, dados hidrológicos e imagens de satélite. Consultamos fontes especializadas e dados brutos estão disponíveis em nosso repositório.
            </p>
          </div>
        </div>

        {/* Right sidebar — Fiel ao Article.jsx */}
        <aside className="grid gap-5 self-start">
          <div className="vp-ad h-[250px]">300 × 250</div>
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-3">Leia também</h3>
            <ul className="list-none p-0 m-0 grid gap-3.5">
              {['Os donos das terras que mais desmatam', 'O mapa do fogo: MS em tempo real', 'Pesquisadores deixam Embrapa por cortes'].map((h, i) => (
                <li key={i} className={`pb-3 border-b border-vp-border ${i === 2 ? 'border-b-0' : ''}`}>
                  <h4 className="vp-headline text-[14px]">{h}</h4>
                  <div className="byline mt-1">há {i + 2} dias</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-vp-surface p-4 border border-vp-border">
            <div className="eyebrow mb-1.5 text-[10px]">Apoie esta reportagem</div>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-2.5">O Voz Pública é sustentado por seus leitores. Seja um dos 4.812 apoiadores.</p>
            <button className="vp-btn vp-btn-primary w-full text-[12px]">Contribuir</button>
          </div>
        </aside>
      </article>

      <SiteFooter />
    </div>
  );
}
