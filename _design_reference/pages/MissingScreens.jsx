// Missing screens: Sobre/Manifesto, Equipe, Denúncia segura, Onboarding, 404

// ─── SOBRE / MANIFESTO (DESKTOP) ───────────────────────────────
function AboutPage() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%' }}>
      <Masthead />
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '60px 28px 80px' }}>
        <span className="eyebrow">Manifesto editorial</span>
        <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 84, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '14px 0 28px', maxWidth: 880 }}>
          Jornalismo <em style={{ color: 'var(--vp-accent)' }}>sem donos</em><br/>em Mato Grosso do Sul.
        </h1>
        <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 24, lineHeight: 1.45, color: 'var(--vp-text-2)', fontStyle: 'italic', maxWidth: 760, marginBottom: 48, borderLeft: '3px solid var(--vp-accent)', paddingLeft: 24 }}>
          O Voz Pública existe porque o estado merece mais do que releases reembalados, jornais financiados pela mesma usina que polui o rio, e silêncio quando o garimpo invade a terra indígena.
        </p>

        <div style={{ columnCount: 2, columnGap: 36, fontFamily: 'var(--vp-serif)', fontSize: 18, lineHeight: 1.7, color: 'var(--vp-text)', marginBottom: 60 }}>
          <p style={{ marginTop: 0 }}><span style={{ float: 'left', fontFamily: 'var(--vp-serif-display)', fontSize: 72, lineHeight: 0.85, color: 'var(--vp-accent)', paddingRight: 10, paddingTop: 4 }}>F</span>undado em 2024 por uma redação de cinco repórteres que recusaram se calar diante da agenda agro-eleitoral que dominou a imprensa local nas últimas duas décadas, o Voz Pública é hoje sustentado por <strong>4.812 apoiadores</strong> que pagam, em média, R$ 31 por mês.</p>
          <p>Não aceitamos publicidade de campanhas eleitorais, frigoríficos, mineradoras nem grandes proprietários rurais. Nossas <a style={{ color: 'var(--vp-accent)' }}>contas mensais são públicas</a> e auditadas anualmente.</p>
          <p>Cobrimos quatro frentes: <strong>Pantanal</strong> (queimadas, hidrovias, sedimentação), <strong>fronteira</strong> (Paraguai e Bolívia, contrabando, rotas), <strong>indígenas</strong> (Guarani Kaiowá, retomadas, conflitos fundiários) e <strong>poder público</strong> (Assembleia, prefeituras, contratos).</p>
          <p>Praticamos jornalismo lento. Uma reportagem nossa leva, em média, <strong>11 semanas</strong> entre apuração, checagem, edição e publicação. Quando a urgência justifica, somos rápidos — mas não somos veículo de timeline.</p>
        </div>

        {/* Princípios */}
        <h2 style={{ fontFamily: 'var(--vp-sans)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', borderBottom: '2px solid var(--vp-text)', paddingBottom: 12, marginBottom: 32 }}>Sete princípios que nos governam</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px 60px', marginBottom: 80 }}>
          {[
            ['01','Independência financeira','Nenhum apoiador, anunciante ou financiador influencia pauta. Editor-chefe tem palavra final e pode ser destituído por voto da redação.'],
            ['02','Transparência radical','Publicamos receitas, despesas, salários da redação e fontes de financiamento. Quando erramos, retificamos com destaque equivalente ao erro.'],
            ['03','Direito de resposta','Toda pessoa citada tem 72h para responder antes da publicação. Resposta é incorporada à matéria, não em nota separada.'],
            ['04','Proteção de fontes','Usamos SecureDrop, Signal e ProtonMail. Nunca entregamos identidade de fonte, mesmo sob ordem judicial — preferimos o tribunal.'],
            ['05','Reportagem in loco','Pelo menos 70% das nossas pautas envolvem deslocamento físico. Não cobrimos Pantanal de Campo Grande.'],
            ['06','Recusa do agro-eleitoral','Não publicamos colunas pagas, não convidamos políticos para "explicar", não fazemos entrevista sem direito a contraditório.'],
            ['07','Pluralidade na redação','Pelo menos 50% da equipe é formada por mulheres, pretas/os, indígenas ou pessoas LGBTQIA+. Reportagens sobre povos indígenas têm sempre uma jornalista indígena na linha de frente.'],
          ].map(([n,t,d]) => (
            <div key={n}>
              <div style={{ fontFamily: 'var(--vp-mono)', fontSize: 12, color: 'var(--vp-accent)', marginBottom: 8 }}>{n}</div>
              <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, lineHeight: 1.2, margin: '0 0 8px' }}>{t}</h3>
              <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, lineHeight: 1.55, color: 'var(--vp-text-2)' }}>{d}</p>
            </div>
          ))}
        </div>

        {/* Números */}
        <div style={{ borderTop: '2px solid var(--vp-text)', borderBottom: '2px solid var(--vp-text)', padding: '40px 0', marginBottom: 60, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[['R$ 1,8M','arrecadado em 2025'],['4.812','apoiadores ativos'],['127','reportagens publicadas'],['0','centavos de campanha']].map(([n,l]) => (
            <div key={n}>
              <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 56, color: 'var(--vp-accent)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>{n}</div>
              <div style={{ fontSize: 12, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--vp-surface)', padding: '40px', textAlign: 'center', border: '1px solid var(--vp-border)' }}>
          <span className="eyebrow">Junte-se</span>
          <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 36, margin: '12px 0 14px', letterSpacing: '-0.015em' }}>Sem você, não há voz pública.</h3>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 17, color: 'var(--vp-text-2)', marginBottom: 22, maxWidth: 540, margin: '0 auto 22px' }}>A partir de R$ 19/mês você sustenta uma redação que recusa dinheiro de quem prefere o silêncio.</p>
          <button className="vp-btn vp-btn-primary" style={{ padding: '14px 28px', fontSize: 14 }}>Apoiar a redação →</button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// ─── EQUIPE / REDAÇÃO ──────────────────────────────────────────
function TeamPage() {
  const team = [
    ['Marina Ribeiro','Editora-chefe','Jornalista há 18 anos, ex-Folha de S.Paulo. Vencedora do Prêmio Vladimir Herzog 2022. Cobre poder público e fronteira.','Pol\u00edtica · Fronteira'],
    ['Tiago Vasconcelos','Editor de Pantanal','Repórter há 12 anos, especialista em cobertura ambiental. Documentou as queimadas de 2020 e 2024.','Pantanal · Ambiente'],
    ['Yara Kaiowá','Repórter de Povos Indígenas','Indígena Guarani Kaiowá, formada em comunicação pela UFGD. Cobre retomadas, saúde indígena e violência fundiária.','Indígenas · Direitos'],
    ['Rafael Souza','Repórter de Dados','Cientista de dados aplicado ao jornalismo. Mantém o painel de obras públicas e o Raio-X parlamentar.','Dados · Política'],
    ['Helena Cardozo','Repórter de Cidades','Cobre Campo Grande, Dourados e Três Lagoas. Especialista em urbanismo e mobilidade.','Cidades · Urbanismo'],
    ['Caio Mendes','Editor multimídia','Documentarista, fotógrafo e podcast lead. Edita a série "Pantanal em chamas".','Multimídia · Podcast'],
    ['Lia Cabral','Colunista','Doutora em ciência política pela USP. Coluna semanal sobre eleições, partidos e Assembleia de MS.','Coluna semanal'],
    ['Bruno Alencar','Colunista','Economista, ex-IBGE. Coluna sobre orçamento, contas públicas e PIB regional.','Coluna quinzenal'],
  ];
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%' }}>
      <Masthead />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 28px 80px' }}>
        <span className="eyebrow">Quem faz o Voz Pública</span>
        <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 72, lineHeight: 1.0, letterSpacing: '-0.02em', margin: '14px 0 22px' }}>A redação.</h1>
        <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 19, color: 'var(--vp-text-2)', maxWidth: 720, lineHeight: 1.55, marginBottom: 56 }}>
          8 jornalistas, 2 colunistas, 1 estagiária e 3 freelas frequentes. Todas as pessoas listadas abaixo têm contrato CLT, plano de saúde e direito a 30 dias de férias por ano. <a style={{ color: 'var(--vp-accent)' }}>Veja a folha salarial</a>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px 48px' }}>
          {team.map(([name, role, bio, beat]) => (
            <article key={name} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, paddingBottom: 28, borderBottom: '1px solid var(--vp-border)' }}>
              <ImgPH width={120} height={120} label="" />
              <div>
                <span className="eyebrow" style={{ fontSize: 10 }}>{role}</span>
                <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 24, margin: '6px 0 8px', lineHeight: 1.1 }}>{name}</h3>
                <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.55, marginBottom: 10 }}>{bio}</p>
                <div style={{ fontSize: 11, color: 'var(--vp-text-3)', fontFamily: 'var(--vp-mono)', marginBottom: 10 }}>{beat}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--vp-accent)' }}>
                  <a>Matérias →</a><a>E-mail</a><a>Signal</a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: 32, background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', textAlign: 'center' }}>
          <span className="eyebrow">Vagas abertas</span>
          <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 28, margin: '10px 0 12px' }}>Procuramos repórter de Agronegócio</h3>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, color: 'var(--vp-text-2)', marginBottom: 18, maxWidth: 580, margin: '0 auto 18px' }}>Mínimo 5 anos cobrindo cadeia produtiva. Salário entre R$ 8.500 e R$ 12.000. Candidaturas até 30 de maio.</p>
          <button className="vp-btn">Ver descrição completa →</button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// ─── DENÚNCIA SEGURA (DESKTOP) ─────────────────────────────────
function WhistleblowerPage() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%' }}>
      <Masthead />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid var(--vp-accent)', background: 'rgba(217,119,87,0.08)', marginBottom: 18 }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontFamily: 'var(--vp-mono)', fontSize: 11, color: 'var(--vp-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Conexão criptografada · Tor disponível</span>
            </div>
            <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 64, lineHeight: 1.0, letterSpacing: '-0.02em', margin: '0 0 18px' }}>Tem algo que precisa virar reportagem?</h1>
            <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 19, color: 'var(--vp-text-2)', lineHeight: 1.55, fontStyle: 'italic', marginBottom: 32, maxWidth: 640 }}>
              Documentos, áudios, imagens, denúncias internas — sua identidade é protegida por lei e por nossas escolhas técnicas. Nunca entregamos fontes.
            </p>

            {/* Steps */}
            <h2 style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', borderBottom: '1px solid var(--vp-border)', paddingBottom: 10, marginBottom: 24 }}>Como funciona</h2>
            {[
              ['1','Escolha um canal','Quanto mais sensível o material, mais seguro o canal. SecureDrop é nossa via mais protegida — anônima inclusive para nós.'],
              ['2','Não use rede ou dispositivo do trabalho','Computadores corporativos têm logs. Use celular pessoal em rede 4G/5G ou um café com Wi-Fi público.'],
              ['3','Aguarde nosso retorno','Checamos SecureDrop diariamente. Por Signal, em até 24h. Não usamos sua identidade real até você autorizar.'],
              ['4','Verificamos antes de publicar','Toda denúncia passa por checagem cruzada com pelo menos duas fontes independentes. Documentos são validados juridicamente.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 18, marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 32, color: 'var(--vp-accent)', lineHeight: 1, fontWeight: 700 }}>{n}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, margin: '0 0 6px' }}>{t}</h3>
                  <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 15, color: 'var(--vp-text-2)', lineHeight: 1.55, margin: 0 }}>{d}</p>
                </div>
              </div>
            ))}

            {/* Channels */}
            <h2 style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', borderBottom: '1px solid var(--vp-border)', paddingBottom: 10, marginTop: 48, marginBottom: 24 }}>Canais</h2>

            {[
              { n: 'SecureDrop', tag: 'Máxima proteção', d: 'Sistema usado por New York Times, ProPublica e The Guardian. Funciona apenas via Tor Browser. Você pode enviar arquivos de até 500MB anonimamente — nem nós sabemos quem você é.', addr: 'vozpublicams7x9k...3qhrp.onion', cta: 'Abrir no Tor' },
              { n: 'Signal', tag: 'Mensagens criptografadas', d: 'Para conversa direta com Marina Ribeiro (editora-chefe). Mensagens efêmeras de 24h. Configure número descartável.', addr: '+55 67 9 8765-4321', cta: 'Copiar número' },
              { n: 'ProtonMail', tag: 'E-mail criptografado', d: 'Para envio de documentos com PGP. Nossa chave pública está abaixo. Crie conta no proton.me se ainda não tem.', addr: 'denuncias@vozpublicams.com.br', cta: 'Copiar chave PGP' },
              { n: 'Formulário web', tag: 'Conveniência · menos seguro', d: 'Aceita texto e até 25MB de anexos. Não recomendado para material muito sensível — apesar da criptografia em trânsito, exige confiança no servidor.', addr: '', cta: 'Abrir formulário ↓' },
            ].map((c,i) => (
              <div key={i} style={{ border: '1px solid var(--vp-border)', padding: 24, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <h3 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 22, margin: 0 }}>{c.n}</h3>
                  <span className="vp-tag" style={{ fontSize: 10 }}>{c.tag}</span>
                </div>
                <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, color: 'var(--vp-text-2)', lineHeight: 1.55, margin: '0 0 14px' }}>{c.d}</p>
                {c.addr && <div style={{ fontFamily: 'var(--vp-mono)', fontSize: 12, color: 'var(--vp-accent)', background: 'var(--vp-surface)', padding: '10px 14px', marginBottom: 12, wordBreak: 'break-all' }}>{c.addr}</div>}
                <button className="vp-btn">{c.cta}</button>
              </div>
            ))}

            {/* Form */}
            <h2 style={{ fontFamily: 'var(--vp-sans)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', borderBottom: '1px solid var(--vp-border)', paddingBottom: 10, marginTop: 48, marginBottom: 24 }}>Formulário web</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <textarea className="vp-input" placeholder="Descreva o que aconteceu, datas, locais e pessoas envolvidas. Não inclua dados que te identifiquem se quiser anonimato." style={{ minHeight: 200, fontFamily: 'var(--vp-serif)', fontSize: 15, padding: 14, resize: 'vertical' }}></textarea>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="vp-input" placeholder="Pseudônimo (opcional)" />
                <input className="vp-input" placeholder="Forma de contato (opcional, criptografada)" />
              </div>
              <div style={{ border: '1px dashed var(--vp-border)', padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--vp-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Anexos · até 25MB</div>
                <a style={{ color: 'var(--vp-accent)', fontSize: 13 }}>Selecionar arquivos</a>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'var(--vp-text-2)' }}>
                <input type="checkbox" style={{ marginTop: 3 }} />
                <span>Entendo que este canal exige confiança no Voz Pública. Para material altamente sensível, prefiro SecureDrop ou Signal.</span>
              </label>
              <button className="vp-btn vp-btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px' }}>Enviar denúncia →</button>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-accent)', padding: 22, marginBottom: 18 }}>
                <div className="eyebrow" style={{ color: 'var(--vp-accent)' }}>Promessa pública</div>
                <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 14, lineHeight: 1.55, color: 'var(--vp-text)', margin: '10px 0 0', fontStyle: 'italic' }}>
                  "Nunca entregamos a identidade de uma fonte. Já fomos intimados três vezes. Recusamos as três. Preferimos a Justiça à traição."
                </p>
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--vp-text-3)' }}>— Marina Ribeiro, editora-chefe</div>
              </div>

              <div style={{ background: 'var(--vp-surface)', border: '1px solid var(--vp-border)', padding: 22, marginBottom: 18 }}>
                <h4 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 12px', color: 'var(--vp-text)' }}>Antes de enviar, leia</h4>
                <ul style={{ fontSize: 13, color: 'var(--vp-text-2)', lineHeight: 1.55, paddingLeft: 18, margin: 0 }}>
                  <li style={{ marginBottom: 8 }}>Como instalar o Tor Browser</li>
                  <li style={{ marginBottom: 8 }}>Configurando Signal de forma segura</li>
                  <li style={{ marginBottom: 8 }}>O que NÃO fazer ao denunciar</li>
                  <li>Direitos do denunciante (Lei 13.608/2018)</li>
                </ul>
              </div>

              <div style={{ background: 'var(--vp-surface-2)', padding: 22, fontSize: 11, color: 'var(--vp-text-3)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--vp-text-2)' }}>Aviso legal:</strong> O Voz Pública não armazena IPs em nenhum dos canais acima. SecureDrop é hospedado em servidor próprio. Logs do formulário web são apagados a cada 72h.
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// ─── ONBOARDING (MOBILE, 4 steps) ──────────────────────────────
function MobileOnboarding({ step = 1 }) {
  const total = 4;
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--vp-text-3)', fontSize: 12 }}>Pular</button>
        <span style={{ fontFamily: 'var(--vp-mono)', fontSize: 11, color: 'var(--vp-text-3)' }}>{step}/{total}</span>
        <span style={{ width: 30 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${total},1fr)`, gap: 4, padding: '0 16px 14px' }}>
        {Array.from({length: total}).map((_,i) => <div key={i} style={{ height: 3, background: i<step ? 'var(--vp-accent)' : 'var(--vp-border)' }} />)}
      </div>

      {step === 1 && (
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>Bem-vinda, Marina</span>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 36, lineHeight: 1.05, margin: '10px 0 14px', letterSpacing: '-0.02em' }}>Vamos personalizar sua leitura.</h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 16, color: 'var(--vp-text-2)', lineHeight: 1.5, marginBottom: 28 }}>4 perguntas rápidas para mostrar primeiro o que mais te interessa.</p>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 200, height: 200, border: '2px solid var(--vp-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--vp-serif-display)', fontSize: 72, color: 'var(--vp-accent)', fontWeight: 700, fontStyle: 'italic' }}>VP</div>
          </div>
          <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13 }}>Começar →</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 26, lineHeight: 1.1, margin: '0 0 6px' }}>Quais editorias você acompanha?</h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-3)', marginBottom: 22 }}>Escolha 3 ou mais. Você pode mudar depois.</p>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignContent: 'flex-start' }}>
            {[['Pantanal',true],['Política',true],['Indígenas',true],['Cidades',false],['Agronegócio',false],['Fronteira',false],['Cultura',false],['Esportes',false],['Economia',true],['Justiça',false]].map(([n,a]) => (
              <button key={n} style={{ padding: '14px 10px', border: a?'2px solid var(--vp-accent)':'1px solid var(--vp-border)', background: a?'rgba(217,119,87,0.08)':'transparent', color: 'var(--vp-text)', fontFamily: 'var(--vp-serif-display)', fontSize: 15, textAlign: 'left' }}>{a && '✓ '}{n}</button>
            ))}
          </div>
          <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13, marginTop: 16 }}>Continuar →</button>
        </div>
      )}

      {step === 3 && (
        <div style={{ flex: 1, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 26, lineHeight: 1.1, margin: '0 0 6px' }}>Como podemos te avisar?</h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-3)', marginBottom: 22 }}>Sem spam. Apenas reportagens importantes.</p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 22 }}>
            {[
              ['Push','Manchetes e furos urgentes',true],
              ['Newsletter A Semana em MS','Resumo aos sábados, 7h',true],
              ['WhatsApp Canal','Alertas pelo VP|MS',false],
              ['E-mail diário','Manhã, 7h, todos os dias',false],
            ].map(([t,d,a]) => (
              <label key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, border: '1px solid var(--vp-border)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={a} style={{ marginTop: 3 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 15, marginBottom: 2 }}>{t}</div>
                  <div style={{ fontSize: 11, color: 'var(--vp-text-3)' }}>{d}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13 }}>Ativar →</button>
        </div>
      )}

      {step === 4 && (
        <div style={{ flex: 1, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 26, lineHeight: 1.1, margin: '0 0 6px' }}>Sua cidade em MS</h1>
          <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 13, color: 'var(--vp-text-3)', marginBottom: 22 }}>Para priorizar matérias da sua região.</p>
          <input className="vp-input" placeholder="Buscar cidade…" style={{ marginBottom: 14 }} />
          <div style={{ flex: 1, overflowY: 'auto' }} className="vp-scroll">
            {['Campo Grande','Dourados','Três Lagoas','Corumbá','Ponta Porã','Naviraí','Aquidauana','Chapadão do Sul','Outra cidade…','Não moro em MS'].map((c,i) => (
              <a key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 4px', borderBottom: '1px solid var(--vp-border)', fontFamily: 'var(--vp-serif-display)', fontSize: 16, color: i===0?'var(--vp-accent)':'var(--vp-text)' }}>
                {c}
                {i===0 && <span style={{ color: 'var(--vp-accent)' }}>✓</span>}
              </a>
            ))}
          </div>
          <button className="vp-btn vp-btn-primary" style={{ width: '100%', padding: 14, fontSize: 13, marginTop: 14 }}>Concluir e ler →</button>
        </div>
      )}
    </div>
  );
}

// ─── 404 ───────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="vp-root" style={{ background: 'var(--vp-bg)', minHeight: '100%' }}>
      <Masthead />
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '120px 28px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 220, lineHeight: 1, color: 'var(--vp-accent)', fontWeight: 900, letterSpacing: '-0.04em', fontStyle: 'italic' }}>404</div>
        <span className="eyebrow" style={{ marginTop: 14, display: 'inline-block' }}>Página não encontrada</span>
        <h1 style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.02em', margin: '14px 0 18px' }}>Aqui não há reportagem.</h1>
        <p style={{ fontFamily: 'var(--vp-serif)', fontSize: 18, color: 'var(--vp-text-2)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.55, fontStyle: 'italic' }}>
          A matéria que você procura pode ter sido despublicada por erro de checagem (corrigimos), arquivada por idade, ou simplesmente nunca existiu nesse endereço.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 56 }}>
          <button className="vp-btn vp-btn-primary" style={{ padding: '12px 22px', fontSize: 13 }}>Voltar para a capa</button>
          <button className="vp-btn" style={{ padding: '12px 22px', fontSize: 13 }}>Buscar no arquivo</button>
        </div>

        <div style={{ borderTop: '1px solid var(--vp-border)', paddingTop: 36, textAlign: 'left', maxWidth: 680, margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--vp-sans)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 18, color: 'var(--vp-text-3)' }}>Mais lidas hoje</h3>
          {[
            ['Pantanal','O rio que sumiu: como o Taquari virou corredor de sedimentos'],
            ['Política','Raio-X: o patrimônio dos 24 deputados estaduais de MS'],
            ['Indígenas','"Estão abrindo o mato com trator": Guarani Kaiowá denunciam invasão em Caarapó'],
            ['Fronteira','A nova rota do contrabando entre Ponta Porã e Pedro Juan'],
          ].map(([s,t],i) => (
            <a key={i} style={{ display: 'grid', gridTemplateColumns: '40px 90px 1fr', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--vp-border)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 28, color: 'var(--vp-accent)', fontWeight: 700 }}>0{i+1}</span>
              <span className="eyebrow" style={{ fontSize: 9 }}>{s}</span>
              <span style={{ fontFamily: 'var(--vp-serif-display)', fontSize: 18, lineHeight: 1.25 }}>{t}</span>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

Object.assign(window, {
  AboutPage, TeamPage, WhistleblowerPage, MobileOnboarding, NotFoundPage,
});
