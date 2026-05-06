// Home — Voz Pública MS
function Home() {
  return (
    <div className="vp-root" style={{ width: '100%', minHeight: '100%', background: 'var(--vp-bg)' }}>
      <Masthead />

      {/* Breaking/live strip */}
      <div style={{ borderBottom: '1px solid var(--vp-border)', background: 'var(--vp-surface)', padding: '9px 28px', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--vp-sans)', fontSize: 12 }}>
        <span className="vp-tag vp-tag-live">AO VIVO</span>
        <span style={{ color: 'var(--vp-text)', fontWeight: 600 }}>Assembleia aprova LDO 2027 em MS após 6 horas de sessão</span>
        <span style={{ color: 'var(--vp-text-3)', marginLeft: 'auto' }}>atualizado há 4 min</span>
      </div>

      {/* Top leaderboard ad */}
      <div style={{ padding: '16px 28px 0' }}>
        <div className="vp-ad" style={{ height: 90 }}>728 × 90 — LEADERBOARD</div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, padding: '24px 28px' }}>
        {/* Left / main column */}
        <div>
          {/* Hero */}
          <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28, paddingBottom: 28, borderBottom: '1px solid var(--vp-border)' }}>
            <div>
              <span className="eyebrow">Exclusivo · Investigação</span>
              <h1 className="vp-headline" style={{ fontSize: 46, marginTop: 10, marginBottom: 14 }}>
                Empresas do agro receberam R$ 2,1 bi do BNDES sem comprovar regularização ambiental
              </h1>
              <p style={{ fontSize: 17, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 16, fontFamily: 'var(--vp-serif)' }}>
                Levantamento do Voz Pública cruza dados do banco público com autuações do Ibama e revela que 38 grupos do sul de MS acessaram crédito subsidiado enquanto respondiam por desmatamento no Pantanal.
              </p>
              <div className="byline">
                Por <strong style={{ color: 'var(--vp-text)' }}>Marina Ribeiro</strong> e <strong style={{ color: 'var(--vp-text)' }}>Carlos Benites</strong> · 22 de abril, 06:00
              </div>
            </div>
            <div>
              <ImgPH label="capa · pantanal queimado" height={380} />
              <div className="meta" style={{ marginTop: 8, fontStyle: 'italic' }}>Vista aérea da Nhecolândia após focos de incêndio em 2025. Foto: Bruno Kelly / Voz Pública</div>
            </div>
          </section>

          {/* Secondary row — 3 up */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--vp-border)' }}>
            {[
              { tag: 'Política', h: 'Governador sanciona lei que amplia isenção para frigoríficos e gera reação no MP', b: 'Texto também cria grupo de trabalho sobre royalties do gás.' },
              { tag: 'Cidades · Campo Grande', h: 'Obra da Avenida Duque de Caxias atrasa 14 meses e custa 60% a mais', b: 'Relatório do TCE aponta aditivos sem justificativa técnica.' },
              { tag: 'Indígenas', h: '“Estão abrindo o mato com trator”: Guarani Kaiowá denunciam invasão em retomada', b: 'Fazendeiros da região negam e acionam Justiça.' },
            ].map((x, i) => (
              <article key={i}>
                <ImgPH label={x.tag} height={150} style={{ marginBottom: 12 }} />
                <span className="eyebrow" style={{ fontSize: 10 }}>{x.tag}</span>
                <h3 className="vp-headline" style={{ fontSize: 19, marginTop: 6, marginBottom: 8 }}>{x.h}</h3>
                <p style={{ fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.45 }}>{x.b}</p>
                <div className="byline" style={{ marginTop: 10 }}>Há 2h · 4 min de leitura</div>
              </article>
            ))}
          </section>

          {/* Pantanal / investigação em destaque — inverted */}
          <section style={{ padding: '28px 0', borderBottom: '1px solid var(--vp-border)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 18 }}>
              <h2 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 24 }}>Especial · Pantanal</h2>
              <div className="rule" style={{ flex: 1 }} />
              <a className="meta" style={{ color: 'var(--vp-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ver tudo →</a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
              <article>
                <ImgPH label="série · pantanal queimado" height={260} style={{ marginBottom: 14 }} />
                <span className="eyebrow">Parte 3 de 5</span>
                <h3 className="vp-headline" style={{ fontSize: 26, marginTop: 8, marginBottom: 10 }}>
                  O rio que sumiu: como o Taquari virou corredor de sedimentos
                </h3>
                <p style={{ fontSize: 15, color: 'var(--vp-text-2)', lineHeight: 1.5 }}>
                  Em oito meses de apuração, nossa equipe percorreu 420 km do leito e documentou o colapso do principal afluente do Pantanal sul.
                </p>
              </article>
              <div style={{ display: 'grid', gap: 18 }}>
                {[
                  'Cinco perguntas que o governo de MS não respondeu sobre o Plano de Manejo',
                  'Dados inéditos: 72% das autuações por queimada viram “dívida ativa” e prescrevem',
                  'Vídeo: o dia em que o fogo chegou na escola ribeirinha de Porto Murtinho',
                  'Quem são os donos das terras que mais desmatam no Pantanal de MS',
                ].map((h, i) => (
                  <article key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 14, paddingBottom: 14, borderBottom: i < 3 ? '1px solid var(--vp-border)' : 'none' }}>
                    <ImgPH label="" height={70} width={70} style={{ aspectRatio: 1 }} />
                    <div>
                      <h4 className="vp-headline" style={{ fontSize: 15, marginBottom: 6 }}>{h}</h4>
                      <div className="byline">Série Pantanal · {['há 3h','ontem','2 dias','3 dias'][i]}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Inline sponsor native */}
          <section style={{ padding: '20px 0', borderBottom: '1px solid var(--vp-border)' }}>
            <div className="vp-ad" style={{ height: 120, position: 'relative' }}>970 × 120 — BILLBOARD</div>
          </section>

          {/* Cidades / Política / Economia — 3 columns */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--vp-border)' }}>
            {[
              { name: 'Política', items: ['Oposição protocola CPI do Gás com 10 assinaturas', 'MP eleitoral arquiva investigação sobre deputado federal de MS', 'Prefeito de Dourados enfrenta 3ª tentativa de cassação'] },
              { name: 'Economia', items: ['Soja de MS fecha safra com alta de 12% e recorde de exportação', 'Nova fábrica de celulose em Ribas terá investimento de R$ 8,4 bi', 'Desemprego cai para 4,1% mas informalidade chega a 39%'] },
              { name: 'Cidades', items: ['Campo Grande terá BRT na Afonso Pena a partir de agosto', 'Três Lagoas perde ônibus urbano após falência de concessionária', 'Corumbá decreta situação de emergência por falta d\u2019água'] },
            ].map(col => (
              <div key={col.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 6, height: 6, background: 'var(--vp-accent)', transform: 'rotate(45deg)' }} />
                  <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>{col.name}</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
                  {col.items.map((h, i) => (
                    <li key={i} style={{ paddingBottom: 14, borderBottom: i < col.items.length-1 ? '1px solid var(--vp-border)' : 'none' }}>
                      <h4 className="vp-headline" style={{ fontSize: 16, marginBottom: 6 }}>{h}</h4>
                      <div className="byline">por {['L. Mattos','A. Figueira','R. Duarte'][i]} · há {3+i}h</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Colunistas */}
          <section style={{ padding: '28px 0', borderBottom: '1px solid var(--vp-border)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 24 }}>Opinião &amp; Colunistas</h2>
              <div className="rule" style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[
                { n: 'Tereza Mattos', t: 'O silêncio cúmplice da bancada ruralista', tag: 'Política' },
                { n: 'Ademir Paredão', t: 'Campo Grande precisa decidir que cidade quer ser', tag: 'Cidades' },
                { n: 'Sandra Yoko', t: 'Por que a MP da reforma tributária penaliza MS', tag: 'Economia' },
                { n: 'Jair Kaiowá', t: 'Retomadas não são invasão — são memória', tag: 'Indígenas' },
              ].map((c, i) => (
                <article key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 12 }}>
                  <ImgPH label="" width={52} height={52} style={{ borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vp-accent)', fontWeight: 700 }}>{c.tag}</div>
                    <h4 className="vp-headline" style={{ fontSize: 15, margin: '4px 0 8px', fontStyle: 'italic' }}>“{c.t}”</h4>
                    <div className="byline" style={{ fontWeight: 600, color: 'var(--vp-text-2)' }}>{c.n}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Mais lidas + Podcast */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, padding: '28px 0' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 16 }}>Mais lidas da semana</h3>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
                {[
                  'Raio-X: o patrimônio dos 24 deputados estaduais de MS',
                  '“Temos medo de denunciar”: relato de servidoras do Detran-MS',
                  'Como o PCC se instalou nas cidades de fronteira de MS',
                  'Por que a água de Campo Grande custa mais que a de São Paulo',
                  'O mapa dos incêndios no Pantanal atualizado em tempo real',
                ].map((h, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14, paddingBottom: 12, borderBottom: i < 4 ? '1px solid var(--vp-border)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 28, fontWeight: 700, color: 'var(--vp-accent)', lineHeight: 1 }}>{i+1}</span>
                    <h4 className="vp-headline" style={{ fontSize: 15 }}>{h}</h4>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 16 }}>Podcast · Voz Alta</h3>
              <ImgPH label="capa do episódio" height={200} style={{ marginBottom: 14 }} />
              <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Episódio 042 · 38 min</div>
              <h4 className="vp-headline" style={{ fontSize: 22, margin: '8px 0 10px' }}>O que a prisão do deputado X revela sobre o esquema do gás</h4>
              <p style={{ fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 14 }}>Conversa com a repórter Marina Ribeiro sobre 4 meses de apuração.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'var(--vp-surface)', border: '1px solid var(--vp-border)' }}>
                <button style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--vp-accent)', border: 'none', color: '#1a1a19', cursor: 'pointer' }}>▶</button>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 3, background: 'var(--vp-border-2)', borderRadius: 2, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: 'var(--vp-accent)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--vp-mono)', fontSize: 10, color: 'var(--vp-text-3)' }}>
                    <span>12:14</span><span>38:22</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside style={{ display: 'grid', gap: 24, alignSelf: 'start' }}>
          {/* Doação banner — ProPublica-style */}
          <div style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Sem donos. Sem paywall.</div>
            <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, marginBottom: 10, lineHeight: 1.15 }}>
              Jornalismo de MS que você pode confiar.
            </h3>
            <p style={{ fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 14 }}>
              Somos sustentados por leitores. 4.812 apoiadores até hoje.
            </p>
            <button className="vp-btn vp-btn-primary" style={{ width: '100%' }}>Apoie o Voz Pública →</button>
          </div>

          {/* Sidebar ad */}
          <div className="vp-ad" style={{ height: 250 }}>300 × 250</div>

          {/* Agenda */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 6, height: 6, background: 'var(--vp-accent)', transform: 'rotate(45deg)' }} />
              <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Agenda pública</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12, fontSize: 13 }}>
              {[
                ['09:00', 'ALMS', 'Votação do PL 124/26 (educação)'],
                ['14:30', 'TJ-MS', 'Habeas corpus — ex-secretário da Saúde'],
                ['16:00', 'MPMS', 'Audiência pública — Pantanal'],
                ['19:00', 'Câmara CG', 'LOA 2027 — 2ª discussão'],
              ].map(([t,o,d],i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, paddingBottom: 10, borderBottom: i < 3 ? '1px solid var(--vp-border)' : 'none' }}>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--vp-accent)', fontWeight: 700 }}>{t}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vp-text-3)' }}>{o}</div>
                    <div style={{ color: 'var(--vp-text-2)' }}>{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ background: 'var(--vp-surface)', padding: 20, border: '1px solid var(--vp-border)' }}>
            <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 19, marginBottom: 8 }}>Newsletter · A Semana em MS</h3>
            <p style={{ fontSize: 12, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 12 }}>Sábado de manhã, de graça. O que importou em Mato Grosso do Sul.</p>
            <input className="vp-input" placeholder="seu@email.com.br" style={{ marginBottom: 8 }} />
            <button className="vp-btn vp-btn-primary" style={{ width: '100%' }}>Quero receber</button>
          </div>

          {/* Sidebar ad 2 */}
          <div className="vp-ad" style={{ height: 600 }}>300 × 600 — SKYSCRAPER</div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

Object.assign(window, { Home });
