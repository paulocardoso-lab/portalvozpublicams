// More mobile screens: Donate funnel, Newsletter, Auth, Reader profile

// ─── DONATE FUNNEL ─────────────────────────────────────────────
function MobileDonateAmount() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--vp-border)', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 18, padding: 0 }}>‹</button>
        <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, textAlign: 'center' }}>Apoiar · 1 de 3</span>
        <span style={{ width: 18 }} />
      </div>
      {/* Step indicator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: '10px 16px' }}>
        {[1,2,3].map(n => (
          <div key={n} style={{ height: 3, background: n===1 ? 'var(--vp-accent)' : 'var(--vp-border)' }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 24px' }} className="vp-scroll">
        <span className="eyebrow" style={{ fontSize: 10 }}>Sem donos. Sem paywall.</span>
        <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 30, lineHeight: 1.05, margin: '8px 0 12px', letterSpacing: '-0.015em' }}>
          Quanto você pode contribuir por mês?
        </h1>
        <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 22 }}>
          4.812 leitores sustentam o Voz Pública. Sua contribuição é o que nos permite recusar dinheiro de campanha eleitoral e do agro.
        </p>

        {/* Goal bar */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Meta de abril</span>
            <span><span style={{ color: 'var(--vp-accent)', fontWeight: 700 }}>R$ 38.420</span> / R$ 50.000</span>
          </div>
          <div style={{ height: 6, background: 'var(--vp-border)' }}>
            <div style={{ width: '76.8%', height: '100%', background: 'var(--vp-accent)' }} />
          </div>
        </div>

        {/* Plans */}
        {[
          { n: 'Leitor',    v: 'R$ 19', d: 'Newsletter exclusiva, sem banners.' },
          { n: 'Apoiador',  v: 'R$ 39', d: 'Acesso aos bastidores e podcast extra.', selected: true, popular: true },
          { n: 'Guardião',  v: 'R$ 79', d: 'Encontros mensais com a redação.' },
          { n: 'Mecenas',   v: 'R$ 199', d: 'Crédito como financiador em reportagens especiais.' },
        ].map((p, i) => (
          <div key={i} style={{
            border: p.selected ? '2px solid var(--vp-accent)' : '1px solid var(--vp-border)',
            background: p.selected ? 'rgba(217,119,87,0.06)' : 'transparent',
            padding: 16, marginBottom: 10, position: 'relative', cursor: 'pointer'
          }}>
            {p.popular && <span className="vp-tag" style={{ position: 'absolute', top: -1, right: 12, background: 'var(--vp-accent)', color: '#1a1a19', transform: 'translateY(-50%)', fontSize: 9 }}>Mais escolhido</span>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 20, fontWeight: 700 }}>{p.n}</span>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, color: 'var(--vp-accent)', fontWeight: 700 }}>{p.v}<span style={{ fontSize: 12, color: 'var(--vp-text-3)', fontWeight: 400 }}>/mês</span></span>
            </div>
            <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.4 }}>{p.d}</p>
          </div>
        ))}

        {/* Custom */}
        <div style={{ marginTop: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>ou contribuição única</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {['R$ 50','R$ 100','R$ 250','R$ 500'].map(v => (
              <button key={v} className="vp-btn" style={{ flex: 1, fontSize: 11, padding: '10px 0' }}>{v}</button>
            ))}
          </div>
          <input className="vp-input" placeholder="Outro valor — R$" style={{ fontFamily: 'var(--vp-serif)', fontSize: 14 }} />
        </div>
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--vp-border)', background: 'var(--vp-bg)' }}>
        <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: '14px', fontSize: 13 }}>Continuar com R$ 39/mês →</button>
      </div>
    </div>
  );
}

function MobileDonateData() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--vp-border)', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 18, padding: 0 }}>‹</button>
        <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, textAlign: 'center' }}>Apoiar · 2 de 3</span>
        <span style={{ width: 18 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: '10px 16px' }}>
        {[1,2,3].map(n => (
          <div key={n} style={{ height: 3, background: n<=2 ? 'var(--vp-accent)' : 'var(--vp-border)' }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 18px 24px' }} className="vp-scroll">
        <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 26, lineHeight: 1.1, margin: '4px 0 6px' }}>Seus dados</h1>
        <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-2)', marginBottom: 20 }}>Plano <strong style={{ color: 'var(--vp-text)' }}>Apoiador · R$ 39/mês</strong>. <a style={{ color: 'var(--vp-accent)' }}>Trocar</a></p>

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>Nome completo</label>
            <input className="vp-input" defaultValue="Marina Ribeiro Alves" />
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>E-mail</label>
            <input className="vp-input" type="email" defaultValue="marina@email.com" />
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>CPF</label>
            <input className="vp-input mono" defaultValue="000.000.000-00" />
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>Celular</label>
            <input className="vp-input mono" defaultValue="(67) 99999-9999" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 10 }}>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>Cidade</label>
              <input className="vp-input" defaultValue="Campo Grande" />
            </div>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>UF</label>
              <input className="vp-input" defaultValue="MS" />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 6 }}>
            <input type="checkbox" style={{ marginTop: 2 }} />
            <span style={{ fontSize: 12, color: 'var(--vp-text-2)', lineHeight: 1.4 }}>Quero receber a newsletter <strong>A Semana em MS</strong> aos sábados.</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2 }} />
            <span style={{ fontSize: 12, color: 'var(--vp-text-2)', lineHeight: 1.4 }}>Concordo com os <a style={{ color: 'var(--vp-accent)' }}>termos</a> e a <a style={{ color: 'var(--vp-accent)' }}>política de privacidade</a> (LGPD).</span>
          </label>
        </div>

        <div style={{ marginTop: 22, padding: 12, border: '1px solid var(--vp-border)', background: 'var(--vp-surface)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ fontSize: 11, color: 'var(--vp-text-2)', lineHeight: 1.4 }}>Seus dados são processados pela Pagar.me. Voz Pública nunca armazena dados de cartão.</span>
        </div>
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--vp-border)' }}>
        <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: '14px', fontSize: 13 }}>Ir para pagamento →</button>
      </div>
    </div>
  );
}

function MobileDonatePay() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--vp-border)', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 18, padding: 0 }}>‹</button>
        <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, textAlign: 'center' }}>Pagamento · 3 de 3</span>
        <span style={{ width: 18 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, padding: '10px 16px' }}>
        {[1,2,3].map(n => <div key={n} style={{ height: 3, background: 'var(--vp-accent)' }} />)}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        {/* Method tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, padding: '0 16px', borderBottom: '1px solid var(--vp-border)' }}>
          {[['PIX',true],['Cartão',false],['Boleto',false]].map(([t,a],i) => (
            <button key={i} style={{
              background: 'none', border: 'none', color: a ? 'var(--vp-text)' : 'var(--vp-text-3)',
              padding: '14px 0', fontFamily: 'var(--vp-sans)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
              borderBottom: a ? '2px solid var(--vp-accent)' : '2px solid transparent'
            }}>{t}</button>
          ))}
        </div>

        <div style={{ padding: '20px 18px' }}>
          <div style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--vp-text-3)' }}>Plano Apoiador</span>
              <strong style={{ fontSize: 14 }}>R$ 39,00</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--vp-text-3)' }}>Recorrência</span>
              <span style={{ fontSize: 12 }}>Mensal</span>
            </div>
            <div style={{ borderTop: '1px solid var(--vp-border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Total hoje</span>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, color: 'var(--vp-accent)', fontWeight: 700 }}>R$ 39,00</span>
            </div>
          </div>

          {/* QR PIX */}
          <div style={{ background: '#fff', padding: 24, display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 200, height: 200, position: 'relative', background: '#fff' }}>
              {/* Stylized QR */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)', backgroundSize: '14px 14px', opacity: 0.9 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, border: '8px solid #000', background: '#fff' }}><div style={{ width: 16, height: 16, background: '#000', margin: 9 }} /></div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 50, height: 50, border: '8px solid #000', background: '#fff' }}><div style={{ width: 16, height: 16, background: '#000', margin: 9 }} /></div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 50, height: 50, border: '8px solid #000', background: '#fff' }}><div style={{ width: 16, height: 16, background: '#000', margin: 9 }} /></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 36, height: 36, background: 'var(--vp-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--vp-serif-display)', fontSize: 16, fontWeight: 700 }}>VP</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Aponte a câmera do banco</div>
            <div style={{ fontSize: 12, color: 'var(--vp-text-2)' }}>ou copie o código abaixo</div>
          </div>

          <div style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', padding: 12, fontFamily: 'var(--vp-mono)', fontSize: 10, wordBreak: 'break-all', color: 'var(--vp-text-2)', marginBottom: 8 }}>
            00020126580014br.gov.bcb.pix0136f8e2a4d1-9c0b-4f5a-...3900
          </div>
          <button className="vp-btn" style={{ width: '100%', fontSize: 12 }}>Copiar código PIX</button>

          <div style={{ marginTop: 18, padding: 12, border: '1px solid var(--vp-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--vp-text-3)', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'var(--vp-text-2)' }}>Aguardando confirmação… Você receberá um e-mail assim que o pagamento for compensado.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDonateSuccess() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--vp-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontFamily: 'var(--vp-serif-display)', fontSize: 44, color: '#1a1a19', fontWeight: 700 }}>✓</div>
      <span className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>Bem-vinda à redação</span>
      <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 32, lineHeight: 1.1, marginBottom: 14, letterSpacing: '-0.015em' }}>Obrigado, Marina.</h1>
      <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, lineHeight: 1.55, color: 'var(--vp-text-2)', marginBottom: 28, maxWidth: 320 }}>
        Você é uma das <strong style={{ color: 'var(--vp-accent)' }}>4.813 pessoas</strong> que sustentam um jornalismo sem donos em Mato Grosso do Sul.
      </p>
      <div style={{ width: '100%', maxWidth: 320, display: 'grid', gap: 8 }}>
        <button className="vp-btn vp-btn-primary" style={{ padding: 14, fontSize: 13 }}>Ler matérias exclusivas →</button>
        <button className="vp-btn" style={{ padding: 14, fontSize: 12 }}>Compartilhar nas redes</button>
      </div>
      <div style={{ marginTop: 32, fontSize: 11, color: 'var(--vp-text-3)', fontFamily: 'var(--vp-mono)' }}>Recibo enviado para marina@email.com</div>
    </div>
  );
}

// ─── NEWSLETTER LANDING ────────────────────────────────────────
function MobileNewsletter() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--vp-border)', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 20, padding: 0 }}>×</button>
        <Monogram size="sm" />
        <span style={{ width: 18 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        {/* Hero */}
        <div style={{ padding: '32px 20px 24px', borderBottom: '1px solid var(--vp-border)', background: 'var(--vp-surface)' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>Newsletter · Sábados, 7h</span>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 38, lineHeight: 1.0, margin: '12px 0 14px', letterSpacing: '-0.02em' }}>
            A Semana<br/>em <span style={{ color: 'var(--vp-accent)', fontStyle: 'italic' }}>MS</span>.
          </h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 16, color: 'var(--vp-text-2)', lineHeight: 1.45, fontStyle: 'italic' }}>
            O resumo do que importou em Mato Grosso do Sul, escrito à mão pela editora-chefe Marina Ribeiro.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid var(--vp-border)' }}>
          {[['12.483','leitores'],['68%','abrem'],['3 anos','no ar']].map(([n,l],i) => (
            <div key={i} style={{ padding: '20px 8px', textAlign: 'center', borderRight: i<2?'1px solid var(--vp-border)':'none' }}>
              <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, color: 'var(--vp-accent)', fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--vp-border)' }}>
          <input className="vp-input" placeholder="seu@email.com.br" style={{ marginBottom: 10, fontSize: 14 }} />
          <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13 }}>Receber aos sábados →</button>
          <p style={{ fontSize: 10, color: 'var(--vp-text-3)', marginTop: 10, lineHeight: 1.4 }}>
            Grátis e sem spam. Cancele quando quiser. Não compartilhamos seu e-mail.
          </p>
        </div>

        {/* What you get */}
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 18 }}>O que vai chegar no seu e-mail</h2>
          {[
            ['1','A pauta da semana','Os 3 fatos que moveram MS, sem a urgência da timeline.'],
            ['2','Bastidores','Como uma reportagem foi feita — fontes, dúvidas, recortes que sobraram.'],
            ['3','O número','Um dado de MS que você ainda não viu, com contexto.'],
            ['4','Recomendação','Um livro, podcast ou doc que conversa com o estado.'],
          ].map(([n,t,d]) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 14, marginBottom: 18 }}>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 26, color: 'var(--vp-accent)', lineHeight: 1, fontWeight: 700 }}>{n}</span>
              <div>
                <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 17, marginBottom: 4 }}>{t}</div>
                <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.5 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Last edition preview */}
        <div style={{ padding: '20px 20px 24px', background: 'var(--vp-surface)', borderTop: '1px solid var(--vp-border)' }}>
          <div className="eyebrow" style={{ marginBottom: 10, fontSize: 10 }}>Edição #142 · 19 abr</div>
          <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, lineHeight: 1.15, marginBottom: 10 }}>"O Pantanal não acabou em 2024. Continua acabando em 2026."</h3>
          <p style={{ fontFamily: 'var(--vp-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 14 }}>
            Quando a fumaça saiu da capa dos jornais, quem ficou foi o fogo…
          </p>
          <a className="meta" style={{ color: 'var(--vp-accent)' }}>Ler edição completa →</a>
        </div>

        <div style={{ padding: '20px', textAlign: 'center', fontSize: 11, color: 'var(--vp-text-3)' }}>
          Outras newsletters · <a style={{ color: 'var(--vp-accent)' }}>Pantanal Diário</a> · <a style={{ color: 'var(--vp-accent)' }}>Política MS</a>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ──────────────────────────────────────────────────────
function MobileLogin() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', justifyContent: 'space-between' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 20 }}>×</button>
        <Monogram size="sm" />
        <span style={{ width: 18 }} />
      </div>

      <div style={{ flex: 1, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 28 }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>Bem-vindo de volta</span>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 32, lineHeight: 1.05, margin: '8px 0 6px', letterSpacing: '-0.015em' }}>Entre na sua conta</h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)' }}>Para comentar, salvar matérias e gerenciar seu apoio.</p>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>E-mail</label>
            <input className="vp-input" type="email" placeholder="seu@email.com.br" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="eyebrow" style={{ fontSize: 10 }}>Senha</label>
              <a style={{ fontSize: 10, color: 'var(--vp-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Esqueci</a>
            </div>
            <input className="vp-input" type="password" placeholder="••••••••" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: 12, color: 'var(--vp-text-2)' }}>Manter conectado neste dispositivo</span>
          </label>
        </div>

        <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13, marginBottom: 18 }}>Entrar</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--vp-border)' }} />
          <span style={{ fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: 'var(--vp-border)' }} />
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <button className="vp-btn" style={{ padding: 12, fontSize: 12, justifyContent: 'center' }}>Continuar com Google</button>
          <button className="vp-btn" style={{ padding: 12, fontSize: 12, justifyContent: 'center' }}>Continuar com Apple</button>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 24, fontSize: 13, color: 'var(--vp-text-2)' }}>
          Não tem conta? <a style={{ color: 'var(--vp-accent)', fontWeight: 600 }}>Cadastre-se grátis</a>
        </div>
      </div>
    </div>
  );
}

function MobileSignup() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', justifyContent: 'space-between' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text)', fontSize: 18 }}>‹</button>
        <Monogram size="sm" />
        <span style={{ width: 18 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }} className="vp-scroll">
        <span className="eyebrow" style={{ fontSize: 10 }}>Cadastro grátis</span>
        <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 28, lineHeight: 1.05, margin: '8px 0 14px', letterSpacing: '-0.015em' }}>Acompanhe MS de perto</h1>

        {/* Benefits */}
        <div style={{ background: 'var(--vp-surface)', padding: 14, marginBottom: 22, border: '1px solid var(--vp-border)' }}>
          {[
            'Comente e participe de debates moderados',
            'Salve matérias para ler depois',
            'Newsletter A Semana em MS aos sábados',
            'Avise-me quando esta série tiver novo capítulo',
          ].map((b,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0' }}>
              <span style={{ color: 'var(--vp-accent)', fontWeight: 700, fontSize: 12 }}>✓</span>
              <span style={{ fontSize: 12, color: 'var(--vp-text-2)' }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>Nome</label>
            <input className="vp-input" placeholder="Como devemos te chamar?" />
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>E-mail</label>
            <input className="vp-input" type="email" placeholder="seu@email.com.br" />
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>Senha</label>
            <input className="vp-input" type="password" placeholder="Mínimo 8 caracteres" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3, marginTop: 6 }}>
              {[1,2,3,4].map(n => <div key={n} style={{ height: 3, background: n<=3?'var(--vp-ok)':'var(--vp-border)' }} />)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--vp-text-3)', marginTop: 4 }}>Boa senha</div>
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6, fontSize: 10 }}>Cidade em MS (opcional)</label>
            <select className="vp-input" defaultValue="cg">
              <option value="cg">Campo Grande</option>
              <option value="dr">Dourados</option>
              <option value="tl">Três Lagoas</option>
              <option value="cb">Corumbá</option>
              <option value="">Outra…</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2 }} />
            <span style={{ fontSize: 12, color: 'var(--vp-text-2)', lineHeight: 1.4 }}>Aceito os <a style={{ color: 'var(--vp-accent)' }}>termos</a> e a <a style={{ color: 'var(--vp-accent)' }}>política de privacidade</a> (LGPD).</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2 }} />
            <span style={{ fontSize: 12, color: 'var(--vp-text-2)', lineHeight: 1.4 }}>Inscrever-me na newsletter A Semana em MS.</span>
          </label>
        </div>

        <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13, marginTop: 22 }}>Criar minha conta</button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--vp-text-2)' }}>
          Já tem conta? <a style={{ color: 'var(--vp-accent)', fontWeight: 600 }}>Entrar</a>
        </div>
      </div>
    </div>
  );
}

// ─── READER PROFILE ────────────────────────────────────────────
function MobileReaderProfile() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--vp-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <ImgPH label="" width={56} height={56} style={{ borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 19, lineHeight: 1.1 }}>Marina Ribeiro</div>
            <div style={{ fontSize: 11, color: 'var(--vp-text-3)', marginTop: 2 }}>Apoiadora desde fev/2024 · Campo Grande</div>
          </div>
          <button style={{ background: 'none', border: '1px solid var(--vp-border)', color: 'var(--vp-text-2)', padding: '6px 10px', fontSize: 11 }}>Editar</button>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(217,119,87,0.12)', border: '1px solid var(--vp-accent)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vp-accent)' }} />
          <span style={{ fontSize: 11, color: 'var(--vp-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plano Apoiador · R$ 39/mês</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid var(--vp-border)' }}>
        {[['28','salvas'],['142','lidas'],['12','comentários']].map(([n,l],i) => (
          <div key={i} style={{ padding: '14px 8px', textAlign: 'center', borderRight: i<2?'1px solid var(--vp-border)':'none' }}>
            <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, fontWeight: 700, color: 'var(--vp-text)' }}>{n}</div>
            <div style={{ fontSize: 10, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid var(--vp-border)' }}>
        {[['Salvos',true],['Histórico',false],['Comentários',false]].map(([t,a],i) => (
          <button key={i} style={{
            background: 'none', border: 'none', color: a ? 'var(--vp-text)' : 'var(--vp-text-3)',
            padding: '12px 0', fontFamily: 'var(--vp-sans)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: a ? '2px solid var(--vp-accent)' : '2px solid transparent'
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
        {/* Saved articles */}
        {[
          { tag:'Pantanal', h:'O rio que sumiu: como o Taquari virou corredor de sedimentos', t:'salvo há 2 dias' },
          { tag:'Política', h:'Raio-X: o patrimônio dos 24 deputados de MS', t:'salvo há 4 dias' },
          { tag:'Indígenas', h:'"Estão abrindo o mato com trator": Guarani Kaiowá denunciam invasão', t:'salvo há 1 sem' },
          { tag:'Cidades · CG', h:'Obra da Duque de Caxias atrasa 14 meses e custa 60% a mais', t:'salvo há 2 sem' },
        ].map((x,i) => (
          <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--vp-border)', display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
            <div>
              <span className="eyebrow" style={{ fontSize: 9 }}>{x.tag}</span>
              <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 15, lineHeight: 1.2, margin: '4px 0 6px' }}>{x.h}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--vp-text-3)' }}>{x.t}</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--vp-accent)', fontSize: 14 }}>★</button>
              </div>
            </div>
            <ImgPH label="" height={70} />
          </div>
        ))}

        {/* Settings menu */}
        <div style={{ padding: '20px 0 0' }}>
          <div className="eyebrow" style={{ padding: '0 16px 10px', fontSize: 10 }}>Conta</div>
          {[
            ['Apoio mensal','R$ 39 · Apoiador'],
            ['Newsletters','2 ativas'],
            ['Notificações','Push + e-mail'],
            ['Métodos de pagamento','PIX cadastrado'],
            ['Privacidade & dados','LGPD'],
            ['Senha e segurança','2FA off'],
            ['Sair','', 'danger'],
          ].map(([k,v,d],i,arr) => (
            <a key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', borderTop: '1px solid var(--vp-border)',
              fontSize: 13, color: d==='danger' ? 'var(--vp-urgent)' : 'var(--vp-text)'
            }}>
              <span>{k}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {v && <span style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>{v}</span>}
                {d!=='danger' && <span style={{ color: 'var(--vp-text-3)' }}>›</span>}
              </span>
            </a>
          ))}
        </div>

        <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 10, color: 'var(--vp-text-3)', fontFamily: 'var(--vp-mono)' }}>
          v2.4.1 · vozpublicams.com.br
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderTop: '1px solid var(--vp-border)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '6px 0 8px', background: 'var(--vp-bg)' }}>
        {[
          { l: 'Capa', i: 'M3 12 12 4l9 8M5 10v10h14V10' },
          { l: 'Editorias', i: 'M4 6h16M4 12h16M4 18h10' },
          { l: 'Ao vivo', live: true },
          { l: 'Salvos', i: 'M6 4h12v18l-6-4-6 4z' },
          { l: 'Eu', i: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0', a: true },
        ].map((t,i) => (
          <a key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0', color: t.a ? 'var(--vp-accent)' : 'var(--vp-text-3)' }}>
            {t.live ? (
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--vp-urgent)', display: 'inline-block' }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={t.i}/></svg>
            )}
            <span style={{ fontFamily: 'var(--vp-sans)', fontSize: 9, fontWeight: 600 }}>{t.l}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  MobileDonateAmount, MobileDonateData, MobileDonatePay, MobileDonateSuccess,
  MobileNewsletter, MobileLogin, MobileSignup, MobileReaderProfile,
});
