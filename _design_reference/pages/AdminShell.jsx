// Admin shell — sidebar + topbar used by all admin pages
function AdminShell({ active, onNavigate, children, user }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '□' },
    { id: 'posts',     label: 'Matérias', icon: '≡' },
    { id: 'editor',    label: 'Nova matéria', icon: '✎' },
    { id: 'kanban',    label: 'Fila editorial', icon: '▦' },
    { id: 'comments',  label: 'Comentários', icon: '◉', badge: 12 },
    { id: 'users',     label: 'Usuários & permissões', icon: '◎' },
    { id: 'ads',       label: 'Banners & publicidade', icon: '▭' },
    { id: 'appearance',label: 'Aparência & layout', icon: '⌘' },
    { id: 'social',    label: 'Redes sociais', icon: '#' },
    { id: 'metrics',   label: 'Métricas & tráfego', icon: '↗' },
    { id: 'subscriptions', label: 'Assinaturas & doações', icon: '♥' },
    { id: 'audit',     label: 'Logs de auditoria', icon: '⎆' },
    { id: 'profile',   label: 'Meu perfil', icon: '◐' },
    { id: 'settings',  label: 'Configurações', icon: '⚙' },
  ];
  return (
    <div className="vp-admin" style={{ width: '100%', minHeight: '100%', background: '#111110', color: 'var(--vp-text)', display: 'grid', gridTemplateColumns: '232px 1fr' }}>
      {/* Sidebar */}
      <aside style={{ background: '#0e0e0d', borderRight: '1px solid var(--vp-border)', padding: '18px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '0 18px 18px', borderBottom: '1px solid var(--vp-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Monogram size="sm" />
          <div style={{ fontSize: 11, color: 'var(--vp-text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin</div>
        </div>
        <nav style={{ display: 'grid', gap: 2, padding: '6px 10px' }}>
          {nav.map(n => (
            <a key={n.id} onClick={() => onNavigate?.(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 4, cursor: 'pointer',
              background: active === n.id ? 'var(--vp-surface-2)' : 'transparent',
              color: active === n.id ? 'var(--vp-text)' : 'var(--vp-text-2)',
              borderLeft: active === n.id ? '2px solid var(--vp-accent)' : '2px solid transparent',
              fontSize: 13, fontWeight: active === n.id ? 600 : 500,
            }}>
              <span style={{ width: 16, textAlign: 'center', color: active===n.id ? 'var(--vp-accent)' : 'var(--vp-text-3)' }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge ? <span style={{ background: 'var(--vp-accent)', color: '#1a1a19', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>{n.badge}</span> : null}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--vp-border)', padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ImgPH label="" width={32} height={32} style={{ borderRadius: '50%' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Marina Ribeiro'}</div>
            <div style={{ fontSize: 10, color: 'var(--vp-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{user?.role || 'Editora-chefe'}</div>
          </div>
          <a style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>Sair</a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderBottom: '1px solid var(--vp-border)', background: '#141413' }}>
          <input className="vp-input" placeholder="Buscar matérias, autores, tags…" style={{ maxWidth: 420 }} />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', fontSize: 12 }}>
            <span className="vp-tag" style={{ background: 'var(--vp-ok)', color: '#0e0e0d' }}>● Online</span>
            <span style={{ color: 'var(--vp-text-3)' }}>12 em rascunho · 4 em revisão</span>
            <button className="vp-btn">Ver site →</button>
            <button className="vp-btn vp-btn-primary">+ Nova matéria</button>
          </div>
        </div>
        <div style={{ padding: '22px 26px' }}>{children}</div>
      </main>
    </div>
  );
}

function Stat({ label, value, delta, sub }) {
  const up = delta?.startsWith('+');
  return (
    <div className="vp-panel" style={{ padding: 16 }}>
      <div style={{ fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 30, color: 'var(--vp-text)', lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 8, fontSize: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        {delta && <span style={{ color: up ? 'var(--vp-ok)' : 'var(--vp-urgent)', fontWeight: 600 }}>{delta}</span>}
        <span style={{ color: 'var(--vp-text-3)' }}>{sub}</span>
      </div>
    </div>
  );
}

function Sparkline({ points, color = 'var(--vp-accent)', height = 50 }) {
  const max = Math.max(...points), min = Math.min(...points);
  const w = 100;
  const step = w / (points.length - 1);
  const norm = v => height - ((v - min) / (max - min || 1)) * (height - 6) - 3;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i*step} ${norm(p)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <path d={`${path} L ${w} ${height} L 0 ${height} Z`} fill={color} opacity="0.15" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function Dashboard() {
  const traffic = [32,28,36,40,38,44,52,48,60,58,66,72,68,82,90,88,94,102,98,110,116,122,118,132];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Bom dia, Marina</h1>
          <div style={{ color: 'var(--vp-text-3)', fontSize: 13 }}>Quarta, 22 de abril · 14 matérias publicadas nas últimas 24h</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="vp-input" style={{ width: 140 }}><option>Últimas 24h</option><option>7 dias</option><option>30 dias</option></select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        <Stat label="Usuários online" value="2.418" delta="+12%" sub="vs. ontem" />
        <Stat label="Page views (24h)" value="184.502" delta="+7%" sub="141k únicos" />
        <Stat label="Assinantes news" value="43.118" delta="+184" sub="hoje" />
        <Stat label="Receita de anúncios (mês)" value="R$ 38.420" delta="+4%" sub="vs. março" />
      </div>

      {/* Traffic + top content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 18 }}>
        <div className="vp-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Tráfego em tempo real</h3>
              <div style={{ fontSize: 12, color: 'var(--vp-text-3)' }}>Visitantes por hora — últimas 24h</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--vp-text-3)' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--vp-accent)', borderRadius: '50%', marginRight: 6 }} />orgânico
              <span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--vp-text-3)', borderRadius: '50%', marginLeft: 12, marginRight: 6 }} />direto
            </div>
          </div>
          <div style={{ height: 180 }}><Sparkline points={traffic} height={180} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'var(--vp-mono)', fontSize: 10, color: 'var(--vp-text-3)' }}>
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>agora</span>
          </div>
        </div>
        <div className="vp-panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Mais lidas agora</h3>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {[
              ['O rio que sumiu: como o Taquari virou corredor', '18.402'],
              ['Assembleia aprova LDO 2027 após 6h de sessão', '12.118'],
              ['Raio-X: patrimônio dos 24 deputados de MS', '9.842'],
              ['Obra da Duque de Caxias atrasa 14 meses', '6.218'],
              ['PCC nas cidades de fronteira de MS', '5.912'],
            ].map(([t,v],i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10, fontSize: 12 }}>
                <span style={{ fontFamily: 'var(--vp-mono)', color: 'var(--vp-accent)', fontWeight: 700 }}>{i+1}</span>
                <span style={{ color: 'var(--vp-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
                <span className="mono" style={{ color: 'var(--vp-text-3)' }}>{v}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Content pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { t: 'Rascunhos', n: 12, c: 'var(--vp-text-3)' },
          { t: 'Em revisão', n: 4, c: '#e0b44a' },
          { t: 'Aprovadas hoje', n: 7, c: 'var(--vp-ok)' },
          { t: 'Agendadas', n: 3, c: 'var(--vp-accent)' },
        ].map(p => (
          <div key={p.t} className="vp-panel" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 4, height: 36, background: p.c, borderRadius: 2 }} />
            <div>
              <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 26 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.t}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: activity + alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="vp-panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Atividade recente</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12, fontSize: 12 }}>
            {[
              ['Carlos Benites', 'publicou', '“Cinco perguntas sobre o Plano de Manejo”', 'há 12min'],
              ['Ana Figueira', 'enviou para revisão', '“Dourados: prefeito enfrenta 3ª cassação”', 'há 38min'],
              ['Tereza Mattos', 'agendou coluna', '“O silêncio cúmplice da bancada”', 'há 1h'],
              ['Lucas Fragoso', 'editou', '“Quem são os donos das terras”', 'há 2h'],
              ['Moderação', 'removeu 3 comentários em', '“O rio que sumiu”', 'há 3h'],
            ].map((a,i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, paddingBottom: 10, borderBottom: i<4 ? '1px solid var(--vp-border)' : 'none', alignItems: 'center' }}>
                <ImgPH label="" width={24} height={24} style={{ borderRadius: '50%' }} />
                <div><strong>{a[0]}</strong> <span style={{ color: 'var(--vp-text-3)' }}>{a[1]}</span> <span style={{ color: 'var(--vp-text-2)' }}>{a[2]}</span></div>
                <span className="mono" style={{ color: 'var(--vp-text-3)', fontSize: 10 }}>{a[3]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="vp-panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Alertas & tarefas</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 12 }}>
            {[
              ['urgent', '4 comentários sinalizados aguardam moderação'],
              ['warn', 'Banner “BYD — Sidebar” expira em 2 dias'],
              ['info', 'Newsletter “Semana em MS” — envio em 3h'],
              ['info', 'Backup automático concluído (03:14)'],
              ['warn', 'Carlos Benites: 2 matérias sem imagem destacada'],
            ].map(([k,t],i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: 10, alignItems: 'center', padding: '10px 12px', background: 'var(--vp-bg)', border: '1px solid var(--vp-border)', borderRadius: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: k==='urgent'?'var(--vp-urgent)':k==='warn'?'#e0b44a':'var(--vp-text-3)' }} />
                <span style={{ color: 'var(--vp-text-2)' }}>{t}</span>
                <a style={{ color: 'var(--vp-accent)', fontWeight: 600 }}>Ver</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminShell, Dashboard, Stat, Sparkline });
