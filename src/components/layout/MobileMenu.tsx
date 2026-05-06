"use client";

import React from 'react';
import { Monogram } from '@/components/shared/Monogram';

export function MobileMenu({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto w-full fixed inset-0 z-[100] border-x border-vp-border">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-vp-border bg-vp-bg">
        <Monogram size="sm" />
        <button aria-label="Fechar menu" onClick={onClose} className="bg-transparent border-none text-vp-text text-[22px] p-0 cursor-pointer hover:text-vp-accent">
          ×
        </button>
      </div>
      
      <input className="vp-input mx-4 my-4" placeholder="Buscar matérias, autores, tags…" />

      <div className="flex-1 overflow-y-auto vp-scroll">
        <div className="px-4 py-2">
          <div className="eyebrow mb-2.5 text-[10px]">Editorias</div>
          {['Política','Cidades','Pantanal','Agronegócio','Economia','Segurança','Saúde','Educação','Indígenas','Fronteira','Cultura','Esportes','Opinião','Especiais'].map((s,i) => (
            <a key={s} className={`flex justify-between items-center py-3 cursor-pointer font-display text-[17px] hover:text-vp-accent ${i < 13 ? 'border-b border-vp-border' : ''}`}>
              {s}
              <span className="text-vp-text-3 font-sans text-[11px]">›</span>
            </a>
          ))}
        </div>
        <div className="px-4 pt-5 pb-2">
          <div className="eyebrow mb-2.5 text-[10px]">Acompanhe</div>
          <a className="block py-2.5 font-sans text-[13px] cursor-pointer hover:text-vp-accent">Newsletter A Semana em MS</a>
          <a className="block py-2.5 font-sans text-[13px] cursor-pointer hover:text-vp-accent">Podcast Voz Alta</a>
          <a className="block py-2.5 font-sans text-[13px] cursor-pointer hover:text-vp-accent">Canal no WhatsApp</a>
          <a className="block py-2.5 font-sans text-[13px] text-vp-accent cursor-pointer hover:underline">Envie sua denúncia</a>
        </div>
      </div>

      <div className="p-4 border-t border-vp-border grid gap-2 bg-vp-bg">
        <button className="vp-btn vp-btn-primary text-[12px]">Apoie o Voz Pública</button>
        <button className="vp-btn text-[12px]">Entrar / Cadastrar</button>
      </div>
    </div>
  );
}
