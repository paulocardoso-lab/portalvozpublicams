import React from 'react';
import { Monogram } from '@/components/shared/Monogram';

export function SiteHeader({ date = 'quarta-feira, 22 de abril de 2026' }: { date?: string }) {
  const sections = [
    'Política', 'Cidades', 'Pantanal', 'Agronegócio', 'Economia', 'Segurança',
    'Saúde', 'Educação', 'Indígenas', 'Fronteira', 'Cultura', 'Esportes',
    'Opinião', 'Especiais',
  ];
  
  return (
    <header className="hidden md:block border-b border-vp-border bg-vp-bg sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="flex items-center justify-between px-7 py-2 border-b border-vp-border font-sans text-[11px] text-vp-text-3">
        <div className="flex gap-4.5 items-center">
          <span className="tracking-[0.08em] uppercase">{date}</span>
          <span className="text-vp-text-4">·</span>
          <span>Campo Grande 28°C</span>
          <span className="text-vp-text-4">·</span>
          <span className="font-mono text-vp-text-3">USD 5,12 &nbsp; BOI 302,40 &nbsp; SOJA 128,10</span>
        </div>
        <div className="flex gap-4 items-center">
          <a className="cursor-pointer hover:text-vp-accent">Newsletter</a>
          <a className="cursor-pointer hover:text-vp-accent">Podcast</a>
          <a className="cursor-pointer hover:text-vp-accent">Envie sua denúncia</a>
          <span className="text-vp-text-4">·</span>
          <a className="cursor-pointer hover:text-vp-accent">Entrar</a>
          <button className="vp-btn vp-btn-primary px-3 py-1.5 text-[11px]">Assine</button>
        </div>
      </div>

      {/* Logo row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-4.5 gap-5">
        <div className="flex items-center gap-3.5">
          <button className="bg-transparent border-none text-vp-text cursor-pointer font-sans text-[12px] flex items-center gap-2 hover:text-vp-accent">
            <span className="inline-block w-4 h-[11px] relative">
              <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 top-[5px] h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-current" />
            </span>
            MENU
          </button>
          <button className="bg-transparent border-none text-vp-text cursor-pointer font-sans text-[12px] flex items-center gap-1.5 hover:text-vp-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            BUSCAR
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Monogram size="lg" />
          <div className="font-serif italic text-[13px] text-vp-text-2 tracking-[0.02em]">
            Jornalismo independente de Mato Grosso do Sul
          </div>
        </div>

        <div className="flex gap-3 justify-end items-center font-sans text-[11px] text-vp-text-3">
          <span className="uppercase tracking-[0.08em]">Siga</span>
          {['FB','IG','X','YT','WA'].map(s => (
            <a key={s} className="w-6 h-6 border border-vp-border-2 rounded-[2px] inline-flex items-center justify-center text-[9px] font-bold text-vp-text-2 cursor-pointer hover:border-vp-accent hover:text-vp-accent">
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-0 px-5 border-t border-vp-border overflow-x-auto font-sans">
        {sections.map((s, i) => (
          <a key={s} className={`px-3.5 py-2.5 text-[12px] font-bold tracking-[0.04em] uppercase whitespace-nowrap cursor-pointer border-b-2 hover:text-vp-accent hover:border-vp-accent ${i === 0 ? 'text-vp-accent border-vp-accent' : 'text-vp-text-2 border-transparent'}`}>
            {s}
          </a>
        ))}
      </nav>
    </header>
  );
}
