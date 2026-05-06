import React from 'react';
import { Monogram } from '@/components/shared/Monogram';

export function SiteFooter() {
  return (
    <footer className="hidden md:block border-t-2 border-vp-text bg-vp-bg px-7 pt-8 pb-6 font-sans text-[12px] text-vp-text-3">
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-7 mb-7">
        <div>
          <Monogram size="md" />
          <p className="mt-3 leading-[1.6] text-vp-text-2 font-serif text-[14px]">
            Jornalismo investigativo, plural e sem donos. Cobrimos Mato Grosso do Sul com rigor e independência desde 2024.
          </p>
          <div className="mt-3.5 flex gap-2">
            <button className="vp-btn vp-btn-primary text-[11px]">Faça uma doação</button>
            <button className="vp-btn text-[11px]">Assine a newsletter</button>
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-vp-text mb-2.5">Editorias</h4>
          <ul className="list-none p-0 m-0 grid gap-1.5">
            {['Política','Cidades','Pantanal','Agronegócio','Segurança','Indígenas','Fronteira'].map(x => (
              <li key={x}><a className="cursor-pointer hover:text-vp-accent hover:underline">{x}</a></li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-vp-text mb-2.5">Institucional</h4>
          <ul className="list-none p-0 m-0 grid gap-1.5">
            {['Quem somos','Princípios editoriais','Política de correções','Contato','Anuncie','Trabalhe conosco'].map(x => (
              <li key={x}><a className="cursor-pointer hover:text-vp-accent hover:underline">{x}</a></li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-vp-text mb-2.5">Envie sua denúncia</h4>
          <p className="leading-[1.5] mb-2.5">Canal criptografado para whistleblowers. Protegemos suas fontes.</p>
          <a className="text-vp-accent font-semibold cursor-pointer hover:underline">denuncia@vozpublicams.com.br →</a>
        </div>
      </div>
      
      <div className="border-t border-vp-border pt-4 flex justify-between text-[11px]">
        <span>© 2026 Voz Pública MS · Campo Grande, MS · CNPJ 00.000.000/0001-00</span>
        <span className="font-mono">vozpublicams.com.br</span>
      </div>
    </footer>
  );
}
