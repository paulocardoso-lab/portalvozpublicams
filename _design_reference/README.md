# Handoff: Voz Pública MS — Portal de notícias + Painel administrativo

## Visão geral

Este pacote contém o design completo do **Voz Pública MS**, um portal de jornalismo independente para o estado de Mato Grosso do Sul (Brasil), com URL oficial **vozpublicams.com.br**. Inclui:

- **5 telas do portal público (desktop):** Home, página de matéria (leitura), página de editoria, página de colunista, busca.
- **13 telas do painel administrativo (desktop):** Dashboard, Editor CMS, Fila editorial (kanban), Comentários, Usuários & permissões, Banners, Métricas, Assinaturas/doações, Aparência, Redes sociais, Perfil de autor, Logs de auditoria, Configurações gerais.
- **3 telas do portal mobile** (iPhone 14 · 390×844): Home, matéria com barra de progresso, menu/editorias.
- **3 telas do admin mobile** (modo escuro): Dashboard com KPIs, editor de matéria, moderação de comentários.
- **4 telas do funil de apoio mobile:** Escolher plano → Dados pessoais → Pagamento PIX → Confirmação.
- **4 telas mobile de leitor & conta:** Newsletter (landing), Login, Cadastro, Perfil do leitor.

**Total: 32 telas** cobrindo desktop e mobile, leitor e redação.

O sistema visual é **clássico editorial dark**, com tipografia serifa (Playfair Display + Source Serif 4) e acento laranja (#d97757), inspirado em referências como NYT, Washington Post e ProPublica, mas com identidade própria para MS (Pantanal, fronteira, agronegócio, povos indígenas).

## Sobre os arquivos de design

Os arquivos `.html` e `.jsx` deste bundle são **referências de design criadas em HTML/React** — protótipos mostrando o look-and-feel e o comportamento pretendidos. **Não são código de produção para copiar diretamente.**

A tarefa do desenvolvedor é **recriar esses designs no ambiente do projeto-alvo** (Next.js, Astro, Remix, Laravel, WordPress headless, etc.), usando os padrões e bibliotecas estabelecidos. Se nenhum ambiente existir ainda, recomendamos um stack abaixo.

## Fidelidade

**Alta fidelidade (hi-fi)** — cores, tipografia, espaçamentos, hierarquia e estados são finais. O desenvolvedor deve reproduzir pixel-a-pixel, adaptando apenas para o framework escolhido.

## Stack recomendado (caso o projeto comece do zero)

- **Frontend:** Next.js 14+ (App Router) com React Server Components + TypeScript
- **CMS:** Strapi ou Payload (auto-hospedado, permite controle total — alinhado com a aba "Configurações") ou WordPress headless via REST/GraphQL
- **Estilização:** Tailwind CSS com tokens customizados (mapear `--vp-*` para `theme.extend`)
- **Banco:** PostgreSQL
- **Auth:** NextAuth.js com 2FA (TOTP) — necessário para os papéis listados
- **Pagamentos (assinaturas/doações):** Stripe + PIX via gateway brasileiro (Pagar.me/Iugu)
- **Comentários:** sistema próprio (já modelado nas telas) com moderação por fila
- **Analytics:** Plausible (privacy-friendly) ou GA4 + Cloudflare Web Analytics
- **CDN/cache:** Cloudflare (já modelado no admin)
- **E-mail:** Resend ou SendGrid para newsletter; integração com Mailchimp opcional
- **Antispam:** Cloudflare Turnstile (já listado em integrações)

## Tokens de design

### Cores (dark mode — padrão)
```
--vp-bg:         #1a1a19   /* fundo principal */
--vp-surface:    #262624   /* cards, painéis */
--vp-surface-2:  #2f2f2d   /* hover, ativo */
--vp-surface-3:  #3a3a37
--vp-border:     #3a3a37
--vp-border-2:   #4a4a46

--vp-text:       #faf9f5   /* texto principal */
--vp-text-2:     #d1cfc4   /* texto secundário */
--vp-text-3:     #8a887f   /* meta, labels */
--vp-text-4:     #5a5852   /* desabilitado */

--vp-accent:       #d97757   /* laranja editorial */
--vp-accent-hover: #c96442
--vp-accent-soft:  rgba(217,119,87,0.12)

--vp-urgent:  #e85d4a   /* erro, urgência, ao vivo */
--vp-ok:      #7aa37a   /* sucesso */
```

### Tipografia
- **Display (manchetes):** `"Playfair Display"`, fallback `"Source Serif 4", Georgia, serif` — peso 700/900, letter-spacing -0.01em a -0.02em, line-height 1.05–1.1
- **Corpo serifa:** `"Source Serif 4"`, fallback `Georgia, serif` — pesos 400/600/700
- **UI sans:** `Inter` — pesos 400/500/600/700
- **Mono:** `JetBrains Mono` — para dados, IPs, códigos, métricas

Escala usada nos protótipos:
- H1 hero portal: 46–72px
- H1 matéria: 52px
- H2: 32px
- H3: 22–26px
- corpo matéria: 19px / line-height 1.65
- meta/byline: 12px
- eyebrow/tag: 10–11px com letter-spacing 0.1em–0.14em, MAIÚSCULAS

### Espaçamento
Múltiplos de 4px. Padding padrão de seção: 28px lateral; gap entre cards: 12–24px; gap entre seções: 28–32px.

### Bordas e radius
Editorial usa **bordas retas** (radius 0–4px). Painéis admin: 4–6px. Imagens de avatar: 50%.

### Imagens
Placeholders no design são divs com listras diagonais a 135° + label — todos devem ser substituídos por `<Image>` do Next.js (ou equivalente) com lazy loading e `srcset` responsivo. Razão típica: 16:9 para destaque, 1:1 para avatares e thumbs.

## Telas — Portal público

### 1. Home (`pages/Home.jsx`)
**Largura:** 1280px no mock; responsivo até 360px.
**Estrutura (top→bottom):**
1. Masthead sticky: barra utilitária (data, clima CG, cotações USD/BOI/SOJA, links newsletter/podcast/denúncia, botão Assine) + linha do logo (menu hambúrguer + busca à esquerda, monograma "VP|MS" central com slogan, redes sociais à direita) + nav horizontal de 14 editorias.
2. Strip "AO VIVO" com tag pulsante vermelha (#e85d4a) e manchete urgente.
3. Banner leaderboard 728×90 (slot configurável).
4. Hero: grid 1.1fr/1fr, manchete principal de 46px à esquerda + foto de capa à direita com legenda em itálico.
5. Trio de chamadas (3 colunas iguais com foto+eyebrow+H3+lead).
6. Bloco "Especial · Pantanal" com 1 destaque grande à esquerda + 4 itens em lista vertical à direita.
7. Banner billboard inline 970×120.
8. 3 colunas: Política / Economia / Cidades (cada uma com 3 itens, separadores horizontais).
9. Colunistas: 4 cards com avatar redondo + tag editoria + título em itálico entre aspas + nome.
10. Mais lidas (numerada 1–5 com numeral grande laranja em Playfair) + Podcast com player.
11. Sidebar direita 320px (alinhada ao topo, desce com scroll): bloco doação, ad 300×250, agenda pública (lista com horário em laranja mono), newsletter inline, ad 300×600 skyscraper.
12. Footer: 4 colunas (sobre + editorias + institucional + denúncia/contato) com regra superior 2px.

### 2. Página de matéria (`pages/Article.jsx`)
**Layout:** grid 200px/1fr/260px com max-width 1400px.
- **Esquerda sticky:** menu de compartilhamento vertical (WhatsApp, Facebook, X, LinkedIn, copiar, imprimir) + bloco "esta reportagem é aberta — contribua".
- **Centro (max 680px):** eyebrow → H1 52px → lead 20px itálico → bloco autor com avatar 44px, nome bold, data/atualização/tempo de leitura → foto destacada com legenda → corpo em Source Serif 19px/1.65, primeira letra (drop cap) 78px laranja em Playfair → bloco citação com borda esquerda 3px laranja, texto 28px Playfair itálico → H2 → grid 3 colunas com números grandes (callout de dados) → continuação de corpo → bloco navegação por capítulos (5 itens, com tempo de leitura) → bloco metodologia em fundo `rgba(217,119,87,0.05)` → seção de comentários (textarea + lista com avatar/nome/tempo/votos/responder/denunciar).
- **Direita:** ad 300×250 → "Leia também" (4 itens) → CTA contribuição.

### 3. Página de editoria (`pages/Pages2.jsx` → `Section`)
- Hero com border-bottom 2px branco: eyebrow "EDITORIA" + H1 72px ("Pantanal") + descrição + meta (X reportagens · Y repórteres · Z séries).
- Subnav horizontal: Todos / Investigações / Dados / Séries / Vídeo / Opinião (ativo com border-bottom laranja 2px).
- Lista: 1 destaque grande no topo (grid 1fr/1fr) + 6 itens em lista horizontal (foto 200px à esquerda, conteúdo no meio, meta à direita).
- Paginação clássica.
- Sidebar: ad 300×250 + lista de repórteres da editoria + ad 300×600.

### 4. Página de colunista (`pages/Pages2.jsx` → `Columnist`)
- Hero em fundo `--vp-surface` com avatar 160px redondo + nome 56px + bio em itálico + e-mail/social.
- Coluna do dia em destaque com lead grande, depois lista de "Colunas recentes" com data em mono à esquerda.
- Sidebar: bloco "Sobre a coluna", ad, tags mais usadas (chips outline).

### 5. Busca (`pages/Pages2.jsx` → `Search`)
- Input gigante 28px Playfair com query atual.
- Filtros laterais (200px): Tipo (checkbox), Editoria (checkbox), Período (radio).
- Resultados: meta em cima, título 22px, snippet com `<mark>` em laranja translúcido.

## Telas — Painel administrativo

Shell comum (`pages/AdminShell.jsx`): sidebar 232px à esquerda (logo VP|MS + nav vertical com ícone+label+badge ativo com border-left laranja 2px + footer com avatar/nome/papel) + topbar (busca + status online + contadores rascunho/revisão + botões "Ver site" e "+ Nova matéria").

### Itens da sidebar (em ordem)
1. **Dashboard** — KPIs + tráfego em tempo real + mais lidas + pipeline + atividade + alertas
2. **Matérias** — listagem (reutiliza editor)
3. **Nova matéria** — Editor CMS WYSIWYG-like com toolbar (B/I/U/S, parágrafo/H2/H3/quote, Quote/Imagem/Galeria/Vídeo/Embed/Lista/Dado/Divisor) + sidebar Publicação/Autores/Tags/SEO/Opções
4. **Fila editorial** — kanban 6 colunas (Pauta → Apuração → Rascunho → Em revisão → Agendado → Publicado)
5. **Comentários** (badge contador) — abas Aguardando/Sinalizados/Aprovados/Ocultos/Banidos com ações Aprovar/Responder/Ocultar/Banir
6. **Usuários & permissões** — matriz de 7 papéis + tabela de usuários com status online/idle/offline
7. **Banners & publicidade** — 5 slots (leaderboard, billboard, retângulo, skyscraper, nativo) + visualização de layout + tabela de campanhas
8. **Métricas & tráfego** — KPIs + gráfico 30d + origem + cidades MS + dispositivos donut + top matérias
9. **Assinaturas & doações** — MRR + meta de campanha + planos (Leitor/Apoiador/Guardião/Mecenas) + transações com PIX/Cartão/Boleto
10. **Aparência & layout** — identidade + tipografia + modo + densidade + reordenação drag-and-drop dos blocos da home
11. **Redes sociais** — 8 canais (IG, FB, X, YT, TikTok, WhatsApp Canal, LinkedIn, Bluesky) + auto-post + fila de publicação
12. **Logs de auditoria** — tabela com data/usuário/ação/alvo/IP/status, tentativas bloqueadas em vermelho
13. **Meu perfil** — bio pública + segurança (senha, 2FA, sessões) + notificações
14. **Configurações** — identidade do veículo (CNPJ, endereço), domínio/SSL, integrações (GA4, AdSense, Mailchimp, Stripe, OpenAI, Turnstile), LGPD, zona de perigo

## Papéis e permissões

| Papel | Cor | Permissões |
|---|---|---|
| Super Admin | `#e85d4a` | Tudo (incluindo cobrança e infraestrutura) |
| Editor-chefe | `#d97757` | Aprova/publica/despublica qualquer conteúdo |
| Editor de editoria | `#e0b44a` | Publica na editoria atribuída; revisa repórteres |
| Repórter | `#7aa2f7` | Cria e edita próprias matérias; envia para revisão |
| Colunista | `#c4a7e7` | Publica na própria coluna sem revisão |
| Moderador | `#7aa37a` | Apenas fila de comentários |
| Financeiro | `#8a887f` | Apenas banners, assinaturas e métricas |

## Modelos de dados (sugeridos)

```
User { id, name, email, avatar, role, bio, social, twoFA, sessions[] }
Article { id, slug, title, eyebrow, lead, body (rich), heroImage, caption,
          authors[], section, series, tags[], status (draft|review|approved|scheduled|published),
          publishedAt, scheduledAt, allowComments, paywall, sendPush, includeInNewsletter }
Comment { id, articleId, userId|guest, body, status (pending|approved|hidden|spam),
          flags[], votes, parentId, ip, createdAt }
Section { slug, name, description, parent }
Series { id, name, parts[], totalParts }
Tag { slug, name }
Campaign { id, name, client, slot, creative, impressions, clicks, ctr, startsAt, endsAt, status }
AdSlot { id, name, dimensions, page, position }
Subscriber { id, userId, plan, mrr, method, status, churned }
Transaction { id, subscriberId, amount, method (PIX|Card|Boleto), status, createdAt }
AuditLog { id, userId, action, target, ip, status, createdAt }
```

## Comportamento e estados

- **Editor:** auto-save a cada 12s, versionamento com histórico (v1...vN), edição colaborativa multi-usuário (mostrar nome do co-editor)
- **Comentários:** detecção automática de spam (links suspeitos, padrões) → fila "Provável spam" amarela; palavrões → flag `[palavrão removido automaticamente]` vermelho
- **Live/breaking:** tag `vp-tag-live` com `animation: vp-pulse 2s infinite`
- **Hover headlines:** `.vp-headline:hover { color: var(--vp-accent) }` em 0.15s
- **Publicação automática:** ao publicar, se toggles ativos, dispara para IG, FB, X, WhatsApp em paralelo
- **2FA obrigatório** para Super Admin e Editor-chefe
- **Auditoria:** todo login, publicação, exclusão, alteração de permissão e geração de chave API gera entrada

## Funil de apoio (doação) — mobile

Tela crítica de conversão. Desenhada como **3 etapas explícitas** (com indicador de progresso no topo) + tela de sucesso. PIX é o método principal — aparece como primeira aba e tem QR code dedicado.

**Etapa 1 — Escolher plano** (`MobileDonateAmount`): mostra **barra de meta mensal** com % e valor arrecadado vs. meta (R$ 50k). Quatro planos em cards verticais (Leitor R$19 / Apoiador R$39 / Guardião R$79 / Mecenas R$199); o card selecionado tem borda 2px laranja + fundo `rgba(217,119,87,0.06)`. Tag "Mais escolhido" no Apoiador. Abaixo, opção de **contribuição única** com 4 botões pré-definidos (R$ 50 / 100 / 250 / 500) + campo livre. Footer fixo com CTA refletindo plano selecionado: "Continuar com R$ 39/mês →".

**Etapa 2 — Dados pessoais** (`MobileDonateData`): campos em sequência (Nome / E-mail / CPF / Celular / Cidade+UF). CPF e celular usam `font-family: var(--vp-mono)` para alinhamento. Checkboxes para newsletter e LGPD. Card discreto com cadeado 🔒 explicando que dados são processados pela Pagar.me e VP nunca armazena cartão.

**Etapa 3 — Pagamento** (`MobileDonatePay`): tabs PIX/Cartão/Boleto no topo. Card de resumo (plano + recorrência + total). **QR code estilizado** (200×200) com finder patterns nos cantos e logo VP centralizado em laranja. Código PIX copiável em mono com botão "Copiar código PIX". Status "Aguardando confirmação…" com ponto cinza.

**Etapa 4 — Sucesso** (`MobileDonateSuccess`): tela centralizada com **círculo grande laranja com ✓** (84×84). H1 "Obrigado, Marina." personalizado. Texto destacando "você é uma das 4.813 pessoas". 2 CTAs: ler matérias exclusivas (primário) + compartilhar (secundário). Recibo em mono no rodapé.

## Newsletter, autenticação e perfil — mobile

**Newsletter landing** (`MobileNewsletter`): hero em fundo `--vp-surface` com H1 enorme (38px Playfair, "A Semana em **MS**" — MS em itálico laranja) + lead em itálico. Faixa de **3 stats sociais** (12.483 leitores · 68% abrem · 3 anos no ar). Form simples (e-mail + CTA). Bloco "O que vai chegar no seu e-mail" com 4 itens numerados em laranja. Preview da última edição (#142) em fundo destacado. Cross-sell de outras newsletters no rodapé.

**Login** (`MobileLogin`): tela compacta com eyebrow + H1 32px → e-mail + senha (com link "Esqueci" alinhado à direita do label) + checkbox "manter conectado" → CTA primário → divisor "ou" → 2 botões sociais (Google, Apple) → link de cadastro fixo no rodapé.

**Cadastro** (`MobileSignup`): card de benefícios em `--vp-surface` listando 4 vantagens com ✓ laranja. Formulário com Nome/E-mail/Senha/Cidade. **Indicador de força de senha** em 4 barras horizontais coloridas em verde. Select de cidade pré-populado com cidades de MS. Checkboxes LGPD + newsletter (default checked).

**Perfil do leitor** (`MobileReaderProfile`): header com avatar 56px + nome + meta "Apoiadora desde fev/2024" + botão Editar. **Pill destacando plano ativo** em fundo `rgba(217,119,87,0.12)`. Linha de 3 stats (28 salvas / 142 lidas / 12 comentários). 3 tabs (Salvos / Histórico / Comentários). Lista de matérias salvas em grid `1fr 80px` (texto+thumb) com timestamp + estrela laranja para remover. Menu de configurações em drill-down: Apoio mensal / Newsletters / Notificações / Métodos de pagamento / Privacidade & dados / Senha e segurança / Sair (em vermelho `--vp-urgent`). Tab bar inferior padrão com "Eu" ativa.

## Responsividade

Os mocks foram desenhados em 1280px (portal desktop), 1400px (admin desktop) e 390px (mobile, iPhone 14). Mobile NÃO é uma adaptação automática — os designs mobile foram desenhados especificamente, com hierarquia e densidade próprias. **70%+ do tráfego de portais brasileiros é mobile**, então estas telas são tão importantes quanto as desktop.

### Portal mobile (`pages/Mobile.jsx`)

**Home mobile** — masthead sticky com hambúrguer à esquerda, monograma central, busca à direita; faixa secundária com data + cotações em mono (USD/BOI). Scroller horizontal de editorias com aba ativa em laranja com border-bottom 2px. Strip "AO VIVO" pulsante. Hero com foto cheia + manchete 24px Playfair + lead 14px serifa + byline. Banner de doação contextual em `--vp-surface` com CTA full-width. Lista de matérias em grid `1fr 90px` (texto+thumb). Banner inline 320×100. Bloco "Especial · Pantanal" com foto cheia + sequência. Mais lidas numerada com numerais grandes laranja. **Tab bar inferior fixa** (5 itens): Capa / Editorias / Ao vivo (badge pulsante) / Salvos / Eu.

**Matéria mobile** — barra superior minimalista com seta voltar + eyebrow + ícone "Aa" (tamanho de fonte) + bookmark; **barra de progresso** 2px logo abaixo. Eyebrow → H1 30px Playfair com letter-spacing -0.015em → lead 16px itálico → bloco autor com avatar 36px → foto destacada com legenda → corpo Source Serif 17px/1.65 com **drop cap 56px laranja**. Citação em borda esquerda 3px laranja com 20px Playfair itálico. Grid 3-col de "scorecard" com números grandes laranja. Bloco de comentários compactado. **Barra inferior fixa** com 4 ações: voto/curtir, compartilhar, citar, salvar.

**Menu / Editorias** — drawer com header (logo + ×) + busca grande no topo. Lista de 14 editorias em Playfair 17px com chevron `›`. Seção "Acompanhe" com newsletter, podcast, WhatsApp Canal, denúncia (em laranja). Footer fixo com 2 botões: "Apoie" (primário) e "Entrar/Cadastrar" (secundário).

### Admin mobile (`pages/Mobile.jsx`)

**Dashboard mobile** — barra superior com hambúrguer + monograma + label "Admin" + indicador online + avatar. Saudação personalizada. **Grid 2×2 de KPIs** (Online / Views 24h / News / Receita) com delta em verde. Painel de tráfego com sparkline 70px de altura. **Pipeline em grid 2×2** com barrinha lateral colorida por status (Rascunhos / Em revisão / Aprovadas / Agendadas). Painel de alertas com pontos coloridos semânticos (urgente vermelho, aviso amarelo, info cinza). CTA "+ Nova matéria" full-width. **Tab bar inferior** (5 itens): Dash / Matérias / Comentários (badge com contador) / Métricas / Mais.

**Editor mobile** — barra superior com voltar + tag "Rascunho" + status auto-save + botão "Publicar". Campos editáveis em sequência: editoria → título 22px Playfair → sutiã itálico → área de foto destacada com borda tracejada → corpo 15px Source Serif (textarea redimensionável). Bloco "Configurações" em lista de drill-down (Editoria / Série / Autores / Tags / SEO) com chevron. **Toolbar de formatação rolável horizontal** fixa no rodapé com 10 botões (B, I, H2, citação, link, imagem, lista, etc.).

**Moderação mobile** — abas roláveis (Aguardando / Sinalizados / Aprovados / Spam) com contadores. Cards diferenciados por status: flag em vermelho translúcido, spam em amarelo translúcido. Cada card mostra avatar + nome + tag de status + tempo + texto do comentário + matéria de origem + motivo. **4 ações em grid**: Aprovar / Responder / Ocultar / Banir.

### Princípios das telas mobile

- **Tipografia mantida:** Playfair Display continua em manchetes (24–30px), Source Serif no corpo (15–17px), Inter na UI (10–13px). Nunca <10px.
- **Hit targets:** mínimo 44×44px em todos os botões e links de navegação.
- **Tab bars:** sempre presentes; nunca esconder navegação principal atrás de hambúrguer no mobile.
- **Sticky navigation:** topo (masthead/progresso) + rodapé (tab bar / ações de matéria) sempre visíveis.
- **Scroll horizontal:** apenas para editorias e toolbars do editor; nunca para conteúdo principal.
- **Densidade:** menos colunas, mais separadores horizontais. Cards com `1fr 90px` para texto+thumb.

## Acessibilidade

- Contraste mínimo verificado: texto principal `#faf9f5` sobre `#1a1a19` = 18.5:1 ✓
- Foco visível com `outline: 2px solid var(--vp-accent)` em todos os interativos
- Headings semânticos (h1 → h2 → h3, sem pular níveis)
- Imagens com `alt` (legendas atuais devem virar `alt`)
- Formulários com `<label for>` explícito
- Navegação por teclado em todos os menus, kanban e tabelas
- ARIA labels em ícones (busca, menu, redes sociais)

## Considerações específicas do Brasil/MS

- **LGPD:** banner de consentimento de cookies, exportação/exclusão de dados do leitor, anonimização de IPs no analytics, DPO designado
- **Pagamentos:** PIX é o método principal (modal), boleto secundário, cartão como conveniência
- **WhatsApp Canal** é prioritário — peso similar a Instagram em distribuição no Brasil
- **Cobertura geográfica:** Campo Grande, Dourados, Três Lagoas, Corumbá, Ponta Porã, Naviraí, fronteira com Paraguai/Bolívia
- **Editorias específicas de MS:** Pantanal, Indígenas (Guarani Kaiowá), Agronegócio, Fronteira

## Arquivos no bundle

- `Voz Pública MS.html` — entry point com DesignCanvas e todos os artboards
- `styles/tokens.css` — todos os tokens CSS
- `components/shared.jsx` — Masthead, SiteFooter, Monogram, ImgPH
- `pages/Home.jsx` — Home do portal
- `pages/Article.jsx` — Página de matéria
- `pages/Pages2.jsx` — Editoria, Colunista, Busca
- `pages/AdminShell.jsx` — Shell do admin + Dashboard + Stat + Sparkline
- `pages/AdminEditor.jsx` — Editor CMS + moderação de comentários
- `pages/AdminMore.jsx` — Usuários, Banners, Aparência, Redes sociais
- `pages/AdminExtra.jsx` — Kanban, Métricas, Configurações, Perfil, Assinaturas, Auditoria
- `pages/Mobile.jsx` — **6 telas mobile** (3 portal + 3 admin) — desenhadas em 390px iPhone 14
- `pages/MobileExtra.jsx` — **8 telas mobile** adicionais: funil de doação (4 etapas) + newsletter + login + cadastro + perfil do leitor
- `ios-frame.jsx` — moldura de iPhone usada para apresentação dos mocks mobile (NÃO portar)
- `design-canvas.jsx` — wrapper de canvas (referência apenas, NÃO portar)

## Ordem sugerida de implementação

1. **Setup base:** Next.js 14 + TypeScript + Tailwind + tokens (`--vp-*` → `tailwind.config.ts`) + fontes via `next/font` + estrutura de rotas
2. **Strapi headless** com modelos `Article`, `User`, `Section`, `Tag`, `Series`, `Comment`
3. **Home mobile** (maior tráfego) — depois desktop
4. **Matéria mobile** + matéria desktop em paralelo (mesmo conteúdo, layouts diferentes)
5. **Auth + papéis** (NextAuth + 2FA TOTP)
6. **Admin desktop:** Dashboard → Editor CMS → Comentários → Usuários
7. **Admin mobile** (mesmas 3 telas críticas: Dashboard, Editor, Comentários)
8. **Demais telas portal** (editoria, colunista, busca)
9. **Demais telas admin** (kanban, banners, métricas, assinaturas, etc.)
10. **Stripe + PIX** (Pagar.me/Iugu) para assinaturas
11. **LGPD, analytics privacy-friendly, antispam, newsletter**

## Para o Google Antigravity / Claude Code / Cursor

Sugestão de prompt inicial:

> Crie um portal de notícias chamado "Voz Pública MS" em Next.js 14 (App Router) + TypeScript + Tailwind CSS, seguindo o handoff anexo. O CMS deve ser Strapi headless. Use Postgres, NextAuth com 2FA, Stripe + PIX (Pagar.me) para assinaturas. **Comece pela versão MOBILE da home pública** (70% do tráfego) — depois desktop. Reproduza pixel-a-pixel as telas em `pages/Mobile.jsx` e `pages/Home.jsx`, mapeando os tokens `--vp-*` para `tailwind.config.ts`. As fontes (Playfair Display, Source Serif 4, Inter, JetBrains Mono) devem ser carregadas via `next/font`. Antes de começar, leia todos os arquivos `.jsx` para entender estrutura, hierarquia e copy editorial. **NÃO porte** `design-canvas.jsx` nem `ios-frame.jsx` — são apenas wrappers de apresentação dos mocks.
