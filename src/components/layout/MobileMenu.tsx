"use client";

import React from 'react';
import { Monogram } from '@/components/shared/Monogram';
import { Eyebrow } from '@/components/shared/Eyebrow';
import Link from 'next/link';

interface MobileMenuProps {
  onClose?: () => void;
}

/**
 * MobileMenu — Menu lateral (drawer) para mobile.
 * Navegação completa por editorias e canais institucionais.
 */
export function MobileMenu({ onClose }: MobileMenuProps) {
  const sections = [
    'Política','Cidades','Pantanal','Agronegócio','Economia','Segurança',
    'Saúde','Educação','Indígenas','Fronteira','Cultura','Esportes','Opinião','Especiais'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full fixed inset-0 z-[100] border-x border-vp-border md:hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-vp-border bg-vp-bg">
        <Monogram size="sm" cssHeight="var(--vp-compact-logo-size)" />
        <button 
          aria-label="Fechar menu" 
          onClick={onClose} 
          className="text-vp-text text-[28px] leading-none p-0 hover:text-vp-accent transition-colors"
        >
          ×
        </button>
      </div>
      
      {/* 2. Search */}
      <div className="px-4 py-4">
        <input 
          className="vp-input w-full" 
          placeholder="Buscar matérias, autores, tags…" 
        />
      </div>

      {/* 3. Sections Scroller */}
      <nav className="flex-1 overflow-y-auto vp-scroll">
        <div className="px-4 py-2">
          <Eyebrow className="mb-2.5 text-[10px]">Editorias</Eyebrow>
          {sections.map((s, i) => (
            <Link 
              key={s} 
              href={`/editoria/${s.toLowerCase()}`}
              onClick={onClose}
              className={`flex justify-between items-center py-3.5 font-display font-bold text-[18px] text-vp-text hover:text-vp-accent transition-colors ${i < sections.length - 1 ? 'border-b border-vp-border' : ''}`}
            >
              {s}
              <span className="text-vp-text-3 font-sans text-[11px] font-bold">›</span>
            </Link>
          ))}
        </div>

        {/* 4. Follow Channels */}
        <div className="px-4 pt-6 pb-4">
          <Eyebrow className="mb-2.5 text-[10px]">Acompanhe</Eyebrow>
          <div className="flex flex-col gap-1">
            <Link href="/newsletter" onClick={onClose} className="block py-2.5 font-sans text-[13px] font-bold text-vp-text-2 hover:text-vp-accent transition-colors">
              Newsletter A Semana em MS
            </Link>
            <Link href="/podcasts" onClick={onClose} className="block py-2.5 font-sans text-[13px] font-bold text-vp-text-2 hover:text-vp-accent transition-colors">
              Podcast Voz Alta
            </Link>
            <Link href="/whatsapp" onClick={onClose} className="block py-2.5 font-sans text-[13px] font-bold text-vp-text-2 hover:text-vp-accent transition-colors">
              Canal no WhatsApp
            </Link>
            <Link href="/denuncia" onClick={onClose} className="block py-2.5 font-sans text-[13px] font-bold text-vp-accent hover:underline underline-offset-4 transition-all">
              Envie sua denúncia
            </Link>
          </div>
        </div>
      </nav>

      {/* 5. Footer Actions */}
      <div className="p-4 border-t border-vp-border flex flex-col gap-2 bg-vp-bg shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        <Link href="/apoiar" onClick={onClose} className="w-full">
          <button className="vp-btn vp-btn-primary w-full py-3.5 text-[13px] font-bold uppercase tracking-wider">
            Apoie o Voz Pública
          </button>
        </Link>
        <Link href="/login" onClick={onClose} className="w-full">
          <button className="vp-btn w-full py-3 text-[13px] font-bold uppercase tracking-wider">
            Entrar / Cadastrar
          </button>
        </Link>
      </div>
    </div>
  );
}
