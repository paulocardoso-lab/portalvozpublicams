# Referência Técnica de Engenharia — Voz Pública MS

Este documento consolida a arquitetura, padrões de design e fluxos operacionais da plataforma Voz Pública MS, reconstruída para excelência editorial e performance.

## 1. Stack Tecnológica Core
- **Framework**: Next.js 16.2.6 (Turbopack / App Router)
- **Linguagem**: TypeScript 5.x
- **Estilização**: Tailwind CSS 4.x + Vanilla CSS (Design Tokens)
- **Banco de Dados**: PostgreSQL (Supabase) + Prisma ORM 7.8.0
- **Autenticação**: NextAuth.js v5 (Beta) + Resend (Magic Links) + Google OAuth
- **Editor CMS**: Tiptap (Rich Text) + Autosave Logic
- **Monitoring**: Sentry + Vercel Speed Insights

## 2. Arquitetura de Design (The Editorial Grid)
A plataforma utiliza um sistema de grid denso e tipografia de alto contraste para emular a experiência de jornais impressos de luxo.

### Tokens de Cores (CSS Variables)
- `--vp-bg`: `#0e0e0d` (Dark mode profundo)
- `--vp-surface`: `#1a1a19` (Cards e painéis)
- `--vp-accent`: `#d97757` (Cor de destaque / Ação)
- `--vp-ok`: `#10b981` (Sucesso / Online)
- `--vp-urgent`: `#e85d4a` (Alertas / Crítico)

### Tipografia
- **Display**: Playfair Display (900/Black) — Títulos e Identidade.
- **Serif**: Source Serif 4 — Corpo do texto para legibilidade máxima.
- **Sans**: Inter — Interface, labels e navegação.
- **Mono**: JetBrains Mono — Dados, métricas e timestamps.

## 3. Fluxos Administrativos (Sprint 4)
O painel administrativo (`/admin`) foi projetado para operações jornalísticas de alta velocidade.
- **Editorial Kanban**: Gestão visual de pautas desde a ideia até a publicação.
- **CMS Editor**: Autosave a cada 12 segundos, suporte a chapéus (eyebrows) e metadados de paywall.
- **Moderação**: Fila de comentários com detecção automática de spam via regex e filtragem de palavras ofensivas.

## 4. Monetização e Marketing (Sprint 5)
- **Ads Engine**: Gerenciador de campanhas nativo com rastreamento de impressões e cliques.
- **Donation Funnel**: Fluxo de 4 etapas (Plano > Dados > Pagamento > Sucesso) com suporte a PIX, Cartão e Boleto.
- **Agenda do Poder**: Sistema de monitoramento de órgãos públicos com alertas automáticos via scraping do Diário Oficial.

## 5. SEO & Performance (Sprint 6)
- **Sitemap Dinâmico**: `/sitemap.xml` gerado automaticamente via Prisma.
- **RSS Feed**: `/feed.xml` para distribuição em agregadores.
- **OpenGraph**: Tags dinâmicas para previews ricos em redes sociais.
- **Performance**: LCP otimizado através de fontes locais e imagens otimizadas pelo Next.js Image.

## 6. Comandos e Operação
- **Desenvolvimento**: `npm run dev`
- **Build**: `npm run build` (Executa Prisma Generate + Next Build)
- **Banco**: `npx prisma studio` (Exploração de dados)
- **Migrações**: `npx prisma migrate dev`

---
*Voz Pública MS — Documentação gerada em 08 de Maio de 2026.*
