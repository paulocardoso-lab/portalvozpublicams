'use client';

import React from 'react';
import type { PodcastEpisode } from '@prisma/client';
import { usePodcast } from './PodcastContext';

export function PodcastPlayButton({ episode, size = 'sm' }: { episode: PodcastEpisode; size?: 'sm' | 'md' | 'lg' }) {
  const { play, episode: current, playing } = usePodcast();
  const isThis = current?.id === episode.id;
  const isPlaying = isThis && playing;

  const sizeClasses = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-[13px]',
    lg: 'w-14 h-14 text-[18px]',
  }[size];

  return (
    <button
      type="button"
      onClick={() => play(episode)}
      title={isPlaying ? 'Pausar' : 'Reproduzir'}
      className={`${sizeClasses} rounded-full border flex items-center justify-center transition-all shrink-0 ${
        isThis
          ? 'bg-vp-accent border-vp-accent text-white hover:bg-vp-accent-hover'
          : 'border-vp-border text-vp-text-2 hover:border-vp-accent hover:text-vp-accent'
      }`}
    >
      {isPlaying ? (
        // Pause icon
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
        </svg>
      ) : (
        // Play icon
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      )}
    </button>
  );
}
