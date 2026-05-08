import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default function ReaderProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <div className="hidden lg:block"><SiteHeader /></div>

      <main className="flex-1 max-w-[720px] mx-auto w-full lg:my-10 bg-vp-bg lg:border border-vp-border shadow-2xl">
        {/* Header Profile */}
        <div className="px-6 py-8 border-b border-vp-border">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-[64px] h-[64px] rounded-full overflow-hidden bg-vp-surface border border-vp-border shrink-0">
               <ImgPH label="" width={64} height={64} />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-[24px] lg:text-[28px] leading-tight font-black">Marina Ribeiro</h1>
              <p className="text-[12px] text-vp-text-3 mt-1 font-sans uppercase tracking-widest font-bold">
                Apoiadora desde fev/2024 · Campo Grande, MS
              </p>
            </div>
            <button className="vp-btn px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-vp-surface transition-colors">
              Editar
            </button>
          </div>
          
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-vp-accent/10 border border-vp-accent rounded-sm shadow-[0_0_15px_rgba(217,119,87,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-vp-accent animate-pulse" />
            <span className="text-[11px] text-vp-accent font-black uppercase tracking-[0.1em]">
              Plano Apoiador · R$ 39/mês
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 border-b border-vp-border bg-vp-surface/30">
          {[
            ['28', 'salvas'],
            ['142', 'lidas'],
            ['12', 'comentários']
          ].map(([n, l], i) => (
            <div key={i} className={`py-5 px-2 text-center ${i < 2 ? 'border-r border-vp-border' : ''}`}>
              <div className="font-display text-[26px] lg:text-[32px] font-black text-vp-text leading-none">{n}</div>
              <div className="text-[10px] text-vp-text-3 uppercase tracking-widest mt-1 font-bold">{l}</div>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-3 border-b border-vp-border bg-vp-bg sticky top-0 lg:top-[124px] z-10">
          {[
            ['Salvos', true],
            ['Histórico', false],
            ['Comentários', false]
          ].map(([t, a], i) => (
            <button 
              key={i} 
              className={`py-4 font-sans text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${
                a 
                  ? 'text-vp-text border-vp-accent bg-vp-surface/20' 
                  : 'text-vp-text-3 border-transparent hover:text-vp-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {/* List items */}
          {[
            { tag:'Pantanal', h:'O rio que sumiu: como o Taquari virou corredor de sedimentos', t:'salvo há 2 dias' },
            { tag:'Política', h:'Raio-X: o patrimônio dos 24 deputados de MS', t:'salvo há 4 dias' },
            { tag:'Indígenas', h:'"Estão abrindo o mato com trator": Guarani Kaiowá denunciam invasão', t:'salvo há 1 sem' },
          ].map((x, i) => (
            <div key={i} className="px-6 py-5 border-b border-vp-border grid grid-cols-[1fr_100px] gap-6 group hover:bg-vp-surface/10 transition-colors">
              <div>
                <Eyebrow className="text-[9px] mb-1.5">{x.tag}</Eyebrow>
                <h3 className="font-display text-[17px] lg:text-[19px] leading-tight mb-2 group-hover:text-vp-accent transition-colors font-bold cursor-pointer italic">
                  &quot;{x.h}&quot;
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-vp-text-4 font-mono uppercase tracking-wider">{x.t}</span>
                  <button className="text-vp-accent text-[18px] opacity-60 hover:opacity-100 transition-opacity" title="Remover dos salvos">
                    ★
                  </button>
                </div>
              </div>
              <div className="w-[100px] h-[75px] rounded-sm overflow-hidden bg-vp-surface border border-vp-border">
                 <ImgPH label="" width={100} height={75} />
              </div>
            </div>
          ))}

          {/* Account Settings Section */}
          <div className="pt-10">
            <div className="px-6 pb-4">
              <Eyebrow variant="muted" className="text-[10px]">Gerenciar Conta</Eyebrow>
            </div>
            
            <div className="flex flex-col border-t border-vp-border">
              {[
                ['Assinatura & Apoio','R$ 39 · Plano Apoiador'],
                ['Newsletters & Alertas','3 assinaturas ativas'],
                ['Notificações','Push + e-mail'],
                ['Métodos de pagamento','PIX cadastrado'],
                ['Privacidade & Dados (LGPD)','Gerenciar permissões'],
                ['Segurança','Alterar senha · 2FA'],
                ['Encerrar Sessão','', 'danger'],
              ].map(([k,v,d], i) => (
                <a 
                  key={i} 
                  className={`flex justify-between items-center px-6 py-4 border-b border-vp-border text-[13px] font-bold cursor-pointer hover:bg-vp-surface transition-all ${
                    d === 'danger' ? 'text-vp-urgent bg-vp-urgent/5' : 'text-vp-text'
                  }`}
                >
                  <span className="tracking-tight">{k}</span>
                  <div className="flex items-center gap-3">
                    {v && <span className="text-[11px] text-vp-text-3 font-normal font-sans italic">{v}</span>}
                    {d !== 'danger' && <span className="text-vp-text-4 text-[18px]">›</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <footer className="px-6 py-12 text-center text-[10px] text-vp-text-4 font-mono uppercase tracking-[0.2em] border-t border-vp-border bg-vp-bg">
            Voz Pública MS · v2.4.1 · build_6721
          </footer>
        </div>
      </main>

      <div className="hidden lg:block"><SiteFooter /></div>
      <div className="lg:hidden"><MobileTabBar active="me" /></div>
    </div>
  );
}

