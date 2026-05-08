# Voz Pública MS - Referência Técnica (Pós-Restauração Visual)

## 1. Stack Tecnológica Core
- **Framework**: Next.js 16.2.6 (App Router)
- **Runtime**: React 19.2.6
- **Database**: PostgreSQL (Supabase) via Prisma 7.8.0
- **Estilização**: Tailwind CSS v4.0.0 + Vanilla CSS
- **Monitoramento**: Sentry (Dsn configurado)
- **Analytics**: Vercel Analytics + Speed Insights

## 2. Identidade Visual (Fidelidade Absoluta)

### Tipografia
- **Display**: `Playfair Display` (Pesos: 400, 700, 900). Usada em manchetes e títulos de destaque.
- **Serif (Corpo)**: `Source Serif 4` (Pesos: 400, 500, 600, 700). Usada em leads, parágrafos e textos longos.
- **Sans (Interface)**: `Inter`. Usada em navegação, metadados e botões.
- **Mono**: `JetBrains Mono`. Usada em indicadores técnicos e tickers.

### Sistema de Cores
- **Background**: `#1a1a19` (Voz Pública Dark)
- **Superfícies**: `#262624` (Cards e inputs)
- **Texto Principal**: `#faf9f5` (Off-white)
- **Texto Secundário**: `#d1cfc4` (Cinza quente)
- **Destaque (Accent)**: `#d97757` (Cobre editorial)
- **Urgente/Live**: `#e85d4a`

### Layout e Grid (Desktop)
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
