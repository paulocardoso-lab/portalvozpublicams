'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  audioUrl: string;
  defaultVolume: number; // 1–30
}

const CONSENT_KEY = 'vp_ambient_consent';
const CONSENT_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

type Consent = 'accepted' | 'declined';

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, expiry } = JSON.parse(raw) as { value: Consent; expiry: number };
    if (Date.now() > expiry) { localStorage.removeItem(CONSENT_KEY); return null; }
    return value;
  } catch { return null; }
}

function writeConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, expiry: Date.now() + CONSENT_TTL }));
  } catch {}
}

export function AmbientSound({ audioUrl, defaultVolume }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [showVolume, setShowVolume] = useState(false);
  const interactedRef = useRef(false);

  // On mount: read stored consent
  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    if (stored === 'accepted') {
      // Will autoplay after first interaction — show the control button immediately
      setPlaying(false); // starts muted until user interacts or we resume
    }
  }, []);

  // Show toast after first meaningful interaction (scroll or click), once
  useEffect(() => {
    if (consent !== null) return; // already decided

    const show = () => {
      if (interactedRef.current) return;
      interactedRef.current = true;
      // Small delay so page has settled
      setTimeout(() => setShowToast(true), 3000);
    };

    window.addEventListener('scroll', show, { once: true, passive: true });
    window.addEventListener('click', show, { once: true });
    return () => {
      window.removeEventListener('scroll', show);
      window.removeEventListener('click', show);
    };
  }, [consent]);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = defaultVolume / 100;
    audio.preload = 'none';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl, defaultVolume]);

  // Pause ambient when podcast is playing
  useEffect(() => {
    const allAudio = () => {
      document.querySelectorAll<HTMLAudioElement>('audio').forEach(el => {
        if (el !== audioRef.current && !el.paused) {
          audioRef.current?.pause();
          setPlaying(false);
        }
      });
    };
    document.addEventListener('play', allAudio, true);
    return () => document.removeEventListener('play', allAudio, true);
  }, []);

  const startPlaying = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [volume]);

  const accept = useCallback(() => {
    writeConsent('accepted');
    setConsent('accepted');
    setShowToast(false);
    startPlaying();
  }, [startPlaying]);

  const decline = useCallback(() => {
    writeConsent('declined');
    setConsent('declined');
    setShowToast(false);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = volume / 100;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, volume]);

  const handleVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  }, []);

  // Resume if consent was already accepted on a previous visit
  useEffect(() => {
    if (consent !== 'accepted') return;
    const resume = () => {
      if (!playing && audioRef.current) {
        audioRef.current.volume = volume / 100;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
      window.removeEventListener('click', resume);
    };
    window.addEventListener('click', resume, { once: true });
    return () => window.removeEventListener('click', resume);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent]);

  if (consent === 'declined') return null;

  return (
    <>
      {/* Consent toast */}
      {showToast && (
        <div
          role="dialog"
          aria-label="Som ambiente"
          className="fixed bottom-20 right-4 z-50 w-[280px] bg-vp-surface border border-vp-border shadow-2xl p-4 rounded-sm animate-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[18px] leading-none mt-0.5">🎵</span>
            <div>
              <p className="font-sans text-[13px] font-bold text-vp-text leading-tight">
                Quer ouvir um som agradável enquanto lê?
              </p>
              <p className="font-serif text-[11px] text-vp-text-3 mt-1 leading-relaxed italic">
                Um ambiente suave de fundo enquanto você navega.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={accept}
              className="vp-btn vp-btn-primary flex-1 py-2 text-[11px] font-bold uppercase tracking-widest"
            >
              Sim, ativar
            </button>
            <button
              type="button"
              onClick={decline}
              className="vp-btn flex-1 py-2 text-[11px] font-bold uppercase tracking-widest"
            >
              Não, obrigado
            </button>
          </div>
        </div>
      )}

      {/* Floating control — only if consent accepted */}
      {consent === 'accepted' && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
          {/* Volume slider — appears on hover/focus */}
          {showVolume && (
            <div className="bg-vp-surface border border-vp-border p-3 rounded-sm shadow-lg flex flex-col items-center gap-2 w-10">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="accent-[var(--vp-accent)] w-20"
                style={{ writingMode: 'vertical-lr', direction: 'rtl', height: 80, width: 6 }}
                title="Volume do som ambiente"
                aria-label="Volume do som ambiente"
              />
              <span className="font-mono text-[9px] text-vp-text-4">{volume}%</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggle}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            title={playing ? 'Pausar som ambiente' : 'Retomar som ambiente'}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-md ${
              playing
                ? 'bg-vp-accent border-vp-accent text-white hover:bg-vp-accent-hover'
                : 'bg-vp-surface border-vp-border text-vp-text-4 hover:border-vp-accent hover:text-vp-accent'
            }`}
          >
            {playing ? (
              // Sound wave icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            ) : (
              // Muted icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                <line x1="2" y1="2" x2="22" y2="22" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </>
  );
}
