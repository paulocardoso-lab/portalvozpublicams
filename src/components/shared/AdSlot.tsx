"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SafeImage } from '@/components/shared/SafeImage';

interface AdSlotProps {
  id: string;
  className?: string;
  rotateEvery?: number;
}

interface Campaign {
  id: string;
  creative: string;
  name: string;
  targetUrl: string;
  effects: string;
}

const FREQ_KEY = 'vp_ad_freq';

function getSessionFreq(): Record<string, number> {
  try { return JSON.parse(sessionStorage.getItem(FREQ_KEY) || '{}'); }
  catch { return {}; }
}
function incrementSessionFreq(campaignId: string) {
  const freq = getSessionFreq();
  freq[campaignId] = (freq[campaignId] ?? 0) + 1;
  try { sessionStorage.setItem(FREQ_KEY, JSON.stringify(freq)); } catch {}
}

// ── Slot tables ───────────────────────────────────────────────────────────────

const SLOT_ASPECT: Record<string, string> = {
  leaderboard:      'aspect-[970/90]',
  'sidebar-top':    'aspect-[300/250]',
  'sidebar-bottom': 'aspect-[300/250]',
  'mobile-top':     'aspect-[320/50]',
  'mobile-inline':  'aspect-[300/250]',
  'in-article':     'aspect-[600/120]',
  'sticky-bottom':  'aspect-[320/50]',
  'native-feed':    'aspect-[600/200]',
};

const SLOT_MAX_W: Record<string, string> = {
  leaderboard:      'max-w-[970px]',
  'sidebar-top':    'max-w-[300px]',
  'sidebar-bottom': 'max-w-[300px]',
  'mobile-top':     'max-w-[320px]',
  'mobile-inline':  'max-w-[300px]',
  'in-article':     'max-w-[600px]',
  'sticky-bottom':  'max-w-[320px]',
  'native-feed':    'max-w-[600px]',
};

const CENTERED_SLOTS = new Set([
  'leaderboard', 'mobile-top', 'mobile-inline', 'in-article', 'native-feed',
]);

const VALID_EFFECTS = new Set(['fadeIn', 'pulse', 'shimmer', 'kenBurns']);

function aspectFor(id: string) {
  return SLOT_ASPECT[id] ?? (id.includes('sidebar') ? 'aspect-[300/250]' : id.includes('mobile') ? 'aspect-[320/50]' : 'aspect-[970/90]');
}
function maxWFor(id: string) {
  return SLOT_MAX_W[id] ?? 'max-w-full';
}

// ── ShimmerOverlay — diagonal shine that runs once on entry ──────────────────

function ShimmerOverlay() {
  return <span aria-hidden className="vp-ad-shimmer-overlay" />;
}

// ── Main component ────────────────────────────────────────────────────────────

export function AdSlot({ id, className = '', rotateEvery = 0 }: AdSlotProps) {
  const [campaign, setCampaign]     = useState<Campaign | null>(null);
  const [loading, setLoading]       = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [visible, setVisible]       = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);

  const containerRef     = useRef<HTMLDivElement>(null);
  const impressionFired  = useRef(false);
  const rotateRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAd = useCallback(async () => {
    try {
      const res = await fetch(`/api/ads/serve/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.id || !data?.creative) { setCampaign(null); return; }
      setCampaign(data);
      setImageFailed(false);
      setShimmerKey(k => k + 1);   // re-trigger shimmer on rotation
      impressionFired.current = false;
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAd();
    if (rotateEvery > 0) {
      rotateRef.current = setInterval(fetchAd, rotateEvery * 1000);
    }
    return () => { if (rotateRef.current) clearInterval(rotateRef.current); };
  }, [fetchAd, rotateEvery]);

  // IntersectionObserver — impression tracking + fade-in trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !campaign) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!visible) setVisible(true);
          if (!impressionFired.current) {
            impressionFired.current = true;
            incrementSessionFreq(campaign.id);
            fetch('/api/ads/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ campaignId: campaign.id, type: 'impression' }),
            }).catch(() => {});
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [campaign, visible]);

  const handleClick = () => {
    if (!campaign) return;
    fetch('/api/ads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, type: 'click' }),
    }).catch(() => {});
  };

  if (loading) return <div className={`animate-pulse bg-vp-surface/30 rounded min-h-12.5 ${className}`} />;
  if (!campaign || imageFailed) return null;

  const aspectClass = aspectFor(id);
  const maxWClass   = maxWFor(id);
  const centered    = CENTERED_SLOTS.has(id);
  const href        = campaign.targetUrl?.trim() || '#';

  const fx = new Set((campaign.effects || '').split(',').map(s => s.trim()).filter(s => VALID_EFFECTS.has(s)));
  const hasFadeIn   = fx.has('fadeIn');
  const hasPulse    = fx.has('pulse');
  const hasShimmer  = fx.has('shimmer');
  const hasKenBurns = fx.has('kenBurns');
  const imgClass    = hasKenBurns ? 'vp-ad-kenburns-img' : hasPulse ? 'vp-ad-pulse-img' : '';

  return (
    <div
      ref={containerRef}
      className={`vp-ad-slot w-full ${centered ? 'flex flex-col items-center' : ''} ${className}`}
    >
      <div className={`w-full ${maxWClass} ${centered ? 'mx-auto' : ''}`}>
        <div className="text-[8px] font-black uppercase tracking-widest text-vp-text-4 select-none mb-1 text-center">
          Publicidade
        </div>

        <div className={hasFadeIn ? `vp-ad-wrap${visible ? ' is-visible' : ''}` : 'vp-ad-wrap is-visible'}>
          <a
            href={href}
            target={href !== '#' ? '_blank' : undefined}
            rel={href !== '#' ? 'noopener noreferrer nofollow' : undefined}
            onClick={handleClick}
            className="vp-ad-anchor"
            aria-label={`Publicidade — ${campaign.name}`}
          >
            {hasShimmer && <ShimmerOverlay key={shimmerKey} />}

            <div className={`relative w-full ${aspectClass} bg-vp-surface/40 overflow-hidden`}>
              <SafeImage
                src={campaign.creative}
                alt={campaign.name}
                fill
                sizes="(max-width: 768px) 100vw, 970px"
                onError={() => setImageFailed(true)}
                className={`object-contain${imgClass && visible ? ` ${imgClass}` : ''}`}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
