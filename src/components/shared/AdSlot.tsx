"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SafeImage } from '@/components/shared/SafeImage';

interface AdSlotProps {
  id: string;
  className?: string;
  rotateEvery?: number; // seconds between creative rotations, 0 = no rotation
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

const SLOT_ASPECT: Record<string, string> = {
  leaderboard:    'aspect-[970/90]',
  'sidebar-top':  'aspect-[300/250]',
  'sidebar-bottom': 'aspect-[300/250]',
  'mobile-top':   'aspect-[320/50]',
  'mobile-inline': 'aspect-[300/250]',
  'in-article':   'aspect-[600/120]',
  'sticky-bottom': 'aspect-[320/50]',
  'native-feed':  'aspect-[600/200]',
};

function aspectFor(id: string) {
  return SLOT_ASPECT[id] ?? (id.includes('sidebar') ? 'aspect-[300/250]' : id.includes('mobile') ? 'aspect-[320/50]' : 'aspect-[970/90]');
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
      impressionFired.current = false; // reset so IntersectionObserver fires for new ad
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial load + rotation timer
  useEffect(() => {
    fetchAd();
    if (rotateEvery > 0) {
      rotateRef.current = setInterval(fetchAd, rotateEvery * 1000);
    }
    return () => {
      if (rotateRef.current) clearInterval(rotateRef.current);
    };
  }, [fetchAd, rotateEvery]);

  // IntersectionObserver — fires impression only when banner enters viewport
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
      { threshold: 0.5 } // 50% do banner visível
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
  const href = campaign.targetUrl?.trim() || '#';

  return (
    <div ref={containerRef} className={`vp-ad-slot relative group ${className}`}>
      <div className="absolute -top-4 left-0 text-[8px] font-black uppercase tracking-widest text-vp-text-4 select-none">
        Publicidade
      </div>
      <a
        href={href}
        target={href !== '#' ? '_blank' : undefined}
        rel={href !== '#' ? 'noopener noreferrer nofollow' : undefined}
        onClick={handleClick}
        className="block overflow-hidden rounded-sm border border-vp-border hover:border-vp-accent/40 transition-all"
        aria-label={`Publicidade — ${campaign.name}`}
      >
        <div className={`relative w-full ${aspectClass} bg-vp-surface`}>
          <SafeImage
            src={campaign.creative}
            alt={campaign.name}
            fill
            sizes="(max-width: 768px) 100vw, 970px"
            onError={() => setImageFailed(true)}
            className="object-contain transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
      </a>
    </div>
  );
}
