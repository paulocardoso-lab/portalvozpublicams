"use client";

import React, { useEffect, useState } from 'react';

interface AdSlotProps {
  id: string; // Slot ID (ex: 'sidebar-top', 'leaderboard')
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
    // In a real app, this would fetch the active campaign for this slot
    // For now, we mock it
    const mockCampaigns: Record<string, Campaign> = {
      'sidebar-top': { id: '1', name: 'BYD Brasil', creative: 'https://placehold.co/300x250/1a1a19/d97757?text=BYD+DOLPHIN+MINI' },
      'leaderboard': { id: '2', name: 'Gov MS', creative: 'https://placehold.co/728x90/1a1a19/d97757?text=GOVERNO+DE+MS+ROTA+BIOCEANICA' },
      'in-article': { id: '3', name: 'Sicredi MS', creative: 'https://placehold.co/600x120/1a1a19/d97757?text=SICREDI+CREDITO+RURAL' },
    };

    if (mockCampaigns[id]) {
      setCampaign(mockCampaigns[id]);
      
      // Track impression
      fetch('/api/ads/track', {
        method: 'POST',
        body: JSON.stringify({ campaignId: mockCampaigns[id].id, type: 'impression' }),
      }).catch(console.error);
    }
    setLoading(false);
  }, [id]);

  const handleClick = () => {
    if (!campaign) return;
    fetch('/api/ads/track', {
      method: 'POST',
      body: JSON.stringify({ campaignId: campaign.id, type: 'click' }),
    }).catch(console.error);
  };

  if (loading || !campaign) return null;

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
