import React from 'react';
import Link from 'next/link';

interface MobileTabBarProps {
  active?: 'home' | 'sections' | 'search' | 'me';
}

export function MobileTabBar({ active = 'home' }: MobileTabBarProps) {
  const tabs = [
    { id: 'home',     l: 'Capa',      i: 'M3 12 12 4l9 8M5 10v10h14V10', h: '/' },
    { id: 'sections', l: 'Editorias', i: 'M4 6h16M4 12h16M4 18h10',      h: '/menu' },
    { id: 'search',   l: 'Buscar',    i: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0', h: '/busca' },
    { id: 'me',       l: 'Entrar',    i: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0',      h: '/login' },
  ];

  return (
    <nav className="sticky bottom-0 bg-vp-bg border-t border-vp-border grid grid-cols-4 z-50">
      {tabs.map(t => (
        <Link
          key={t.id}
          href={t.h}
          className={`flex flex-col items-center justify-center gap-0.75 min-h-13 py-2 cursor-pointer no-underline transition-colors ${t.id === active ? 'text-vp-accent' : 'text-vp-text-3 hover:text-vp-text-2'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={t.i}/>
          </svg>
          <span className="font-sans text-[10px] font-bold tracking-[0.04em] uppercase">{t.l}</span>
        </Link>
      ))}
    </nav>
  );
}
