// Admin — extra screens: Kanban, Metrics, Settings, Profile, Subscriptions, Audit
function AdminKanban() {
  const cols = [
    { t: 'Pauta', c: 'var(--vp-text-3)', items: [
      { h: 'Escolas rurais sem transporte em Bonito', a: 'L. Fragoso', d: 'pauta · 2 dias' },
      { h: 'Auditoria do TCE sobre Iluminação CG', a: 'R. Duarte', d: 'pauta · hoje' },
      { h: 'Perfil: nova juíza auxiliar do TJ-MS', a: 'T. Mattos', d: 'pauta · 1 dia' },
    ]},
    { t: 'Apuração', c: '#7aa2f7', items: [
      { h: 'Patrimônio dos 24 deputados de MS', a: 'M. Ribeiro', d: 'apurando · 6 dias', badge: 'sigiloso' },
      { h: 'PCC na fronteira — parte 2', a: 'C. Benites', d: 'apurando · 14 dias' },
    ]},
    { t: 'Rascunho', c: '#e0b44a', items: [
      { h: 'Cinco perguntas sobre Plano de Manejo', a: 'L. Fragoso', d: 'rascunho · 95% pronto' },
      { h: 'Raio-X do orçamento municipal CG', a: 'R. Duarte', d: 'rascunho · aguarda dados' },
      { h: 'Opinião — reforma tributária e MS', a: 'S. Yoko', d: 'rascunho · hoje' },
    ]},
    { t: 'Em revisão', c: 'var(--vp-accent)', items: [
      { h: 'Dourados: 3ª tentativa de cassação', a: 'A. Figueira → M. Ribeiro', d: 'revisão · 3h', badge: 'urgente' },
      { h: 'Dados · 72% das autuações prescrevem', a: 'R. Duarte → C. Benites', d: 'revisão · 1 dia' },
    ]},
    { t: 'Agendado', c: 'var(--vp-ok)', items: [
      { h: 'O rio que sumiu — capítulo 4', a: 'M. Ribeiro', d: 'publica amanhã, 06h' },
      { h: 'Newsletter A Semana em MS', a: 'Editoria', d: 'publica sáb, 08h' },
    ]},
    { t: 'Publicado (hoje)', c: 'var(--vp-text-3)', items: [
      { h: 'O rio que sumiu — capítulo 3', a: 'M. Ribeiro', d: '06:00 · 18.402 vis.' },
      { h: 'Assembleia aprova LDO 2027', a: 'L. Fragoso', d: '12:40 · 12.118 vis.' },
    ]},
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Fila editorial</h1>
          <p style={{ color: 'var(--vp-text-3)', fontSize: 13 }}>Kanban da redação · 14 matérias em curso · 3 agendadas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="vp-input" style={{ width: 160 }}><option>Toda redação</option><option>Pantanal</option><option>Política</option></select>
          <select className="vp-input" style={{ width: 160 }}><option>Todos autores</option><option>Eu</option></select>
          <button className="vp-btn vp-btn-primary">+ Pauta</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(220px, 1fr))', gap: 12, alignItems: 'start' }}>
        {cols.map(col => (
          <div key={col.t} style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', borderRadius: 6, padding: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px 10px', borderBottom: `2px solid ${col.c}` }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.c }} />
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{col.t}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--vp-mono)', fontSize: 11, color: 'var(--vp-text-3)' }}>{col.items.length}</span>
            </div>
            <div style={{ display: 'grid', gap: 8, paddingTop: 10 }}>
              {col.items.map((it, i) => (
                <div key={i} style={{ background: 'var(--vp-bg)', border: '1px solid var(--vp-border)', padding: 10, borderRadius: 4, cursor: 'grab' }}>
                  {it.badge && <span className="vp-tag" style={{ background: it.badge==='urgente'?'var(--vp-urgent)':'var(--vp-surface-3)', color: '#fff', marginBottom: 6, display: 'inline-block' }}>{it.badge}</span>}
                  <div style={{ fontSize: 13, lineHeight: 1.35, color: 'var(--vp-text)', marginBottom: 8 }}>{it.h}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--vp-text-3)' }}>
                    <span>{it.a}</span>
                    <span>{it.d}</span>
                  </div>
                </div>
              ))}
              <button style={{ background: 'transparent', border: '1px dashed var(--vp-border-2)', padding: 8, color: 'var(--vp-text-3)', fontSize: 11, borderRadius: 4, cursor: 'pointer' }}>+ novo</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminMetrics() {
  const daily = [184,192,174,210,232,228,246,258,272,264,278,298,312,326,338,352,340,364,382,398,412,428,440,462];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Métricas & tráfego</h1>
          <p style={{ color: 'var(--vp-text-3)', fontSize: 13 }}>Audiência, engajamento, conversão e performance editorial</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="vp-input" style={{ width: 140 }}><option>Últimos 30 dias</option><option>Últimos 7 dias</option><option>Este ano</option></select>
          <button className="vp-btn">Exportar CSV</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
        <Stat label="Visitantes únicos (mês)" value="1.284.402" delta="+18%" sub="vs. mês anterior" />
        <Stat label="Pageviews" value="4.812.118" delta="+22%" sub="média 3,7/visita" />
        <Stat label="Tempo médio" value="4m 12s" delta="+8%" sub="aprofundamento alto" />
        <Stat label="Taxa de rejeição" value="38,4%" delta="-3%" sub="queda saudável" />
        <Stat label="Cadastros newsletter" value="+3.402" delta="+12%" sub="conversão 0,26%" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 16 }}>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 12 }}>Audiência diária — últimos 30 dias</h3>
          <div style={{ height: 220 }}><Sparkline points={daily} height={220} /></div>
        </div>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Origem do tráfego</h3>
          {[
            ['Busca orgânica', 48, 'var(--vp-accent)'],
            ['Direto', 22, 'var(--vp-text-2)'],
            ['Redes sociais', 18, '#7aa2f7'],
            ['WhatsApp', 8, 'var(--vp-ok)'],
            ['Newsletter', 3, '#c4a7e7'],
            ['Referência', 1, 'var(--vp-text-4)'],
          ].map(([n,v,c]) => (
            <div key={n} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--vp-text-2)' }}>{n}</span>
                <span className="mono" style={{ color: 'var(--vp-text-3)' }}>{v}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--vp-border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${v*2}%`, maxWidth: '100%', height: '100%', background: c }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Cidades no MS</h3>
          {[
            ['Campo Grande', '612.218', 48],
            ['Dourados', '168.402', 13],
            ['Três Lagoas', '94.120', 7],
            ['Corumbá', '62.410', 5],
            ['Ponta Porã', '48.212', 4],
            ['Naviraí', '32.118', 3],
          ].map(([c,v,p]) => (
            <div key={c} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 40px', gap: 10, padding: '8px 0', alignItems: 'center', borderBottom: '1px solid var(--vp-border)', fontSize: 12 }}>
              <span>{c}</span>
              <span className="mono" style={{ color: 'var(--vp-text-3)', textAlign: 'right' }}>{v}</span>
              <span style={{ color: 'var(--vp-accent)', fontWeight: 600, textAlign: 'right' }}>{p}%</span>
            </div>
          ))}
        </div>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Dispositivos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
            {[['Mobile', 72, 'var(--vp-accent)'],['Desktop', 22, '#7aa2f7'],['Tablet', 6, 'var(--vp-ok)']].map(([n,v,c]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 6px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15" fill="none" stroke="var(--vp-border)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke={c} strokeWidth="3" strokeDasharray={`${v*0.942} 100`} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--vp-serif-display)', fontSize: 20 }}>{v}%</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--vp-text-2)' }}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--vp-text-3)', lineHeight: 1.5 }}>
            Dica: 72% mobile reforça prioridade no redesign responsivo — seu tempo médio em mobile ainda é 38% menor que desktop.
          </div>
        </div>
      </div>

      <div className="vp-panel" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 13, marginBottom: 14 }}>Matérias com melhor performance (30d)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', padding: '6px 10px', borderBottom: '1px solid var(--vp-border)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>
          <span>Matéria</span><span>Views</span><span>Únicos</span><span>Tempo</span><span>Scroll 75%</span><span>Compart.</span>
        </div>
        {[
          ['O rio que sumiu: Taquari', '218.402', '168.112', '8m 14s', '62%', '4.218'],
          ['Raio-X dos 24 deputados de MS', '184.218', '142.018', '5m 48s', '58%', '3.412'],
          ['PCC nas cidades de fronteira', '128.412', '98.210', '6m 12s', '54%', '2.812'],
          ['Como MS virou polo da celulose', '94.218', '72.118', '4m 20s', '48%', '1.412'],
          ['Os donos do Pantanal', '88.412', '68.012', '7m 05s', '59%', '2.218'],
        ].map((r,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr', padding: '10px', borderBottom: i<4 ? '1px solid var(--vp-border)' : 'none', fontSize: 12, alignItems: 'center' }}>
            <span style={{ color: 'var(--vp-text)' }}>{r[0]}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{r[1]}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{r[2]}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{r[3]}</span>
            <span className="mono" style={{ color: 'var(--vp-accent)', fontWeight: 600 }}>{r[4]}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{r[5]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Configurações gerais</h1>
      <p style={{ color: 'var(--vp-text-3)', fontSize: 13, marginBottom: 20 }}>Identidade do veículo, domínio, políticas, integrações e backup</p>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        <nav style={{ display: 'grid', gap: 2, alignSelf: 'start' }}>
          {['Geral','Domínio & DNS','E-mails','Integrações (APIs)','Comentários — regras','Moderação automática','Privacidade & LGPD','Backup','Faturamento','Zona de perigo'].map((n,i) => (
            <a key={n} style={{ padding: '8px 12px', fontSize: 12, color: i===0?'var(--vp-text)':'var(--vp-text-2)', borderLeft: i===0?'2px solid var(--vp-accent)':'2px solid transparent', background: i===0?'var(--vp-surface-2)':'transparent', cursor: 'pointer' }}>{n}</a>
          ))}
        </nav>

        <div style={{ display: 'grid', gap: 16 }}>
          <div className="vp-panel" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, marginBottom: 14 }}>Identidade do veículo</h3>
            <div style={{ display: 'grid', gap: 12, fontSize: 12 }}>
              <label>Nome
                <input className="vp-input" defaultValue="Voz Pública MS" style={{ marginTop: 4 }} />
              </label>
              <label>Razão social
                <input className="vp-input" defaultValue="Voz Pública Comunicação Ltda." style={{ marginTop: 4 }} />
              </label>
              <label>CNPJ
                <input className="vp-input" defaultValue="00.000.000/0001-00" style={{ marginTop: 4, fontFamily: 'var(--vp-mono)' }} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label>E-mail redação<input className="vp-input" defaultValue="redacao@vozpublicams.com.br" style={{ marginTop: 4 }} /></label>
                <label>E-mail contato<input className="vp-input" defaultValue="contato@vozpublicams.com.br" style={{ marginTop: 4 }} /></label>
              </div>
              <label>Endereço
                <input className="vp-input" defaultValue="Rua 14 de Julho, 1.234 — Centro — Campo Grande/MS — CEP 79002-333" style={{ marginTop: 4 }} />
              </label>
            </div>
          </div>

          <div className="vp-panel" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, marginBottom: 14 }}>Domínio & SSL</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', padding: 12, background: 'var(--vp-bg)', border: '1px solid var(--vp-border)', fontFamily: 'var(--vp-mono)', fontSize: 13 }}>
              <span>vozpublicams.com.br</span>
              <span className="vp-tag" style={{ background: 'var(--vp-ok)', color: '#1a1a19' }}>● SSL ATIVO · expira em 78d</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--vp-text-3)', marginTop: 10 }}>Certificado renovado automaticamente via Let's Encrypt. CDN: Cloudflare.</div>
          </div>

          <div className="vp-panel" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, marginBottom: 14 }}>Integrações</h3>
            <div style={{ display: 'grid', gap: 1, background: 'var(--vp-border)', border: '1px solid var(--vp-border)' }}>
              {[
                ['Google Analytics 4', 'G-XXXXXXX', 'conectado'],
                ['Google AdSense', 'ca-pub-…', 'conectado'],
                ['Mailchimp / Newsletter', 'api_…2f7a', 'conectado'],
                ['Stripe / Doações', 'sk_live_…', 'conectado'],
                ['Meta Business Suite', '—', 'conectar'],
                ['OpenAI (resumo + título sugerido)', 'sk-…', 'conectado'],
                ['Cloudflare Turnstile (antispam)', '0x4AAAA…', 'conectado'],
              ].map(([n,k,s],i) => (
                <div key={i} style={{ background: 'var(--vp-surface)', padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center', fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>{n}</span>
                  <span className="mono" style={{ color: 'var(--vp-text-3)' }}>{k}</span>
                  <button className="vp-btn" style={{ fontSize: 11, color: s==='conectado'?'var(--vp-ok)':'var(--vp-accent)', borderColor: s==='conectado'?'var(--vp-ok)':'var(--vp-accent)' }}>
                    {s==='conectado'?'● conectado':'conectar →'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="vp-panel" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, marginBottom: 14 }}>Privacidade & LGPD</h3>
            {[
              ['Banner de consentimento de cookies', true],
              ['Permitir solicitação de exclusão de dados por leitores', true],
              ['Enviar relatório mensal de dados para DPO', true],
              ['Anonimizar IPs no analytics', true],
            ].map(([l,v],i) => (
              <label key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, borderBottom: i<3?'1px solid var(--vp-border)':'none' }}>
                <span>{l}</span>
                <span style={{ display: 'inline-block', width: 28, height: 16, background: v?'var(--vp-accent)':'var(--vp-border-2)', borderRadius: 10, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 2, left: v?14:2, width: 12, height: 12, background: '#fff', borderRadius: '50%' }} />
                </span>
              </label>
            ))}
          </div>

          <div className="vp-panel" style={{ padding: 18, borderColor: 'var(--vp-urgent)', borderWidth: 1 }}>
            <h3 style={{ fontSize: 13, marginBottom: 6, color: 'var(--vp-urgent)' }}>Zona de perigo</h3>
            <p style={{ fontSize: 12, color: 'var(--vp-text-3)', marginBottom: 12 }}>Ações irreversíveis. Exigem senha do super admin.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="vp-btn" style={{ borderColor: 'var(--vp-urgent)', color: 'var(--vp-urgent)', fontSize: 11 }}>Exportar tudo</button>
              <button className="vp-btn" style={{ borderColor: 'var(--vp-urgent)', color: 'var(--vp-urgent)', fontSize: 11 }}>Transferir propriedade</button>
              <button className="vp-btn" style={{ borderColor: 'var(--vp-urgent)', color: 'var(--vp-urgent)', fontSize: 11 }}>Desativar site</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProfile() {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Meu perfil</h1>
      <p style={{ color: 'var(--vp-text-3)', fontSize: 13, marginBottom: 20 }}>Página pública de autor + dados da conta</p>

      <div className="vp-panel" style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 22, alignItems: 'start' }}>
          <div>
            <ImgPH label="foto" width={120} height={120} style={{ borderRadius: '50%' }} />
            <button className="vp-btn" style={{ width: '100%', marginTop: 8, fontSize: 11 }}>Trocar</button>
          </div>
          <div style={{ display: 'grid', gap: 12, fontSize: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>Nome<input className="vp-input" defaultValue="Marina" style={{ marginTop: 4 }} /></label>
              <label>Sobrenome<input className="vp-input" defaultValue="Ribeiro" style={{ marginTop: 4 }} /></label>
            </div>
            <label>Bio (aparece na página de autor)
              <textarea className="vp-input" rows={3} defaultValue="Editora-chefe do Voz Pública MS. Jornalista há 18 anos, cobriu o Pantanal para Folha, Piauí e El País. Autora de 'O Rio dos Mortos' (2023)." style={{ marginTop: 4, resize: 'vertical', fontFamily: 'var(--vp-serif)' }} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>E-mail<input className="vp-input" defaultValue="marina@vozpublicams.com.br" style={{ marginTop: 4 }} /></label>
              <label>Telefone<input className="vp-input" defaultValue="(67) 99999-0000" style={{ marginTop: 4 }} /></label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <label>Instagram<input className="vp-input" defaultValue="@marinaribeiro" style={{ marginTop: 4 }} /></label>
              <label>X / Twitter<input className="vp-input" defaultValue="@marinaribeiro" style={{ marginTop: 4 }} /></label>
              <label>LinkedIn<input className="vp-input" defaultValue="/in/marinaribeiro" style={{ marginTop: 4 }} /></label>
            </div>
          </div>
        </div>
      </div>

      <div className="vp-panel" style={{ padding: 18, marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, marginBottom: 12 }}>Segurança</h3>
        <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--vp-bg)', border: '1px solid var(--vp-border)' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Senha</div>
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>Alterada há 48 dias · forte</div>
            </div>
            <button className="vp-btn">Alterar</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--vp-bg)', border: '1px solid var(--vp-border)' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Autenticação de 2 fatores <span className="vp-tag" style={{ background: 'var(--vp-ok)', color: '#1a1a19', marginLeft: 6 }}>ATIVO</span></div>
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>App autenticador · Google Authenticator</div>
            </div>
            <button className="vp-btn">Gerenciar</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--vp-bg)', border: '1px solid var(--vp-border)' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Sessões ativas</div>
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>3 dispositivos · MacBook (agora), iPhone 15 (há 2h), Chrome Win (ontem)</div>
            </div>
            <button className="vp-btn" style={{ color: 'var(--vp-urgent)', borderColor: 'var(--vp-urgent)' }}>Encerrar outras</button>
          </div>
        </div>
      </div>

      <div className="vp-panel" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 13, marginBottom: 12 }}>Notificações</h3>
        {[
          ['E-mail quando enviarem matéria para minha revisão', true],
          ['E-mail quando comentários em minhas matérias forem sinalizados', true],
          ['Push no mobile para urgências editoriais', true],
          ['Relatório semanal de performance das minhas matérias', true],
          ['Newsletter interna da redação', false],
        ].map(([l,v],i) => (
          <label key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, borderBottom: i<4?'1px solid var(--vp-border)':'none' }}>
            <span>{l}</span>
            <span style={{ display: 'inline-block', width: 28, height: 16, background: v?'var(--vp-accent)':'var(--vp-border-2)', borderRadius: 10, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 2, left: v?14:2, width: 12, height: 12, background: '#fff', borderRadius: '50%' }} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AdminSubscriptions() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Assinaturas & doações</h1>
          <p style={{ color: 'var(--vp-text-3)', fontSize: 13 }}>4.812 apoiadores · R$ 82.418/mês recorrente</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="vp-btn">Exportar</button>
          <button className="vp-btn vp-btn-primary">+ Nova campanha</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        <Stat label="Apoiadores ativos" value="4.812" delta="+184" sub="este mês" />
        <Stat label="MRR (recorrente/mês)" value="R$ 82.418" delta="+6%" sub="meta R$ 100k" />
        <Stat label="Ticket médio" value="R$ 17,12" delta="+R$ 0,80" sub="modo PIX" />
        <Stat label="Churn mensal" value="3,2%" delta="-0,4%" sub="retenção boa" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Meta da campanha &ldquo;Série Pantanal&rdquo;</h3>
          <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 32, color: 'var(--vp-text)' }}>R$ 68.402 <span style={{ color: 'var(--vp-text-3)', fontSize: 16 }}>/ R$ 100.000</span></div>
          <div style={{ height: 10, background: 'var(--vp-border)', borderRadius: 5, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ width: '68%', height: '100%', background: 'var(--vp-accent)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--vp-text-3)' }}>
            <span>1.412 apoiadores nessa campanha</span>
            <span>68% · faltam 22 dias</span>
          </div>
        </div>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Planos</h3>
          {[
            ['Leitor', 'R$ 5/mês', '1.218 ativos', 12],
            ['Apoiador', 'R$ 15/mês', '2.812 ativos', 58],
            ['Guardião', 'R$ 40/mês', '618 ativos', 22],
            ['Mecenas', 'R$ 150/mês', '164 ativos', 18],
          ].map(([n,v,s,rev],i) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 60px', gap: 10, padding: '10px 0', alignItems: 'center', borderBottom: i<3?'1px solid var(--vp-border)':'none', fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>{n}</span>
              <span className="mono">{v}</span>
              <span style={{ color: 'var(--vp-text-3)' }}>{s}</span>
              <span style={{ color: 'var(--vp-accent)', fontWeight: 600, textAlign: 'right' }}>{rev}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="vp-panel" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 13, marginBottom: 14 }}>Últimas transações</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px 120px 80px', padding: '6px 10px', borderBottom: '1px solid var(--vp-border)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--vp-text-3)' }}>
          <span>Apoiador</span><span>E-mail</span><span>Plano</span><span>Valor</span><span>Método</span><span>Status</span>
        </div>
        {[
          ['Carla Menezes', 'carla.m@…', 'Apoiador', 'R$ 15,00', 'PIX', 'ok'],
          ['João de Sousa', 'jsousa@…', 'Guardião', 'R$ 40,00', 'Cartão', 'ok'],
          ['Ana Figueira', 'afig@…', 'Mecenas', 'R$ 150,00', 'Cartão', 'ok'],
          ['Leandro Paim', 'lpaim@…', 'Leitor', 'R$ 5,00', 'PIX', 'ok'],
          ['Regina Costa', 'rcosta@…', 'Apoiador', 'R$ 15,00', 'Cartão', 'falha'],
          ['Mário Ziller', 'mz@…', 'Guardião', 'R$ 40,00', 'Boleto', 'pendente'],
        ].map((t,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px 120px 80px', padding: '10px', borderBottom: i<5?'1px solid var(--vp-border)':'none', fontSize: 12, alignItems: 'center' }}>
            <span>{t[0]}</span>
            <span style={{ color: 'var(--vp-text-3)' }}>{t[1]}</span>
            <span style={{ color: 'var(--vp-accent)' }}>{t[2]}</span>
            <span className="mono">{t[3]}</span>
            <span style={{ color: 'var(--vp-text-3)' }}>{t[4]}</span>
            <span className="vp-tag vp-tag-outline" style={{
              color: t[5]==='ok'?'var(--vp-ok)':t[5]==='falha'?'var(--vp-urgent)':'#e0b44a',
              borderColor: t[5]==='ok'?'var(--vp-ok)':t[5]==='falha'?'var(--vp-urgent)':'#e0b44a',
            }}>{t[5]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAudit() {
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Logs de auditoria</h1>
      <p style={{ color: 'var(--vp-text-3)', fontSize: 13, marginBottom: 20 }}>Todas as ações sensíveis do admin nos últimos 90 dias</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input className="vp-input" placeholder="Buscar por usuário, ação, alvo…" style={{ maxWidth: 320 }} />
        <select className="vp-input" style={{ width: 180 }}><option>Todos usuários</option></select>
        <select className="vp-input" style={{ width: 180 }}><option>Todas ações</option><option>Publicação</option><option>Exclusão</option><option>Permissão alterada</option><option>Login</option></select>
        <select className="vp-input" style={{ width: 140 }}><option>Últimos 7 dias</option><option>30 dias</option><option>90 dias</option></select>
        <button className="vp-btn" style={{ marginLeft: 'auto' }}>Exportar CSV</button>
      </div>

      <div className="vp-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '140px 160px 110px 1fr 120px 80px', padding: '10px 16px', borderBottom: '1px solid var(--vp-border)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>
          <span>Data/Hora</span><span>Usuário</span><span>Ação</span><span>Alvo</span><span>IP</span><span>Status</span>
        </div>
        {[
          ['22/04 14:18', 'Marina Ribeiro', 'Publicou', '“O rio que sumiu — cap. 3”', '179.218.14.2', 'ok'],
          ['22/04 13:42', 'Pedro Yoshida', 'Removeu comentário', 'em “LDO 2027”', '177.112.8.14', 'ok'],
          ['22/04 12:18', 'Guilherme Otoni', 'Alterou permissão', 'Ana Figueira → Editor de editoria', '45.180.14.2', 'ok'],
          ['22/04 11:02', 'Carlos Benites', 'Editou', '“Cinco perguntas — Plano de Manejo”', '179.218.14.88', 'ok'],
          ['22/04 09:14', 'Clarice Noveli', 'Pausou campanha', 'JBS — Institucional', '187.84.14.210', 'ok'],
          ['22/04 08:40', 'Sistema', 'Backup automático', 'banco + mídia — 4.2 GB', '—', 'ok'],
          ['22/04 02:14', 'desconhecido', 'Tentativa de login', 'marina@vozpublicams.com.br', '103.244.8.4 · CN', 'bloqueado'],
          ['21/04 22:18', 'Marina Ribeiro', 'Revogou sessão', 'Chrome Windows · IP antigo', '179.218.14.2', 'ok'],
          ['21/04 19:40', 'Guilherme Otoni', 'Gerou chave API', 'integração n8n', '45.180.14.2', 'ok'],
          ['21/04 18:12', 'Tereza Mattos', 'Agendou coluna', '“O silêncio cúmplice”', '187.118.44.2', 'ok'],
        ].map((l,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 160px 110px 1fr 120px 80px', padding: '10px 16px', borderBottom: i<9?'1px solid var(--vp-border)':'none', fontSize: 12, alignItems: 'center', background: l[5]==='bloqueado' ? 'rgba(232,93,74,0.06)' : 'transparent' }}>
            <span className="mono" style={{ color: 'var(--vp-text-3)', fontSize: 11 }}>{l[0]}</span>
            <span style={{ fontWeight: 600 }}>{l[1]}</span>
            <span style={{ color: 'var(--vp-accent)' }}>{l[2]}</span>
            <span style={{ color: 'var(--vp-text-2)' }}>{l[3]}</span>
            <span className="mono" style={{ color: 'var(--vp-text-3)', fontSize: 11 }}>{l[4]}</span>
            <span className="vp-tag vp-tag-outline" style={{
              color: l[5]==='ok'?'var(--vp-ok)':'var(--vp-urgent)',
              borderColor: l[5]==='ok'?'var(--vp-ok)':'var(--vp-urgent)',
            }}>{l[5]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AdminKanban, AdminMetrics, AdminSettings, AdminProfile, AdminSubscriptions, AdminAudit });
