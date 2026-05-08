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

      <article className="grid grid-cols-[200px_1fr_260px] gap-9 px-12 py-9 max-w-[1400px] mx-auto w-full">
        {/* Left — sticky share */}
        <aside className="sticky top-[160px] self-start grid gap-4">
          <div className="meta tracking-[0.1em] uppercase text-[10px] mb-1">Compartilhar</div>
          {['WhatsApp','Facebook','X / Twitter','LinkedIn','Copiar link','Imprimir'].map(s => (
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
          <span className="eyebrow text-[10px]">{article.eyebrow || article.section?.name || 'Geral'} · {article.readTimeMin || 5} min de leitura</span>
          <h1 className="font-display text-[52px] leading-[1.05] mt-3.5 mb-4.5 tracking-[-0.015em] text-balance">
            {article.title}
          </h1>
          <p className="font-serif text-[20px] italic text-vp-text-2 leading-[1.45] mb-5.5 text-pretty">
            {article.lead}
          </p>

          <div className="flex items-center gap-4.5 pt-4.5 border-y border-vp-border pb-3.5 mb-7">
            {article.authors[0]?.avatar ? (
              <div className="relative w-[44px] h-[44px] overflow-hidden rounded-full shrink-0">
                <SafeImage 
                  src={article.authors[0].avatar} 
                  alt="" 
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <ImgPH label="" width={44} height={44} style={{ borderRadius: '50%' }} />
            )}
            <div className="flex-1">
              <div className="font-sans text-[13px] text-vp-text font-semibold">
                Por {article.authors?.length > 0 ? article.authors.map(a => a.name).join(' e ') : 'Redação'}
              </div>
              <div className="byline text-[11px] mt-0.5">
                {article.publishedAt && !isNaN(new Date(article.publishedAt).getTime()) ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(article.publishedAt)) : 'Recente'}
                {article.updatedAt && !isNaN(new Date(article.updatedAt).getTime()) && article.updatedAt > (article.publishedAt || new Date()) && ` · Atualizado ${new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(article.updatedAt))}`}
              </div>
            </div>
          </div>

          {article.heroImage ? (
            <div className="relative w-full aspect-[16/9] mb-7 overflow-hidden rounded-sm group">
              <SafeImage 
                src={article.heroImage} 
                alt={article.title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          ) : (
            <ImgPH label={article.eyebrow || 'capa'} height={460} style={{ marginBottom: 14 }} />
          )}
          {article.heroCaption && (
            <div className="meta font-serif italic text-[13px] mb-7 text-vp-text-3 border-l-2 border-vp-accent pl-3">
              {article.heroCaption}
            </div>
          )}

          <div 
            className="font-serif text-[19px] leading-[1.65] text-vp-text text-pretty article-body mb-10"
            dangerouslySetInnerHTML={{ 
              __html: typeof article.body === 'string' 
                ? article.body 
                : JSON.stringify(article.body) // Fallback temporário
            }}
          />
        </div>

        {/* Right sidebar */}
        <aside className="grid gap-5 self-start">
          <div className="vp-ad h-[250px]">300 × 250</div>
          <div className="bg-vp-surface p-4 border border-vp-border">
            <div className="eyebrow mb-1.5 text-[10px]">Apoie esta reportagem</div>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-2.5">O Voz Pública é sustentado por seus leitores. Ajude-nos a manter este jornalismo independente.</p>
            <button className="vp-btn vp-btn-primary w-full text-[12px]">Contribuir</button>
          </div>
        </aside>
      </article>

      <SiteFooter />
    </div>
  );
}
