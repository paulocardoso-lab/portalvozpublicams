/* eslint-disable @next/next/no-page-custom-font */

export const dynamic = 'force-static';

export default function DesignStudioPreviewPage() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Preview</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      </head>
      <body>
        <div id="root">
          {/* ── HEADER ───────────────────────────────────── */}
          <header id="ds-header">
            <div className="header-inner">
              <div className="header-logo">
                <div className="monogram">
                  <span className="m-l">V</span>
                  <span className="m-r">oz Pública<br /><em>MS</em></span>
                </div>
              </div>
              <nav className="header-nav">
                <a href="#">Política</a>
                <a href="#">Cidade</a>
                <a href="#">Economia</a>
                <a href="#">Especiais</a>
                <a href="#">Podcasts</a>
              </nav>
              <div className="header-actions">
                <button type="button" className="btn btn-ghost">Assinar newsletter</button>
                <button type="button" className="btn btn-primary">Apoiar →</button>
              </div>
            </div>
          </header>

          {/* ── TICKER ───────────────────────────────────── */}
          <div className="ticker">
            <span className="ticker-label">AO VIVO</span>
            <span className="ticker-text">Campo Grande · Sessão da Câmara Municipal discute orçamento suplementar de R$ 42 milhões</span>
          </div>

          {/* ── MAIN CONTENT ─────────────────────────────── */}
          <div className="container">
            <div className="layout-main">

              {/* ── PRIMARY CONTENT ── */}
              <div className="primary">

                {/* Hero */}
                <div className="hero-card">
                  <div className="hero-img">
                    <div className="img-ph img-ph-hero">
                      <span>Foto: Voz Pública MS</span>
                    </div>
                    <span className="badge badge-exclusive">Exclusivo</span>
                  </div>
                  <div className="hero-body">
                    <div className="eyebrow">Política · Campo Grande</div>
                    <h1 className="hero-title">
                      Investigação Revela Desvio de R$&nbsp;18 Milhões em Contratos da Saúde Municipal
                    </h1>
                    <p className="hero-lead">
                      Documentos obtidos pela reportagem mostram irregularidades em licitações entre 2022 e 2024. Prefeitura nega e promete apuração interna.
                    </p>
                    <div className="meta">
                      <span className="author">Por Redação Voz Pública</span>
                      <span className="dot">·</span>
                      <span className="date">8 de junho · 14h32</span>
                    </div>
                  </div>
                </div>

                {/* Section label */}
                <div className="section-header">
                  <span className="section-rule" />
                  <span className="section-label">Últimas notícias</span>
                  <span className="section-rule" />
                </div>

                {/* Card grid */}
                <div className="card-grid">
                  {SAMPLE_ARTICLES.map((a, i) => (
                    <article key={i} className="card">
                      <div className="card-img">
                        <div className={`img-ph img-ph-${a.color}`} />
                      </div>
                      <div className="card-body">
                        <span className="card-category">{a.category}</span>
                        <h2 className="card-title">{a.title}</h2>
                        <p className="card-lead">{a.lead}</p>
                        <div className="card-meta">
                          <span>{a.author}</span>
                          <span className="dot">·</span>
                          <span>{a.time}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Article body preview */}
                <div className="article-preview">
                  <div className="section-header section-header-article">
                    <span className="section-rule" />
                    <span className="section-label">Prévia de artigo</span>
                    <span className="section-rule" />
                  </div>
                  <div id="ds-article" className="article-body">
                    <p>
                      A investigação conduzida pela equipe de jornalismo de dados do <strong>Voz Pública MS</strong> identificou
                      ao menos 14 contratos com indícios de sobrepreço, superfaturamento ou direcionamento de licitações no
                      período entre janeiro de 2022 e março de 2024.
                    </p>
                    <p>
                      Os documentos, obtidos via Lei de Acesso à Informação após recurso em segunda instância, mostram
                      aquisições de insumos médicos por valores até três vezes superiores ao praticado no mercado nacional.
                    </p>
                    <blockquote>
                      &ldquo;Os dados falam por si. Não há justificativa técnica para essa diferença de preço&rdquo;, afirmou
                      especialista em licitações ouvido pela reportagem sob condição de anonimato.
                    </blockquote>
                    <p>
                      A Secretaria Municipal de Saúde, por meio de sua assessoria de imprensa, negou irregularidades
                      e afirmou que todos os processos seguiram os normativos legais vigentes.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── SIDEBAR ── */}
              <aside className="sidebar">

                {/* Donation block */}
                <div className="sidebar-card sidebar-donation">
                  <p className="sidebar-eyebrow">Sem donos. Sem paywall.</p>
                  <h3 className="sidebar-headline">Jornalismo de MS que você pode confiar.</h3>
                  <p className="sidebar-body">Somos sustentados por leitores. <strong>0</strong> apoiadores até hoje.</p>
                  <button type="button" className="btn btn-primary btn-full">Apoie o Voz Pública →</button>
                </div>

                {/* Charge do dia */}
                <div className="sidebar-card">
                  <div className="sidebar-section-label">
                    <span className="accent-dot">◆</span> Charge do dia
                  </div>
                  <div className="img-ph img-ph-charge">
                    <span>Charge editorial</span>
                  </div>
                  <p className="sidebar-caption">&ldquo;A Informação Também Tem Lado: O do Cidadão&rdquo;</p>
                  <a href="#" className="sidebar-link">Arquivo de charges →</a>
                </div>

                {/* Enquete */}
                <div className="sidebar-card">
                  <div className="sidebar-section-label">
                    <span className="accent-dot">◆</span> Enquete
                  </div>
                  <p className="sidebar-poll-q">O que você achou do nosso portal vozpublicams.com.br?</p>
                  <div className="poll-options">
                    <div className="poll-option">
                      <div className="poll-bar poll-bar-62" />
                      <span className="poll-label">Excelente</span>
                      <span className="poll-pct">62%</span>
                    </div>
                    <div className="poll-option">
                      <div className="poll-bar poll-bar-28" />
                      <span className="poll-label">Bom</span>
                      <span className="poll-pct">28%</span>
                    </div>
                    <div className="poll-option">
                      <div className="poll-bar poll-bar-10" />
                      <span className="poll-label">Regular</span>
                      <span className="poll-pct">10%</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="sidebar-card sidebar-newsletter">
                  <div className="sidebar-section-label">
                    <span className="accent-dot">◆</span> Newsletter
                  </div>
                  <h3 className="sidebar-nl-title">A Semana em MS</h3>
                  <p className="sidebar-body">Sábado de manhã, de graça. O que importou em Mato Grosso do Sul.</p>
                  <input className="input" type="email" placeholder="seu@email.com" readOnly />
                  <button type="button" className="btn btn-primary btn-full btn-mt">Assinar grátis</button>
                </div>

              </aside>
            </div>
          </div>

          {/* ── FOOTER ───────────────────────────────────── */}
          <footer id="ds-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <div className="monogram monogram-sm">
                  <span className="m-l">V</span>
                  <span className="m-r">oz Pública<br /><em>MS</em></span>
                </div>
                <p className="footer-desc">Jornalismo investigativo, plural e sem donos para Mato Grosso do Sul.</p>
              </div>
              <div className="footer-links">
                <span className="footer-link-group-label">Editorias</span>
                <a href="#">Política</a>
                <a href="#">Economia</a>
                <a href="#">Cidade</a>
                <a href="#">Meio Ambiente</a>
              </div>
              <div className="footer-links">
                <span className="footer-link-group-label">Portal</span>
                <a href="#">Sobre</a>
                <a href="#">Equipe</a>
                <a href="#">Contato</a>
                <a href="#">Denúncias</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 Voz Pública MS · Campo Grande, MS</span>
            </div>
          </footer>
        </div>

        <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      </body>
    </html>
  );
}

// ── Sample data ───────────────────────────────────────────────────────────────

const SAMPLE_ARTICLES = [
  { category: 'Economia', title: 'Soja Fecha Semana em Alta de 3,2% com Demanda Chinesa Aquecida', lead: 'Mercado reage a novos contratos de exportação firmados com importadores asiáticos.', author: 'Redação', time: 'há 2h', color: 'a' },
  { category: 'Cidade', title: 'Campo Grande Amplia Horário de Ônibus nos Finais de Semana', lead: 'Medida beneficia moradores de bairros mais afastados do centro da capital.', author: 'Beatriz Leal', time: 'há 3h', color: 'b' },
  { category: 'Meio Ambiente', title: 'Pantanal Registra Menor Índice de Queimadas desde 2019', lead: 'Programa de monitoramento aponta redução de 41% em relação ao mesmo período do ano passado.', author: 'Carlos Mello', time: 'há 5h', color: 'c' },
  { category: 'Justiça', title: 'STJ Suspende Processos sobre Aluguel de Curta Temporada', lead: 'Decisão afeta proprietários de imóveis em plataformas digitais em todo o país.', author: 'Redação', time: 'há 6h', color: 'd' },
  { category: 'Saúde', title: 'MS Amplia Vacinação contra Dengue para Adultos até 59 Anos', lead: 'Estado recebe novo lote de vacinas e abre agendamento online a partir de segunda-feira.', author: 'Ana Flores', time: 'há 7h', color: 'e' },
  { category: 'Política', title: 'Vereadora Protocola Projeto para Revisão da Lei de Zoneamento', lead: 'Proposta busca regularizar ocupações em áreas de expansão urbana sem infraestrutura.', author: 'Redação', time: 'há 9h', color: 'f' },
];

// ── Styles (self-contained, driven by CSS vars) ────────────────────────────

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --vp-bg:         #1a1a19;
    --vp-surface:    #262624;
    --vp-surface-2:  #2f2f2d;
    --vp-surface-3:  #3a3a37;
    --vp-border:     #3a3a37;
    --vp-border-2:   #4a4a46;
    --vp-text:       #faf9f5;
    --vp-text-2:     #d1cfc4;
    --vp-text-3:     #8a887f;
    --vp-text-4:     #5a5852;
    --vp-accent:     #d97757;
    --vp-accent-hover: #c96442;
    --vp-urgent:     #e85d4a;
    --vp-ok:         #7aa37a;
    --vp-serif-display: "Playfair Display", Georgia, serif;
    --vp-serif:      "Source Serif 4", Georgia, serif;
    --vp-sans:       "Inter", system-ui, sans-serif;
    --radius-md:     4px;
    --vp-btn-radius: 2px;
    --vp-card-radius: 0px;
    --vp-content-gap: 24px;
    --vp-header-logo-size: 36px;
    --vp-footer-logo-size: 32px;
    --vp-article-text-align: left;
    --vp-article-font-size: 18px;
    --vp-article-max-width: 680px;
    --vp-article-paragraph-gap: 24px;
  }

  html, body { background: var(--vp-bg); color: var(--vp-text); font-family: var(--vp-serif); font-size: 16px; line-height: 1.6; min-height: 100vh; }

  a { color: inherit; text-decoration: none; }
  a:hover { color: var(--vp-accent); }
  strong { font-weight: 700; }

  /* ── HEADER ── */
  #ds-header {
    background: var(--vp-bg);
    border-bottom: 1px solid var(--vp-border);
    position: sticky; top: 0; z-index: 20;
  }
  .header-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex; align-items: center; gap: 32px;
  }
  .header-logo { flex-shrink: 0; }
  .header-nav { display: flex; gap: 20px; flex: 1; }
  .header-nav a { font-family: var(--vp-sans); font-size: 13px; font-weight: 600; color: var(--vp-text-2); text-transform: uppercase; letter-spacing: 0.06em; transition: color .15s; }
  .header-nav a:hover { color: var(--vp-accent); }
  .header-actions { display: flex; gap: 8px; flex-shrink: 0; }

  /* ── MONOGRAM ── */
  .monogram { display: flex; align-items: flex-start; gap: 6px; }
  .m-l { font-family: var(--vp-serif-display); font-weight: 900; font-size: var(--vp-header-logo-size); color: var(--vp-bg); background: var(--vp-text); line-height: 1; padding: 2px 6px; }
  .m-r { font-family: var(--vp-sans); font-size: 11px; font-weight: 600; color: var(--vp-text); line-height: 1.3; padding-top: 4px; }
  .m-r em { font-style: normal; font-weight: 400; color: var(--vp-accent); }
  .monogram-sm .m-l { font-size: var(--vp-footer-logo-size); }
  .monogram-sm .m-r { font-size: 10px; }

  /* ── TICKER ── */
  .ticker {
    background: var(--vp-urgent); color: #fff;
    display: flex; align-items: center; gap: 12px;
    padding: 7px 24px; font-family: var(--vp-sans); font-size: 12px;
  }
  .ticker-label { font-weight: 800; letter-spacing: 0.1em; background: rgba(0,0,0,.25); padding: 2px 8px; border-radius: 2px; flex-shrink: 0; }
  .ticker-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── BUTTONS ── */
  .btn {
    font-family: var(--vp-sans); font-size: 12px; font-weight: 600;
    padding: 7px 16px; border-radius: var(--vp-btn-radius);
    border: 1px solid var(--vp-border-2); background: var(--vp-surface);
    color: var(--vp-text); cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .btn:hover { background: var(--vp-surface-2); border-color: var(--vp-text-3); }
  .btn-primary { background: var(--vp-accent); border-color: var(--vp-accent); color: #1a1a19; }
  .btn-primary:hover { background: var(--vp-accent-hover); border-color: var(--vp-accent-hover); }
  .btn-ghost { border-color: transparent; background: transparent; }
  .btn-full { width: 100%; }

  /* ── INPUT ── */
  .input {
    font-family: var(--vp-sans); font-size: 13px;
    padding: 8px 12px; border-radius: var(--radius-md);
    border: 1px solid var(--vp-border-2); background: var(--vp-surface-2);
    color: var(--vp-text); width: 100%;
  }
  .input::placeholder { color: var(--vp-text-4); }

  /* ── CONTAINER / LAYOUT ── */
  .container { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }
  .layout-main { display: grid; grid-template-columns: 1fr 300px; gap: var(--vp-content-gap); }

  /* ── HERO ── */
  .hero-card { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 40px; border-bottom: 1px solid var(--vp-border); padding-bottom: 36px; }
  .hero-img { position: relative; }
  .hero-body { display: flex; flex-direction: column; justify-content: center; gap: 14px; }
  .eyebrow { font-family: var(--vp-sans); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--vp-accent); }
  .hero-title { font-family: var(--vp-serif-display); font-size: 32px; font-weight: 800; line-height: 1.15; color: var(--vp-text); }
  .hero-lead { font-family: var(--vp-serif); font-size: 17px; color: var(--vp-text-2); line-height: 1.6; }
  .meta { font-family: var(--vp-sans); font-size: 12px; color: var(--vp-text-4); display: flex; gap: 6px; align-items: center; }
  .author { color: var(--vp-text-3); }
  .dot { color: var(--vp-border-2); }
  .badge { position: absolute; top: 10px; left: 10px; font-family: var(--vp-sans); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; padding: 3px 8px; background: var(--vp-accent); color: #1a1a19; border-radius: 2px; }
  .badge-exclusive { background: var(--vp-urgent); color: #fff; }

  /* ── SECTION HEADER ── */
  .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .section-rule { flex: 1; height: 1px; background: var(--vp-border); }
  .section-label { font-family: var(--vp-sans); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: var(--vp-text-4); white-space: nowrap; }

  /* ── CARD GRID ── */
  .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--vp-content-gap); margin-bottom: 40px; }
  .card { border-radius: var(--vp-card-radius); border: var(--vp-card-border, 0px) solid var(--vp-border); background: var(--vp-surface); overflow: hidden; display: flex; flex-direction: column; }
  .card-img { aspect-ratio: 16/9; overflow: hidden; }
  .card-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .card-category { font-family: var(--vp-sans); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--vp-accent); }
  .card-title { font-family: var(--vp-serif-display); font-size: 16px; font-weight: 700; line-height: 1.3; color: var(--vp-text); }
  .card-lead { font-family: var(--vp-serif); font-size: 13px; color: var(--vp-text-3); line-height: 1.5; flex: 1; }
  .card-meta { font-family: var(--vp-sans); font-size: 11px; color: var(--vp-text-4); display: flex; gap: 5px; margin-top: 4px; }

  /* ── IMAGE PLACEHOLDERS ── */
  .img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--vp-sans); font-size: 11px; color: rgba(255,255,255,.3); font-weight: 600; text-align: center; padding: 8px; }
  .img-ph-hero { background: #2a2a28; min-height: 280px; }
  .img-ph-a { background: #1e2a1e; min-height: 120px; }
  .img-ph-b { background: #1a1e2a; min-height: 120px; }
  .img-ph-c { background: #2a1e1a; min-height: 120px; }
  .img-ph-d { background: #241e2a; min-height: 120px; }
  .img-ph-e { background: #1a2422; min-height: 120px; }
  .img-ph-f { background: #2a2218; min-height: 120px; }
  .img-ph-charge { background: #2a2a28; min-height: 160px; width: 100%; font-size: 12px; }

  /* ── ARTICLE BODY ── */
  .article-preview { border-top: 1px solid var(--vp-border); padding-top: 36px; margin-bottom: 40px; }
  .section-header-article { margin-bottom: 1.5rem; }
  .btn-mt { margin-top: 8px; }
  #ds-article {
    max-width: var(--vp-article-max-width);
    font-size: var(--vp-article-font-size);
    text-align: var(--vp-article-text-align);
    font-family: var(--vp-serif);
    color: var(--vp-text-2);
    line-height: 1.75;
  }
  #ds-article p { margin-bottom: var(--vp-article-paragraph-gap); }
  #ds-article blockquote {
    border-left: 3px solid var(--vp-accent);
    padding: 12px 20px;
    margin: 0 0 var(--vp-article-paragraph-gap);
    background: var(--vp-surface);
    font-style: italic;
    color: var(--vp-text-3);
    font-size: 0.95em;
  }

  /* ── SIDEBAR ── */
  .sidebar { display: flex; flex-direction: column; gap: 16px; }
  .sidebar-card { background: var(--vp-surface); border: 1px solid var(--vp-border); padding: 16px; display: flex; flex-direction: column; gap: 10px; border-radius: var(--radius-md); }
  .sidebar-section-label { font-family: var(--vp-sans); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: var(--vp-text-3); display: flex; align-items: center; gap: 6px; }
  .accent-dot { color: var(--vp-accent); font-size: 9px; }
  .sidebar-eyebrow { font-family: var(--vp-sans); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; color: var(--vp-accent); }
  .sidebar-headline { font-family: var(--vp-serif-display); font-size: 18px; font-weight: 800; line-height: 1.2; color: var(--vp-text); }
  .sidebar-nl-title { font-family: var(--vp-serif-display); font-size: 16px; font-weight: 700; color: var(--vp-text); }
  .sidebar-body { font-family: var(--vp-serif); font-size: 13px; color: var(--vp-text-3); line-height: 1.5; }
  .sidebar-caption { font-family: var(--vp-serif); font-size: 11px; font-style: italic; color: var(--vp-text-4); }
  .sidebar-link { font-family: var(--vp-sans); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--vp-accent); }
  .sidebar-poll-q { font-family: var(--vp-sans); font-size: 13px; font-weight: 600; color: var(--vp-text-2); line-height: 1.4; }

  /* ── POLL ── */
  .poll-options { display: flex; flex-direction: column; gap: 8px; }
  .poll-option { position: relative; display: flex; align-items: center; gap: 8px; }
  .poll-bar { position: absolute; left: 0; top: 0; bottom: 0; background: var(--vp-accent); opacity: .18; border-radius: 2px; transition: width .3s ease; }
  .poll-bar-62 { width: 62%; }
  .poll-bar-28 { width: 28%; }
  .poll-bar-10 { width: 10%; }
  .poll-label { font-family: var(--vp-sans); font-size: 12px; color: var(--vp-text-2); z-index: 1; padding: 4px 8px; flex: 1; }
  .poll-pct { font-family: var(--vp-sans); font-size: 11px; font-weight: 700; color: var(--vp-accent); z-index: 1; padding-right: 4px; }

  /* ── FOOTER ── */
  #ds-footer { background: var(--vp-surface); border-top: 1px solid var(--vp-border); margin-top: 48px; }
  .footer-inner { max-width: 1280px; margin: 0 auto; padding: 40px 24px; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
  .footer-brand { display: flex; flex-direction: column; gap: 12px; }
  .footer-desc { font-family: var(--vp-serif); font-size: 13px; color: var(--vp-text-3); line-height: 1.6; max-width: 280px; }
  .footer-links { display: flex; flex-direction: column; gap: 8px; }
  .footer-link-group-label { font-family: var(--vp-sans); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; color: var(--vp-text-4); margin-bottom: 4px; }
  .footer-links a { font-family: var(--vp-sans); font-size: 13px; color: var(--vp-text-3); }
  .footer-links a:hover { color: var(--vp-accent); }
  .footer-bottom { border-top: 1px solid var(--vp-border); padding: 16px 24px; text-align: center; font-family: var(--vp-sans); font-size: 11px; color: var(--vp-text-4); }
`;

// ── postMessage listener — applies tokens in real time ────────────────────

const SCRIPT = `
(function () {
  function applyTokens(tokens) {
    var r = document.documentElement;
    var n = function(k) { return parseFloat(tokens[k]) || 0; };

    // Colors
    r.style.setProperty('--vp-bg',            tokens['color.bg']);
    r.style.setProperty('--vp-surface',       tokens['color.surface']);
    r.style.setProperty('--vp-surface-2',     tokens['color.surface-2']);
    r.style.setProperty('--vp-surface-3',     tokens['color.surface-3']);
    r.style.setProperty('--vp-border',        tokens['color.border']);
    r.style.setProperty('--vp-border-2',      tokens['color.border-2']);
    r.style.setProperty('--vp-text',          tokens['color.text']);
    r.style.setProperty('--vp-text-2',        tokens['color.text-2']);
    r.style.setProperty('--vp-text-3',        tokens['color.text-3']);
    r.style.setProperty('--vp-text-4',        tokens['color.text-4']);
    r.style.setProperty('--vp-accent',        tokens['color.accent']);
    r.style.setProperty('--vp-accent-hover',  tokens['color.accent-hover']);
    r.style.setProperty('--vp-urgent',        tokens['color.urgent']);

    // Typography — fonts (inject @import dynamically if Google Fonts)
    r.style.setProperty('--vp-serif-display', '"' + tokens['type.font-display'] + '", Georgia, serif');
    r.style.setProperty('--vp-serif',         '"' + tokens['type.font-serif']   + '", Georgia, serif');
    r.style.setProperty('--vp-sans',          '"' + tokens['type.font-sans']    + '", system-ui, sans-serif');
    r.style.setProperty('font-size',          n('type.size-base') + 'px');

    // Layout
    r.style.setProperty('--radius-md',        n('layout.border-radius')  + 'px');
    r.style.setProperty('--vp-content-gap',   n('layout.content-gap')    + 'px');

    // Components
    r.style.setProperty('--vp-btn-radius',    n('comp.btn-radius')       + 'px');
    r.style.setProperty('--vp-card-radius',   n('comp.card-radius')      + 'px');
    r.style.setProperty('--vp-card-border',   n('comp.card-border-width')+ 'px');

    // Header logo
    var logoSize = n('comp.header-logo-size');
    if (logoSize > 0) r.style.setProperty('--vp-header-logo-size', logoSize + 'px');
    var footerLogoSize = n('comp.footer-logo-size');
    if (footerLogoSize > 0) r.style.setProperty('--vp-footer-logo-size', footerLogoSize + 'px');

    // Article
    r.style.setProperty('--vp-article-font-size',     n('comp.article-font-size')      + 'px');
    r.style.setProperty('--vp-article-max-width',     n('comp.article-max-width')      + 'px');
    r.style.setProperty('--vp-article-text-align',    tokens['comp.article-text-align'] || 'left');
    r.style.setProperty('--vp-article-paragraph-gap', n('comp.article-paragraph-gap')  + 'px');
  }

  function applyLogo(url) {
    document.querySelectorAll('.m-l').forEach(function(el) {
      // only update if it's an img, otherwise keep the monogram letter
      if (el.tagName === 'IMG') el.src = url;
    });
  }

  window.addEventListener('message', function(e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'DS_TOKENS') applyTokens(e.data.tokens);
    if (e.data.type === 'DS_LOGO')   applyLogo(e.data.url);
  });

  // Signal ready so parent can push current tokens immediately
  window.parent.postMessage({ type: 'DS_READY' }, '*');
})();
`;
