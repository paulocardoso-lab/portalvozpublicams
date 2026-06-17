import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Monogram } from '@/components/shared/Monogram';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { SafeImage } from '@/components/shared/SafeImage';
import { getPodcastEpisodes } from '@/app/actions/podcast';
import { getSiteSettings } from '@/app/actions/settings';
import { PodcastPlayButton } from '@/components/podcast/PodcastPlayButton';
import type { Metadata } from 'next';
import { formatPortalDate } from '@/lib/portal-time';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const episodes = await getPodcastEpisodes();
  const ep = episodes.find(e => e.id === id);
  if (!ep) return { title: 'Episódio não encontrado | Voz Pública MS' };
  return {
    title: `${ep.title} | Podcast Voz Pública MS`,
    description: ep.description ?? undefined,
    openGraph: ep.coverImage ? { images: [ep.coverImage] } : undefined,
  };
}

export default async function PodcastEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [episodes, settings] = await Promise.all([getPodcastEpisodes(), getSiteSettings()]);
  const ep = episodes.find(e => e.id === id && e.isActive);
  if (!ep) notFound();

  const programTitle = settings['podcast.title'] || 'Voz Alta';
  const others = episodes.filter(e => e.isActive && e.id !== id).slice(0, 4);
  const epIndex = episodes.filter(e => e.isActive).findIndex(e => e.id === id);
  const epNumber = episodes.filter(e => e.isActive).length - epIndex;

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <div className="hidden lg:block">
        <SiteHeader />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center px-2 py-1 border-b border-vp-border gap-1">
        <Link href="/podcasts" aria-label="Voltar" className="text-vp-text text-[24px] leading-none min-w-11 min-h-11 flex items-center justify-center hover:text-vp-accent transition-colors no-underline">←</Link>
        <div className="flex-1 text-center">
          <Monogram size="sm" cssHeight="var(--vp-compact-logo-size)" />
        </div>
        <div className="min-w-11" />
      </div>

      <main className="flex-1 flex flex-col items-center">
        <div className="max-w-[760px] w-full lg:my-12 lg:border lg:border-vp-border">

          {/* Episode header */}
          <div className="px-5 py-8 lg:p-10 bg-vp-surface border-b border-vp-border">
            <Eyebrow className="text-[10px] mb-4">
              <Link href="/podcasts" className="hover:text-vp-accent transition-colors">{programTitle}</Link>
              {' · '}Ep. {epNumber}
            </Eyebrow>

            <div className="flex gap-5 items-start">
              {/* Cover */}
              <div className="shrink-0 w-24 h-24 lg:w-32 lg:h-32 relative overflow-hidden rounded-sm border border-vp-border bg-vp-surface-2">
                {ep.coverImage ? (
                  <SafeImage src={ep.coverImage} alt={ep.title} fill sizes="128px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-vp-text-4">
                      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="font-display text-[22px] lg:text-[28px] font-black leading-tight mb-2">
                  {ep.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-vp-text-4">
                  {ep.duration && <span>{ep.duration}</span>}
                  <span>{formatPortalDate(ep.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="mt-4">
                  <PodcastPlayButton episode={ep} size="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Embed player */}
          {ep.embedUrl && (
            <div className="px-5 py-6 lg:px-10 border-b border-vp-border">
              <iframe
                src={ep.embedUrl}
                title={ep.title}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full rounded-sm border border-vp-border"
                style={{ height: 152 }}
              />
            </div>
          )}

          {/* Description */}
          {ep.description && (
            <div className="px-5 py-8 lg:px-10 border-b border-vp-border">
              <h2 className="font-sans text-[11px] uppercase tracking-widest font-bold text-vp-text-4 mb-4">Sobre o episódio</h2>
              <p className="font-serif text-[16px] text-vp-text-2 leading-relaxed whitespace-pre-line">
                {ep.description}
              </p>
            </div>
          )}

          {/* Other episodes */}
          {others.length > 0 && (
            <div className="px-5 py-8 lg:px-10">
              <h2 className="font-sans text-[11px] uppercase tracking-widest font-bold text-vp-text-4 mb-5">Outros episódios</h2>
              <div className="flex flex-col divide-y divide-vp-border">
                {others.map(other => (
                  <div key={other.id} className="flex items-center gap-3 py-3">
                    <PodcastPlayButton episode={other} size="sm" />
                    <Link href={`/podcast/${other.id}`} className="flex-1 min-w-0 group">
                      <div className="font-sans text-[13px] font-bold text-vp-text group-hover:text-vp-accent transition-colors truncate">
                        {other.title}
                      </div>
                      {other.duration && (
                        <div className="font-mono text-[10px] text-vp-text-4 mt-0.5">{other.duration}</div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
              <Link href="/podcasts" className="mt-5 block font-sans text-[11px] text-vp-accent font-bold uppercase tracking-widest hover:text-vp-accent-hover transition-colors">
                Ver todos os episódios →
              </Link>
            </div>
          )}
        </div>
      </main>

      <div className="hidden lg:block">
        <SiteFooter />
      </div>
    </div>
  );
}
