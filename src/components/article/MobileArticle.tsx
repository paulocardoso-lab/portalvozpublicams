"use client";

import React from 'react';
import { Article, User, Section } from '@prisma/client';
import { ImgPH } from '@/components/shared/ImgPH';
import Image from 'next/image';

type ArticleWithRelations = Article & {
  authors: User[];
  section: Section;
};

export function MobileArticle({ article }: { article: ArticleWithRelations }) {
  if (!article) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto border-x border-vp-border relative">
      {/* Top minimal bar with progress */}
      <div className="sticky top-0 z-50 bg-vp-bg border-b border-vp-border">
        <div className="flex items-center px-4 py-3 gap-3">
          <button 
            aria-label="Voltar" 
            className="bg-transparent border-none text-vp-text p-0 cursor-pointer hover:text-vp-accent"
            onClick={() => window.history.back()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <span className="eyebrow flex-1 text-[9px] truncate">{article.section.name} {article.eyebrow && `· ${article.eyebrow}`}</span>
          <button aria-label="Ajustar texto" className="bg-transparent border-none text-vp-text text-[16px] p-0 cursor-pointer hover:text-vp-accent">Aa</button>
          <button aria-label="Salvar" className="bg-transparent border-none text-vp-text p-0 cursor-pointer hover:text-vp-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h12v18l-6-4-6 4z"/></svg>
          </button>
        </div>
        <div className="h-[2px] bg-vp-border w-full">
          <div className="w-[34%] h-full bg-vp-accent transition-all duration-300" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto vp-scroll">
        <article className="px-[18px] pt-[18px] pb-6">
          <span className="eyebrow text-[10px]">{article.eyebrow || article.section.name} · {article.readTimeMin || 5} min de leitura</span>
          <h1 className="font-display text-[30px] leading-[1.05] my-2.5 tracking-[-0.015em] text-balance">
            {article.title}
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-2 leading-[1.45] mb-4 text-pretty">
            {article.lead}
          </p>

          <div className="flex items-center gap-3 py-3 border-y border-vp-border mb-[18px]">
            {article.authors[0]?.avatar ? (
              <div className="relative w-[36px] h-[36px] overflow-hidden rounded-full shrink-0">
                <Image 
                  src={article.authors[0].avatar} 
                  alt="" 
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <ImgPH label="" width={36} height={36} style={{ borderRadius: '50%' }} />
            )}
            <div className="flex-1">
              <div className="font-sans text-[12px] font-semibold">{article.authors.map(a => a.name).join(' e ')}</div>
              <div className="byline text-[11px]">
                {article.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(article.publishedAt)) : 'Recente'}
              </div>
            </div>
            <button aria-label="Compartilhar" className="bg-transparent border-none text-vp-text-3 p-0 cursor-pointer hover:text-vp-accent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></svg>
            </button>
          </div>

          {article.heroImage ? (
            <div className="relative w-full aspect-[16/9] mb-2 overflow-hidden rounded-sm">
              <Image 
                src={article.heroImage} 
                alt={article.title} 
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <ImgPH label={article.eyebrow || 'capa'} height={220} style={{ marginBottom: 8 }} />
          )}
          {article.heroCaption && (
            <div className="meta italic mb-[22px] text-[11px]">{article.heroCaption}</div>
          )}

          <div 
            className="font-serif text-[17px] leading-[1.65] text-vp-text article-body"
            dangerouslySetInnerHTML={{ 
              __html: typeof article.body === 'string' 
                ? article.body 
                : JSON.stringify(article.body)
            }}
          />
        </article>

        {/* Comments preview */}
        <div className="p-5 border-t border-vp-border bg-vp-surface">
          <h3 className="font-display text-[17px] mb-2.5">Comentários · {article.views > 10 ? '47' : '0'}</h3>
          <button className="vp-btn w-full text-[12px]">Ver e participar</button>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="border-t border-vp-border bg-vp-bg grid grid-cols-4 py-2 sticky bottom-0 z-50">
        {[['▲', article.views > 100 ? '128' : '0'],['↗','Compart.'],['❝','Citar'],['⌃','+']].map(([i,l],idx) => (
          <button key={idx} className="bg-transparent border-none text-vp-text-2 flex flex-col items-center gap-[2px] p-1 font-sans text-[10px] cursor-pointer hover:text-vp-text">
            <span className="text-[14px]">{i}</span><span>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
