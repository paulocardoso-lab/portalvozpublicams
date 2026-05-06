// Admin — Users & permissions
function AdminUsers() {
  const roles = [
    { r: 'Super Admin', c: 'var(--vp-urgent)', p: 'Acesso total, gerencia usuários, cobrança e infraestrutura' },
    { r: 'Editor-chefe', c: 'var(--vp-accent)', p: 'Aprova, publica e despublica qualquer conteúdo' },
    { r: 'Editor de editoria', c: '#e0b44a', p: 'Publica na editoria atribuída; revisa matérias de repórteres' },
    { r: 'Repórter', c: '#7aa2f7', p: 'Cria e edita próprias matérias; envia para revisão' },
    { r: 'Colunista', c: '#c4a7e7', p: 'Publica na própria coluna sem revisão' },
    { r: 'Moderador', c: 'var(--vp-ok)', p: 'Apenas fila de comentários' },
    { r: 'Financeiro', c: '#8a887f', p: 'Apenas banners, assinaturas e métricas' },
  ];
  const users = [
    { n: 'Marina Ribeiro', e: 'marina@vp', r: 'Editor-chefe', s: 'online', t: 'há 2min', a: 482 },
    { n: 'Carlos Benites', e: 'carlos@vp', r: 'Repórter', s: 'online', t: 'há 6min', a: 124 },
    { n: 'Tereza Mattos', e: 'tereza@vp', r: 'Colunista', s: 'idle', t: 'há 40min', a: 218 },
    { n: 'Ademir Paredão', e: 'ademir@vp', r: 'Colunista', s: 'offline', t: 'ontem', a: 96 },
    { n: 'Lucas Fragoso', e: 'lucas@vp', r: 'Repórter', s: 'online', t: 'há 14min', a: 64 },
    { n: 'Ana Figueira', e: 'ana@vp', r: 'Editor de editoria', s: 'online', t: 'há 1min', a: 142 },
    { n: 'Rita Duarte', e: 'rita@vp', r: 'Repórter', s: 'offline', t: '2 dias', a: 38 },
    { n: 'Pedro Yoshida', e: 'pedro@vp', r: 'Moderador', s: 'online', t: 'há 3min', a: 0 },
    { n: 'Clarice Noveli', e: 'clarice@vp', r: 'Financeiro', s: 'offline', t: '3 dias', a: 0 },
    { n: 'Guilherme Otoni', e: 'gui@vp', r: 'Super Admin', s: 'idle', t: 'há 1h', a: 0 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Usuários & permissões</h1>
          <p style={{ color: 'var(--vp-text-3)', fontSize: 13 }}>10 usuários ativos · 7 níveis de acesso</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="vp-btn">Exportar</button>
          <button className="vp-btn vp-btn-primary">+ Convidar usuário</button>
        </div>
      </div>

      {/* Role legend / matrix */}
      <div className="vp-panel" style={{ padding: 18, marginBottom: 18 }}>
        <h3 style={{ fontSize: 13, marginBottom: 14 }}>Níveis de acesso</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--vp-border)', border: '1px solid var(--vp-border)' }}>
          {roles.map(r => (
            <div key={r.r} style={{ background: 'var(--vp-surface)', padding: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.c, marginBottom: 8 }} />
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{r.r}</div>
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)', lineHeight: 1.4 }}>{r.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User table */}
      <div className="vp-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.9fr 0.8fr 0.6fr', padding: '10px 16px', borderBottom: '1px solid var(--vp-border)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>
          <span>Usuário</span><span>Papel</span><span>Status</span><span>Matérias</span><span style={{ textAlign: 'right' }}>Ações</span>
        </div>
        {users.map((u, i) => {
          const role = roles.find(r => r.r === u.r);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.9fr 0.8fr 0.6fr', padding: '12px 16px', borderBottom: i < users.length-1 ? '1px solid var(--vp-border)' : 'none', alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <ImgPH label="" width={32} height={32} style={{ borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{u.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>{u.e}@vozpublicams.com.br</div>
                </div>
              </div>
              <span style={{ color: role?.c, fontWeight: 600, fontSize: 12 }}>{u.r}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--vp-text-2)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: u.s==='online'?'var(--vp-ok)':u.s==='idle'?'#e0b44a':'var(--vp-text-4)' }} />
                {u.s} · {u.t}
              </div>
              <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{u.a}</span>
              <div style={{ textAlign: 'right', fontSize: 12 }}>
                <a style={{ color: 'var(--vp-text-3)', marginRight: 10 }}>Editar</a>
                <a style={{ color: 'var(--vp-urgent)' }}>Suspender</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Admin — Banners & ads
function AdminAds() {
  const slots = [
    { n: 'Leaderboard topo', s: '728×90', f: '92%', r: 'R$ 8.420' },
    { n: 'Billboard inline', s: '970×120', f: '68%', r: 'R$ 4.180' },
    { n: 'Retângulo sidebar', s: '300×250', f: '100%', r: 'R$ 12.240' },
    { n: 'Skyscraper', s: '300×600', f: '84%', r: 'R$ 6.840' },
    { n: 'Nativo in-feed', s: 'flex', f: '100%', r: 'R$ 6.740' },
  ];
  const campaigns = [
    { n: 'BYD — ATTO 8 (abr)', c: 'Agência Z', slot: 'Leaderboard topo', imp: '412.8k', cli: '3.214', ctr: '0,78%', end: '28/04', st: 'ativa' },
    { n: 'Sicredi MS — Safra', c: 'Direto', slot: 'Retângulo sidebar', imp: '284.1k', cli: '2.114', ctr: '0,74%', end: '15/05', st: 'ativa' },
    { n: 'UFMS — Vestibular', c: 'Direto', slot: 'Billboard inline', imp: '88.2k', cli: '1.218', ctr: '1,38%', end: '05/05', st: 'ativa' },
    { n: 'JBS — Institucional', c: 'Agência X', slot: 'Skyscraper', imp: '128.3k', cli: '612', ctr: '0,48%', end: '02/05', st: 'pausada' },
    { n: 'Shop MS — Nativo', c: 'Direto', slot: 'Nativo in-feed', imp: '44.0k', cli: '1.812', ctr: '4,12%', end: '24/04', st: 'expira amanhã' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Banners & publicidade</h1>
          <p style={{ color: 'var(--vp-text-3)', fontSize: 13 }}>5 slots · 14 campanhas ativas · R$ 38.420 faturado este mês</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="vp-btn">Relatório</button>
          <button className="vp-btn vp-btn-primary">+ Nova campanha</button>
        </div>
      </div>

      {/* Slots */}
      <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--vp-text-3)', marginBottom: 10 }}>Slots disponíveis</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
        {slots.map(s => (
          <div key={s.n} className="vp-panel" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.n}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--vp-text-3)', marginBottom: 10 }}>{s.s}</div>
            <div style={{ height: 6, background: 'var(--vp-border)', borderRadius: 3, marginBottom: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: s.f, background: 'var(--vp-accent)', borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--vp-text-3)' }}>
              <span>ocupação {s.f}</span><span>{s.r}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Layout visualizer */}
      <div className="vp-panel" style={{ padding: 16, marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, marginBottom: 12 }}>Visualização dos slots na home</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 10, background: 'var(--vp-bg)', padding: 14, border: '1px solid var(--vp-border)' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="vp-ad" style={{ height: 56 }}>728×90 · Leaderboard topo</div>
            <div style={{ background: 'var(--vp-surface-2)', height: 140, borderRadius: 2, padding: 10, fontSize: 10, color: 'var(--vp-text-3)' }}>conteúdo editorial · hero</div>
            <div className="vp-ad" style={{ height: 70 }}>970×120 · Billboard inline</div>
            <div style={{ background: 'var(--vp-surface-2)', height: 100, borderRadius: 2, padding: 10, fontSize: 10, color: 'var(--vp-text-3)' }}>conteúdo editorial</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="vp-ad" style={{ height: 150 }}>300×250</div>
            <div className="vp-ad" style={{ height: 220 }}>300×600 · Skyscraper</div>
          </div>
        </div>
      </div>

      {/* Campaigns */}
      <div className="vp-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', padding: '10px 16px', borderBottom: '1px solid var(--vp-border)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--vp-text-3)' }}>
          <span>Campanha</span><span>Cliente</span><span>Slot</span><span>Impressões</span><span>Cliques</span><span>CTR</span><span>Fim</span><span>Status</span>
        </div>
        {campaigns.map((c,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', padding: '12px 16px', borderBottom: i<campaigns.length-1 ? '1px solid var(--vp-border)' : 'none', fontSize: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="vp-ad" style={{ width: 40, height: 24, fontSize: 7 }}>{c.slot.includes('728')?'':''}</div>
              <span style={{ fontWeight: 600, color: 'var(--vp-text)' }}>{c.n}</span>
            </div>
            <span style={{ color: 'var(--vp-text-2)' }}>{c.c}</span>
            <span style={{ color: 'var(--vp-text-2)' }}>{c.slot}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{c.imp}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{c.cli}</span>
            <span className="mono" style={{ color: 'var(--vp-text-2)' }}>{c.ctr}</span>
            <span className="mono" style={{ color: 'var(--vp-text-3)' }}>{c.end}</span>
            <span className="vp-tag vp-tag-outline" style={{
              color: c.st==='ativa' ? 'var(--vp-ok)' : c.st==='pausada' ? 'var(--vp-text-3)' : '#e0b44a',
              borderColor: c.st==='ativa' ? 'var(--vp-ok)' : c.st==='pausada' ? 'var(--vp-text-3)' : '#e0b44a',
            }}>{c.st}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin — Appearance
function AdminAppearance() {
  const accents = ['#d97757','#c89c5a','#7aa2f7','#c4a7e7','#7aa37a'];
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Aparência & layout</h1>
      <p style={{ color: 'var(--vp-text-3)', fontSize: 13, marginBottom: 20 }}>Controles de marca, tipografia e organização da home</p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18 }}>
        {/* Controls */}
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="vp-panel" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>Identidade</h3>
            <label style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>Logo (monograma)
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--vp-bg)', border: '1px solid var(--vp-border)', marginTop: 4 }}>
                <Monogram size="md" />
                <button className="vp-btn" style={{ marginLeft: 'auto', fontSize: 11 }}>Trocar</button>
              </div>
            </label>
            <label style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>Slogan
              <input className="vp-input" defaultValue="Jornalismo independente de Mato Grosso do Sul" style={{ marginTop: 4 }} />
            </label>
            <label style={{ fontSize: 12, display: 'block' }}>Cor de destaque
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {accents.map((a,i) => (
                  <span key={a} style={{ width: 32, height: 32, borderRadius: '50%', background: a, border: i===0?'2px solid var(--vp-text)':'2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </label>
          </div>

          <div className="vp-panel" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>Tipografia</h3>
            <label style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>Fonte dos títulos
              <select className="vp-input" style={{ marginTop: 4 }}><option>Playfair Display</option><option>Source Serif 4</option><option>IBM Plex Serif</option></select>
            </label>
            <label style={{ fontSize: 12, display: 'block', marginBottom: 10 }}>Fonte do corpo
              <select className="vp-input" style={{ marginTop: 4 }}><option>Source Serif 4</option><option>Georgia</option><option>Inter (sans)</option></select>
            </label>
            <label style={{ fontSize: 12, display: 'block' }}>Escala de leitura
              <input type="range" min="90" max="120" defaultValue="100" style={{ width: '100%', marginTop: 8, accentColor: 'var(--vp-accent)' }} />
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)', textAlign: 'right' }}>100%</div>
            </label>
          </div>

          <div className="vp-panel" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>Modo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button className="vp-btn" style={{ padding: 12, borderColor: 'var(--vp-accent)' }}>● Escuro (padrão)</button>
              <button className="vp-btn" style={{ padding: 12 }}>○ Claro</button>
            </div>
            <label style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              Seguir preferência do sistema <input type="checkbox" defaultChecked />
            </label>
          </div>

          <div className="vp-panel" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>Densidade da home</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {['Leve','Média','Densa'].map((d,i) => (
                <button key={d} className="vp-btn" style={{ padding: 10, fontSize: 11, borderColor: i===2?'var(--vp-accent)':undefined }}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — home layout blocks / drag-reorder */}
        <div className="vp-panel" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13 }}>Blocos da home — arraste para reordenar</h3>
            <button className="vp-btn" style={{ fontSize: 11 }}>+ Adicionar bloco</button>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { n: 'Hero — Manchete principal', t: 'hero', on: true },
              { n: 'Ad · Leaderboard topo', t: 'ad', on: true },
              { n: 'Trio de chamadas', t: 'grid-3', on: true },
              { n: 'Especial · Pantanal (fixo)', t: 'serie', on: true },
              { n: 'Ad · Billboard inline', t: 'ad', on: true },
              { n: '3 colunas — Política / Economia / Cidades', t: 'cols-3', on: true },
              { n: 'Colunistas', t: 'authors', on: true },
              { n: 'Mais lidas + Podcast', t: 'split', on: true },
              { n: 'Newsletter (sidebar)', t: 'aside', on: true },
              { n: 'Eventos / Agenda pública', t: 'side', on: false },
            ].map((b, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 80px 1fr 80px 60px', gap: 12, alignItems: 'center', padding: '10px 12px', background: 'var(--vp-bg)', border: '1px solid var(--vp-border)', borderRadius: 4, opacity: b.on ? 1 : 0.5 }}>
                <span style={{ color: 'var(--vp-text-3)', cursor: 'grab' }}>⋮⋮</span>
                <span className="vp-tag vp-tag-outline" style={{ textAlign: 'center' }}>{b.t}</span>
                <span style={{ fontSize: 13 }}>{b.n}</span>
                <span style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>#{i+1}</span>
                <label style={{ display: 'inline-block', width: 28, height: 16, background: b.on ? 'var(--vp-accent)' : 'var(--vp-border-2)', borderRadius: 10, position: 'relative', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 2, left: b.on?14:2, width: 12, height: 12, background: '#fff', borderRadius: '50%' }} />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin — Social
function AdminSocial() {
  const channels = [
    { n: 'Instagram', u: '@vozpublicams', f: '48.2k', a: 'conectado', c: '#c4a7e7' },
    { n: 'Facebook', u: '/vozpublicams', f: '32.1k', a: 'conectado', c: '#7aa2f7' },
    { n: 'X / Twitter', u: '@vozpublicams', f: '18.4k', a: 'conectado', c: 'var(--vp-text)' },
    { n: 'YouTube', u: 'Voz Pública MS', f: '12.8k', a: 'conectado', c: 'var(--vp-urgent)' },
    { n: 'TikTok', u: '@vozpublicams', f: '22.4k', a: 'conectado', c: 'var(--vp-text)' },
    { n: 'WhatsApp Canal', u: 'Voz Pública MS', f: '84.1k', a: 'conectado', c: 'var(--vp-ok)' },
    { n: 'LinkedIn', u: '/company/vp', f: '4.2k', a: 'desconectado', c: '#7aa2f7' },
    { n: 'Bluesky', u: '@vp.bsky.social', f: '2.1k', a: 'desconectado', c: '#7aa2f7' },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Redes sociais</h1>
      <p style={{ color: 'var(--vp-text-3)', fontSize: 13, marginBottom: 20 }}>Conecte canais, agende publicações e acompanhe desempenho</p>

      {/* Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {channels.map(c => (
          <div key={c.n} className="vp-panel" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: c.c, color: '#1a1a19', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, borderRadius: 4 }}>
                {c.n[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.n}</div>
                <div style={{ fontSize: 10, color: 'var(--vp-text-3)' }}>{c.u}</div>
              </div>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.a==='conectado' ? 'var(--vp-ok)' : 'var(--vp-text-4)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--vp-text-3)', marginBottom: 10 }}>
              <span>Seguidores</span><span className="mono" style={{ color: 'var(--vp-text)' }}>{c.f}</span>
            </div>
            <button className="vp-btn" style={{ width: '100%', fontSize: 11 }}>{c.a==='conectado' ? 'Gerenciar' : 'Conectar'}</button>
          </div>
        ))}
      </div>

      {/* Auto-post rules + scheduler */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Publicação automática</h3>
          {[
            ['Ao publicar matéria, postar no Instagram (carrossel)', true],
            ['Ao publicar matéria, postar no Facebook', true],
            ['Ao publicar matéria, tweetar no X', true],
            ['Ao publicar matéria, enviar no Canal WhatsApp', true],
            ['Criar reel vertical automático para TikTok', false],
            ['Push notification em matérias de urgência', true],
          ].map(([t,v],i) => (
            <label key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 13, borderBottom: i<5?'1px solid var(--vp-border)':'none' }}>
              <span>{t}</span>
              <span style={{ display: 'inline-block', width: 28, height: 16, background: v ? 'var(--vp-accent)' : 'var(--vp-border-2)', borderRadius: 10, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 2, left: v?14:2, width: 12, height: 12, background: '#fff', borderRadius: '50%' }} />
              </span>
            </label>
          ))}
        </div>

        <div className="vp-panel" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 13, marginBottom: 14 }}>Fila de publicação</h3>
          {[
            { c: 'Instagram', t: '“O rio que sumiu” — carrossel 8 cards', h: 'hoje, 18:00', st: 'agendado' },
            { c: 'X', t: '“Assembleia aprova LDO 2027 após 6h de sessão”', h: 'hoje, 15:30', st: 'agendado' },
            { c: 'WhatsApp', t: 'Newsletter A Semana em MS', h: 'sáb, 08:00', st: 'agendado' },
            { c: 'TikTok', t: 'Vídeo: o dia em que o fogo chegou…', h: 'ontem, 20:00', st: 'publicado' },
          ].map((p,i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: 10, padding: '12px 0', borderBottom: i<3?'1px solid var(--vp-border)':'none' }}>
              <span className="vp-tag vp-tag-outline" style={{ textAlign: 'center' }}>{p.c}</span>
              <div>
                <div style={{ fontSize: 13, color: 'var(--vp-text-2)' }}>{p.t}</div>
                <div style={{ fontSize: 11, color: 'var(--vp-text-3)', marginTop: 2 }}>{p.h}</div>
              </div>
              <span style={{ fontSize: 11, color: p.st==='publicado'?'var(--vp-ok)':'var(--vp-accent)' }}>{p.st}</span>
            </div>
          ))}
          <button className="vp-btn" style={{ width: '100%', marginTop: 12, fontSize: 12 }}>+ Agendar publicação</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminUsers, AdminAds, AdminAppearance, AdminSocial });
