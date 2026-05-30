"use client";

import React, { useEffect, useState } from 'react';
import { SafeImage } from '@/components/shared/SafeImage';

interface AdSlotProps {
  id: string; // Slot ID (ex: 'sidebar-top', 'leaderboard', 'in-article')
  className?: string;
}

interface Campaign {
  id: string;
  creative: string;
  name: string;
}

export function AdSlot({ id, className = '' }: AdSlotProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    async function loadAd() {
      try {
        const response = await fetch(`/api/ads/serve/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (!data?.id || !data?.creative) {
            setCampaign(null);
            return;
          }

          setCampaign(data);
          setImageFailed(false);
          
          // Track impression
          fetch('/api/ads/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaignId: data.id, type: 'impression' }),
          }).catch(console.error);
        }
      } catch (error) {
        console.error('Failed to load ad:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAd();
  }, [id]);

  const handleClick = () => {
    if (!campaign) return;
    fetch('/api/ads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, type: 'click' }),
    }).catch(console.error);
  };

  if (loading) {
    return <div className={`animate-pulse bg-vp-surface/30 rounded min-h-[100px] ${className}`} />;
  }

  if (!campaign || imageFailed) return null;

  const aspectClass = id.includes('sidebar')
    ? 'aspect-[300/250]'
    : id.includes('mobile')
      ? 'aspect-[320/100]'
      : 'aspect-[970/90]';

  return (
    <div className={`vp-ad-slot relative group ${className}`}>
      <div className="absolute -top-4 left-0 text-[8px] font-black uppercase tracking-widest text-vp-text-4">
        Publicidade
      </div>
      <a 
        href="#" 
        onClick={handleClick}
        className="block overflow-hidden rounded-sm border border-vp-border hover:border-vp-accent/40 transition-all"
      >
        <div className={`relative w-full ${aspectClass} bg-vp-surface`}>
          <SafeImage
            src={campaign.creative}
            alt={campaign.name}
            fill
            sizes="(max-width: 768px) 100vw, 970px"
            onError={() => setImageFailed(true)}
            className="object-contain grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </a>
    </div>
  );
}
