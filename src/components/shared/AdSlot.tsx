import React from 'react';
import { getActiveCampaign } from '@/lib/external-data';

interface AdSlotProps {
  id: string;
  className?: string;
  fallbackText?: string;
}

export async function AdSlot({ id, className, fallbackText }: AdSlotProps) {
  const campaign = await getActiveCampaign(id);

  if (!campaign) {
    return (
      <div className={`vp-ad flex items-center justify-center text-[10px] text-vp-text-4 border border-vp-border ${className}`}>
        {fallbackText || `ESPAÇO PUBLICITÁRIO: ${id}`}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -top-4 right-0 text-[9px] text-vp-text-4 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Publicidade: {campaign.client}
      </div>
      <a href={`/api/ads/click?id=${campaign.id}`} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
        <img 
          src={campaign.creative} 
          alt={campaign.name} 
          className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
        />
      </a>
    </div>
  );
}
