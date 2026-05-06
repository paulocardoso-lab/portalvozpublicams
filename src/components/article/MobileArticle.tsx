import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

export function MobileArticle() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto border-x border-vp-border relative">
      {/* Top minimal bar with progress */}
      <div className="sticky top-0 z-50 bg-vp-bg border-b border-vp-border">
        <div className="flex items-center px-4 py-3 gap-3">
          <button aria-label="Voltar" className="bg-transparent border-none text-vp-text p-0 cursor-pointer hover:text-vp-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <span className="eyebrow flex-1 text-[9px] truncate">Pantanal · Investigação</span>
          <button aria-label="Ajustar texto" className="bg-transparent border-none text-vp-text text-[16px] p-0 cursor-pointer hover:text-vp-accent">Aa</button>
          <button aria-label="Salvar" className="bg-transparent border-none text-vp-text p-0 cursor-pointer hover:text-vp-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h12v18l-6-4-6 4z"/></svg>
          </button>
        </div>
        <div className="h-[2px] bg-vp-border w-full">
          <div className="w-[34%] h-full bg-vp-accent" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto vp-scroll">
        <article className="px-[18px] pt-[18px] pb-6">
          <span className="eyebrow text-[10px]">Investigação · 8 meses de apuração</span>
          <h1 className="font-display text-[30px] leading-[1.05] my-2.5 tracking-[-0.015em] text-balance">
            O rio que sumiu: como o Taquari virou corredor de sedimentos
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-2 leading-[1.45] mb-4 text-pretty">
            420 km percorridos pela equipe revelam o colapso silencioso do principal afluente do Pantanal sul.
          </p>

          <div className="flex items-center gap-3 py-3 border-y border-vp-border mb-[18px]">
            <ImgPH label="" width={36} height={36} style={{ borderRadius: '50%' }} />
            <div className="flex-1">
              <div className="font-sans text-[12px] font-semibold">Marina Ribeiro e Carlos Benites</div>
              <div className="byline text-[11px]">22 abr · 14 min de leitura</div>
            </div>
            <button aria-label="Compartilhar" className="bg-transparent border-none text-vp-text-3 p-0 cursor-pointer hover:text-vp-accent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></svg>
            </button>
          </div>

          <ImgPH label="foto · taquari" height={220} style={{ marginBottom: 8 }} />
          <div className="meta italic mb-[22px] text-[11px]">Trecho do Taquari em Coxim, março de 2026. Foto: Bruno Kelly / VP</div>

          <div className="font-serif text-[17px] leading-[1.65] text-vp-text">
            <p className="mb-4">
              <span className="font-display float-left text-[56px] leading-[0.85] pr-2 pt-1 text-vp-accent">N</span>
              as manhãs de abril, o Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: &quot;o rio acabou, moço&quot;.
            </p>
            <p className="mb-4">
              Dados inéditos obtidos por Lei de Acesso mostram que, desde 2016, o volume de sedimento despejado no baixo curso cresceu 182%.
            </p>

            <blockquote className="border-l-[3px] border-vp-accent py-1.5 pl-[18px] pr-0 my-[22px] font-display text-[20px] leading-[1.25] italic text-vp-text">
              &quot;O Taquari não está doente. Ele está sendo engolido.&quot;
              <footer className="font-sans text-[11px] not-italic text-vp-text-3 mt-2 tracking-[0.04em] uppercase">Débora Calheiros · Embrapa</footer>
            </blockquote>

            <div className="grid grid-cols-3 gap-[1px] bg-vp-border border border-vp-border my-[22px]">
              {[['182%','sedimento'],['9%','do plano executado'],['420 km','percorridos']].map(([n,l]) => (
                <div key={n} className="bg-vp-surface p-3">
                  <div className="font-display text-[22px] text-vp-accent leading-none font-bold">{n}</div>
                  <div className="font-sans text-[10px] text-vp-text-2 mt-1 leading-[1.3]">{l}</div>
                </div>
              ))}
            </div>

            <p>No trecho entre São Gabriel do Oeste e Coxim, as margens mostram pivôs de irrigação a menos de cem metros da calha — o que contraria o Código Florestal.</p>
          </div>
        </article>

        {/* Comments preview */}
        <div className="p-5 border-t border-vp-border bg-vp-surface">
          <h3 className="font-display text-[17px] mb-2.5">Comentários · 47</h3>
          <button className="vp-btn w-full text-[12px]">Ver e participar</button>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="border-t border-vp-border bg-vp-bg grid grid-cols-4 py-2 sticky bottom-0 z-50">
        {[['▲','12'],['↗','Compart.'],['❝','Citar'],['⌃','+']].map(([i,l],idx) => (
          <button key={idx} className="bg-transparent border-none text-vp-text-2 flex flex-col items-center gap-[2px] p-1 font-sans text-[10px] cursor-pointer hover:text-vp-text">
            <span className="text-[14px]">{i}</span><span>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
