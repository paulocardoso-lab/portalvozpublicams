import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>
      <div className="md:hidden"><MobileMasthead /></div>

      <div className="max-w-[1200px] mx-auto w-full md:px-7 px-4 py-8 flex-1">
        <div className="flex md:flex-row flex-col gap-3 mb-2.5">
          <input className="vp-input flex-1 font-display md:text-[28px] text-[22px] md:px-4.5 px-3 md:py-3.5 py-2.5 bg-vp-bg border-2" defaultValue="pantanal taquari" />
          <button className="vp-btn vp-btn-primary px-5.5 text-[14px]">Buscar</button>
        </div>
        <div className="byline text-[11px] mb-6">Cerca de <strong className="text-vp-text">312 resultados</strong> · 0,12s</div>

        <div className="grid md:grid-cols-[200px_1fr] grid-cols-1 gap-8">
          {/* Filters */}
          <div className="grid gap-5 md:self-start font-sans text-[13px]">
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.12em] font-bold mb-2.5">Tipo</h4>
              {['Reportagem','Coluna','Vídeo','Podcast','Dados'].map((x,i) => (
                <label key={x} className="flex gap-2 py-1 text-vp-text-2 cursor-pointer hover:text-vp-text">
                  <input type="checkbox" className="accent-vp-accent" defaultChecked={i<3} /> {x}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.12em] font-bold mb-2.5 md:mt-2">Editoria</h4>
              {['Pantanal','Política','Cidades','Indígenas'].map(x => (
                <label key={x} className="flex gap-2 py-1 text-vp-text-2 cursor-pointer hover:text-vp-text">
                  <input type="checkbox" className="accent-vp-accent" /> {x}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.12em] font-bold mb-2.5 md:mt-2">Período</h4>
              {['Últimos 7 dias','Último mês','Último ano','Tudo'].map((x,i) => (
                <label key={x} className="flex gap-2 py-1 text-vp-text-2 cursor-pointer hover:text-vp-text">
                  <input type="radio" name="p" className="accent-vp-accent" defaultChecked={i===2} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            {[
              { h:'O rio que sumiu: como o Taquari virou corredor de sedimentos', e:'Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do <mark class="bg-vp-accent/20 text-vp-text">Pantanal</mark> sul e documentou o colapso do <mark class="bg-vp-accent/20 text-vp-text">Taquari</mark>…', m:'Pantanal · Reportagem · 22 abr' },
              { h:'Cinco perguntas sobre o Plano de Manejo do Pantanal que MS não responde', e:'Reportagem pediu posição ao governo em sete ocasiões sobre o <mark class="bg-vp-accent/20 text-vp-text">Pantanal</mark> e o rio <mark class="bg-vp-accent/20 text-vp-text">Taquari</mark>…', m:'Pantanal · Reportagem · 15 abr' },
              { h:'Pesquisadores deixam Embrapa Pantanal após 3º ano de cortes', e:'Quadro de cientistas do <mark class="bg-vp-accent/20 text-vp-text">Pantanal</mark> encolheu 55% desde 2022, incluindo equipe que monitorava o <mark class="bg-vp-accent/20 text-vp-text">Taquari</mark>…', m:'Pantanal · Reportagem · 08 abr' },
              { h:'Dados · 72% das autuações por queimada prescrevem em MS', e:'Cruzamento cobre toda a bacia do <mark class="bg-vp-accent/20 text-vp-text">Taquari</mark> e revela padrão em toda extensão do <mark class="bg-vp-accent/20 text-vp-text">Pantanal</mark>…', m:'Dados · 02 abr' },
            ].map((r,i) => (
              <article key={i} className="py-5 border-b border-vp-border">
                <div className="meta text-[10px] mb-1">{r.m}</div>
                <h3 className="font-display text-[22px] leading-[1.15] mb-1.5 hover:text-vp-accent cursor-pointer">{r.h}</h3>
                <p className="font-serif text-[15px] text-vp-text-2 leading-[1.5]" dangerouslySetInnerHTML={{ __html: r.e }} />
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
      <div className="md:hidden"><MobileTabBar active="search" /></div>
    </div>
  );
}
