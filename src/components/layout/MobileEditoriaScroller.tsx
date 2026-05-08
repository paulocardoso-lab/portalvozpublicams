import React from 'react';
import Link from 'next/link';

interface MobileEditoriaScrollerProps {
  sections?: { name: string, slug: string }[];
  activeSlug?: string;
}

/**
 * MobileEditoriaScroller — Barra horizontal de navegação por editorias para mobile.
 * Implementa o scroll horizontal suave sem scrollbar visível.
 */
export function MobileEditoriaScroller({ 
  sections = [
    { name: 'Para você', slug: '' },
    { name: 'Pantanal', slug: 'pantanal' },
    { name: 'Política', slug: 'politica' },
    { name: 'Cidades', slug: 'cidades' },
    { name: 'Indígenas', slug: 'indigenas' },
    { name: 'Agro', slug: 'agronegocio' },
    { name: 'Economia', slug: 'economia' },
    { name: 'Segurança', slug: 'seguranca' }
  ],
  activeSlug = ''
}: MobileEditoriaScrollerProps) {
  return (
    <div className="border-b border-vp-border flex overflow-x-auto px-3 gap-1 scrollbar-hide">
      {sections.map((s) => (
        <Link 
          key={s.slug} 
          href={s.slug ? `/editoria/${s.slug}` : '/'}
          className={`
            py-3 px-3 font-sans text-[12px] font-bold tracking-[0.04em] uppercase whitespace-nowrap border-b-2 transition-all
            ${s.slug === activeSlug ? 'text-vp-accent border-vp-accent' : 'text-vp-text-2 border-transparent hover:text-vp-text'}
          `}
        >
          {s.name}
        </Link>
      ))}
    </div>
  );
}
