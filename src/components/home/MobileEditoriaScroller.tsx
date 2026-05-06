import React from 'react';

export function MobileEditoriaScroller() {
  const items = ['Para você','Pantanal','Política','Cidades','Indígenas','Agro','Economia','Segurança'];
  return (
    <div className="border-b border-vp-border flex overflow-x-auto px-3 gap-1 [scrollbar-width:none]">
      {items.map((t, i) => (
        <a key={t} className={`py-3 px-3 font-sans text-[12px] font-semibold tracking-[0.04em] uppercase whitespace-nowrap cursor-pointer border-b-2 ${i === 0 ? 'text-vp-accent border-vp-accent' : 'text-vp-text-2 border-transparent'}`}>
          {t}
        </a>
      ))}
    </div>
  );
}
