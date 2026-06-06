# Diagnóstico Técnico — Portal Voz Pública MS

> Documento de referência técnica. Mantido atualizado a cada ciclo de desenvolvimento.  
> Última atualização: **06/06/2026** — commit `a175b4d`

---

## 1. Identificação do Projeto

| Campo | Valor |
|---|---|
| Nome | Voz Pública MS |
| Tipo | Portal de jornalismo independente |
| Estado | Mato Grosso do Sul |
| Repositório | `github.com/paulocardoso-lab/portalvozpublicams` |
| Branch de produção | `main` |
| Deploy automático | Sim — Vercel conectado ao GitHub (push → build → deploy) |
| URL de produção | `sitevozpublicamsoficial-paulocardoso-labs-projects.vercel.app` |
| Domínio pretendido | `vozpublicams.com.br` |
| Primeiro commit | 05/05/2026 |

---

## 2. Stack Tecnológica

### Framework e linguagem
| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router, webpack) | ^16.2.6 |
| Linguagem | TypeScript | ^5.x |
| Estilização | Tailwind CSS v4 | ^4.x |
| Runtime de produção | Node.js (serverless functions) | — |

### Banco de dados e storage
| Camada | Tecnologia | Versão |
|---|---|---|
| ORM | Prisma | ^7.8.0 |
| Banco | PostgreSQL via Supabase | — |
| Storage (imagens) | Supabase Storage | — |
| Cache de schema | Prisma Client gerado no build | — |

> **Nota Prisma 7:** `url` e `directUrl` foram removidos do `datasource` do `schema.prisma` (incompatíveis com Prisma 7). A conexão é feita exclusivamente via variável de ambiente `DATABASE_URL`.

### Autenticação
| Método | Implementação |
|---|---|
| Email + senha | NextAuth v5 (`credentials` provider) |
| Magic link | NextAuth v5 (`email` provider) |
| Sessão | JWT com role (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `REPORTER`...) |
| Auth guard | `src/lib/auth-guard.ts` → `requireAdmin()` |

> **Nota NextAuth v5:** A configuração de auth (`src/auth.ts`) é isolada do Edge runtime para evitar bundle acima de 1 MB.

### Serviços externos
| Serviço | Uso |
|---|---|
| Vercel | Hospedagem, cron jobs, analytics, speed insights |
| Supabase | PostgreSQL + Storage |
| Stripe | Assinaturas e pagamentos com cartão |
| Pagarme | PIX e boleto |
| Google Analytics 4 | `G-RXGYK3CM8C` |
| Umami | Analytics alternativo (configurável via env) |
| Sharp | Processamento de imagens server-side (WebP, resize) |
| Gemini AI | Geração de banners publicitários |

---

## 3. Arquitetura de Rotas

```
src/app/
├── (public)/           # Área pública
│   ├── page.tsx        # Home
│   ├── materia/[slug]/ # Página de artigo
│   ├── editoria/[slug]/# Página de editoria
│   ├── apoiar/         # Fluxo de doação/assinatura
│   │   ├── page.tsx
│   │   ├── dados/
│   │   ├── pagamento/
│   │   └── sucesso/
│   ├── autor/[slug]/
│   ├── busca/
│   ├── login/
│   └── menu/
│
├── admin/              # Painel administrativo (requer auth)
│   ├── page.tsx        # Dashboard
│   ├── posts/          # Gestão de matérias + editor Tiptap
│   ├── kanban/         # Fila editorial visual
│   ├── comments/       # Moderação de comentários
│   ├── users/          # Gestão de usuários e permissões
│   ├── ads/            # Banners e publicidade (+ IA)
│   ├── rss/            # Automação RSS + fila de revisão
│   ├── podcasts/
│   ├── social/
│   ├── metrics/        # Métricas de tráfego
│   │   └── market/     # Indicadores do cabeçalho (dólar, boi...)
│   ├── subscriptions/  # Assinaturas e doações
│   ├── audit/          # Logs de auditoria
│   ├── health/         # Saúde do sistema
│   ├── appearance/     # Logo, favicon, branding, redes sociais
│   ├── design-studio/  # Editor visual de design tokens [NOVO]
│   └── settings/       # Configurações gerais
│
└── api/
    ├── cron/
    │   ├── fetch-agri/         # Indicadores de mercado (agro)
    │   └── apply-scheduled-theme/ # Aplica temas agendados [NOVO]
    ├── brand/favicon/          # Favicon dinâmico
    ├── external/               # Dados externos de mercado
    ├── og/                     # Open Graph image
    └── admin/                  # APIs administrativas
```

---

## 4. Modelo de Dados (Prisma Schema)

### Conteúdo editorial
- `Article` — matérias (status: DRAFT, REVIEW, PUBLISHED, ARCHIVED)
- `Section` — editorias (ex: Política, Meio Ambiente)
- `Series` — séries especiais de reportagens
- `Tag`, `Comment`, `Author`

### Usuários e acesso
- `User` — com campo `role` (SUPER_ADMIN, ADMIN, EDITOR, REPORTER, COLUMNIST, SECTION_EDITOR, MODERATOR, FINANCE)
- `Account`, `Session`, `VerificationToken` — NextAuth

### Monetização
- `Subscription`, `Transaction` (PIX, Card, Boleto)
- `Campaign` — banners publicitários

### Operações
- `SiteSetting` — configurações chave/valor (inclui tokens de design com prefixo `DESIGN_TOKEN_`, snapshots `DESIGN_SNAPSHOT_`, temas agendados `DESIGN_SCHEDULED_`)
- `RSSFeed`, `RSSDeadLetter` — automação de conteúdo
- `AuditLog` — trilha de auditoria
- `MarketIndicator` — indicadores do ticker do cabeçalho
- `AgendaEvent`, `Alert`, `Podcast`, `AdSlot`

---

## 5. Sistema de Design (Design Studio)

Painel visual em `/admin/design-studio` que permite alterar a aparência do portal sem rebuild ou deploy.

### Arquitetura
- **Persistência:** tokens salvos em `SiteSetting` com prefixo `DESIGN_TOKEN_`
- **Aplicação:** `DesignTokensStyle` (Server Component) injeta CSS custom properties no `<head>` a cada request
- **Preview:** iframe do portal em tempo real com atualização via `document.documentElement.style.setProperty()`

### Tokens disponíveis (48 no total)
| Categoria | Tokens |
|---|---|
| Cores | 13 (bg, surface×3, border×2, text×4, accent×2, urgent) |
| Tipografia | 6 (família display/serif/sans/mono, tamanho base, altura de linha) |
| Espaçamento/Layout | 6 (spacing-unit, container-max, content-gap, border-radius, header-height, sidebar-width) |
| Botões | 5 (radius, font-size, font-weight, padding-x, padding-y) |
| Cards | 4 (radius, border-width, image-ratio, gap) |
| Cabeçalho | 3 (logo-size, nav-font-size, nav-font-weight) |
| Artigo | 4 (max-width, font-size, text-align, paragraph-gap) |

### Funcionalidades
- **Publicar** — salva tokens no banco + cria snapshot automático do estado anterior
- **Restaurar padrão** — apaga tokens salvos (volta aos valores hardcoded)
- **Histórico** — até 20 snapshots com nome, data, diff visual e rollback com 1 clique
- **Modo escuro automático** — algoritmo HSL inverte lightness das cores de fundo/borda/texto
- **Modo claro automático** — aplica paleta editorial clara canônica (#faf9f5)
- **Agendamento** — publica um tema em data/hora futura; no plano Hobby da Vercel, cron `/api/cron/apply-scheduled-theme` roda diariamente às 12h UTC

---

## 6. Sistema de Imagens

Todas as imagens são processadas server-side via **Sharp** antes de armazenar no Supabase Storage:

| Contexto | Processamento | Qualidade |
|---|---|---|
| Logo do portal | Resize (altura max 400px) → WebP | 90% |
| Favicon | Resize 512×512px (contain) → PNG | — |
| Imagens de artigos | → WebP | 85% |
| Banners de anúncios | → WebP | 85% |
| Imagens de RSS | Download → validação (min 200×200px) → WebP | 85% |
| Banner IA | SVG → PNG via Sharp | — |

Buckets no Supabase: `brand`, `articles`, `ads`, `profiles`

---

## 7. Cron Jobs (vercel.json)

| Path | Schedule | Função |
|---|---|---|
| `/api/cron/fetch-agri` | `0 21 * * 1-5` | Atualiza indicadores agro (dólar, boi, soja, milho, trigo) — dias úteis às 21h |
| `/api/cron/apply-scheduled-theme` | `0 12 * * *` | Aplica temas de design agendados — diariamente às 12h UTC (compatível com Vercel Hobby) |

Autenticação dos crons: header `Authorization: Bearer $CRON_SECRET`

---

## 8. Variáveis de Ambiente Necessárias

```env
# Banco
DATABASE_URL=                    # Supabase PostgreSQL (pooler)

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=                    # URL de produção

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Pagamentos
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PAGARME_API_KEY=

# IA / Analytics
GEMINI_API_KEY=
NEXT_PUBLIC_GA_ID=               # G-RXGYK3CM8C
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SRC=

# Cron
CRON_SECRET=
```

---

## 9. Histórico de Commits e Deploys

### Fase de fundação (maio/2026)

| Data | Commit | Descrição |
|---|---|---|
| 05/05/2026 | `Initial commit` | Criação do projeto |
| 05/05/2026 | `feat: first commit com supabase` | Integração inicial com Supabase |
| 05/05/2026 | `fix: mover auth.ts para src` | Correção de estrutura para build |
| 05/05/2026 | `fix: bypass prisma init during build` | Evita erro de conexão no build |
| 06/05/2026 | `fix: handle async params for Next.js 15+` | Compatibilidade de params assíncronos |
| 24/05/2026 | `feat(auth)` | Login por email/senha e magic link |
| 24/05/2026 | `feat(analytics)` | Google Analytics 4 + Vercel Analytics |
| 24/05/2026 | `feat(brand)` | Logomarca oficial em todo o projeto |
| 25/05/2026 | `fix(assets)` | 404s de favicon, apple-touch-icon, og-image |

### Estabilização do deploy (29-31/05/2026)

| Data | Commit | Descrição |
|---|---|---|
| 29/05/2026 | `fix(build)` | Força webpack no build — evita Turbopack em produção |
| 29/05/2026 | `fix(og)` | Move `/api/og` de Edge para Node.js runtime |
| 29/05/2026 | `fix(middleware)` | Isola auth do Edge runtime — resolve bundle >1 MB |
| 29/05/2026 | `chore: harden security` | Proteção e CORS em produção |
| 29/05/2026 | `refactor(admin)` | Remove dados fictícios — conecta painel a fontes reais |
| 30/05/2026 | `feat(admin)` | Painel admin com dados reais, auth corrigida |
| 31/05/2026 | `fix(editor)` | Sanitização automática de slug |
| 31/05/2026 | `feat(storage)` | Conversão automática de uploads para WebP |
| 31/05/2026 | `fix(rss)` | Substitui jsdom por linkedom (erro ESM no Vercel) |
| 31/05/2026 | `feat(rss): Sprint A–D` | Sistema RSS completo: observabilidade, qualidade, retry, dedup, dead-letter queue, fila de revisão |
| 31/05/2026 | `feat(ads+brand)` | Sistema de anúncios com geração por IA (Gemini) |
| 31/05/2026 | `fix(hydration)` | React error #482 em MobileHome e MobileMasthead |

### Infra e módulos novos (01/06/2026)

| Data | Commit | Descrição |
|---|---|---|
| 01/06/2026 | `fix(prisma)` | Remove `url`/`directUrl` do schema (incompatível Prisma 7) |
| 01/06/2026 | `fix(migration)` | Constraint `RSSDeadLetter_feedId_fkey` idempotente |
| 01/06/2026 | `fix(hydration)` | React error #482 em login e página de matéria |
| 01/06/2026 | `chore: redeploy` | Correção de `NEXTAUTH_URL` para produção |

### Ciclo de UI/UX — logo, mobile e header (06/06/2026)

| Commit | Descrição |
|---|---|
| `feat(layout)` | Logomarca 3× maior no cabeçalho |
| `feat(admin)` | Logo maior na sidebar + label "Painel Administrativo" |
| `feat(infra)` | Fluxo completo de apoio/doações, auth, cron agri, prisma |
| `fix(mobile)` | Auditoria mobile-first: touch targets 44px (WCAG), grid responsivo, tipografia |
| `fix(mobile)` | Correções responsivas nas páginas restantes |
| `feat(brand)` | Conversão da logomarca para WebP com fundo transparente |
| `fix(header)` | Restaura fonte sans em newsletter/podcast/denúncia |
| `feat(brand)` | Substitui pela logomarca oficial (`logooficial.webp`) |
| `fix(header)` | Fonte mono na utility bar — padrão unificado com ticker |
| `fix(home)` | Reduz fonte da manchete principal e ajusta margens/gaps |
| `feat(header)` | Logo maior via `scale-x` sem alterar altura do cabeçalho |

### Design Studio — sistema completo (06/06/2026)

| Commit | Hash | Descrição |
|---|---|---|
| Fases 1 e 2 | `3f93e35` | Server Component `DesignTokensStyle`, painel admin com editor de cores/tipografia/layout e preview ao vivo em iframe |
| Fases 3 e 4 | `d88efb7` | Aba Componentes (botões, cards, header, artigo), aba Espaçamento, histórico de versões com diff e rollback |
| Fase 5 | `a175b4d` | Agendamento de publicação, gerador de modo escuro/claro automático via algoritmo HSL |

---

## 10. Problemas Conhecidos Resolvidos

| Problema | Solução |
|---|---|
| Edge bundle >1 MB | Auth isolada do Edge; `/api/og` movido para Node.js runtime; webpack forçado |
| Turbopack em produção | `next.config.ts`: `webpack: true` no build |
| jsdom incompatível com ESM no Vercel | Substituído por `linkedom` no RSS parser |
| Prisma `url`/`directUrl` incompatível com Prisma 7 | Removidos do `schema.prisma`; conexão via `DATABASE_URL` apenas |
| React hydration error #482 | `suppressHydrationWarning` nos componentes com datas/dados dinâmicos |
| Git push 403 (credenciais OneTwoBrand) | `cmdkey /delete:git:https://github.com` + `git config --local credential.helper manager` |
| Imagens não convertidas para WebP | Sharp aplicado em todos os fluxos de upload server-side |
| Logo com fundo branco | Processamento Sharp com `ensureAlpha()` + extração do canal alpha |
| `overflow-visible` ignorado em `sticky` + `backdrop-blur` | Workaround: `scale-x-[2.5]` no logo (escala visual sem impactar layout) |

---

## 11. Estado Atual da Plataforma

- **Deploy ativo:** commit `a175b4d` — 06/06/2026
- **Build:** estável, sem erros TypeScript
- **Design tokens:** sistema completo em 5 fases, operacional
- **RSS:** automação com 4 Sprints (A–D), retry, dedup, dead-letter queue
- **Pagamentos:** Stripe (cartão) + Pagarme (PIX/boleto) integrados
- **Autenticação:** credentials + magic link, JWT com role
- **Imagens:** 100% WebP via Sharp em todos os fluxos
- **Mobile:** auditoria WCAG concluída (touch targets 44px, grid responsivo)
- **Admin:** 16 seções no painel, Design Studio com 48 tokens e histórico

---

*Documento mantido por Paulo Cardoso / Voz Pública MS*  
*Atualizado automaticamente a cada ciclo de desenvolvimento com Claude Code*
