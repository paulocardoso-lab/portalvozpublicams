import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';

export function DesktopHome() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <SiteHeader />

      {/* Breaking/live strip */}
      <div className="border-b border-vp-border bg-vp-surface px-7 py-2.5 flex items-center gap-3.5 font-sans text-[12px]">
        <span className="vp-tag vp-tag-live shrink-0">AO VIVO</span>
        <span className="text-vp-text font-semibold">Assembleia aprova LDO 2027 em MS após 6 horas de sessão</span>
        <span className="text-vp-text-3 ml-auto shrink-0">atualizado há 4 min</span>
      </div>

      {/* Top leaderboard ad */}
      <div className="px-7 pt-4">
        <div className="vp-ad h-[90px]">728 × 90 — LEADERBOARD</div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-8 px-7 py-6 max-w-[1440px] mx-auto w-full">
        {/* Left / main column */}
        <div>
          {/* Hero */}
          <section className="grid grid-cols-[1.1fr_1fr] gap-7 pb-7 border-b border-vp-border">
            <div>
              <span className="eyebrow text-[10px]">Exclusivo · Investigação</span>
              <h1 className="font-display text-[46px] leading-[1.05] mt-2.5 mb-3.5 tracking-[-0.01em]">
                Empresas do agro receberam R$ 2,1 bi do BNDES sem comprovar regularização ambiental
              </h1>
              <p className="font-serif text-[17px] text-vp-text-2 leading-[1.5] mb-4 text-pretty">
                Levantamento do Voz Pública cruza dados do banco público com autuações do Ibama e revela que 38 grupos do sul de MS acessaram crédito subsidiado enquanto respondiam por desmatamento no Pantanal.
              </p>
              <div className="byline text-[11px]">
                Por <strong className="text-vp-text">Marina Ribeiro</strong> e <strong className="text-vp-text">Carlos Benites</strong> · 22 de abril, 06:00
              </div>
            </div>
            <div>
              <ImgPH label="capa · pantanal queimado" height={380} />
              <div className="meta mt-2 italic text-[11px]">Vista aérea da Nhecolândia após focos de incêndio em 2025. Foto: Bruno Kelly / Voz Pública</div>
            </div>
          </section>

          {/* Secondary row — 3 up */}
          <section className="grid grid-cols-3 gap-6 py-7 border-b border-vp-border">
            {[
              { tag: 'Política', h: 'Governador sanciona lei que amplia isenção para frigoríficos e gera reação no MP', b: 'Texto também cria grupo de trabalho sobre royalties do gás.' },
              { tag: 'Cidades · Campo Grande', h: 'Obra da Avenida Duque de Caxias atrasa 14 meses e custa 60% a mais', b: 'Relatório do TCE aponta aditivos sem justificativa técnica.' },
              { tag: 'Indígenas', h: '“Estão abrindo o mato com trator”: Guarani Kaiowá denunciam invasão em retomada', b: 'Fazendeiros da região negam e acionam Justiça.' },
            ].map((x, i) => (
              <article key={i}>
                <ImgPH label={x.tag} height={150} style={{ marginBottom: 12 }} />
                <span className="eyebrow text-[10px]">{x.tag}</span>
                <h3 className="font-display text-[19px] leading-[1.15] mt-1.5 mb-2 hover:text-vp-accent cursor-pointer">{x.h}</h3>
                <p className="font-serif text-[14px] text-vp-text-2 leading-[1.45] text-pretty">{x.b}</p>
                <div className="byline text-[11px] mt-2.5">Há 2h · 4 min de leitura</div>
              </article>
            ))}
          </section>

          {/* Pantanal / investigação em destaque */}
          <section className="py-7 border-b border-vp-border">
            <div className="flex items-baseline gap-4 mb-4.5">
              <h2 className="font-display text-[24px]">Especial · Pantanal</h2>
              <div className="flex-1 h-[1px] bg-vp-border" />
              <a className="text-[11px] text-vp-accent tracking-[0.1em] uppercase cursor-pointer hover:underline">Ver tudo →</a>
            </div>

            <div className="grid grid-cols-2 gap-7">
              <article>
                <ImgPH label="série · pantanal queimado" height={260} style={{ marginBottom: 14 }} />
                <span className="eyebrow text-[10px]">Parte 3 de 5</span>
                <h3 className="font-display text-[26px] leading-[1.15] mt-2 mb-2.5 hover:text-vp-accent cursor-pointer">
                  O rio que sumiu: como o Taquari virou corredor de sedimentos
                </h3>
                <p className="font-serif text-[15px] text-vp-text-2 leading-[1.5] text-pretty">
                  Em oito meses de apuração, nossa equipe percorreu 420 km do leito e documentou o colapso do principal afluente do Pantanal sul.
                </p>
              </article>
              <div className="grid gap-4.5">
                {[
                  'Cinco perguntas que o governo de MS não respondeu sobre o Plano de Manejo',
                  'Dados inéditos: 72% das autuações por queimada viram “dívida ativa” e prescrevem',
                  'Vídeo: o dia em que o fogo chegou na escola ribeirinha de Porto Murtinho',
                  'Quem são os donos das terras que mais desmatam no Pantanal de MS',
                ].map((h, i) => (
                  <article key={i} className={`grid grid-cols-[70px_1fr] gap-3.5 pb-3.5 ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                    <ImgPH label="" height={70} width={70} style={{ aspectRatio: '1/1' }} />
                    <div>
                      <h4 className="font-display text-[15px] leading-[1.2] mb-1.5 hover:text-vp-accent cursor-pointer">{h}</h4>
                      <div className="byline text-[11px]">Série Pantanal · {['há 3h','ontem','2 dias','3 dias'][i]}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Inline sponsor native */}
          <section className="py-5 border-b border-vp-border">
            <div className="vp-ad h-[120px] relative">970 × 120 — BILLBOARD</div>
          </section>

          {/* Cidades / Política / Economia — 3 columns */}
          <section className="grid grid-cols-3 gap-6 py-7 border-b border-vp-border">
            {[
              { name: 'Política', items: ['Oposição protocola CPI do Gás com 10 assinaturas', 'MP eleitoral arquiva investigação sobre deputado federal de MS', 'Prefeito de Dourados enfrenta 3ª tentativa de cassação'] },
              { name: 'Economia', items: ['Soja de MS fecha safra com alta de 12% e recorde de exportação', 'Nova fábrica de celulose em Ribas terá investimento de R$ 8,4 bi', 'Desemprego cai para 4,1% mas informalidade chega a 39%'] },
              { name: 'Cidades', items: ['Campo Grande terá BRT na Afonso Pena a partir de agosto', 'Três Lagoas perde ônibus urbano após falência de concessionária', 'Corumbá decreta situação de emergência por falta d\'água'] },
            ].map(col => (
              <div key={col.name}>
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
                  <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">{col.name}</h3>
                </div>
                <ul className="list-none p-0 m-0 grid gap-3.5">
                  {col.items.map((h, i) => (
                    <li key={i} className={`pb-3.5 ${i < col.items.length-1 ? 'border-b border-vp-border' : ''}`}>
                      <h4 className="font-display text-[16px] leading-[1.2] mb-1.5 hover:text-vp-accent cursor-pointer text-balance">{h}</h4>
                      <div className="byline text-[11px]">por {['L. Mattos','A. Figueira','R. Duarte'][i]} · há {3+i}h</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Colunistas */}
          <section className="py-7 border-b border-vp-border">
            <div className="flex items-baseline gap-4 mb-5">
              <h2 className="font-display text-[24px]">Opinião &amp; Colunistas</h2>
              <div className="flex-1 h-[1px] bg-vp-border" />
            </div>
            <div className="grid grid-cols-4 gap-5">
              {[
                { n: 'Tereza Mattos', t: 'O silêncio cúmplice da bancada ruralista', tag: 'Política' },
                { n: 'Ademir Paredão', t: 'Campo Grande precisa decidir que cidade quer ser', tag: 'Cidades' },
                { n: 'Sandra Yoko', t: 'Por que a MP da reforma tributária penaliza MS', tag: 'Economia' },
                { n: 'Jair Kaiowá', t: 'Retomadas não são invasão — são memória', tag: 'Indígenas' },
              ].map((c, i) => (
                <article key={i} className="grid grid-cols-[52px_1fr] gap-3">
                  <ImgPH label="" width={52} height={52} style={{ borderRadius: '50%' }} />
                  <div>
                    <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-vp-accent font-bold">{c.tag}</div>
                    <h4 className="font-display text-[15px] leading-[1.25] my-1 font-serif italic hover:text-vp-accent cursor-pointer">“{c.t}”</h4>
                    <div className="byline font-semibold text-vp-text-2 text-[11px]">{c.n}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Mais lidas + Podcast */}
          <section className="grid grid-cols-2 gap-9 py-7">
            <div>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-4">Mais lidas da semana</h3>
              <ol className="list-none p-0 m-0 grid gap-3.5">
                {[
                  'Raio-X: o patrimônio dos 24 deputados estaduais de MS',
                  '“Temos medo de denunciar”: relato de servidoras do Detran-MS',
                  'Como o PCC se instalou nas cidades de fronteira de MS',
                  'Por que a água de Campo Grande custa mais que a de São Paulo',
                  'O mapa dos incêndios no Pantanal atualizado em tempo real',
                ].map((h, i) => (
                  <li key={i} className={`grid grid-cols-[36px_1fr] gap-3.5 pb-3 ${i < 4 ? 'border-b border-vp-border' : ''}`}>
                    <span className="font-display text-[28px] font-bold text-vp-accent leading-none">{i+1}</span>
                    <h4 className="font-display text-[15px] leading-[1.25] hover:text-vp-accent cursor-pointer">{h}</h4>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-4">Podcast · Voz Alta</h3>
              <ImgPH label="capa do episódio" height={200} style={{ marginBottom: 14 }} />
              <div className="font-sans text-[11px] text-vp-text-3 tracking-[0.08em] uppercase">Episódio 042 · 38 min</div>
              <h4 className="font-display text-[22px] leading-[1.2] my-2 hover:text-vp-accent cursor-pointer">O que a prisão do deputado X revela sobre o esquema do gás</h4>
              <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-3.5">Conversa com a repórter Marina Ribeiro sobre 4 meses de apuração.</p>
              <div className="flex items-center gap-2.5 p-3 bg-vp-surface border border-vp-border">
                <button aria-label="Play" className="w-9 h-9 rounded-full bg-vp-accent border-none text-[#1a1a19] cursor-pointer flex items-center justify-center pl-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div className="flex-1">
                  <div className="h-[3px] bg-vp-border-2 rounded-sm relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[32%] bg-vp-accent" />
                  </div>
                  <div className="flex justify-between mt-1.5 font-mono text-[10px] text-vp-text-3">
                    <span>12:14</span><span>38:22</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="grid gap-6 self-start">
          {/* Doação banner */}
          <div className="bg-vp-surface border border-vp-border p-5">
            <div className="eyebrow mb-2 text-[10px]">Sem donos. Sem paywall.</div>
            <h3 className="font-display text-[22px] mb-2.5 leading-[1.15]">
              Jornalismo de MS que você pode confiar.
            </h3>
            <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5] mb-3.5">
              Somos sustentados por leitores. 4.812 apoiadores até hoje.
            </p>
            <button className="vp-btn vp-btn-primary w-full text-[13px]">Apoie o Voz Pública →</button>
          </div>

          {/* Sidebar ad */}
          <div className="vp-ad h-[250px]">300 × 250</div>

          {/* Agenda */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-vp-accent rotate-45" />
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold">Agenda pública</h3>
            </div>
            <ul className="list-none p-0 m-0 grid gap-3 text-[13px]">
              {[
                ['09:00', 'ALMS', 'Votação do PL 124/26 (educação)'],
                ['14:30', 'TJ-MS', 'Habeas corpus — ex-secretário da Saúde'],
                ['16:00', 'MPMS', 'Audiência pública — Pantanal'],
                ['19:00', 'Câmara CG', 'LOA 2027 — 2ª discussão'],
              ].map(([t,o,d],i) => (
                <li key={i} className={`grid grid-cols-[44px_1fr] gap-2.5 pb-2.5 ${i < 3 ? 'border-b border-vp-border' : ''}`}>
                  <span className="font-mono text-[13px] text-vp-accent font-bold">{t}</span>
                  <div>
                    <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-vp-text-3">{o}</div>
                    <div className="text-vp-text-2 font-serif text-[13px]">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-vp-surface p-5 border border-vp-border">
            <h3 className="font-display text-[19px] mb-2 leading-[1.2]">Newsletter · A Semana em MS</h3>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-3">Sábado de manhã, de graça. O que importou em Mato Grosso do Sul.</p>
            <input className="vp-input w-full mb-2 text-[13px]" placeholder="seu@email.com.br" />
            <button className="vp-btn vp-btn-primary w-full text-[13px]">Quero receber</button>
          </div>

          {/* Sidebar ad 2 */}
          <div className="vp-ad h-[600px]">300 × 600 — SKYSCRAPER</div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
