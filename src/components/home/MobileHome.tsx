import React from 'react';
import Link from 'next/link';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileEditoriaScroller } from '@/components/home/MobileEditoriaScroller';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { ImgPH } from '@/components/shared/ImgPH';

export function MobileHome() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg relative max-w-[480px] mx-auto border-x border-vp-border">
      <MobileMasthead />
      <MobileEditoriaScroller />

      {/* Live strip */}
      <div className="px-4 py-2.5 flex gap-2.5 items-center border-b border-vp-border">
        <span className="vp-tag vp-tag-live shrink-0">AO VIVO</span>
        <span className="font-sans text-[12px] font-semibold text-vp-text leading-tight">ALMS aprova LDO 2027 após 6h de sessão</span>
      </div>

      <div className="flex-1 overflow-y-auto vp-scroll">
        {/* Hero */}
        <Link href="/o-rio-que-sumiu-taquari" className="block no-underline">
          <article className="px-4 py-[18px] border-b border-vp-border">
            <ImgPH label="capa" height={200} style={{ marginBottom: 12 }} />
            <span className="eyebrow text-[10px]">Exclusivo · Investigação</span>
            <h1 className="font-display text-[24px] leading-[1.1] my-2 tracking-[-0.01em]">
              Empresas do agro receberam R$ 2,1 bi do BNDES sem regularização ambiental
            </h1>
            <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-2.5">
              Levantamento cruza dados do banco com autuações do Ibama e revela 38 grupos do sul de MS.
            </p>
            <div className="byline">Marina Ribeiro e Carlos Benites · 06:00</div>
          </article>
        </Link>

        {/* Donate banner */}
        <div className="bg-vp-surface p-4 border-b border-vp-border">
          <div className="eyebrow mb-1 text-[10px]">Sem donos. Sem paywall.</div>
          <div className="font-display text-[17px] leading-[1.2] mb-2.5 text-wrap balance">
            4.812 leitores sustentam este jornalismo. Você pode ser o próximo.
          </div>
          <Link href="/apoiar" className="block w-full no-underline">
            <button className="vp-btn vp-btn-primary w-full text-[12px]">Apoiar com R$ 19/mês</button>
          </Link>
        </div>

        {/* List items */}
        {[
          { tag:'Política', h:'Governador sanciona lei que amplia isenção para frigoríficos', t:'há 2h', s:'isencao-frigorificos' },
          { tag:'Cidades · CG', h:'Obra da Duque de Caxias atrasa 14 meses e custa 60% a mais', t:'há 3h', s:'obra-duque-caxias' },
          { tag:'Indígenas', h:'“Estão abrindo o mato com trator”: Guarani Kaiowá denunciam invasão', t:'há 4h', s:'guarani-kaiowa' },
        ].map((x,i) => (
          <Link key={i} href={`/${x.s}`} className="block no-underline">
            <article className="px-4 py-3.5 border-b border-vp-border grid grid-cols-[1fr_90px] gap-3">
              <div>
                <span className="eyebrow text-[9px]">{x.tag}</span>
                <h3 className="font-display text-[16px] leading-[1.2] my-1">{x.h}</h3>
                <div className="byline text-[11px]">{x.t} · 4 min</div>
              </div>
              <ImgPH label="" height={80} />
            </article>
          </Link>
        ))}

        {/* Inline ad */}
        <div className="p-3 bg-vp-bg">
          <div className="vp-ad h-[100px]">320 × 100</div>
        </div>

        {/* Section header */}
        <div className="px-4 pt-[18px] pb-2.5 flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">Especial · Pantanal</h3>
          <Link href="/editoria/pantanal" className="meta ml-auto text-vp-accent cursor-pointer hover:underline no-underline">Ver tudo →</Link>
        </div>
        <Link href="/o-rio-que-sumiu-taquari" className="block no-underline">
          <article className="px-4 pb-4 border-b border-vp-border">
            <ImgPH label="série · pantanal" height={170} style={{ marginBottom: 10 }} />
            <span className="eyebrow text-[10px]">Parte 3 de 5</span>
            <h3 className="font-display text-[19px] leading-[1.15] my-1.5">O rio que sumiu: como o Taquari virou corredor de sedimentos</h3>
            <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5]">8 meses de apuração e 420 km percorridos.</p>
          </article>
        </Link>

        {/* Mais lidas */}
        <div className="p-4">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-3">Mais lidas hoje</h3>
          {['Raio-X: o patrimônio dos 24 deputados de MS','Como o PCC se instalou nas cidades de fronteira','Mapa do fogo: Pantanal em tempo real'].map((h,i) => (
            <Link key={i} href={`/top-${i}`} className="block no-underline">
              <div className={`grid grid-cols-[24px_1fr] gap-2.5 py-2.5 ${i < 2 ? 'border-b border-vp-border' : ''}`}>
                <span className="font-display text-[22px] text-vp-accent leading-none font-bold">{i+1}</span>
                <h4 className="font-display text-[14px] leading-[1.25]">{h}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MobileTabBar active="home" />
    </div>
  );
}
