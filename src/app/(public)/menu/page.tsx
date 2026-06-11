import React from 'react';
import Link from 'next/link';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { prisma } from '@/lib/prisma';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { isDonationsEnabled } from '@/lib/donation-config';

export default async function MenuPage() {
  const [sections, donationsEnabled] = await Promise.all([
    prisma.section.findMany({ orderBy: { name: 'asc' } }),
    isDonationsEnabled(),
  ]);

  return (
    <div className="flex flex-col min-h-dvh bg-vp-bg text-vp-text w-full max-w-120 mx-auto border-x border-vp-border">
      <header className="flex items-center justify-between px-4 py-3 border-b border-vp-border">
        <BrandLogo size="md" cssHeight="var(--vp-compact-logo-size)" />
        <Link href="/" className="text-vp-text text-2xl no-underline leading-none">×</Link>
      </header>

      {/* Search block */}
      <div className="p-4 border-b border-vp-border bg-vp-surface">
        <div className="relative">
          <input className="vp-input pl-9" placeholder="Buscar no Voz Pública..." />
          <svg className="absolute left-3 top-2.5 text-vp-text-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 pb-20 sm:pb-2">
        {sections.map(s => (
          <Link key={s.id} href={`/editoria/${s.slug}`} className="flex justify-between items-center py-4 border-b border-vp-border no-underline group">
            <span className="font-display text-[17px] text-vp-text group-hover:text-vp-accent transition-colors">{s.name}</span>
            <span className="text-vp-text-4">›</span>
          </Link>
        ))}

        <div className="mt-8 mb-4">
          <div className="eyebrow mb-4">Acompanhe</div>
          <div className="grid gap-3">
            {[
              { l: 'Newsletter', h: '/newsletter' },
              { l: 'Podcast Voz Alta', h: '/podcasts' },
              { l: 'WhatsApp Canal', h: '#' },
              { l: 'Denúncia Segura', h: '/denuncia' }
            ].map(item => (
              <Link key={item.l} href={item.h} className="font-display text-[17px] text-vp-accent italic no-underline hover:underline">
                {item.l} →
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className={`p-4 gap-3 border-t border-vp-border bg-vp-surface ${donationsEnabled ? "grid grid-cols-2" : "flex"}`}>
        {donationsEnabled && (
          <Link href="/apoiar" className="vp-btn vp-btn-primary py-3 no-underline text-center">Apoie</Link>
        )}
        <Link href="/login" className={`vp-btn py-3 no-underline text-center ${donationsEnabled ? "" : "flex-1"}`}>Entrar</Link>
      </div>

      <MobileTabBar active="sections" />
    </div>
  );
}
