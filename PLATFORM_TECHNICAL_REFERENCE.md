# Voz Pública MS — Referência Técnica do Design Restaurado

## Identidade Visual Core
- **Modo Padrão**: Dark Mode Absoluto (`bg: #1a1a19`, `text: #faf9f5`)
- **Estética**: Editorial Clássico / Jornalismo Investigativo Premium.
- **Bordas**: Radius 0px a 4px (Editorial reto).

## Tipografia (Google Fonts)
1. **Playfair Display** (Display/Headlines)
   - Pesos: 400, 600, 700, 900 + Italic.
   - Uso: Manchetes, Drop Caps, Blockquotes.
2. **Source Serif 4** (Corpo/Serif)
   - Pesos: 300, 400, 600, 700 + Italic.
   - Uso: Texto de matérias, Leads.
3. **Inter** (UI/Sans)
   - Pesos: 400, 500, 600, 700.
   - Uso: Meta-dados, Botões, Navegação, Eyebrows.
4. **JetBrains Mono** (Dados)
   - Pesos: 400, 500.
   - Uso: Mercado financeiro, Agendas, Timestamps.

## Sistema de Design (Tokens CSS)
- **Cores Principais**:
  - `accent`: #d97757 (Terracota editorial)
  - `bg`: #1a1a19
  - `surface`: #262624
  - `border`: #3a3a37
- **Grid Editorial (Desktop)**:
  - Home: 1fr 320px (Main + Sidebar), Gap 32px.
  - Artigo: 200px 1fr 260px (Share + Body + Sidebar), Gap 36px.
  - Padding Lateral: 28px.

## Componentes Core Restaurados
1. **Masthead**: Estrutura em 3 níveis (Utilidade, Logo/Tagline, Nav) com comportamento sticky.
2. **BrandLogo**: Monograma VP|MS calculado proporcionalmente (25% padding na esquerda, 55% font-size na direita).
3. **Article Body**: Suporte a Drop Caps (78px Playfair), Blockquotes editoriais com borda accent, e Data Callouts.
4. **Mobile Experience**: Menu em lista Playfair 17px com chevrons, Editoria Scroller e Tab Bar persistente.

## Verificação de Fidelidade
- **Fonte da Verdade**: `\_design\_reference/`
- **Validação**: Todas as telas devem seguir o grid de múltiplos de 4px e o contraste AAA para legibilidade em dark mode.
- **Grid Principal**: `grid-cols-[1fr_320px]` (Conteúdo principal vs Sidebar fixa).
- **Gaps**: Estritos `32px` entre colunas de conteúdo e sidebar; `28px` entre itens do Hero.
- **Paddings**: Container lateral de `28px`; Paddings verticais de `24px` a `32px`.
- **Bordas**: `1px solid var(--vp-border)` (#3a3a37).

## 3. Componentes de Marca Core
- **Monograma (BrandLogo)**: Lógica de padding proporcional dinâmica baseada no `fontSize`.
- **Image Placeholders (ImgPH)**: Estilo de listras diagonais 135deg com gradiente radial sutil.
- **Botões (vp-btn)**: Arredondamento de `3px`, fonte Inter 13px, borda `1px solid var(--vp-border-2)`.

## 4. Configurações Administrativas
- **RSS Manager**: Sistema de sincronização automática via cron Jobs (em correção para estabilidade).
- **Settings**: Variáveis dinâmicas armazenadas no Prisma (`SITE_TAGLINE`, `SOCIAL_FB`, etc).

## 5. Próximos Passos (Backlog Técnico)
- Resolver loop infinito no formulário de RSS (implementar validação de input).
- Finalizar a transição do banco de dados (db push) após liberação de travas no Supabase.
