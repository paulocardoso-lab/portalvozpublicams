// Section page (editoria)
function Section() {
  return (
    <div className="vp-root" style={{ width: '100%', minHeight: '100%', background: 'var(--vp-bg)' }}>
      <Masthead />

      {/* Section hero */}
      <div style={{ borderBottom: '2px solid var(--vp-text)', padding: '40px 28px 28px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Editoria</div>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 72, letterSpacing: '-0.02em', marginBottom: 14 }}>Pantanal</h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 18, color: 'var(--vp-text-2)', maxWidth: 640, lineHeight: 1.5 }}>
            Cobertura contínua do maior bioma alagado do planeta — ciência, política, terra e as pessoas que vivem entre os rios.
          </p>
          <div style={{ marginTop: 18, display: 'flex', gap: 18, fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text-3)' }}>
            <span>342 reportagens</span><span>·</span><span>14 repórteres</span><span>·</span><span>3 séries abertas</span>
          </div>
        </div>
      </div>

      {/* Subnav */}
      <div style={{ borderBottom: '1px solid var(--vp-border)', padding: '0 28px', display: 'flex', gap: 22, fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {['Todos','Investigações','Dados','Séries','Vídeo','Opinião'].map((t,i) => (
          <a key={t} style={{ padding: '14px 0', borderBottom: i===0 ? '2px solid var(--vp-accent)' : '2px solid transparent', color: i===0 ? 'var(--vp-accent)' : undefined, fontWeight: 600 }}>{t}</a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, padding: '28px', maxWidth: 1400, margin: '0 auto' }}>
        <div>
          {/* Featured */}
          <article style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, paddingBottom: 28, borderBottom: '1px solid var(--vp-border)' }}>
            <ImgPH label="destaque · especial pantanal" height={340} />
            <div>
              <span className="eyebrow">Série · Parte 3 de 5</span>
              <h2 style={{ fontSize: 38, margin: '10px 0 14px', lineHeight: 1.05 }}>O rio que sumiu: como o Taquari virou corredor de sedimentos</h2>
              <p style={{ fontSize: 16, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 14 }}>Oito meses de apuração e 420 km de leito percorridos revelam o colapso silencioso do principal afluente.</p>
              <div className="byline">Marina Ribeiro e Carlos Benites · 22 abr</div>
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
            <article key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 22, padding: '22px 0', borderBottom: '1px solid var(--vp-border)', alignItems: 'start' }}>
              <ImgPH label={x.tag} height={130} />
              <div>
                <span className="eyebrow" style={{ fontSize: 10 }}>{x.tag}</span>
                <h3 className="vp-headline" style={{ fontSize: 22, margin: '6px 0 8px' }}>{x.h}</h3>
                <p style={{ fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.5 }}>{x.b}</p>
                <div className="byline" style={{ marginTop: 10 }}>por {x.a} · {x.t}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span className="meta">5 min</span>
                <span className="meta">128 coment.</span>
              </div>
            </article>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: '28px 0', fontFamily: 'var(--vp-sans)', fontSize: 13 }}>
            {['1','2','3','4','…','29'].map((n,i) => (
              <button key={i} className="vp-btn" style={{ minWidth: 36, padding: '6px 10px', background: i===0 ? 'var(--vp-surface-2)' : 'transparent' }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'grid', gap: 22, alignSelf: 'start' }}>
          <div className="vp-ad" style={{ height: 250 }}>300 × 250</div>
          <div style={{ background: 'var(--vp-surface)', padding: 16, border: '1px solid var(--vp-border)' }}>
            <h4 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 18, marginBottom: 10 }}>Repórteres desta editoria</h4>
            {['Marina Ribeiro','Carlos Benites','Lucas Fragoso','Ana Figueira'].map((n,i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i>0 ? '1px solid var(--vp-border)' : 'none' }}>
                <ImgPH label="" width={32} height={32} style={{ borderRadius: '50%' }} />
                <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 13 }}>{n}</div>
              </div>
            ))}
          </div>
          <div className="vp-ad" style={{ height: 600 }}>300 × 600</div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

// Columnist page
function Columnist() {
  return (
    <div className="vp-root" style={{ width: '100%', minHeight: '100%', background: 'var(--vp-bg)' }}>
      <Masthead />

      {/* Hero columnist */}
      <div style={{ borderBottom: '1px solid var(--vp-border)', padding: '40px 28px', background: 'var(--vp-surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 28, alignItems: 'center' }}>
          <ImgPH label="" width={160} height={160} style={{ borderRadius: '50%' }} />
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Colunista · Política</div>
            <h1 style={{ fontSize: 56, letterSpacing: '-0.02em', marginBottom: 10 }}>Tereza Mattos</h1>
            <p style={{ fontFamily: 'var(--vp-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--vp-text-2)', maxWidth: 640, lineHeight: 1.5 }}>
              Jornalista há 24 anos, cobre o Legislativo de MS desde 2008. Autora de “A República do Boi”.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, fontFamily: 'var(--vp-sans)', fontSize: 12 }}>
              <a style={{ color: 'var(--vp-text-3)' }}>tereza@vozpublicams.com.br</a>
              <span style={{ color: 'var(--vp-text-4)' }}>·</span>
              <a style={{ color: 'var(--vp-text-3)' }}>@terezamattos</a>
            </div>
          </div>
          <div>
            <button className="vp-btn vp-btn-primary">Assinar coluna</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, padding: '28px', maxWidth: 1300, margin: '0 auto' }}>
        <div>
          {/* Latest column */}
          <article style={{ paddingBottom: 28, borderBottom: '1px solid var(--vp-border)' }}>
            <span className="eyebrow">Coluna de hoje · 22 abr</span>
            <h2 style={{ fontSize: 40, margin: '10px 0 14px', lineHeight: 1.1, fontStyle: 'italic' }}>“O silêncio cúmplice da bancada ruralista”</h2>
            <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 19, color: 'var(--vp-text-2)', lineHeight: 1.6, marginBottom: 14 }}>
              Nenhum dos oito deputados federais de MS se manifestou sobre o relatório do TCU que apontou falhas graves na fiscalização ambiental do Pantanal. O silêncio, neste caso, é posição — e cara a quem vota.
            </p>
            <a className="vp-btn" style={{ display: 'inline-block' }}>Ler coluna completa →</a>
          </article>

          {/* Archive */}
          <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, margin: '28px 0 16px' }}>Colunas recentes</h3>
          {[
            { t: '“Não é CPI do gás. É CPI do silêncio.”', d: '20 abr', e: 'Sobre os dois anos sem decisão na ALMS.' },
            { t: '“O que MS perde ao não ter uma política de dados”', d: '17 abr', e: 'Transparência se faz com planilha aberta — não com cartilha.' },
            { t: '“Três erros da oposição no caso do ex-secretário”', d: '14 abr', e: 'Falta de estratégia comum deixa governo confortável.' },
            { t: '“A eleição começa no interior. De novo.”', d: '11 abr', e: 'Mapa das convenções de partidos sinaliza reagrupamento.' },
          ].map((c,i) => (
            <article key={i} style={{ padding: '18px 0', borderBottom: '1px solid var(--vp-border)', display: 'grid', gridTemplateColumns: '60px 1fr', gap: 18 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--vp-text-3)', letterSpacing: '0.08em' }}>{c.d}</div>
              <div>
                <h4 className="vp-headline" style={{ fontSize: 22, fontStyle: 'italic', marginBottom: 6 }}>{c.t}</h4>
                <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.5 }}>{c.e}</p>
              </div>
            </article>
          ))}
        </div>

        <aside style={{ display: 'grid', gap: 22, alignSelf: 'start' }}>
          <div style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', padding: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Sobre a coluna</div>
            <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.55 }}>
              Publicada às terças, quintas e domingos. 218 textos no arquivo. 18.420 assinantes recebem por e-mail.
            </p>
          </div>
          <div className="vp-ad" style={{ height: 250 }}>300 × 250</div>
          <div>
            <h4 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 12 }}>Tags mais usadas</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['ALMS','Governo','Orçamento','Agro','Pantanal','Oposição','PT','PP','PSDB','Eleições 2026','Justiça'].map(t => (
                <span key={t} className="vp-tag vp-tag-outline">{t}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

// Search page
function Search() {
  return (
    <div className="vp-root" style={{ width: '100%', minHeight: '100%', background: 'var(--vp-bg)' }}>
      <Masthead />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <input className="vp-input" defaultValue="pantanal taquari" style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 28, padding: '14px 18px', background: 'var(--vp-bg)', borderWidth: 2 }} />
          <button className="vp-btn vp-btn-primary" style={{ padding: '0 22px', fontSize: 14 }}>Buscar</button>
        </div>
        <div className="byline" style={{ marginBottom: 24 }}>Cerca de <strong style={{ color: 'var(--vp-text)' }}>312 resultados</strong> · 0,12s</div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>
          {/* Filters */}
          <div style={{ display: 'grid', gap: 20, alignSelf: 'start', fontFamily: 'var(--vp-sans)', fontSize: 13 }}>
            <div>
              <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 10 }}>Tipo</h4>
              {['Reportagem','Coluna','Vídeo','Podcast','Dados'].map((x,i) => (
                <label key={x} style={{ display: 'flex', gap: 8, padding: '4px 0', color: 'var(--vp-text-2)' }}>
                  <input type="checkbox" defaultChecked={i<3} /> {x}
                </label>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 10 }}>Editoria</h4>
              {['Pantanal','Política','Cidades','Indígenas'].map(x => (
                <label key={x} style={{ display: 'flex', gap: 8, padding: '4px 0', color: 'var(--vp-text-2)' }}>
                  <input type="checkbox" /> {x}
                </label>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 10 }}>Período</h4>
              {['Últimos 7 dias','Último mês','Último ano','Tudo'].map((x,i) => (
                <label key={x} style={{ display: 'flex', gap: 8, padding: '4px 0', color: 'var(--vp-text-2)' }}>
                  <input type="radio" name="p" defaultChecked={i===2} /> {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            {[
              { h:'O rio que sumiu: como o Taquari virou corredor de sedimentos', e:'Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do <mark>Pantanal</mark> sul e documentou o colapso do <mark>Taquari</mark>…', m:'Pantanal · Reportagem · 22 abr' },
              { h:'Cinco perguntas sobre o Plano de Manejo do Pantanal que MS não responde', e:'Reportagem pediu posição ao governo em sete ocasiões sobre o <mark>Pantanal</mark> e o rio <mark>Taquari</mark>…', m:'Pantanal · Reportagem · 15 abr' },
              { h:'Pesquisadores deixam Embrapa Pantanal após 3º ano de cortes', e:'Quadro de cientistas do <mark>Pantanal</mark> encolheu 55% desde 2022, incluindo equipe que monitorava o <mark>Taquari</mark>…', m:'Pantanal · Reportagem · 08 abr' },
              { h:'Dados · 72% das autuações por queimada prescrevem em MS', e:'Cruzamento cobre toda a bacia do <mark>Taquari</mark> e revela padrão em toda extensão do <mark>Pantanal</mark>…', m:'Dados · 02 abr' },
            ].map((r,i) => (
              <article key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--vp-border)' }}>
                <div className="meta" style={{ marginBottom: 4 }}>{r.m}</div>
                <h3 className="vp-headline" style={{ fontSize: 22, marginBottom: 6 }}>{r.h}</h3>
                <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, color: 'var(--vp-text-2)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: r.e }} />
              </article>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

Object.assign(window, { Section, Columnist, Search });
