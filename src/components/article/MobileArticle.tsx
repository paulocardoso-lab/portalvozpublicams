"use client";

import React, { useEffect, useState } from 'react';
import { Article, Section } from '@prisma/client';
import { ImgPH } from '@/components/shared/ImgPH';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Headline } from '@/components/shared/Headline';
import { SafeImage } from '@/components/shared/SafeImage';
import { AdSlot } from '@/components/shared/AdSlot';
import { StickyBottomAd } from '@/components/shared/StickyBottomAd';
import { ArticleBodyWithAd } from '@/components/shared/ArticleBodyWithAd';
import { renderArticleBody } from '@/lib/article-renderer';
import { ShareBar } from '@/components/article/ShareBar';

type ArticleWithRelations = Article & {
  authors: { id: string; name: string; slug: string | null; avatar: string | null }[];
  section: Section;
};

/**
 * MobileArticle — Página de visualização de matéria para mobile.
 * Implementa drop-cap editorial, barra de leitura e controles de texto.
 */
export function MobileArticle({ article }: { article: ArticleWithRelations }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const articleUrl = `https://www.vozpublicams.com.br/materia/${article.slug}`;

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) return null;

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg md:hidden">
      {/* 1. Top minimal bar with progress */}
      <div className="sticky top-0 z-50 bg-vp-bg border-b border-vp-border">
        <div className="flex items-center px-2 py-0 gap-1">
          <button
            aria-label="Voltar"
            className="text-vp-text min-w-11 min-h-11 flex items-center justify-center transition-colors hover:text-vp-accent"
            onClick={() => window.history.back()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <div className="flex-1 overflow-hidden">
            <Eyebrow className="text-[9px] truncate block">
              {article.section?.name || 'Geral'} {article.eyebrow && `· ${article.eyebrow}`}
            </Eyebrow>
          </div>
          <button aria-label="Ajustar tamanho do texto" className="text-vp-text text-[16px] font-serif min-w-11 min-h-11 flex items-center justify-center hover:text-vp-accent">Aa</button>
          <button aria-label="Salvar matéria" className="text-vp-text min-w-11 min-h-11 flex items-center justify-center hover:text-vp-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h12v18l-6-4-6 4z"/></svg>
          </button>
        </div>
        <div className="h-[2px] bg-vp-border w-full">
          <div 
            className="h-full bg-vp-accent transition-all duration-150" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <main className="flex-1 pb-16">
        <article className="px-[18px] pt-6">
          <Eyebrow className="text-[10px] mb-2.5">
            {article.eyebrow || article.section?.name || 'Geral'} · {article.readTimeMin || 5} min de leitura
          </Eyebrow>
          
          <Headline as="h1" size="article" hoverAccent={false} className="!text-[30px] !leading-[1.1] mb-3.5">
            {article.title}
          </Headline>
          
          <p className="font-serif italic text-[16px] text-vp-text-2 leading-[1.45] mb-4">
            {article.lead}
          </p>

          <div className="flex items-center gap-3 py-3 border-y border-vp-border mb-[18px]">
            {article.authors?.[0]?.avatar ? (
              <div className="relative w-9 h-9 overflow-hidden rounded-full shrink-0">
                <SafeImage src={article.authors[0].avatar} alt="" fill className="object-cover" />
              </div>
            ) : (
              <ImgPH label="" width={36} height={36} className="rounded-full" />
            )}
            <div className="flex-1">
              <div className="font-sans text-[12px] font-bold text-vp-text">
                {article.authors?.length > 0 ? article.authors.map(a => a.name).join(' e ') : 'Redação'}
              </div>
              <div className="font-sans text-[11px] text-vp-text-3">
                {article.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(article.publishedAt)) : 'Recente'}
              </div>
            </div>
            <button aria-label="Compartilhar matéria" className="text-vp-text-3 p-0 hover:text-vp-accent" onClick={() => setShareOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></svg>
            </button>
          </div>

          <div className="mb-8">
            {article.heroImage ? (
              <div className="relative w-full aspect-[16/10] mb-2 overflow-hidden rounded-[2px]">
                <SafeImage src={article.heroImage} alt={article.title} fill className="object-cover" priority />
              </div>
            ) : (
              <ImgPH label="foto" height={220} className="mb-2" />
            )}
            {article.heroCaption && (
              <p className="font-serif italic text-[11px] text-vp-text-3 leading-relaxed">
                {article.heroCaption}
              </p>
            )}
          </div>

          <ArticleBodyWithAd
            html={renderArticleBody(article.body)}
            className="font-serif text-[17px] leading-[1.65] text-vp-text vp-article-content"
            adSlotId="in-article"
            insertAfterParagraph={3}
          />
        </article>

        <div className="px-4 my-6">
          <AdSlot id="mobile-inline" className="w-full" />
        </div>

        {/* 2. Comments preview */}
        <section className="px-4 py-8 border-t border-vp-border bg-vp-surface mt-8">
          <Headline as="h3" size="h3" hoverAccent={false} className="!text-[18px] mb-4">
            Comentários · 47
          </Headline>
          <button className="vp-btn w-full text-[12px] font-bold py-3">
            Ver e participar da conversa
          </button>
        </section>
      </main>

      <StickyBottomAd />

      {/* 3. Sticky bottom action bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-vp-border bg-vp-bg grid grid-cols-4 z-50">
        {[
          { i: '▲', l: '128', action: undefined },
          { i: '↗', l: 'Compart.', action: () => setShareOpen(true) },
          { i: '❝', l: 'Citar', action: undefined },
          { i: '⌃', l: '+', action: undefined }
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className="text-vp-text-2 flex flex-col items-center justify-center gap-0.5 min-h-13 font-sans text-[10px] font-bold hover:text-vp-accent transition-colors"
          >
            <span className="text-[16px] leading-none">{btn.i}</span>
            <span className="uppercase tracking-wider">{btn.l}</span>
          </button>
        ))}
      </nav>

      {/* Share bottom sheet */}
      {shareOpen && (
        <div className="fixed inset-0 z-60 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShareOpen(false)} />
          <div className="relative bg-vp-bg border-t border-vp-border rounded-t-xl p-6 pb-10">
            <div className="font-sans text-[10px] uppercase tracking-widest text-vp-text-3 font-bold mb-5">Compartilhar</div>
            <ShareBar
              url={articleUrl}
              title={article.title}
              orientation="vertical"
              className="gap-4"
            />
            <button
              type="button"
              onClick={() => setShareOpen(false)}
              className="mt-6 w-full vp-btn py-3 text-[12px] font-bold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
