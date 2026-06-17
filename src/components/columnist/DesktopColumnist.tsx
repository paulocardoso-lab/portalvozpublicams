import React from 'react';
import Link from 'next/link';
import type { Article } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { Headline } from '@/components/shared/Headline';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { SafeImage } from '@/components/shared/SafeImage';
import { AdSlot } from '@/components/shared/AdSlot';
import { formatPortalDate } from '@/lib/portal-time';

interface DesktopColumnistProps {
  columnist: {
    id: string;
    name: string;
    slug: string | null;
    image: string | null;
    avatar: string | null;
    email: string;
    bio: string | null;
    articles: Article[];
  };
}

/**
 * DesktopColumnist — Página de colunista para desktop.
 * Layout com perfil do autor em destaque e arquivo de colunas.
 */
export function DesktopColumnist({ columnist }: DesktopColumnistProps) {
  const articles = columnist.articles || [];
  const latest = articles[0];
  const archive = articles.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      {/* Hero Columnist */}
      <div className="border-b border-vp-border bg-vp-surface px-[28px] py-[40px]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-[160px_1fr_auto] gap-[28px] items-center">
          <div className="w-[160px] h-[160px] rounded-full overflow-hidden bg-vp-bg border border-vp-border shrink-0">
            {columnist.image ? (
              <SafeImage src={columnist.image} alt={columnist.name} fill className="object-cover" />
            ) : (
              <ImgPH label="" width={160} height={160} className="rounded-full" />
            )}
          </div>
          <div>
            <Eyebrow className="mb-2">Colunista · Voz Pública</Eyebrow>
            <h1 className="font-display text-[56px] tracking-tight font-black mb-2.5 leading-[1.05] text-vp-text">
              {columnist.name}
            </h1>
            <p className="font-serif italic text-[17px] text-vp-text-2 max-w-[640px] leading-[1.5]">
              {columnist.bio || 'Analista político e colaborador do Voz Pública MS, focado nas dinâmicas de poder no estado.'}
            </p>
            <div className="mt-4 flex items-center gap-4 font-sans text-[12px]">
              <a href={`mailto:${columnist.email}`} className="text-vp-text-3 hover:text-vp-accent transition-colors font-bold">
                {columnist.email}
              </a>
              <span className="text-vp-text-4">·</span>
              <a href="#" className="text-vp-text-3 hover:text-vp-accent transition-colors font-bold uppercase tracking-widest">
                Seguir
              </a>
            </div>
          </div>
          <div>
            <button className="vp-btn vp-btn-primary px-8 py-3.5 font-bold uppercase tracking-widest text-[12px]">
              Assinar coluna
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[1fr_300px] gap-[32px] px-[28px] py-[40px] max-w-[1300px] mx-auto w-full">
        <div>
          {/* Latest Column */}
          {latest ? (
            <article className="pb-[40px] border-b border-vp-border">
              <Eyebrow className="mb-2.5">
                Coluna de hoje · {latest.publishedAt ? formatPortalDate(latest.publishedAt, { day: 'numeric', month: 'short' }) : ''}
              </Eyebrow>
              <Headline as="h2" size="hero" href={`/materia/${latest.slug}`} className="!text-[42px] italic mb-3.5 leading-[1.1] font-black">
                “{latest.title}”
              </Headline>
              <p className="font-serif text-[19px] text-vp-text-2 leading-[1.6] mb-6">
                {latest.lead}
              </p>
              <Link href={`/materia/${latest.slug}`} className="vp-btn inline-block px-6 py-3 font-bold uppercase tracking-widest text-[12px]">
                Ler coluna completa →
              </Link>
            </article>
          ) : (
            <div className="py-20 text-center text-vp-text-3 font-serif italic border-b border-vp-border">
              O colunista ainda não publicou textos.
            </div>
          )}

          {/* Archive List */}
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mt-[40px] mb-[24px] text-vp-text-3 border-b border-vp-border pb-2">
            Colunas recentes
          </h3>
          <div className="flex flex-col">
            {archive.map((art) => (
              <article key={art.id} className="py-[20px] border-b border-vp-border grid grid-cols-[60px_1fr] gap-[24px] group">
                <div className="font-mono text-[11px] text-vp-text-3 tracking-[0.08em] uppercase pt-1.5 font-bold text-center">
                  {art.publishedAt ? formatPortalDate(art.publishedAt, { day: 'numeric', month: 'short' }) : ''}
                </div>
                <div>
                  <Headline size="h3" href={`/materia/${art.slug}`} className="!text-[22px] italic mb-1.5 leading-snug group-hover:text-vp-accent transition-colors">
                    “{art.title}”
                  </Headline>
                  <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] line-clamp-2">
                    {art.lead}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 self-start">
          <div className="bg-vp-surface border border-vp-border p-5">
            <Eyebrow className="mb-2 text-[10px]">Sobre a coluna</Eyebrow>
            <p className="font-serif text-[14px] text-vp-text-2 leading-[1.55]">
              {articles.length > 0 ? `${articles.length} texto${articles.length > 1 ? 's' : ''} no arquivo.` : 'Colunista do portal.'}
            </p>
          </div>

          <AdSlot id="sidebar-top" className="w-full" />
          <AdSlot id="sidebar-bottom" className="w-full" />
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
