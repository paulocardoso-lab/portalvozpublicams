// Admin — CMS Editor (WYSIWYG-esque)
function AdminEditor() {
  const [content, setContent] = React.useState(
    `O Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: "o rio acabou, moço". Para chegar até ele, o Voz Pública atravessou 420 quilômetros de leito em três expedições.

Dados inéditos obtidos por Lei de Acesso mostram que, desde 2016, o volume de sedimento despejado no baixo curso cresceu 182%.`
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
      <div>
        {/* Status bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, fontSize: 12 }}>
          <span className="vp-tag vp-tag-outline">Rascunho</span>
          <span style={{ color: 'var(--vp-text-3)' }}>Salvo automaticamente há 12s · v14</span>
          <span style={{ color: 'var(--vp-text-3)' }}>· editando com Carlos Benites</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="vp-btn">Histórico</button>
            <button className="vp-btn">Pré-visualizar</button>
            <button className="vp-btn">Enviar para revisão</button>
            <button className="vp-btn vp-btn-primary">Publicar</button>
          </div>
        </div>

        {/* Editor canvas */}
        <div className="vp-panel" style={{ padding: 32, background: 'var(--vp-bg)' }}>
          <div style={{ marginBottom: 16, fontSize: 11, color: 'var(--vp-text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Eyebrow</div>
          <input className="vp-input" defaultValue="Investigação · Pantanal · 8 meses de apuração" style={{ marginBottom: 18, fontSize: 13 }} />

          <input
            className="vp-input"
            defaultValue="O rio que sumiu: como o Taquari virou corredor de sedimentos"
            style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 38, fontWeight: 700, padding: '8px 10px', border: '1px solid var(--vp-border)', marginBottom: 14, lineHeight: 1.1 }}
          />
          <textarea
            className="vp-input"
            defaultValue="Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do Pantanal sul — e encontrou uma bacia travada por assoreamento."
            style={{ fontFamily: 'var(--vp-serif)', fontStyle: 'italic', fontSize: 18, minHeight: 60, marginBottom: 18, resize: 'vertical' }}
          />

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 4, padding: '6px 8px', background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', borderRadius: 4, marginBottom: 10, fontFamily: 'var(--vp-sans)', fontSize: 12, flexWrap: 'wrap' }}>
            {['B','I','U','S'].map(b => (
              <button key={b} style={{ background: 'transparent', border: 'none', color: 'var(--vp-text)', width: 28, height: 28, fontWeight: 700, cursor: 'pointer', fontStyle: b==='I'?'italic':'normal', textDecoration: b==='U'?'underline':b==='S'?'line-through':'none' }}>{b}</button>
            ))}
            <span style={{ width: 1, background: 'var(--vp-border)', margin: '4px 4px' }} />
            <select style={{ background: 'transparent', color: 'var(--vp-text-2)', border: 'none', fontSize: 12 }}>
              <option>Parágrafo</option><option>Título H2</option><option>Título H3</option><option>Citação</option><option>Destaque</option>
            </select>
            <span style={{ width: 1, background: 'var(--vp-border)', margin: '4px 4px' }} />
            {['❝ Quote','⌾ Imagem','⊡ Galeria','▭ Vídeo','∿ Embed','≡ Lista','① Dado','↯ Divisor'].map(b => (
              <button key={b} className="vp-btn" style={{ padding: '4px 8px', fontSize: 11, border: 'none' }}>{b}</button>
            ))}
            <span style={{ marginLeft: 'auto', color: 'var(--vp-text-3)', fontSize: 11, alignSelf: 'center' }}>2.318 palavras · ~14 min de leitura</span>
          </div>

          {/* Featured image block */}
          <div style={{ border: '2px dashed var(--vp-border-2)', padding: 8, marginBottom: 18 }}>
            <ImgPH label="foto destacada · clique para substituir" height={220} />
            <input className="vp-input" defaultValue="Trecho do Taquari em Coxim, março de 2026. Foto: Bruno Kelly / Voz Pública" style={{ marginTop: 8, fontSize: 12, fontStyle: 'italic' }} />
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="vp-input"
            style={{ fontFamily: 'var(--vp-serif)', fontSize: 17, lineHeight: 1.6, minHeight: 280, resize: 'vertical' }}
          />

          {/* Inline quote block preview */}
          <blockquote style={{ borderLeft: '3px solid var(--vp-accent)', padding: '8px 0 8px 20px', margin: '18px 0', fontFamily: 'var(--vp-serif-display)', fontSize: 22, fontStyle: 'italic', color: 'var(--vp-text)' }}>
            “O Taquari não está doente. Ele está sendo engolido.”
            <div style={{ fontSize: 11, fontStyle: 'normal', color: 'var(--vp-text-3)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Débora Calheiros, Embrapa Pantanal · bloco citação</div>
          </blockquote>
        </div>
      </div>

      {/* Right sidebar — publishing options */}
      <aside style={{ display: 'grid', gap: 14, alignSelf: 'start' }}>
        <div className="vp-panel" style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>Publicação</h4>
          <div style={{ display: 'grid', gap: 10, fontSize: 12 }}>
            <label>Status
              <select className="vp-input" style={{ marginTop: 4 }}><option>Rascunho</option><option>Em revisão</option><option>Aprovado</option><option>Agendado</option></select>
            </label>
            <label>Data de publicação
              <input className="vp-input" type="datetime-local" defaultValue="2026-04-22T06:00" style={{ marginTop: 4 }} />
            </label>
            <label>Editoria
              <select className="vp-input" style={{ marginTop: 4 }}>
                <option>Pantanal</option><option>Política</option><option>Cidades</option><option>Indígenas</option>
              </select>
            </label>
            <label>Série
              <select className="vp-input" style={{ marginTop: 4 }}><option>O rio que sumiu (3/5)</option><option>—</option></select>
            </label>
          </div>
        </div>

        <div className="vp-panel" style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>Autores</h4>
          {['Marina Ribeiro','Carlos Benites'].map(a => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <ImgPH label="" width={24} height={24} style={{ borderRadius: '50%' }} />
              <span style={{ flex: 1, fontSize: 12 }}>{a}</span>
              <a style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>×</a>
            </div>
          ))}
          <button className="vp-btn" style={{ width: '100%', marginTop: 8, fontSize: 11 }}>+ Adicionar autor</button>
        </div>

        <div className="vp-panel" style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>Tags</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {['pantanal','taquari','ibama','semadesc','investigação'].map(t => (
              <span key={t} className="vp-tag vp-tag-outline" style={{ color: 'var(--vp-accent)', borderColor: 'var(--vp-accent)' }}>#{t} ×</span>
            ))}
          </div>
          <input className="vp-input" placeholder="Adicionar tag…" style={{ fontSize: 12 }} />
        </div>

        <div className="vp-panel" style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>SEO & redes</h4>
          <div style={{ display: 'grid', gap: 10, fontSize: 12 }}>
            <label>Slug
              <input className="vp-input" defaultValue="/pantanal/o-rio-que-sumiu-taquari" style={{ marginTop: 4, fontFamily: 'var(--vp-mono)' }} />
            </label>
            <label>Meta description
              <textarea className="vp-input" rows={3} defaultValue="420 km percorridos, 8 meses de apuração e a radiografia do colapso do Taquari." style={{ marginTop: 4, resize: 'vertical' }} />
            </label>
            <div style={{ padding: 10, background: 'var(--vp-bg)', borderRadius: 4, border: '1px solid var(--vp-border)' }}>
              <div style={{ fontSize: 10, color: 'var(--vp-text-3)' }}>vozpublicams.com.br</div>
              <div style={{ color: '#7aa2f7', fontSize: 13, marginTop: 2 }}>O rio que sumiu: como o Taquari virou…</div>
              <div style={{ fontSize: 10, color: 'var(--vp-text-3)', marginTop: 2, lineHeight: 1.4 }}>420 km percorridos, 8 meses de apuração e a radiografia do colapso…</div>
            </div>
          </div>
        </div>

        <div className="vp-panel" style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--vp-text-3)' }}>Opções</h4>
          {[['Comentários abertos', true],['Permitir indexação', true],['Aparecer na home', true],['Paywall/assinantes', false],['Enviar push', true],['Incluir na newsletter', true]].map(([l,v]) => (
            <label key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
              <span>{l}</span>
              <span style={{ display: 'inline-block', width: 28, height: 16, background: v ? 'var(--vp-accent)' : 'var(--vp-border-2)', borderRadius: 10, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 2, left: v?14:2, width: 12, height: 12, background: '#fff', borderRadius: '50%', transition: 'left .15s' }} />
              </span>
            </label>
          ))}
        </div>
      </aside>
    </div>
  );
}

// Comments moderation
function AdminComments() {
  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>Comentários</h1>
      <p style={{ color: 'var(--vp-text-3)', fontSize: 13, marginBottom: 18 }}>Fila de moderação · 12 aguardando · 4 sinalizados</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, fontSize: 12 }}>
        {['Aguardando (12)','Sinalizados (4)','Aprovados','Ocultos','Banidos'].map((t,i) => (
          <button key={t} className="vp-btn" style={{ background: i===0 ? 'var(--vp-surface-2)' : 'transparent', borderColor: i===0 ? 'var(--vp-accent)' : undefined }}>{t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <input className="vp-input" placeholder="Buscar comentário…" style={{ width: 220 }} />
          <select className="vp-input" style={{ width: 180 }}><option>Toda editoria</option><option>Pantanal</option><option>Política</option></select>
        </div>
      </div>

      <div className="vp-panel">
        {[
          { n:'Elza Morais', e:'elza.morais@email.com', c:'Sou de Coxim. O rio realmente mudou, e a cobertura de vocês é a primeira a ouvir ribeirinhos em vez de só fontes oficiais. Obrigada.', a:'O rio que sumiu', t:'há 12min', k:'ok' },
          { n:'Anônimo', e:'temp91@mail.com', c:'vocês são comprados pelo governo petista, só vale o que os patrões dos fazendeiros falam seus pilantras [palavrão removido automaticamente]', a:'O rio que sumiu', t:'há 22min', k:'flag', reasons:['insulto','palavrão'] },
          { n:'João Vicentini', e:'jvicentini@fazendaj.com.br', c:'Faltou ouvir produtor rural da margem. O texto dá um recorte só.', a:'O rio que sumiu', t:'há 38min', k:'ok' },
          { n:'visitante_123', e:'-', c:'http://site-duvidoso.ru/ganhe-r500 clique aqui e ganhe R$ 500 na hora', a:'Assembleia aprova LDO', t:'há 1h', k:'spam', reasons:['link suspeito','padrão de spam'] },
          { n:'Ana Lúcia Paes', e:'analp@ufms.br', c:'Publiquem os dados brutos em CSV, não só no repositório. Muita gente aqui não usa GitHub.', a:'O rio que sumiu', t:'há 1h', k:'ok' },
        ].map((cm,i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 220px', gap: 14, padding: 16, borderBottom: i<4 ? '1px solid var(--vp-border)' : 'none', alignItems: 'start', background: cm.k==='flag'?'rgba(232,93,74,0.05)':cm.k==='spam'?'rgba(224,180,74,0.04)':'transparent' }}>
            <ImgPH label="" width={36} height={36} style={{ borderRadius: '50%' }} />
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 13 }}>{cm.n}</strong>
                <span style={{ color: 'var(--vp-text-3)', fontSize: 11 }}>{cm.e}</span>
                {cm.k==='flag' && <span className="vp-tag" style={{ background: 'var(--vp-urgent)', color: '#fff' }}>Sinalizado</span>}
                {cm.k==='spam' && <span className="vp-tag" style={{ background: '#e0b44a', color: '#1a1a19' }}>Provável spam</span>}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--vp-text-3)' }}>{cm.t}</span>
              </div>
              <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 8 }}>{cm.c}</p>
              <div style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>
                em <a style={{ color: 'var(--vp-accent)' }}>{cm.a}</a>
                {cm.reasons && ` · motivos: ${cm.reasons.join(', ')}`}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="vp-btn vp-btn-primary" style={{ fontSize: 11 }}>Aprovar</button>
              <button className="vp-btn" style={{ fontSize: 11 }}>Responder</button>
              <button className="vp-btn" style={{ fontSize: 11 }}>Ocultar</button>
              <button className="vp-btn" style={{ fontSize: 11, color: 'var(--vp-urgent)', borderColor: 'var(--vp-urgent)' }}>Banir usuário</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12, color: 'var(--vp-text-3)' }}>
        <div><input type="checkbox" /> Selecionar todos · <a style={{ color: 'var(--vp-accent)' }}>Aprovar em massa</a> · <a style={{ color: 'var(--vp-accent)' }}>Excluir em massa</a></div>
        <div>Exibindo 1–5 de 12</div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminEditor, AdminComments });
