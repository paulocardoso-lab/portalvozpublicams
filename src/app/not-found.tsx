import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg">
      <SiteHeader />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-[800px] w-full text-center space-y-10">
          <div className="space-y-4">
            <div className="flex justify-center">
              <span className="bg-vp-urgent text-vp-bg text-[12px] font-black uppercase tracking-[0.2em] px-4 py-1">
                Erro 404
              </span>
            </div>
            <h1 className="font-display text-[56px] lg:text-[84px] font-black leading-none tracking-tighter text-vp-text">
              Página Não Encontrada.
            </h1>
            <p className="font-serif italic text-[20px] lg:text-[24px] text-vp-text-3 max-w-[600px] mx-auto leading-relaxed">
              O link que você seguiu pode estar quebrado, a matéria pode ter sido arquivada ou o rio Taquari mudou seu curso novamente.
            </p>
          </div>

          <div className="h-[1px] w-40 bg-vp-border mx-auto" />

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/" 
              className="vp-btn vp-btn-primary px-10 py-4 text-[14px] font-black uppercase tracking-widest w-full md:w-auto"
            >
              Voltar à Capa
            </Link>
            <Link 
              href="/busca" 
              className="vp-btn px-10 py-4 text-[14px] font-black uppercase tracking-widest w-full md:w-auto border-vp-border"
            >
              Pesquisar no Arquivo
            </Link>
          </div>

          <div className="pt-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-vp-text-4 mb-8">
              Enquanto isso, leia nossas últimas investigações
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
               {[
                 'O rio que sumiu: como o Taquari virou corredor',
                 'Raio-X: patrimônio dos 24 deputados de MS',
                 'Assembleia aprova LDO 2027 após 6h de sessão'
               ].map((t, i) => (
                 <div key={i} className="group cursor-pointer">
                    <div className="text-vp-accent font-mono text-[10px] mb-2 uppercase">#0{i+1}</div>
                    <p className="text-[14px] font-bold text-vp-text-2 group-hover:text-vp-text transition-colors leading-snug">
                      {t}
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
