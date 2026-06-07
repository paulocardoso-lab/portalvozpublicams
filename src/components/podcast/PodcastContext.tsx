'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { PodcastEpisode } from '@prisma/client';

interface PodcastState {
  episode: PodcastEpisode | null;
  playing: boolean;
  currentTime: number;
  duration: number;
}

interface PodcastContextValue extends PodcastState {
  play: (episode: PodcastEpisode) => void;
  toggle: () => void;
  seek: (time: number) => void;
  close: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PodcastContext = createContext<PodcastContextValue | null>(null);

export function PodcastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PodcastState>({
    episode: null,
    playing: false,
    currentTime: 0,
    duration: 0,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((episode: PodcastEpisode) => {
    // Only direct audio URLs go through the HTML5 player — embeds open the episode page
    if (!episode.audioUrl) {
      window.location.href = `/podcast/${episode.id}`;
      return;
    }
    const el = audioRef.current;
    if (!el) return;

    if (state.episode?.id === episode.id) {
      if (state.playing) {
        el.pause();
        setState(p => ({ ...p, playing: false }));
      } else {
        el.play().catch(() => {});
        setState(p => ({ ...p, playing: true }));
      }
      return;
    }

    el.src = episode.audioUrl;
    el.load();
    el.play().catch(() => {});
    setState({ episode, playing: true, currentTime: 0, duration: 0 });
  }, [state.episode?.id, state.playing]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !state.episode) return;
    if (state.playing) {
      el.pause();
      setState(p => ({ ...p, playing: false }));
    } else {
      el.play().catch(() => {});
      setState(p => ({ ...p, playing: true }));
    }
  }, [state.playing, state.episode]);

  const seek = useCallback((time: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = time;
    setState(p => ({ ...p, currentTime: time }));
  }, []);

  const close = useCallback(() => {
    const el = audioRef.current;
    if (el) { el.pause(); el.src = ''; }
    setState({ episode: null, playing: false, currentTime: 0, duration: 0 });
  }, []);

  return (
    <PodcastContext.Provider value={{ ...state, play, toggle, seek, close, audioRef }}>
      {children}
      {/* Hidden audio element — always mounted */}
      <audio
        ref={audioRef}
        onTimeUpdate={e => setState(p => ({ ...p, currentTime: (e.target as HTMLAudioElement).currentTime }))}
        onDurationChange={e => setState(p => ({ ...p, duration: (e.target as HTMLAudioElement).duration }))}
        onEnded={() => setState(p => ({ ...p, playing: false, currentTime: 0 }))}
        preload="none"
      />
    </PodcastContext.Provider>
  );
}

export function usePodcast() {
  const ctx = useContext(PodcastContext);
  if (!ctx) throw new Error('usePodcast must be used inside PodcastProvider');
  return ctx;
}
