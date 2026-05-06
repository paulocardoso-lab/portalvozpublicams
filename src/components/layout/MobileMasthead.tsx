import React from 'react';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';

export function MobileMasthead({ title }: { title?: string }) {
  return (
    <div className="sticky top-0 z-50 bg-vp-bg border-b border-vp-border">
      <div className="flex items-center px-4 py-3 gap-3">
        <Link href="/menu" aria-label="Menu" className="bg-transparent border-none text-vp-text p-0 cursor-pointer no-underline">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </Link>
        <div className="flex-1 text-center">
          <Link href="/" aria-label="Home" className="bg-transparent border-none text-vp-text p-0 cursor-pointer no-underline inline-block">
            {title ? (
              <div className="font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-vp-accent">{title}</div>
            ) : (
              <Monogram size="sm" />
            )}
          </Link>
        </div>
        <Link href="/busca" aria-label="Buscar" className="bg-transparent border-none text-vp-text p-0 cursor-pointer no-underline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </Link>
      </div>
      {/* Edition strip */}
      <div className="px-4 py-[6px] border-t border-vp-border font-sans text-[10px] text-vp-text-3 flex justify-between tracking-[0.06em] uppercase">
        <span>Quarta · 22 abr</span>
        <span className="mono">USD 5,12 · BOI 302,40</span>
      </div>
    </div>
  );
}
