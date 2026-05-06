import React from 'react';
import { Monogram } from '@/components/shared/Monogram';

export default function AdminAppearancePage() {
  const accents = ['bg-[#d97757]', 'bg-[#c89c5a]', 'bg-[#7aa2f7]', 'bg-[#c4a7e7]', 'bg-[#7aa37a]'];
  
  const blocks = [
    { n: 'Hero — Manchete principal', t: 'hero', on: true },
    { n: 'Ad · Leaderboard topo', t: 'ad', on: true },
    { n: 'Trio de chamadas', t: 'grid-3', on: true },
    { n: 'Especial · Pantanal (fixo)', t: 'serie', on: true },
    { n: 'Ad · Billboard inline', t: 'ad', on: true },
    { n: '3 colunas — Política / Economia / Cidades', t: 'cols-3', on: true },
    { n: 'Colunistas', t: 'authors', on: true },
    { n: 'Mais lidas + Podcast', t: 'split', on: true },
    { n: 'Newsletter (sidebar)', t: 'aside', on: true },
    { n: 'Eventos / Agenda pública', t: 'side', on: false },
  ];

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[22px] font-semibold mb-1">Aparência & layout</h1>
      <p className="text-vp-text-3 text-[13px] mb-5">Controles de marca, tipografia e organização da home</p>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4.5 items-start">
        {/* Controls */}
        <div className="grid gap-3.5">
          <div className="bg-[#141413] border border-vp-border p-4 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3">Identidade</h3>
            <label className="text-[12px] block mb-2.5">Logo (monograma)
              <div className="flex items-center gap-2.5 p-2.5 bg-vp-bg border border-vp-border mt-1">
                <Monogram size="md" />
                <button className="vp-btn text-[11px] ml-auto">Trocar</button>
              </div>
            </label>
            <label className="text-[12px] block mb-2.5">Slogan
              <input className="vp-input mt-1 w-full" defaultValue="Jornalismo independente de Mato Grosso do Sul" />
            </label>
            <label className="text-[12px] block">Cor de destaque
              <div className="flex gap-2 mt-1.5">
                {accents.map((a, i) => (
                  <span key={a} className={`w-8 h-8 rounded-full ${a} cursor-pointer ${i === 0 ? 'border-2 border-vp-text' : 'border-2 border-transparent'}`} />
                ))}
              </div>
            </label>
          </div>

          <div className="bg-[#141413] border border-vp-border p-4 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3">Tipografia</h3>
            <label className="text-[12px] block mb-2.5">Fonte dos títulos
              <select className="vp-input mt-1 w-full"><option>Playfair Display</option><option>Source Serif 4</option><option>IBM Plex Serif</option></select>
            </label>
            <label className="text-[12px] block mb-2.5">Fonte do corpo
              <select className="vp-input mt-1 w-full"><option>Source Serif 4</option><option>Georgia</option><option>Inter (sans)</option></select>
            </label>
            <label className="text-[12px] block">Escala de leitura
              <input type="range" min="90" max="120" defaultValue="100" className="w-full mt-2 accent-vp-accent" aria-label="Escala de leitura" />
              <div className="text-[11px] text-vp-text-3 text-right">100%</div>
            </label>
          </div>

          <div className="bg-[#141413] border border-vp-border p-4 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3">Modo</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="vp-btn p-3 border-vp-accent text-vp-accent text-[12px]">● Escuro (padrão)</button>
              <button className="vp-btn p-3 text-[12px]">○ Claro</button>
            </div>
            <label className="text-[12px] flex justify-between items-center mt-3 cursor-pointer">
              Seguir preferência do sistema <input type="checkbox" defaultChecked className="accent-vp-accent" />
            </label>
          </div>

          <div className="bg-[#141413] border border-vp-border p-4 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3">Densidade da home</h3>
            <div className="grid grid-cols-3 gap-2">
              {['Leve','Média','Densa'].map((d, i) => (
                <button key={d} className={`vp-btn p-2.5 text-[11px] ${i === 2 ? 'border-vp-accent text-vp-accent' : ''}`}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — home layout blocks / drag-reorder */}
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-3.5">
            <h3 className="text-[13px] font-semibold">Blocos da home — arraste para reordenar</h3>
            <button className="vp-btn text-[11px]">+ Adicionar bloco</button>
          </div>
          <div className="grid gap-2">
            {blocks.map((b, i) => (
              <div key={i} className={`grid grid-cols-[22px_70px_1fr_40px_40px] sm:grid-cols-[22px_80px_1fr_60px_60px] gap-2 sm:gap-3 items-center px-3 py-2.5 bg-vp-bg border border-vp-border rounded-[4px] ${b.on ? 'opacity-100' : 'opacity-50'}`}>
                <span className="text-vp-text-3 cursor-grab leading-none flex items-center justify-center">⋮⋮</span>
                <span className="vp-tag bg-transparent border-vp-border text-[10px] text-center px-0 flex justify-center">{b.t}</span>
                <span className="text-[12px] sm:text-[13px] font-medium truncate">{b.n}</span>
                <span className="text-[11px] text-vp-text-3 text-right">#{i + 1}</span>
                <label className={`inline-block w-7 h-4 rounded-full relative cursor-pointer ml-auto transition-colors ${b.on ? 'bg-vp-accent' : 'bg-vp-border-2'}`}>
                  <span className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${b.on ? 'left-[14px]' : 'left-[2px]'}`} />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
