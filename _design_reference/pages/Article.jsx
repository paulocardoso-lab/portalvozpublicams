// Article reading page — Voz Pública MS
function Article() {
  return (
    <div className="vp-root" style={{ width: '100%', minHeight: '100%', background: 'var(--vp-bg)' }}>
      <Masthead />

      {/* Breadcrumb */}
      <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--vp-border)', fontFamily: 'var(--vp-sans)', fontSize: 11, color: 'var(--vp-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        <span>Editorias</span> <span style={{ margin: '0 8px', color: 'var(--vp-text-4)' }}>/</span>
        <span style={{ color: 'var(--vp-accent)' }}>Pantanal</span> <span style={{ margin: '0 8px', color: 'var(--vp-text-4)' }}>/</span>
        <span>Investigação</span>
      </div>

      <article style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', gap: 36, padding: '36px 48px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Left — sticky share */}
        <aside style={{ position: 'sticky', top: 160, alignSelf: 'start', display: 'grid', gap: 16 }}>
          <div className="meta" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 10, marginBottom: 4 }}>Compartilhar</div>
          {['WhatsApp','Facebook','X / Twitter','LinkedIn','Copiar link','Imprimir'].map(s => (
            <a key={s} style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text-2)', borderLeft: '1px solid var(--vp-border)', paddingLeft: 12 }}>{s}</a>
          ))}
          <div style={{ marginTop: 10, padding: 12, border: '1px solid var(--vp-border)', fontSize: 11, fontFamily: 'var(--vp-sans)', color: 'var(--vp-text-3)', lineHeight: 1.5 }}>
            Esta reportagem é aberta e sem paywall. Se considera importante, <a style={{ color: 'var(--vp-accent)' }}>contribua</a>.
          </div>
        </aside>

        {/* Main — article body */}
        <div style={{ maxWidth: 680 }}>
          <span className="eyebrow">Investigação · Pantanal · 8 meses de apuração</span>
          <h1 style={{ fontSize: 52, lineHeight: 1.05, margin: '14px 0 18px', letterSpacing: '-0.015em' }}>
            O rio que sumiu: como o Taquari virou um corredor de sedimentos
          </h1>
          <p style={{ fontSize: 20, fontStyle: 'italic', color: 'var(--vp-text-2)', lineHeight: 1.45, fontFamily: 'var(--vp-serif)', marginBottom: 22 }}>
            Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do Pantanal sul — e encontrou uma bacia travada por assoreamento, fazendas às margens e um plano federal parado há uma década.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingTop: 18, borderTop: '1px solid var(--vp-border)', borderBottom: '1px solid var(--vp-border)', padding: '14px 0', marginBottom: 28 }}>
            <ImgPH label="" width={44} height={44} style={{ borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 13, color: 'var(--vp-text)', fontWeight: 600 }}>
                Por Marina Ribeiro e Carlos Benites
              </div>
              <div className="byline">22 de abril de 2026, 06:00 · Atualizado há 2h · 14 min de leitura</div>
            </div>
          </div>

          <ImgPH label="foto · leito do rio taquari" height={460} style={{ marginBottom: 14 }} />
          <div className="meta" style={{ fontStyle: 'italic', marginBottom: 28 }}>
            Trecho do Taquari no município de Coxim, em março de 2026. A região perdeu 2/3 da vazão em duas décadas. Foto: Bruno Kelly / Voz Pública
          </div>

          <div style={{ fontFamily: 'var(--vp-serif)', fontSize: 19, lineHeight: 1.65, color: 'var(--vp-text)' }}>
            <p style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--vp-serif-display)', float: 'left', fontSize: 78, lineHeight: 0.85, paddingRight: 10, paddingTop: 6, color: 'var(--vp-accent)' }}>N</span>
              as manhãs de abril, o Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: “o rio acabou, moço”. Para chegar até ele, o Voz Pública atravessou 420 quilômetros de leito em três expedições. O que encontrou foi a radiografia de um colapso silencioso — e, ao mesmo tempo, o retrato exato do que a ciência vem alertando desde 2014.
            </p>
            <p style={{ marginBottom: 20 }}>
              Dados inéditos obtidos por Lei de Acesso mostram que, desde 2016, o volume de sedimento despejado no baixo curso cresceu 182%. A cada temporada seca, areia e silte se acumulam; a cada cheia, o rio tenta desviar e invade fazendas. O <em>leque aluvial</em> — o grande funil natural do Pantanal — virou um corredor sem limites.
            </p>
            <blockquote style={{ borderLeft: '3px solid var(--vp-accent)', padding: '8px 0 8px 24px', margin: '30px 0', fontFamily: 'var(--vp-serif-display)', fontSize: 28, lineHeight: 1.25, fontStyle: 'italic', color: 'var(--vp-text)' }}>
              “O Taquari não está doente. Ele está sendo engolido por um modelo agropecuário que ignora a paisagem.”
              <footer style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, fontStyle: 'normal', color: 'var(--vp-text-3)', marginTop: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Débora Calheiros · hidróloga, Embrapa Pantanal</footer>
            </blockquote>
            <h2 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 32, margin: '32px 0 16px' }}>Um plano parado há 11 anos</h2>
            <p style={{ marginBottom: 20 }}>
              O “Programa de Revitalização do Taquari”, anunciado em 2015 pelo governo federal, previa R$ 480 milhões em oito anos. Até hoje, menos de 9% do orçamento foi executado. Documentos obtidos pela reportagem mostram que três secretários estaduais diferentes pediram retomada do programa — sem resposta.
            </p>

            {/* Data callout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--vp-border)', border: '1px solid var(--vp-border)', margin: '28px 0' }}>
              {[
                ['182%','Aumento no sedimento despejado (2016–2025)'],
                ['R$ 480M','Previsto no plano federal — 9% executado'],
                ['420 km','Leito percorrido pela equipe'],
              ].map(([n,l]) => (
                <div key={n} style={{ background: 'var(--vp-surface)', padding: 20 }}>
                  <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 36, color: 'var(--vp-accent)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text-2)', marginTop: 6, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>

            <p style={{ marginBottom: 20 }}>
              No trecho entre São Gabriel do Oeste e Coxim, as margens mostram pivôs de irrigação a menos de cem metros da calha — o que contraria o Código Florestal. Procurada, a Semadesc informou que “acompanha a situação” e que novas autuações estão em curso. Em resposta enviada por e-mail, o Ministério do Meio Ambiente afirmou que o plano será “repactuado” neste semestre. Não há prazo.
            </p>
            <p>
              O restante desta reportagem está dividido em cinco capítulos — clique para navegar.
            </p>
          </div>

          {/* Chapter nav */}
          <div style={{ marginTop: 28, border: '1px solid var(--vp-border)', background: 'var(--vp-surface)' }}>
            {['01 · O leito que engoliu o rio','02 · Os donos da margem','03 · O plano que nunca saiu do papel','04 · Ciência: o que está em jogo','05 · O que pode ser feito'].map((c,i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: i < 4 ? '1px solid var(--vp-border)' : 'none', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--vp-sans)', fontSize: 14, cursor: 'pointer', color: i === 0 ? 'var(--vp-accent)' : 'var(--vp-text-2)' }}>
                <span>{c}</span>
                <span className="meta">{['4 min','6 min','3 min','5 min','4 min'][i]}</span>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div style={{ marginTop: 28, padding: 20, border: '1px solid var(--vp-border)', background: 'rgba(217,119,87,0.05)' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Metodologia</div>
            <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, lineHeight: 1.6, color: 'var(--vp-text-2)' }}>
              Esta reportagem analisou 3.214 autos de infração do Ibama, 14 anos de dados hidrológicos da ANA e imagens de satélite Sentinel-2. Consultamos 22 fontes. Dados brutos e documentos estão disponíveis em <a style={{ color: 'var(--vp-accent)' }}>github.com/vozpublicams/taquari</a>.
            </p>
          </div>

          {/* Comments */}
          <div style={{ marginTop: 48, borderTop: '1px solid var(--vp-border)', paddingTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22 }}>Comentários · 47</h3>
              <select className="vp-input" style={{ width: 180, fontSize: 12 }}>
                <option>Mais relevantes</option><option>Mais recentes</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: 14, border: '1px solid var(--vp-border)', marginBottom: 18 }}>
              <ImgPH label="" width={36} height={36} style={{ borderRadius: '50%' }} />
              <textarea className="vp-input" placeholder="Compartilhe sua análise. Leia antes as regras de moderação." style={{ flex: 1, minHeight: 70, resize: 'vertical', fontFamily: 'var(--vp-serif)' }} />
            </div>
            {[
              { n: 'Elza Morais', t: '12h', c: 'Sou de Coxim. O rio realmente mudou, e a cobertura de vocês é a primeira a ouvir ribeirinhos em vez de só fontes oficiais. Obrigada.', v: 34 },
              { n: 'João Vicentini', t: '8h', c: 'Faltou ouvir produtor rural da margem. O texto dá um recorte só.', v: 4 },
              { n: 'Ana Lúcia Paes', t: '6h', c: 'Publiquem os dados brutos em CSV, não só no repositório. Muita gente aqui não usa GitHub.', v: 22 },
            ].map((cm, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 12, paddingBottom: 18, marginBottom: 18, borderBottom: i < 2 ? '1px solid var(--vp-border)' : 'none' }}>
                <ImgPH label="" width={40} height={40} style={{ borderRadius: '50%' }} />
                <div>
                  <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 13, color: 'var(--vp-text)', fontWeight: 600 }}>{cm.n} <span style={{ color: 'var(--vp-text-3)', fontWeight: 400, marginLeft: 8 }}>· {cm.t}</span></div>
                  <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, color: 'var(--vp-text-2)', lineHeight: 1.55, margin: '6px 0 10px' }}>{cm.c}</p>
                  <div style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, color: 'var(--vp-text-3)', display: 'flex', gap: 16 }}>
                    <span>▲ {cm.v}</span><a>Responder</a><a>Denunciar</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ display: 'grid', gap: 20, alignSelf: 'start' }}>
          <div className="vp-ad" style={{ height: 250 }}>300 × 250</div>
          <div>
            <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 12 }}>Leia também</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
              {['Os donos das terras que mais desmatam no Pantanal','O mapa do fogo: MS em tempo real','Pesquisadores deixam Embrapa Pantanal por cortes','Governo federal destrava apenas 9% do plano'].map((h,i) => (
                <li key={i} style={{ paddingBottom: 12, borderBottom: i < 3 ? '1px solid var(--vp-border)' : 'none' }}>
                  <h4 className="vp-headline" style={{ fontSize: 14 }}>{h}</h4>
                  <div className="byline" style={{ marginTop: 4 }}>há {i+2} dias</div>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'var(--vp-surface)', padding: 16, border: '1px solid var(--vp-border)' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Apoie esta reportagem</div>
            <p style={{ fontSize: 12, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 10 }}>8 meses de apuração foram pagos por 4.812 leitores. Seja um deles.</p>
            <button className="vp-btn vp-btn-primary" style={{ width: '100%' }}>Contribuir</button>
          </div>
        </aside>
      </article>

      <SiteFooter />
    </div>
  );
}

Object.assign(window, { Article });
