import React from 'react';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';

export function SiteHeader({ date = 'quarta-feira, 22 de abril de 2026' }: { date?: string }) {
  const sections = [
    { n: 'Política', s: 'politica' },
    { n: 'Cidades', s: 'cidades' },
    { n: 'Pantanal', s: 'pantanal' },
    { n: 'Agronegócio', s: 'agronegocio' },
    { n: 'Economia', s: 'economia' },
    { n: 'Segurança', s: 'seguranca' },
    { n: 'Saúde', s: 'saude' },
    { n: 'Educação', s: 'educacao' },
    { n: 'Indígenas', s: 'indigenas' },
    { n: 'Fronteira', s: 'fronteira' },
    { n: 'Cultura', s: 'cultura' },
    { n: 'Esportes', s: 'esportes' },
    { n: 'Opinião', s: 'opiniao' },
    { n: 'Especiais', s: 'especiais' },
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
          <Link href="/newsletter" className="cursor-pointer hover:text-vp-accent no-underline">Newsletter</Link>
          <a className="cursor-pointer hover:text-vp-accent no-underline">Podcast</a>
          <a className="cursor-pointer hover:text-vp-accent no-underline">Envie sua denúncia</a>
          <span className="text-vp-text-4">·</span>
          <Link href="/login" className="cursor-pointer hover:text-vp-accent no-underline">Entrar</Link>
          <Link href="/apoiar" className="no-underline">
            <button className="vp-btn vp-btn-primary px-3 py-1.5 text-[11px]">Assine</button>
          </Link>
        </div>
      </div>

      {/* Logo row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-4.5 gap-5">
        <div className="flex items-center gap-3.5">
          <Link href="/menu" className="bg-transparent border-none text-vp-text cursor-pointer font-sans text-[12px] flex items-center gap-2 hover:text-vp-accent no-underline">
            <span className="inline-block w-4 h-[11px] relative">
              <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 top-[5px] h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-current" />
            </span>
            MENU
          </Link>
          <Link href="/busca" className="bg-transparent border-none text-vp-text cursor-pointer font-sans text-[12px] flex items-center gap-1.5 hover:text-vp-accent no-underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            BUSCAR
          </Link>
        </div>

        <Link href="/" className="flex flex-col items-center gap-1 no-underline">
          <Monogram size="lg" />
          <div className="font-serif italic text-[13px] text-vp-text-2 tracking-[0.02em]">
            Jornalismo independente de Mato Grosso do Sul
          </div>
        </Link>

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
          <Link key={s.s} href={`/editoria/${s.s}`} className={`px-3.5 py-2.5 text-[12px] font-bold tracking-[0.04em] uppercase whitespace-nowrap cursor-pointer border-b-2 hover:text-vp-accent hover:border-vp-accent no-underline ${i === 2 ? 'text-vp-accent border-vp-accent' : 'text-vp-text-2 border-transparent'}`}>
            {s.n}
          </Link>
        ))}
      </nav>
    </header>
  );
}
