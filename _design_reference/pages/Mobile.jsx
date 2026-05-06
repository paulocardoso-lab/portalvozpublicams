// Mobile screens for Voz Pública MS
// Designed at 390px (iPhone 14 standard). Place inside <IPhoneFrame>.

function MobileMasthead({ title }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--vp-bg)', borderBottom: '1px solid var(--vp-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0, cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          {title ? (
            <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--vp-accent)' }}>{title}</div>
          ) : (
            <Monogram size="sm" />
          )}
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0, cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>
      {/* Edition strip */}
      <div style={{ padding: '6px 16px', borderTop: '1px solid var(--vp-border)', fontFamily: 'var(--vp-sans)', fontSize: 10, color: 'var(--vp-text-3)', display: 'flex', justifyContent: 'space-between', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span>Quarta · 22 abr</span>
        <span className="mono">USD 5,12 · BOI 302,40</span>
      </div>
    </div>
  );
}

function MobileEditoriaScroller() {
  const items = ['Para você','Pantanal','Política','Cidades','Indígenas','Agro','Economia','Segurança'];
  return (
    <div style={{ borderBottom: '1px solid var(--vp-border)', display: 'flex', overflowX: 'auto', padding: '0 12px', gap: 4, scrollbarWidth: 'none' }}>
      {items.map((t,i) => (
        <a key={t} style={{
          padding: '12px 12px',
          fontFamily: 'var(--vp-sans)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: i === 0 ? 'var(--vp-accent)' : 'var(--vp-text-2)',
          borderBottom: i === 0 ? '2px solid var(--vp-accent)' : '2px solid transparent',
          whiteSpace: 'nowrap',
        }}>{t}</a>
      ))}
    </div>
  );
}

function MobileTabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home',     l: 'Capa',     i: 'M3 12 12 4l9 8M5 10v10h14V10' },
    { id: 'sections', l: 'Editorias',i: 'M4 6h16M4 12h16M4 18h10' },
    { id: 'live',     l: 'Ao vivo',  live: true },
    { id: 'saved',    l: 'Salvos',   i: 'M6 4h12v18l-6-4-6 4z' },
    { id: 'me',       l: 'Eu',       i: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0' },
  ];
  return (
    <div style={{ position: 'sticky', bottom: 0, background: 'var(--vp-bg)', borderTop: '1px solid var(--vp-border)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '6px 0 8px' }}>
      {tabs.map(t => (
        <a key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0', color: t.id === active ? 'var(--vp-accent)' : 'var(--vp-text-3)' }}>
          {t.live ? (
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--vp-urgent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--vp-sans)', fontSize: 7, fontWeight: 800, color: '#fff', animation: 'vp-pulse 2s infinite' }}>●</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={t.i}/></svg>
          )}
          <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 9, fontWeight: 600, letterSpacing: '0.04em' }}>{t.l}</span>
        </a>
      ))}
    </div>
  );
}

function MobileHome() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <MobileMasthead />
      <MobileEditoriaScroller />

      {/* Live strip */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--vp-border)' }}>
        <span className="vp-tag vp-tag-live" style={{ flexShrink: 0 }}>AO VIVO</span>
        <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text)', fontWeight: 600, lineHeight: 1.3 }}>ALMS aprova LDO 2027 após 6h de sessão</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        {/* Hero */}
        <article style={{ padding: '18px 16px', borderBottom: '1px solid var(--vp-border)' }}>
          <ImgPH label="capa" height={200} style={{ marginBottom: 12 }} />
          <span className="eyebrow" style={{ fontSize: 10 }}>Exclusivo · Investigação</span>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 24, lineHeight: 1.1, margin: '8px 0 10px', letterSpacing: '-0.01em' }}>
            Empresas do agro receberam R$ 2,1 bi do BNDES sem regularização ambiental
          </h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 10 }}>
            Levantamento cruza dados do banco com autuações do Ibama e revela 38 grupos do sul de MS.
          </p>
          <div className="byline">Marina Ribeiro e Carlos Benites · 06:00</div>
        </article>

        {/* Donate banner */}
        <div style={{ background: 'var(--vp-surface)', padding: 16, borderBottom: '1px solid var(--vp-border)' }}>
          <div className="eyebrow" style={{ marginBottom: 4, fontSize: 10 }}>Sem donos. Sem paywall.</div>
          <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 17, lineHeight: 1.2, marginBottom: 10 }}>4.812 leitores sustentam este jornalismo. Você pode ser o próximo.</div>
          <button className="vp-btn vp-btn-primary" style={{ width: '100%', fontSize: 12 }}>Apoiar com R$ 19/mês</button>
        </div>

        {/* List items */}
        {[
          { tag:'Política', h:'Governador sanciona lei que amplia isenção para frigoríficos', t:'há 2h' },
          { tag:'Cidades · CG', h:'Obra da Duque de Caxias atrasa 14 meses e custa 60% a mais', t:'há 3h' },
          { tag:'Indígenas', h:'“Estão abrindo o mato com trator”: Guarani Kaiowá denunciam invasão', t:'há 4h' },
        ].map((x,i) => (
          <article key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--vp-border)', display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12 }}>
            <div>
              <span className="eyebrow" style={{ fontSize: 9 }}>{x.tag}</span>
              <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 16, lineHeight: 1.2, margin: '4px 0 6px' }}>{x.h}</h3>
              <div className="byline" style={{ fontSize: 11 }}>{x.t} · 4 min</div>
            </div>
            <ImgPH label="" height={80} />
          </article>
        ))}

        {/* Inline ad */}
        <div style={{ padding: 12, background: 'var(--vp-bg)' }}>
          <div className="vp-ad" style={{ height: 100 }}>320 × 100</div>
        </div>

        {/* Section header */}
        <div style={{ padding: '18px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 6, height: 6, background: 'var(--vp-accent)', transform: 'rotate(45deg)' }} />
          <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>Especial · Pantanal</h3>
          <a className="meta" style={{ marginLeft: 'auto', color: 'var(--vp-accent)' }}>Ver tudo →</a>
        </div>
        <article style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--vp-border)' }}>
          <ImgPH label="série · pantanal" height={170} style={{ marginBottom: 10 }} />
          <span className="eyebrow" style={{ fontSize: 10 }}>Parte 3 de 5</span>
          <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 19, lineHeight: 1.15, margin: '6px 0 8px' }}>O rio que sumiu: como o Taquari virou corredor de sedimentos</h3>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.5 }}>8 meses de apuração e 420 km percorridos.</p>
        </article>

        {/* Mais lidas */}
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 12 }}>Mais lidas hoje</h3>
          {['Raio-X: o patrimônio dos 24 deputados de MS','Como o PCC se instalou nas cidades de fronteira','Mapa do fogo: Pantanal em tempo real'].map((h,i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10, padding: '10px 0', borderBottom: i<2 ? '1px solid var(--vp-border)' : 'none' }}>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, color: 'var(--vp-accent)', lineHeight: 1, fontWeight: 700 }}>{i+1}</span>
              <h4 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 14, lineHeight: 1.25 }}>{h}</h4>
            </div>
          ))}
        </div>
      </div>

      <MobileTabBar active="home" />
    </div>
  );
}

function MobileArticle() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top minimal bar with progress */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--vp-bg)', borderBottom: '1px solid var(--vp-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <span className="eyebrow" style={{ flex: 1, fontSize: 9 }}>Pantanal · Investigação</span>
          <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 16, padding: 0 }}>Aa</button>
          <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4h12v18l-6-4-6 4z"/></svg>
          </button>
        </div>
        <div style={{ height: 2, background: 'var(--vp-border)' }}>
          <div style={{ width: '34%', height: '100%', background: 'var(--vp-accent)' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        <article style={{ padding: '18px 18px 24px' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>Investigação · 8 meses de apuração</span>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 30, lineHeight: 1.05, margin: '10px 0 14px', letterSpacing: '-0.015em' }}>
            O rio que sumiu: como o Taquari virou corredor de sedimentos
          </h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--vp-text-2)', lineHeight: 1.45, marginBottom: 16 }}>
            420 km percorridos pela equipe revelam o colapso silencioso do principal afluente do Pantanal sul.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--vp-border)', borderBottom: '1px solid var(--vp-border)', marginBottom: 18 }}>
            <ImgPH label="" width={36} height={36} style={{ borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, fontWeight: 600 }}>Marina Ribeiro e Carlos Benites</div>
              <div className="byline" style={{ fontSize: 11 }}>22 abr · 14 min de leitura</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--vp-text-3)', padding: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></svg>
            </button>
          </div>

          <ImgPH label="foto · taquari" height={220} style={{ marginBottom: 8 }} />
          <div className="meta" style={{ fontStyle: 'italic', marginBottom: 22, fontSize: 11 }}>Trecho do Taquari em Coxim, março de 2026. Foto: Bruno Kelly / VP</div>

          <div style={{ fontFamily: 'var(--vp-serif)', fontSize: 17, lineHeight: 1.65, color: 'var(--vp-text)' }}>
            <p style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--vp-serif-display)', float: 'left', fontSize: 56, lineHeight: 0.85, paddingRight: 8, paddingTop: 4, color: 'var(--vp-accent)' }}>N</span>
              as manhãs de abril, o Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: "o rio acabou, moço".
            </p>
            <p style={{ marginBottom: 16 }}>
              Dados inéditos obtidos por Lei de Acesso mostram que, desde 2016, o volume de sedimento despejado no baixo curso cresceu 182%.
            </p>

            <blockquote style={{ borderLeft: '3px solid var(--vp-accent)', padding: '6px 0 6px 18px', margin: '22px 0', fontFamily: 'var(--vp-serif-display)', fontSize: 20, lineHeight: 1.25, fontStyle: 'italic', color: 'var(--vp-text)' }}>
              "O Taquari não está doente. Ele está sendo engolido."
              <footer style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, fontStyle: 'normal', color: 'var(--vp-text-3)', marginTop: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Débora Calheiros · Embrapa</footer>
            </blockquote>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--vp-border)', border: '1px solid var(--vp-border)', margin: '22px 0' }}>
              {[['182%','sedimento'],['9%','do plano executado'],['420 km','percorridos']].map(([n,l]) => (
                <div key={n} style={{ background: 'var(--vp-surface)', padding: 12 }}>
                  <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, color: 'var(--vp-accent)', lineHeight: 1, fontWeight: 700 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 10, color: 'var(--vp-text-2)', marginTop: 4, lineHeight: 1.3 }}>{l}</div>
                </div>
              ))}
            </div>

            <p>No trecho entre São Gabriel do Oeste e Coxim, as margens mostram pivôs de irrigação a menos de cem metros da calha — o que contraria o Código Florestal.</p>
          </div>
        </article>

        {/* Comments preview */}
        <div style={{ padding: '20px 18px', borderTop: '1px solid var(--vp-border)', background: 'var(--vp-surface)' }}>
          <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 17, marginBottom: 10 }}>Comentários · 47</h3>
          <button className="vp-btn" style={{ width: '100%', fontSize: 12 }}>Ver e participar</button>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div style={{ borderTop: '1px solid var(--vp-border)', background: 'var(--vp-bg)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '8px 0' }}>
        {[['▲','12'],['↗','Compart.'],['❝','Citar'],['⌃','+']].map(([i,l],idx) => (
          <button key={idx} style={{ background: 'none', border: 'none', color: 'var(--vp-text-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 4, fontFamily: 'var(--vp-sans)', fontSize: 10 }}>
            <span style={{ fontSize: 14 }}>{i}</span><span>{l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileMenu() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--vp-border)' }}>
        <Monogram size="sm" />
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 22, padding: 0 }}>×</button>
      </div>
      <input className="vp-input" placeholder="Buscar matérias, autores, tags…" style={{ margin: 16 }} />

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        <div style={{ padding: '8px 16px' }}>
          <div className="eyebrow" style={{ marginBottom: 10, fontSize: 10 }}>Editorias</div>
          {['Política','Cidades','Pantanal','Agronegócio','Economia','Segurança','Saúde','Educação','Indígenas','Fronteira','Cultura','Esportes','Opinião','Especiais'].map((s,i) => (
            <a key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i<13 ? '1px solid var(--vp-border)' : 'none', fontFamily: 'var(--vp-serif-display)', fontSize: 17 }}>
              {s}
              <span style={{ color: 'var(--vp-text-3)', fontFamily: 'var(--vp-sans)', fontSize: 11 }}>›</span>
            </a>
          ))}
        </div>
        <div style={{ padding: '20px 16px 8px' }}>
          <div className="eyebrow" style={{ marginBottom: 10, fontSize: 10 }}>Acompanhe</div>
          <a style={{ display: 'block', padding: '10px 0', fontFamily: 'var(--vp-sans)', fontSize: 13 }}>Newsletter A Semana em MS</a>
          <a style={{ display: 'block', padding: '10px 0', fontFamily: 'var(--vp-sans)', fontSize: 13 }}>Podcast Voz Alta</a>
          <a style={{ display: 'block', padding: '10px 0', fontFamily: 'var(--vp-sans)', fontSize: 13 }}>Canal no WhatsApp</a>
          <a style={{ display: 'block', padding: '10px 0', fontFamily: 'var(--vp-sans)', fontSize: 13, color: 'var(--vp-accent)' }}>Envie sua denúncia</a>
        </div>
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--vp-border)', display: 'grid', gap: 8 }}>
        <button className="vp-btn vp-btn-primary" style={{ fontSize: 12 }}>Apoie o Voz Pública</button>
        <button className="vp-btn" style={{ fontSize: 12 }}>Entrar / Cadastrar</button>
      </div>
    </div>
  );
}

function MobileAdminDash() {
  return (
    <div className="vp-admin" style={{ background: '#111110', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--vp-border)', gap: 10 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <Monogram size="sm" />
        <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--vp-ok)' }} />
          <ImgPH label="" width={26} height={26} style={{ borderRadius: '50%' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }} className="vp-scroll">
        <h1 style={{ fontFamily: 'var(--vp-sans)', fontSize: 18, fontWeight: 600, marginBottom: 2 }}>Bom dia, Marina</h1>
        <div style={{ fontSize: 11, color: 'var(--vp-text-3)', marginBottom: 14 }}>14 publicadas nas últimas 24h</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[['Online','2.418','+12%'],['Views (24h)','184k','+7%'],['News','43.1k','+184'],['Receita','R$ 38k','+4%']].map(([l,v,d]) => (
            <div key={l} className="vp-panel" style={{ padding: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 10, color: 'var(--vp-ok)', fontWeight: 600, marginTop: 4 }}>{d}</div>
            </div>
          ))}
        </div>

        <div className="vp-panel" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Tráfego (24h)</div>
          <Sparkline points={[32,28,40,52,48,66,72,82,90,94,102,116,132]} height={70} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { t: 'Rascunhos', n: 12, c: 'var(--vp-text-3)' },
            { t: 'Em revisão', n: 4, c: '#e0b44a' },
            { t: 'Aprovadas', n: 7, c: 'var(--vp-ok)' },
            { t: 'Agendadas', n: 3, c: 'var(--vp-accent)' },
          ].map(p => (
            <div key={p.t} className="vp-panel" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 28, background: p.c, borderRadius: 2 }} />
              <div>
                <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 20 }}>{p.n}</div>
                <div style={{ fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.t}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="vp-panel" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Alertas</div>
          {[
            ['urgent','4 comentários sinalizados'],
            ['warn','Banner BYD expira em 2 dias'],
            ['info','Newsletter envia em 3h'],
          ].map(([k,t],i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i<2?'1px solid var(--vp-border)':'none' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: k==='urgent'?'var(--vp-urgent)':k==='warn'?'#e0b44a':'var(--vp-text-3)' }} />
              <span style={{ fontSize: 12, color: 'var(--vp-text-2)', flex: 1 }}>{t}</span>
              <a style={{ fontSize: 11, color: 'var(--vp-accent)', fontWeight: 600 }}>›</a>
            </div>
          ))}
        </div>

        <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: '12px', fontSize: 13 }}>+ Nova matéria</button>
      </div>

      {/* Bottom tab bar */}
      <div style={{ borderTop: '1px solid var(--vp-border)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '6px 0 8px', background: '#0e0e0d' }}>
        {[
          { l: 'Dash', i: 'M3 12 12 4l9 8M5 10v10h14V10', a: true },
          { l: 'Matérias', i: 'M4 6h16M4 12h16M4 18h10' },
          { l: 'Coment.', i: 'M4 5h16v12H8l-4 4z', badge: 12 },
          { l: 'Métricas', i: 'M4 20V8M10 20v-6M16 20V4' },
          { l: 'Mais', i: 'M5 12h.01M12 12h.01M19 12h.01' },
        ].map((t,i) => (
          <a key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0', color: t.a ? 'var(--vp-accent)' : 'var(--vp-text-3)', position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={t.i}/></svg>
            <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 9, fontWeight: 600 }}>{t.l}</span>
            {t.badge && <span style={{ position: 'absolute', top: 2, right: '24%', background: 'var(--vp-accent)', color: '#1a1a19', fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 8 }}>{t.badge}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}

function MobileAdminEditor() {
  return (
    <div className="vp-admin" style={{ background: '#111110', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--vp-border)', gap: 10 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0, fontSize: 18 }}>‹</button>
        <span className="vp-tag vp-tag-outline" style={{ fontSize: 9 }}>Rascunho</span>
        <span style={{ fontSize: 10, color: 'var(--vp-text-3)' }}>salvo há 12s</span>
        <button className="vp-btn vp-btn-primary" style={{ marginLeft: 'auto', fontSize: 11, padding: '5px 10px' }}>Publicar</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        <div style={{ padding: 16 }}>
          <input className="vp-input" defaultValue="Investigação · Pantanal" style={{ marginBottom: 10, fontSize: 11 }} />
          <input className="vp-input" defaultValue="O rio que sumiu: como o Taquari virou corredor de sedimentos"
            style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.15 }} />
          <textarea className="vp-input" defaultValue="420 km percorridos pela equipe revelam o colapso silencioso do principal afluente."
            style={{ fontFamily: 'var(--vp-serif)', fontStyle: 'italic', fontSize: 14, minHeight: 60, marginBottom: 10, resize: 'vertical' }} />
          <div style={{ border: '2px dashed var(--vp-border-2)', padding: 6, marginBottom: 12 }}>
            <ImgPH label="foto destacada · trocar" height={140} />
          </div>
          <textarea className="vp-input"
            defaultValue="O Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: 'o rio acabou, moço'."
            style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, lineHeight: 1.5, minHeight: 200, resize: 'vertical' }} />
        </div>

        {/* Quick actions */}
        <div style={{ padding: 14, borderTop: '1px solid var(--vp-border)', background: 'var(--vp-surface)' }}>
          <div style={{ fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Configurações</div>
          {[
            ['Editoria','Pantanal'],
            ['Série','O rio que sumiu (3/5)'],
            ['Autores','Marina + Carlos'],
            ['Tags','5 selecionadas'],
            ['SEO','Pré-visualizar'],
          ].map(([k,v],i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i<4?'1px solid var(--vp-border)':'none', fontSize: 13 }}>
              <span style={{ color: 'var(--vp-text-3)' }}>{k}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--vp-text-2)' }}>{v}</span>
                <span style={{ color: 'var(--vp-text-3)' }}>›</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky toolbar */}
      <div style={{ display: 'flex', gap: 2, padding: '8px 10px', borderTop: '1px solid var(--vp-border)', background: '#0e0e0d', overflowX: 'auto' }} className="vp-scroll">
        {['B','I','H2','❝','⌾','▭','≡','①','↯','⊞'].map(b => (
          <button key={b} style={{ background: 'transparent', border: '1px solid var(--vp-border)', color: 'var(--vp-text-2)', minWidth: 36, height: 32, fontWeight: 700, fontStyle: b==='I'?'italic':'normal', fontSize: 12, borderRadius: 4, flexShrink: 0 }}>{b}</button>
        ))}
      </div>
    </div>
  );
}

function MobileAdminComments() {
  return (
    <div className="vp-admin" style={{ background: '#111110', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--vp-border)', gap: 10 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', padding: 0, fontSize: 18 }}>‹</button>
        <h1 style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>Comentários</h1>
        <span className="vp-tag" style={{ background: 'var(--vp-urgent)', color: '#fff' }}>4 flag</span>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '8px 14px', borderBottom: '1px solid var(--vp-border)', overflowX: 'auto' }} className="vp-scroll">
        {[['Aguardando','12',true],['Sinalizados','4'],['Aprovados',''],['Spam','3']].map(([t,n,a],i) => (
          <button key={i} className="vp-btn" style={{ fontSize: 11, padding: '5px 10px', background: a?'var(--vp-surface-2)':'transparent', borderColor: a?'var(--vp-accent)':undefined, whiteSpace: 'nowrap', flexShrink: 0 }}>{t}{n && ` (${n})`}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        {[
          { n:'Elza Morais', c:'Sou de Coxim. O rio realmente mudou, e a cobertura é a primeira a ouvir ribeirinhos.', a:'O rio que sumiu', t:'12min', k:'ok' },
          { n:'Anônimo', c:'vocês são comprados pelo governo, só vale o que os patrões falam [palavrão removido]', a:'O rio que sumiu', t:'22min', k:'flag', r:'insulto' },
          { n:'João Vicentini', c:'Faltou ouvir produtor rural da margem. O texto dá um recorte só.', a:'O rio que sumiu', t:'38min', k:'ok' },
          { n:'visitante_123', c:'http://site-duvidoso.ru/ganhe-r500 clique e ganhe', a:'LDO 2027', t:'1h', k:'spam', r:'link suspeito' },
        ].map((cm,i) => (
          <div key={i} style={{ padding: 14, borderBottom: '1px solid var(--vp-border)', background: cm.k==='flag'?'rgba(232,93,74,0.05)':cm.k==='spam'?'rgba(224,180,74,0.04)':'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <ImgPH label="" width={28} height={28} style={{ borderRadius: '50%' }} />
              <strong style={{ fontSize: 12, flex: 1 }}>{cm.n}</strong>
              {cm.k==='flag' && <span className="vp-tag" style={{ background: 'var(--vp-urgent)', color: '#fff' }}>flag</span>}
              {cm.k==='spam' && <span className="vp-tag" style={{ background: '#e0b44a', color: '#1a1a19' }}>spam</span>}
              <span style={{ fontSize: 10, color: 'var(--vp-text-3)' }}>{cm.t}</span>
            </div>
            <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 8 }}>{cm.c}</p>
            <div style={{ fontSize: 10, color: 'var(--vp-text-3)', marginBottom: 10 }}>em <span style={{ color: 'var(--vp-accent)' }}>{cm.a}</span>{cm.r && ` · ${cm.r}`}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
              {['✓ Aprovar','↩ Resp.','◌ Ocultar','✕ Banir'].map(b => (
                <button key={b} className="vp-btn" style={{ fontSize: 10, padding: '6px 4px' }}>{b}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MobileHome, MobileArticle, MobileMenu, MobileAdminDash, MobileAdminEditor, MobileAdminComments });
