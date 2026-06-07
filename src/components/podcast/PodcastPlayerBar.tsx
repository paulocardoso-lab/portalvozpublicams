'use client';

import React from 'react';
import Link from 'next/link';
import { usePodcast } from './PodcastContext';

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function PodcastPlayerBar() {
  const { episode, playing, currentTime, duration, toggle, seek, close } = usePodcast();

  if (!episode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-vp-border bg-vp-bg/95 backdrop-blur-sm">
      {/* Progress bar */}
      <div
        className="relative h-0.75 bg-vp-border w-full cursor-pointer"
        onClick={e => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          seek(((e.clientX - rect.left) / rect.width) * duration);
        }}
      >
        <div
          className="h-full bg-vp-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 max-w-350 mx-auto">
        {/* Play/Pause */}
        <button
          type="button"
          onClick={toggle}
          title={playing ? 'Pausar' : 'Reproduzir'}
          className="w-9 h-9 rounded-full bg-vp-accent text-white flex items-center justify-center shrink-0 hover:bg-vp-accent-hover transition-colors"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        {/* Episode info */}
        <div className="flex-1 min-w-0">
          <Link href={`/podcast/${episode.id}`} className="font-sans text-[12px] font-bold text-vp-text truncate block hover:text-vp-accent transition-colors">
            {episode.title}
          </Link>
          <div className="font-mono text-[10px] text-vp-text-4">
            {formatTime(currentTime)} {duration > 0 && `/ ${formatTime(duration)}`}
          </div>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={() => {
            const audio = document.querySelector('audio');
            if (audio) { audio.pause(); audio.src = ''; }
            window.dispatchEvent(new CustomEvent('podcast-close'));
          }}
          title="Fechar player"
          className="text-vp-text-4 hover:text-vp-text transition-colors p-1 shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
