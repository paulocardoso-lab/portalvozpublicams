import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export default function ReaderProfilePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>

      <div className="flex-1 max-w-[720px] mx-auto w-full md:py-10 bg-vp-bg md:border-x border-vp-border">
        {/* Header */}
        <div className="px-5 py-5 border-b border-vp-border">
          <div className="flex items-center gap-3.5 mb-3.5">
            <ImgPH label="" width={56} height={56} style={{ borderRadius: '50%' }} />
            <div className="flex-1">
              <div className="font-display text-[19px] leading-[1.1]">Marina Ribeiro</div>
              <div className="text-[11px] text-vp-text-3 mt-0.5">Apoiadora desde fev/2024 · Campo Grande</div>
            </div>
            <button className="bg-transparent border border-vp-border text-vp-text-2 px-2.5 py-1.5 text-[11px] cursor-pointer hover:bg-vp-surface transition-colors">
              Editar
            </button>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-vp-accent/10 border border-vp-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-vp-accent" />
            <span className="text-[11px] text-vp-accent font-semibold uppercase tracking-[0.06em]">Plano Apoiador · R$ 39/mês</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-vp-border">
          {[['28','salvas'],['142','lidas'],['12','comentários']].map(([n,l],i) => (
            <div key={i} className={`py-3.5 px-2 text-center ${i<2 ? 'border-r border-vp-border' : ''}`}>
              <div className="font-display text-[22px] font-bold text-vp-text">{n}</div>
              <div className="text-[10px] text-vp-text-3 uppercase tracking-[0.06em] mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-vp-border">
          {[['Salvos',true],['Histórico',false],['Comentários',false]].map(([t,a],i) => (
            <button key={i} className={`bg-transparent py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] cursor-pointer ${a ? 'text-vp-text border-b-2 border-vp-accent' : 'text-vp-text-3 border-b-2 border-transparent hover:text-vp-text-2'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto vp-scroll">
          {/* Saved articles */}
          {[
            { tag:'Pantanal', h:'O rio que sumiu: como o Taquari virou corredor de sedimentos', t:'salvo há 2 dias' },
            { tag:'Política', h:'Raio-X: o patrimônio dos 24 deputados de MS', t:'salvo há 4 dias' },
            { tag:'Indígenas', h:'"Estão abrindo o mato com trator": Guarani Kaiowá denunciam invasão', t:'salvo há 1 sem' },
            { tag:'Cidades · CG', h:'Obra da Duque de Caxias atrasa 14 meses e custa 60% a mais', t:'salvo há 2 sem' },
          ].map((x,i) => (
            <div key={i} className="px-4 py-3.5 border-b border-vp-border grid grid-cols-[1fr_80px] gap-3">
              <div>
                <span className="eyebrow text-[9px]">{x.tag}</span>
                <h3 className="font-display text-[15px] leading-[1.2] my-1 hover:text-vp-accent cursor-pointer">{x.h}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-vp-text-3">{x.t}</span>
                  <button className="bg-transparent border-none text-vp-accent text-[14px] cursor-pointer" aria-label="Remover">★</button>
                </div>
              </div>
              <ImgPH label="" height={70} />
            </div>
          ))}

          {/* Settings menu */}
          <div className="pt-5">
            <div className="eyebrow px-4 pb-2.5 text-[10px]">Conta</div>
            {[
              ['Apoio mensal','R$ 39 · Apoiador'],
              ['Newsletters','2 ativas'],
              ['Notificações','Push + e-mail'],
              ['Métodos de pagamento','PIX cadastrado'],
              ['Privacidade & dados','LGPD'],
              ['Senha e segurança','2FA off'],
              ['Sair','', 'danger'],
            ].map(([k,v,d],i) => (
              <a key={i} className={`flex justify-between items-center px-4 py-3.5 border-t border-vp-border text-[13px] cursor-pointer hover:bg-vp-surface transition-colors ${d==='danger' ? 'text-vp-urgent' : 'text-vp-text'}`}>
                <span>{k}</span>
                <span className="flex items-center gap-2">
                  {v && <span className="text-[11px] text-vp-text-3">{v}</span>}
                  {d!=='danger' && <span className="text-vp-text-3">›</span>}
                </span>
              </a>
            ))}
          </div>

          <div className="px-4 py-6 text-center text-[10px] text-vp-text-3 font-mono">
            v2.4.1 · vozpublicams.com.br
          </div>
        </div>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
      <div className="md:hidden"><MobileTabBar active="me" /></div>
    </div>
  );
}
