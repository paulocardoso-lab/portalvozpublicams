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
}

const FREQ_KEY = 'vp_ad_freq';

function getSessionFreq(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(FREQ_KEY) || '{}');
  } catch {
    return {};
  }
}

function incrementSessionFreq(campaignId: string) {
  const freq = getSessionFreq();
  freq[campaignId] = (freq[campaignId] ?? 0) + 1;
  try {
    sessionStorage.setItem(FREQ_KEY, JSON.stringify(freq));
  } catch {}
}

// IAB standard aspect ratios per slot
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

// Max widths that enforce IAB dimensions — container can be narrower, never wider
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

// Slots that should be centred horizontally within their container
const CENTERED_SLOTS = new Set([
  'leaderboard', 'mobile-top', 'mobile-inline', 'in-article', 'native-feed',
]);

function aspectFor(id: string) {
  return SLOT_ASPECT[id] ?? (id.includes('sidebar') ? 'aspect-[300/250]' : id.includes('mobile') ? 'aspect-[320/50]' : 'aspect-[970/90]');
}

function maxWFor(id: string) {
  return SLOT_MAX_W[id] ?? 'max-w-full';
}

export function AdSlot({ id, className = '', rotateEvery = 0 }: AdSlotProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const impressionFired = useRef(false);
  const rotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAd = useCallback(async () => {
    try {
      const res = await fetch(`/api/ads/serve/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.id || !data?.creative) {
        setCampaign(null);
        return;
      }
      setCampaign(data);
      setImageFailed(false);
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
    return () => {
      if (rotateRef.current) clearInterval(rotateRef.current);
    };
  }, [fetchAd, rotateEvery]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !campaign) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !impressionFired.current) {
          impressionFired.current = true;
          incrementSessionFreq(campaign.id);
          fetch('/api/ads/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaignId: campaign.id, type: 'impression' }),
          }).catch(() => {});
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [campaign]);

  const handleClick = () => {
    if (!campaign) return;
    fetch('/api/ads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, type: 'click' }),
    }).catch(() => {});
  };

  if (loading) {
    return <div className={`animate-pulse bg-vp-surface/30 rounded min-h-[50px] ${className}`} />;
  }

  if (!campaign || imageFailed) return null;

  const aspectClass = aspectFor(id);
  const maxWClass = maxWFor(id);
  const centered = CENTERED_SLOTS.has(id);
  const href = campaign.targetUrl?.trim() || '#';

  return (
    <div
      ref={containerRef}
      className={`vp-ad-slot w-full ${centered ? 'flex flex-col items-center' : ''} ${className}`}
    >
      <div className={`w-full ${maxWClass} ${centered ? 'mx-auto' : ''}`}>
        {/* Label editorial — discreta, acima do banner */}
        <div className="text-[8px] font-black uppercase tracking-widest text-vp-text-4 select-none mb-1 text-center">
          Publicidade
        </div>
        <a
          href={href}
          target={href !== '#' ? '_blank' : undefined}
          rel={href !== '#' ? 'noopener noreferrer nofollow' : undefined}
          onClick={handleClick}
          className="block overflow-hidden rounded-sm border border-vp-border/60 hover:border-vp-accent/40 transition-all"
          aria-label={`Publicidade — ${campaign.name}`}
        >
          <div className={`relative w-full ${aspectClass} bg-vp-surface/40`}>
            <SafeImage
              src={campaign.creative}
              alt={campaign.name}
              fill
              sizes="(max-width: 768px) 100vw, 970px"
              onError={() => setImageFailed(true)}
              className="object-contain transition-opacity duration-300 hover:opacity-90"
            />
          </div>
        </a>
      </div>
    </div>
  );
}
