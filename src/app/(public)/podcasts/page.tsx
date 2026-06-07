import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Monogram } from '@/components/shared/Monogram';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Headline } from '@/components/shared/Headline';
import { SafeImage } from '@/components/shared/SafeImage';
import { getPodcastEpisodes } from '@/app/actions/podcast';
import { getSiteSettings } from '@/app/actions/settings';
import { PodcastPlayButton } from '@/components/podcast/PodcastPlayButton';

export const metadata = {
  title: 'Podcast | Voz Pública MS',
  description: 'Ouça os episódios do podcast Voz Pública MS.',
};

export default async function PodcastsPage() {
  const [episodes, settings] = await Promise.all([
    getPodcastEpisodes(),
    getSiteSettings(),
  ]);

  const active = episodes.filter(ep => ep.isActive);

  const programTitle = settings['podcast.title'] || 'Voz Alta';
  const programDesc = settings['podcast.description'] || 'Jornalismo em áudio. Entrevistas, investigações e bastidores da redação do Voz Pública MS.';
  const programEyebrow = settings['podcast.eyebrow'] || 'Podcast · Voz Pública MS';

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <div className="hidden lg:block">
        <SiteHeader />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center px-2 py-1 border-b border-vp-border gap-1">
        <Link href="/" aria-label="Voltar" className="text-vp-text text-[24px] leading-none min-w-11 min-h-11 flex items-center justify-center hover:text-vp-accent transition-colors no-underline">×</Link>
        <div className="flex-1 text-center">
          <Monogram size="sm" cssHeight="var(--vp-compact-logo-size)" />
        </div>
        <div className="min-w-11" />
      </div>

      <main className="flex-1 flex flex-col items-center">
        <div className="max-w-[760px] w-full lg:my-12 lg:border lg:border-vp-border lg:bg-vp-bg">

          {/* Hero */}
          <div className="px-5 py-8 lg:p-12 border-b border-vp-border bg-vp-surface">
            <Eyebrow className="text-[10px] mb-4">{programEyebrow}</Eyebrow>
            <Headline as="h1" size="hero" hoverAccent={false} className="!text-[38px] lg:!text-[52px] !leading-[1.05] mb-4 font-black">
              {programTitle}
            </Headline>
            <p className="font-serif text-[16px] lg:text-[18px] text-vp-text-2 leading-[1.45] italic max-w-[520px]">
              {programDesc}
            </p>
          </div>

          {/* Episodes */}
          <div className="divide-y divide-vp-border">
            {active.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <p className="font-serif italic text-[16px] text-vp-text-3">Nenhum episódio publicado ainda.</p>
              </div>
            ) : (
              active.map((ep, i) => (
                <article key={ep.id} className="flex gap-4 px-5 py-6 lg:px-8 hover:bg-vp-surface/50 transition-colors group">
                  {/* Cover */}
                  <div className="shrink-0 w-20 h-20 lg:w-24 lg:h-24 relative overflow-hidden rounded-sm border border-vp-border bg-vp-surface">
                    {ep.coverImage ? (
                      <SafeImage src={ep.coverImage} alt={ep.title} fill sizes="96px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-vp-text-4">
                          <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] text-vp-accent font-bold uppercase tracking-widest">
                        Ep. {active.length - i}
                      </span>
                      {ep.duration && (
                        <span className="text-[10px] text-vp-text-4 font-mono">{ep.duration}</span>
                      )}
                      <span className="text-[10px] text-vp-text-4 font-mono">
                        {new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ep.publishedAt))}
                      </span>
                    </div>

                    <Link href={`/podcast/${ep.id}`} className="block group-hover:text-vp-accent transition-colors">
                      <h2 className="font-display text-[18px] lg:text-[20px] font-bold leading-tight mb-2">
                        {ep.title}
                      </h2>
                    </Link>

                    {ep.description && (
                      <p className="font-serif text-[13px] text-vp-text-3 leading-relaxed line-clamp-2 mb-3">
                        {ep.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <PodcastPlayButton episode={ep} />
                      <Link
                        href={`/podcast/${ep.id}`}
                        className="font-sans text-[11px] text-vp-text-4 hover:text-vp-accent transition-colors uppercase tracking-widest font-bold"
                      >
                        Ver episódio →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <SiteFooter />
      </div>
    </div>
  );
}
