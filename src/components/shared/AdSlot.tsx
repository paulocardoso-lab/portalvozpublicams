"use client";

import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    async function loadAd() {
      try {
        const response = await fetch(`/api/ads/serve/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCampaign(data);
          
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

  if (!campaign) return null;

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
        <img 
          src={campaign.creative} 
          alt={campaign.name}
          className="w-full h-auto grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
        />
      </a>
    </div>
  );
}
