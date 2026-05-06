import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';

export function DesktopArticle() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="px-7 py-3.5 border-b border-vp-border font-sans text-[11px] text-vp-text-3 tracking-[0.06em] uppercase">
        <span className="cursor-pointer hover:underline">Editorias</span> <span className="mx-2 text-vp-text-4">/</span>
        <span className="text-vp-accent cursor-pointer hover:underline">Pantanal</span> <span className="mx-2 text-vp-text-4">/</span>
        <span className="cursor-pointer hover:underline">Investigação</span>
      </div>

      <article className="grid grid-cols-[200px_1fr_260px] gap-9 px-12 py-9 max-w-[1400px] mx-auto w-full">
        {/* Left — sticky share */}
        <aside className="sticky top-[160px] self-start grid gap-4">
          <div className="meta tracking-[0.1em] uppercase text-[10px] mb-1">Compartilhar</div>
          {['WhatsApp','Facebook','X / Twitter','LinkedIn','Copiar link','Imprimir'].map(s => (
            <a key={s} className="font-sans text-[12px] text-vp-text-2 border-l border-vp-border pl-3 cursor-pointer hover:text-vp-accent hover:border-vp-accent transition-colors">
              {s}
            </a>
          ))}
          <div className="mt-2.5 p-3 border border-vp-border text-[11px] font-sans text-vp-text-3 leading-[1.5]">
            Esta reportagem é aberta e sem paywall. Se considera importante, <a className="text-vp-accent cursor-pointer hover:underline">contribua</a>.
          </div>
        </aside>

        {/* Main — article body */}
        <div className="max-w-[680px]">
          <span className="eyebrow text-[10px]">Investigação · Pantanal · 8 meses de apuração</span>
          <h1 className="font-display text-[52px] leading-[1.05] mt-3.5 mb-4.5 tracking-[-0.015em] text-balance">
            O rio que sumiu: como o Taquari virou um corredor de sedimentos
          </h1>
          <p className="font-serif text-[20px] italic text-vp-text-2 leading-[1.45] mb-5.5 text-pretty">
            Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do Pantanal sul — e encontrou uma bacia travada por assoreamento, fazendas às margens e um plano federal parado há uma década.
          </p>

          <div className="flex items-center gap-4.5 pt-4.5 border-y border-vp-border pb-3.5 mb-7">
            <ImgPH label="" width={44} height={44} style={{ borderRadius: '50%' }} />
            <div className="flex-1">
              <div className="font-sans text-[13px] text-vp-text font-semibold">
                Por Marina Ribeiro e Carlos Benites
              </div>
              <div className="byline text-[11px] mt-0.5">22 de abril de 2026, 06:00 · Atualizado há 2h · 14 min de leitura</div>
            </div>
          </div>

          <ImgPH label="foto · leito do rio taquari" height={460} style={{ marginBottom: 14 }} />
          <div className="meta font-serif italic text-[13px] mb-7 text-vp-text-3">
            Trecho do Taquari no município de Coxim, em março de 2026. A região perdeu 2/3 da vazão em duas décadas. Foto: Bruno Kelly / Voz Pública
          </div>

          <div className="font-serif text-[19px] leading-[1.65] text-vp-text text-pretty">
            <p className="mb-5">
              <span className="font-display float-left text-[78px] leading-[0.85] pr-2.5 pt-1.5 text-vp-accent">N</span>
              as manhãs de abril, o Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: “o rio acabou, moço”. Para chegar até ele, o Voz Pública atravessou 420 quilômetros de leito em três expedições. O que encontrou foi a radiografia de colapso silencioso — e, ao mesmo tempo, o retrato exato do que a ciência vem alertando desde 2014.
            </p>
            <p className="mb-5">
              Dados inéditos obtidos por Lei de Acesso mostram que, desde 2016, o volume de sedimento despejado no baixo curso cresceu 182%. A cada temporada seca, areia e silte se acumulam; a cada cheia, o rio tenta desviar e invade fazendas. O <em className="italic">leque aluvial</em> — o grande funil natural do Pantanal — virou um corredor sem limites.
            </p>
            <blockquote className="border-l-[3px] border-vp-accent py-2 pl-6 my-7 font-display text-[28px] leading-[1.25] italic text-vp-text">
              “O Taquari não está doente. Ele está sendo engolido por um modelo agropecuário que ignora a paisagem.”
              <footer className="font-sans text-[12px] not-italic text-vp-text-3 mt-3 tracking-[0.04em] uppercase">Débora Calheiros · hidróloga, Embrapa Pantanal</footer>
            </blockquote>
            <h2 className="font-display text-[32px] mt-8 mb-4 leading-[1.2]">Um plano parado há 11 anos</h2>
            <p className="mb-5">
              O “Programa de Revitalização do Taquari”, anunciado em 2015 pelo governo federal, previa R$ 480 milhões em oito anos. Até hoje, menos de 9% do orçamento foi executado. Documentos obtidos pela reportagem mostram que três secretários estaduais diferentes pediram retomada do programa — sem resposta.
            </p>

            {/* Data callout */}
            <div className="grid grid-cols-3 gap-[1px] bg-vp-border border border-vp-border my-7">
              {[
                ['182%','Aumento no sedimento despejado (2016–2025)'],
                ['R$ 480M','Previsto no plano federal — 9% executado'],
                ['420 km','Leito percorrido pela equipe'],
              ].map(([n,l]) => (
                <div key={n} className="bg-vp-surface p-5">
                  <div className="font-display text-[36px] leading-none font-bold text-vp-accent">{n}</div>
                  <div className="font-sans text-[12px] text-vp-text-2 mt-1.5 leading-[1.4]">{l}</div>
                </div>
              ))}
            </div>

            <p className="mb-5">
              No trecho entre São Gabriel do Oeste e Coxim, as margens mostram pivôs de irrigação a menos de cem metros da calha — o que contraria o Código Florestal. Procurada, a Semadesc informou que “acompanha a situação” e que novas autuações estão em curso. Em resposta enviada por e-mail, o Ministério do Meio Ambiente afirmou que o plano será “repactuado” neste semestre. Não há prazo.
            </p>
            <p>
              O restante desta reportagem está dividido em cinco capítulos — clique para navegar.
            </p>
          </div>

          {/* Chapter nav */}
          <div className="mt-7 border border-vp-border bg-vp-surface">
            {['01 · O leito que engoliu o rio','02 · Os donos da margem','03 · O plano que nunca saiu do papel','04 · Ciência: o que está em jogo','05 · O que pode ser feito'].map((c,i) => (
              <div key={i} className={`p-3.5 px-4.5 flex justify-between font-sans text-[14px] cursor-pointer hover:bg-vp-bg ${i < 4 ? 'border-b border-vp-border' : ''} ${i === 0 ? 'text-vp-accent' : 'text-vp-text-2'}`}>
                <span>{c}</span>
                <span className="meta">{['4 min','6 min','3 min','5 min','4 min'][i]}</span>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div className="mt-7 p-5 border border-vp-border bg-vp-accent-soft">
            <div className="eyebrow mb-2 text-[10px]">Metodologia</div>
            <p className="font-serif text-[14px] leading-[1.6] text-vp-text-2">
              Esta reportagem analisou 3.214 autos de infração do Ibama, 14 anos de dados hidrológicos da ANA e imagens de satélite Sentinel-2. Consultamos 22 fontes. Dados brutos e documentos estão disponíveis em <a className="text-vp-accent hover:underline cursor-pointer">github.com/vozpublicams/taquari</a>.
            </p>
          </div>

          {/* Comments */}
          <div className="mt-12 border-t border-vp-border pt-6">
            <div className="flex justify-between items-baseline mb-4.5">
              <h3 className="font-display text-[22px]">Comentários · 47</h3>
              <select className="vp-input w-[180px] text-[12px]" defaultValue="relevantes" aria-label="Ordernar comentários">
                <option value="relevantes">Mais relevantes</option>
                <option value="recentes">Mais recentes</option>
              </select>
            </div>
            
            <div className="flex gap-3 p-3.5 border border-vp-border mb-4.5 bg-vp-surface">
              <ImgPH label="" width={36} height={36} style={{ borderRadius: '50%' }} />
              <textarea className="vp-input flex-1 min-h-[70px] resize-y font-serif text-[14px]" placeholder="Compartilhe sua análise. Leia antes as regras de moderação." />
            </div>

            {[
              { n: 'Elza Morais', t: '12h', c: 'Sou de Coxim. O rio realmente mudou, e a cobertura de vocês é a primeira a ouvir ribeirinhos em vez de só fontes oficiais. Obrigada.', v: 34 },
              { n: 'João Vicentini', t: '8h', c: 'Faltou ouvir produtor rural da margem. O texto dá um recorte só.', v: 4 },
              { n: 'Ana Lúcia Paes', t: '6h', c: 'Publiquem os dados brutos em CSV, não só no repositório. Muita gente aqui não usa GitHub.', v: 22 },
            ].map((cm, i) => (
              <div key={i} className={`grid grid-cols-[40px_1fr] gap-3 pb-4.5 mb-4.5 ${i < 2 ? 'border-b border-vp-border' : ''}`}>
                <ImgPH label="" width={40} height={40} style={{ borderRadius: '50%' }} />
                <div>
                  <div className="font-sans text-[13px] text-vp-text font-semibold">{cm.n} <span className="text-vp-text-3 font-normal ml-2">· {cm.t}</span></div>
                  <p className="font-serif text-[15px] text-vp-text-2 leading-[1.55] my-1.5">{cm.c}</p>
                  <div className="font-sans text-[12px] text-vp-text-3 flex gap-4">
                    <span className="cursor-pointer hover:text-vp-accent">▲ {cm.v}</span>
                    <a className="cursor-pointer hover:text-vp-text">Responder</a>
                    <a className="cursor-pointer hover:text-vp-text">Denunciar</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="grid gap-5 self-start">
          <div className="vp-ad h-[250px]">300 × 250</div>
          
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-3">Leia também</h3>
            <ul className="list-none p-0 m-0 grid gap-3.5">
              {['Os donos das terras que mais desmatam no Pantanal','O mapa do fogo: MS em tempo real','Pesquisadores deixam Embrapa Pantanal por cortes','Governo federal destrava apenas 9% do plano'].map((h,i) => (
                <li key={i} className={`pb-3 ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                  <h4 className="font-display text-[14px] leading-[1.25] hover:text-vp-accent cursor-pointer">{h}</h4>
                  <div className="byline mt-1">há {i+2} dias</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-vp-surface p-4 border border-vp-border">
            <div className="eyebrow mb-1.5 text-[10px]">Apoie esta reportagem</div>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-2.5">8 meses de apuração foram pagos por 4.812 leitores. Seja um deles.</p>
            <button className="vp-btn vp-btn-primary w-full text-[12px]">Contribuir</button>
          </div>
        </aside>
      </article>

      <SiteFooter />
    </div>
  );
}
