import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export default function ColumnistPage({ params }: { params: { slug: string } }) {
  // Mock data for slug
  const name = params.slug === 'tereza-mattos' ? 'Tereza Mattos' : 'Tereza Mattos';

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>
      <div className="md:hidden"><MobileMasthead /></div>

      {/* Hero columnist */}
      <div className="border-b border-vp-border md:px-7 px-4 md:py-10 py-7 bg-vp-surface">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-[160px_1fr_auto] grid-cols-1 gap-7 items-center">
          <ImgPH label="" width={160} height={160} style={{ borderRadius: '50%' }} />
          <div>
            <div className="eyebrow mb-2 text-[10px]">Colunista · Política</div>
            <h1 className="font-display md:text-[56px] text-[40px] tracking-[-0.02em] mb-2.5 leading-[1.05]">{name}</h1>
            <p className="font-serif italic md:text-[17px] text-[15px] text-vp-text-2 max-w-[640px] leading-[1.5] text-pretty">
              Jornalista há 24 anos, cobre o Legislativo de MS desde 2008. Autora de “A República do Boi”.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2.5 font-sans text-[12px]">
              <a className="text-vp-text-3 cursor-pointer hover:underline hover:text-vp-text">tereza@vozpublicams.com.br</a>
              <span className="text-vp-text-4">·</span>
              <a className="text-vp-text-3 cursor-pointer hover:underline hover:text-vp-text">@terezamattos</a>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="vp-btn vp-btn-primary w-full md:w-auto">Assinar coluna</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] grid-cols-1 gap-8 md:px-7 px-4 py-7 max-w-[1300px] mx-auto w-full">
        <div>
          {/* Latest column */}
          <article className="pb-7 border-b border-vp-border">
            <span className="eyebrow text-[10px]">Coluna de hoje · 22 abr</span>
            <h2 className="font-display md:text-[40px] text-[28px] my-2.5 leading-[1.1] italic hover:text-vp-accent cursor-pointer">
              “O silêncio cúmplice da bancada ruralista”
            </h2>
            <p className="font-serif md:text-[19px] text-[15px] text-vp-text-2 leading-[1.6] mb-3.5 text-pretty">
              Nenhum dos oito deputados federais de MS se manifestou sobre o relatório do TCU que apontou falhas graves na fiscalização ambiental do Pantanal. O silêncio, neste caso, é posição — e cara a quem vota.
            </p>
            <a className="vp-btn inline-block text-[13px] cursor-pointer">Ler coluna completa →</a>
          </article>

          {/* Archive */}
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold my-7">Colunas recentes</h3>
          {[
            { t: '“Não é CPI do gás. É CPI do silêncio.”', d: '20 abr', e: 'Sobre os dois anos sem decisão na ALMS.' },
            { t: '“O que MS perde ao não ter uma política de dados”', d: '17 abr', e: 'Transparência se faz com planilha aberta — não com cartilha.' },
            { t: '“Três erros da oposição no caso do ex-secretário”', d: '14 abr', e: 'Falta de estratégia comum deixa governo confortável.' },
            { t: '“A eleição começa no interior. De novo.”', d: '11 abr', e: 'Mapa das convenções de partidos sinaliza reagrupamento.' },
          ].map((c,i) => (
            <article key={i} className="py-4.5 border-b border-vp-border grid grid-cols-[50px_1fr] md:grid-cols-[60px_1fr] gap-4.5">
              <div className="font-mono text-[11px] text-vp-text-3 tracking-[0.08em] uppercase pt-1.5">{c.d}</div>
              <div>
                <h4 className="font-display md:text-[22px] text-[18px] italic mb-1.5 leading-[1.15] hover:text-vp-accent cursor-pointer">{c.t}</h4>
                <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5]">{c.e}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid gap-5 md:self-start">
          <div className="bg-vp-surface border border-vp-border p-4.5">
            <div className="eyebrow mb-2 text-[10px]">Sobre a coluna</div>
            <p className="font-serif text-[14px] text-vp-text-2 leading-[1.55]">
              Publicada às terças, quintas e domingos. 218 textos no arquivo. 18.420 assinantes recebem por e-mail.
            </p>
          </div>
          <div className="vp-ad h-[250px] w-full">300 × 250</div>
          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-3">Tags mais usadas</h4>
            <div className="flex flex-wrap gap-1.5">
              {['ALMS','Governo','Orçamento','Agro','Pantanal','Oposição','PT','PP','PSDB','Eleições 2026','Justiça'].map(t => (
                <span key={t} className="vp-tag vp-tag-outline cursor-pointer hover:border-vp-accent hover:text-vp-accent transition-colors">{t}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
      <div className="md:hidden"><MobileTabBar /></div>
    </div>
  );
}
