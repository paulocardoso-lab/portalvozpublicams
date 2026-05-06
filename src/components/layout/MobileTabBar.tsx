import React from 'react';

export function MobileTabBar({ active = 'home' }: { active?: 'home' | 'sections' | 'live' | 'saved' | 'me' | 'search' }) {
  const tabs = [
    { id: 'home',     l: 'Capa',     i: 'M3 12 12 4l9 8M5 10v10h14V10' },
    { id: 'sections', l: 'Editorias',i: 'M4 6h16M4 12h16M4 18h10' },
    { id: 'live',     l: 'Ao vivo',  live: true },
    { id: 'saved',    l: 'Salvos',   i: 'M6 4h12v18l-6-4-6 4z' },
    { id: 'me',       l: 'Eu',       i: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0' },
  ];
  return (
    <div className="sticky bottom-0 bg-vp-bg border-t border-vp-border grid grid-cols-5 pt-[6px] pb-2">
      {tabs.map(t => (
        <a key={t.id} className={`flex flex-col items-center gap-[3px] py-1 cursor-pointer ${t.id === active ? 'text-vp-accent' : 'text-vp-text-3'}`}>
          {t.live ? (
            <span className="w-4 h-4 rounded-full bg-vp-urgent inline-flex items-center justify-center font-sans text-[7px] font-extrabold text-white animate-[vp-pulse_2s_infinite]">●</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={t.i}/></svg>
          )}
          <span className="font-sans text-[9px] font-semibold tracking-[0.04em]">{t.l}</span>
        </a>
      ))}
    </div>
  );
}
