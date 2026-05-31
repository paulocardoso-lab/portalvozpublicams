"use client";

import React, { useState } from 'react';
import { AdSlot } from '@/components/shared/AdSlot';

/**
 * Sticky bottom ad bar for mobile — dismissible, sits above the tab bar.
 * Only renders if the sticky-bottom slot has an active campaign.
 */
export function StickyBottomAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-[56px] left-0 right-0 z-40 md:hidden">
      <div className="relative mx-2 mb-1">
        <AdSlot id="sticky-bottom" className="w-full shadow-lg" />
        <button
          type="button"
          aria-label="Fechar publicidade"
          onClick={() => setDismissed(true)}
          className="absolute -top-3 right-0 w-5 h-5 rounded-full bg-vp-surface border border-vp-border text-vp-text-4 hover:text-vp-text text-[10px] flex items-center justify-center leading-none z-10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
