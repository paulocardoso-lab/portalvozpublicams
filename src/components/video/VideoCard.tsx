'use client';

import React, { useState } from 'react';

interface VideoCardProps {
  title: string;
  embedUrl: string;
  platform: 'youtube' | 'vimeo' | 'gif' | 'other';
  thumbnailUrl: string | null;
  description: string | null;
  publishedAt: Date | string | null;
}

const PLATFORM_LABEL: Record<string, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  gif: 'GIF',
  other: 'Vídeo',
};

export function VideoCard({ title, embedUrl, platform, thumbnailUrl, description, publishedAt }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  const date = publishedAt
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(publishedAt))
    : '';

  const isGif = platform === 'gif';

  return (
    <div className="border border-vp-border bg-vp-surface">
      {/* Cabeçalho — mesmo padrão do ChargeCard e PollWidget */}
      <div className="px-4 py-2.5 border-b border-vp-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
          <span className="font-sans text-[10px] uppercase tracking-[0.14em] font-bold text-vp-text">
            Vídeo em Destaque
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-vp-accent uppercase tracking-widest font-bold">
            {PLATFORM_LABEL[platform] ?? 'Vídeo'}
          </span>
          <span className="font-mono text-[10px] text-vp-text-4">{date}</span>
        </div>
      </div>

      {/* Player / Thumbnail */}
      <div className="relative w-full aspect-video bg-[#0a0a09] overflow-hidden">
        {isGif ? (
          /* GIF — renderiza como img */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={embedUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : playing ? (
          /* iframe ativo após clique no play */
          <iframe
            src={`${embedUrl}&autoplay=1`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          /* Thumbnail com botão play — evita carregar iframe pesado na sidebar */
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group flex items-center justify-center cursor-pointer"
            aria-label={`Reproduzir: ${title}`}
          >
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-vp-surface-2" />
            )}
            {/* Overlay escuro no hover */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            {/* Botão play */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-vp-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-white text-[18px] ml-1">▶</span>
            </div>
          </button>
        )}
      </div>

      {/* Título e descrição */}
      <div className="px-4 py-3 border-t border-vp-border">
        <p className="font-serif text-[13px] font-bold text-vp-text leading-snug mb-(--vp-card-title-gap)">
          {title}
        </p>
        {description && (
          <p className="font-serif text-[12px] text-vp-text-2 leading-[1.45] line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
