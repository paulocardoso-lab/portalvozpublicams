// Shared components for Voz Pública MS

// VP | MS monogram
function Monogram({ size = 'md' }) {
  const fs = size === 'lg' ? 28 : size === 'sm' ? 14 : 20;
  return (
    <div className="vp-monogram" style={{ fontSize: fs }}>
      <span className="m-l" style={{ padding: `${fs*0.25}px ${fs*0.4}px ${fs*0.22}px`, fontSize: fs }}>VP</span>
      <span className="m-r" style={{ padding: `${fs*0.35}px ${fs*0.4}px ${fs*0.2}px`, fontSize: fs*0.55 }}>MS</span>
    </div>
  );
}

// Diagonal-stripe image placeholder
function ImgPH({ label, ratio, height, width, style }) {
  const s = {
    width: width ?? '100%',
    height: height,
    aspectRatio: !height && ratio ? ratio : undefined,
    ...style,
  };
  return (
    <div className="vp-img-ph" style={s}>
      <span style={{ opacity: 0.7 }}>{label || 'FOTO'}</span>
    </div>
  );
}

// Masthead (top header of public site)
function Masthead({ date = 'quarta-feira, 22 de abril de 2026', dense = false }) {
  const sections = [
    'Política', 'Cidades', 'Pantanal', 'Agronegócio', 'Economia', 'Segurança',
    'Saúde', 'Educação', 'Indígenas', 'Fronteira', 'Cultura', 'Esportes',
    'Opinião', 'Especiais',
  ];
  return (
    <header style={{ borderBottom: '1px solid var(--vp-border)', background: 'var(--vp-bg)', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Top utility bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 28px', borderBottom: '1px solid var(--vp-border)', fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{date}</span>
          <span style={{ color: 'var(--vp-text-4)' }}>·</span>
          <span>Campo Grande 28°C</span>
          <span style={{ color: 'var(--vp-text-4)' }}>·</span>
          <span className="mono" style={{ color: 'var(--vp-text-3)' }}>USD 5,12 &nbsp; BOI 302,40 &nbsp; SOJA 128,10</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a>Newsletter</a>
          <a>Podcast</a>
          <a>Envie sua denúncia</a>
          <span style={{ color: 'var(--vp-text-4)' }}>·</span>
          <a>Entrar</a>
          <button className="vp-btn vp-btn-primary" style={{ padding: '5px 12px', fontSize: 11 }}>Assine</button>
        </div>
      </div>

      {/* Logo row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 28px', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', cursor: 'pointer', fontFamily: 'var(--vp-sans)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 16, height: 11, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1.5, background: 'currentColor' }} />
              <span style={{ position: 'absolute', left: 0, right: 0, top: 5, height: 1.5, background: 'currentColor' }} />
              <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.5, background: 'currentColor' }} />
            </span>
            MENU
          </button>
          <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', cursor: 'pointer', fontFamily: 'var(--vp-sans)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            BUSCAR
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Monogram size="lg" />
          <div style={{ fontFamily: 'var(--vp-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--vp-text-2)', letterSpacing: '0.02em' }}>
            Jornalismo independente de Mato Grosso do Sul
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center', fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Siga</span>
          {['FB','IG','X','YT','WA'].map(s => (
            <a key={s} style={{ width: 24, height: 24, border: '1px solid var(--vp-border-2)', borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--vp-text-2)' }}>{s}</a>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 0, padding: '0 20px', borderTop: '1px solid var(--vp-border)', overflowX: 'auto', fontFamily: 'var(--vp-sans)' }}>
        {sections.map((s, i) => (
          <a key={s} style={{
            padding: '11px 14px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: i === 0 ? 'var(--vp-accent)' : 'var(--vp-text-2)',
            borderBottom: i === 0 ? '2px solid var(--vp-accent)' : '2px solid transparent',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}>{s}</a>
        ))}
      </nav>
    </header>
  );
}

// Footer
function SiteFooter() {
  return (
    <footer style={{ borderTop: '2px solid var(--vp-text)', background: 'var(--vp-bg)', padding: '32px 28px 24px', fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text-3)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 28, marginBottom: 28 }}>
        <div>
          <Monogram size="md" />
          <p style={{ marginTop: 12, lineHeight: 1.6, color: 'var(--vp-text-2)', fontFamily: 'var(--vp-serif)', fontSize: 14 }}>
            Jornalismo investigativo, plural e sem donos. Cobrimos Mato Grosso do Sul com rigor e independência desde 2024.
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button className="vp-btn vp-btn-primary" style={{ fontSize: 11 }}>Faça uma doação</button>
            <button className="vp-btn" style={{ fontSize: 11 }}>Assine a newsletter</button>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text)', marginBottom: 10 }}>Editorias</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            {['Política','Cidades','Pantanal','Agronegócio','Segurança','Indígenas','Fronteira'].map(x => <li key={x}><a>{x}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text)', marginBottom: 10 }}>Institucional</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            {['Quem somos','Princípios editoriais','Política de correções','Contato','Anuncie','Trabalhe conosco'].map(x => <li key={x}><a>{x}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text)', marginBottom: 10 }}>Envie sua denúncia</h4>
          <p style={{ lineHeight: 1.5, marginBottom: 10 }}>Canal criptografado para whistleblowers. Protegemos suas fontes.</p>
          <a style={{ color: 'var(--vp-accent)', fontWeight: 600 }}>denuncia@vozpublicams.com.br →</a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--vp-border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span>© 2026 Voz Pública MS · Campo Grande, MS · CNPJ 00.000.000/0001-00</span>
        <span className="mono">vozpublicams.com.br</span>
      </div>
    </footer>
  );
}

// Export
Object.assign(window, { Monogram, ImgPH, Masthead, SiteFooter });
