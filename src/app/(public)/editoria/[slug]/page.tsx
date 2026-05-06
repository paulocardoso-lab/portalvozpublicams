import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Mock data for slug
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>
      <div className="md:hidden"><MobileMasthead /></div>

      {/* Section hero */}
      <div className="border-b-2 border-vp-text md:px-7 px-4 md:py-10 py-6">
        <div className="max-w-[1300px] mx-auto">
          <div className="eyebrow mb-2.5 text-[10px]">Editoria</div>
          <h1 className="font-display md:text-[72px] text-[48px] tracking-[-0.02em] mb-3.5 leading-[1.05]">{title}</h1>
          <p className="font-serif md:text-[18px] text-[15px] text-vp-text-2 max-w-[640px] leading-[1.5]">
            Cobertura contínua do maior bioma alagado do planeta — ciência, política, terra e as pessoas que vivem entre os rios.
          </p>
          <div className="mt-4.5 flex gap-4.5 font-sans md:text-[12px] text-[10px] text-vp-text-3">
            <span>342 reportagens</span><span>·</span><span>14 repórteres</span><span>·</span><span>3 séries abertas</span>
          </div>
        </div>
      </div>

      {/* Subnav */}
      <div className="border-b border-vp-border px-4 md:px-7 flex gap-5 font-sans md:text-[12px] text-[11px] text-vp-text-2 uppercase tracking-[0.08em] overflow-x-auto vp-scroll">
        {['Todos','Investigações','Dados','Séries','Vídeo','Opinião'].map((t,i) => (
          <a key={t} className={`whitespace-nowrap py-3.5 border-b-2 font-semibold cursor-pointer hover:text-vp-accent transition-colors ${i===0 ? 'border-vp-accent text-vp-accent' : 'border-transparent'}`}>
            {t}
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_300px] grid-cols-1 gap-8 md:px-7 px-4 py-7 max-w-[1400px] mx-auto w-full">
        <div>
          {/* Featured */}
          <article className="grid md:grid-cols-2 grid-cols-1 gap-7 pb-7 border-b border-vp-border">
            <ImgPH label="destaque · especial pantanal" height={340} />
            <div>
              <span className="eyebrow text-[10px]">Série · Parte 3 de 5</span>
              <h2 className="font-display md:text-[38px] text-[28px] my-2.5 leading-[1.05] hover:text-vp-accent cursor-pointer">
                O rio que sumiu: como o Taquari virou corredor de sedimentos
              </h2>
              <p className="font-serif md:text-[16px] text-[14px] text-vp-text-2 leading-[1.5] mb-3.5 text-pretty">
                Oito meses de apuração e 420 km de leito percorridos revelam o colapso silencioso do principal afluente.
              </p>
              <div className="byline text-[11px]">Marina Ribeiro e Carlos Benites · 22 abr</div>
            </div>
          </article>

          {/* List */}
          {[
            { h:'Cinco perguntas que o governo de MS não respondeu sobre o Plano de Manejo', b:'Reportagem pediu posição em sete ocasiões desde novembro. Não houve resposta.' , a:'L. Fragoso', t:'há 8h', tag: 'Reportagem' },
            { h:'Dados inéditos: 72% das autuações por queimada viram “dívida ativa” e prescrevem', b:'Análise de 3.214 autos do Ibama em MS mostra padrão de paralisia administrativa.', a:'R. Duarte · dados', t:'ontem', tag: 'Dados' },
            { h:'Vídeo · O dia em que o fogo chegou na escola ribeirinha de Porto Murtinho', b:'Acompanhamos por 40 dias a comunidade Barra do São Lourenço.', a:'Equipe VP', t:'2 dias', tag: 'Vídeo' },
            { h:'Quem são os donos das terras que mais desmatam no Pantanal de MS', b:'Cruzamento de CAR + CNPJ identifica 38 grupos — a maioria do agro.', a:'M. Ribeiro', t:'3 dias', tag: 'Investigação' },
            { h:'Pesquisadores deixam Embrapa Pantanal após 3º ano consecutivo de cortes', b:'Quadro encolheu de 42 para 19 servidores desde 2022.', a:'A. Figueira', t:'4 dias', tag: 'Reportagem' },
            { h:'Opinião · O Pantanal não é pasto', b:'Por Débora Calheiros, hidróloga e pesquisadora aposentada da Embrapa.', a:'D. Calheiros', t:'5 dias', tag: 'Opinião' },
          ].map((x,i) => (
            <article key={i} className="grid md:grid-cols-[200px_1fr_auto] grid-cols-[1fr] gap-5 py-5 border-b border-vp-border md:items-start">
              <ImgPH label={x.tag} height={130} />
              <div>
                <span className="eyebrow text-[10px]">{x.tag}</span>
                <h3 className="font-display text-[22px] my-1.5 leading-[1.15] hover:text-vp-accent cursor-pointer">{x.h}</h3>
                <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5]">{x.b}</p>
                <div className="byline text-[11px] mt-2.5">por {x.a} · {x.t}</div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1.5">
                <span className="meta">5 min</span>
                <span className="meta">128 coment.</span>
              </div>
            </article>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-1 py-7 font-sans text-[13px]">
            {['1','2','3','4','…','29'].map((n,i) => (
              <button key={i} className={`vp-btn min-w-[36px] px-2.5 py-1.5 ${i===0 ? 'bg-vp-surface border-vp-border-2' : 'bg-transparent border-transparent text-vp-text-2 hover:bg-vp-surface'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="grid gap-5 md:self-start">
          <div className="vp-ad h-[250px] w-full">300 × 250</div>
          <div className="bg-vp-surface p-4 border border-vp-border">
            <h4 className="font-display text-[18px] mb-2.5">Repórteres desta editoria</h4>
            {['Marina Ribeiro','Carlos Benites','Lucas Fragoso','Ana Figueira'].map((n,i) => (
              <div key={n} className={`flex items-center gap-2.5 py-2 ${i>0 ? 'border-t border-vp-border' : ''}`}>
                <ImgPH label="" width={32} height={32} style={{ borderRadius: '50%' }} />
                <div className="font-sans text-[13px] font-semibold">{n}</div>
              </div>
            ))}
          </div>
          <div className="vp-ad h-[600px] hidden md:block">300 × 600</div>
        </aside>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
      <div className="md:hidden"><MobileTabBar active="search" /></div>
    </div>
  );
}
