# Referência Técnica — Voz Pública MS
> **Última atualização:** 2026-05-24 | Branch: `main` | Commit: `5c4478e`

---

## 1. Stack Tecnológica

| Camada | Tecnologia | Versão | Status |
|---|---|---|---|
| Framework | Next.js (App Router + Turbopack) | 16.2.6 | ✅ Ativo |
| Linguagem | TypeScript | 5.x | ✅ Ativo |
| Runtime | Node.js | 25.8.1 | ✅ Ativo |
| Estilização | Tailwind CSS | 4.x + Vanilla CSS | ✅ Ativo |
| ORM | Prisma | 7.8.0 | ✅ Ativo |
| Banco de Dados | PostgreSQL (Supabase) | 17.6 | ✅ Conectado |
| Autenticação | NextAuth.js v5 Beta | 5.0.0-beta.31 | ✅ Ativo |
| Editor Rich Text | Tiptap | 3.22.5 | ✅ Ativo |
| State (cliente) | Zustand | 5.0.13 | ✅ Ativo |
| Data Fetching | SWR | 2.4.1 | ✅ Ativo |
| Validação | Zod | 4.4.3 | ✅ Ativo |
| AI | Google Gemini | @google/generative-ai 0.24.1 | ✅ Ativo |
| Email | Resend | 6.12.2 | ✅ Ativo |
| Pagamentos | Stripe + Pagar.me | 22.1.0 / 4.35.2 | ⚠️ Integrado, sem prod |
| Storage | Supabase Storage | @supabase/supabase-js 2.105.3 | ✅ Ativo |
| RSS | rss-parser + Cheerio | 3.13.0 / 1.2.0 | ✅ Ativo |
| Drag & Drop | dnd-kit | 6.3.1 | ✅ Ativo |
| Monitoring | Sentry | 10.51.0 | ⚠️ Desabilitado |
| Analytics | Vercel Analytics + Speed Insights | 2.0.1 / 2.0.0 | ✅ Ativo |
| Testes | Vitest + Playwright + Testing Library | 4.1.5 / 1.59.1 | ⚠️ Configurado |
| Deploy | Vercel | — | ✅ Produção |

---

## 2. Infraestrutura

### Repositório Git
- **Remote:** `https://github.com/paulocardoso-lab/portalvozpublicams.git`
- **Branch principal:** `main`
- **Convenção de commits:** `tipo(escopo): mensagem` (português)

### Vercel
- **Projeto:** `sitevozpublicamsoficial`
- **Project ID:** `prj_1B26sr89ctqmDO9bEn7gQKOJgCVR`
- **Org ID:** `team_lpNHKzXfGFMEXoGfUFSjme6d`
- **URL produção:** `https://sitevozpublicamsoficial.vercel.app`
- **Região:** AWS SA East 1 (São Paulo)

### Supabase
- **Projeto:** `ofixwqrjjjrhtgfifhzl`
- **Região:** `sa-east-1`
- **Postgres:** 17.6.1
- **URL pública:** `https://ofixwqrjjjrhtgfifhzl.supabase.co`
- **Buckets:** `articles`, `profiles`, `ads`

---

## 3. Conexão com Banco de Dados

### Configuração Prisma 7 (nova API)
As URLs de banco **não ficam em `schema.prisma`** — ficam em `prisma.config.ts`:

```ts
// prisma.config.ts
datasource: {
  url: process.env["DATABASE_URL"],  // pooler porta 6543
}
```

### Variáveis de ambiente
| Variável | Uso | Porta |
|---|---|---|
| `DATABASE_URL` | Runtime (app + build) | 6543 (pooler) |
| `DIRECT_URL` | Migrações manuais | 5432 (direto) |

### Rodar migrações (requer conexão direta)
```bash
DATABASE_URL="postgresql://postgres.ofixwqrjjjrhtgfifhzl:[senha]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres" \
  npx prisma migrate status
```

### Estado atual das migrações
- `20260505190753_init` — ✅ Aplicada

---

## 4. Variáveis de Ambiente

### Arquivo `.env.local` (localhost)
| Variável | Status |
|---|---|
| `DATABASE_URL` | ✅ Configurada |
| `DIRECT_URL` | ✅ Configurada |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configurada |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configurada |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configurada |
| `NEXTAUTH_URL` | ✅ `http://localhost:3000` |
| `NEXTAUTH_SECRET` | ✅ Configurada |
| `AUTH_SECRET` | ✅ Configurada |
| `AUTH_URL` | ✅ `http://localhost:3000` |
| `RESEND_API_KEY` | ✅ Configurada |
| `AUTH_RESEND_KEY` | ✅ Configurada |
| `GOOGLE_GEMINI_API_KEY` | ✅ Configurada |
| `AUTH_GOOGLE_ID` | ⚠️ Placeholder |
| `AUTH_GOOGLE_SECRET` | ⚠️ Placeholder |
| `AUTH_APPLE_ID` | ⚠️ Placeholder |
| `AUTH_APPLE_SECRET` | ⚠️ Placeholder |

### Vercel (produção) — configurar manualmente
Acessar: Dashboard Vercel → Settings → Environment Variables

```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_URL=https://sitevozpublicamsoficial.vercel.app
NEXTAUTH_SECRET
AUTH_SECRET
AUTH_URL=https://sitevozpublicamsoficial.vercel.app
RESEND_API_KEY
AUTH_RESEND_KEY
GOOGLE_GEMINI_API_KEY
```

---

## 5. Comandos de Operação

```bash
# Desenvolvimento
npm run dev

# Build (roda: prisma generate + next build)
npm run build

# Start produção local
npm run start

# Lint
npm run lint

# Prisma — exploração visual
npx prisma studio

# Prisma — gerar client
npx prisma generate

# Prisma — status de migrações (usar DIRECT_URL na variável)
DATABASE_URL="<url-porta-5432>" npx prisma migrate status

# Prisma — nova migração
DATABASE_URL="<url-porta-5432>" npx prisma migrate dev --name nome-da-migracao

# Seed do banco
npx tsx prisma/seed.ts
```

---

## 6. Arquitetura de Rotas

### App Router (`src/app/`)
```
(public)/           → layout público (home, artigos, editorias)
  page.tsx          → Home
  materia/[slug]/   → Página de artigo
  editoria/[slug]/  → Página de editoria
  colunista/[slug]/ → Página de colunista
  apoiar/           → Funil de doação (dados → pagamento → sucesso)
  denuncia/         → Formulário de denúncia
  busca/            → Busca
  newsletter/       → Inscrição newsletter
  menu/             → Menu mobile
  feed.xml/         → RSS

(auth)/             → layout autenticado
  eu/               → Perfil do leitor
  login/
  signup/

admin/              → Painel administrativo (RBAC)
  posts/            → CMS (listar, criar, editar)
  editor/           → Editor Tiptap
  kanban/           → Fluxo editorial
  sections/         → Editorias
  users/            → Gestão de usuários
  podcasts/         → Episódios
  rss/              → Fontes RSS
  denuncias/        → Moderação de tips
  comments/         → Moderação de comentários
  ads/              → Campanhas publicitárias
  agenda/           → Agenda do poder
  alerts/           → Alertas ao vivo
  appearance/       → Aparência do site
  settings/         → Configurações
  subscriptions/    → Assinaturas
  metrics/          → Métricas e dados de mercado
  audit/            → Logs de auditoria
  social/           → Redes sociais

api/
  auth/[...nextauth]/     → NextAuth handlers
  cron/fetch-agri/        → Dados agrícolas (cron 9pm seg-sex)
  cron/rss-sync/          → Sincronização RSS
  ads/serve/[slot]/       → Serving de anúncios
  ads/track/              → Rastreamento de cliques/impressões
  webhooks/stripe/        → Webhook Stripe
  newsletter/subscribe/   → Inscrição newsletter
  stats/newsletter/       → Stats newsletter
  health/                 → Health check
  debug-vars/             → Debug de env vars
```

---

## 7. Middleware e Segurança

**Arquivo:** `src/middleware.ts`

Rotas protegidas por RBAC via NextAuth:
| Rota | Acesso |
|---|---|
| `/admin/*` | Qualquer role exceto `READER` |
| `/eu/*` | Qualquer usuário autenticado |
| `/login`, `/signup` | Redireciona se já autenticado |

### Roles disponíveis
`READER` · `REPORTER` · `COLUMNIST` · `SECTION_EDITOR` · `EDITOR_CHIEF` · `SUPER_ADMIN` · `MODERATOR` · `FINANCE`

---

## 8. Cron Jobs (Vercel)

Configurados em `vercel.json`:
| Endpoint | Schedule | Descrição |
|---|---|---|
| `/api/cron/fetch-agri` | `0 21 * * 1-5` | Dados agrícolas (21h, seg-sex) |

---

## 9. Design System

### Tokens de Cor
| Token | Valor | Uso |
|---|---|---|
| `--vp-bg` | `#1a1a19` | Fundo principal (dark) |
| `--vp-surface` | `#262624` | Cards e painéis |
| `--vp-accent` | `#d97757` | Laranja — ação/destaque |
| `--vp-urgent` | `#e85d4a` | Alertas críticos |
| `--vp-ok` | `#7aa37a` | Sucesso / online |
| `--vp-warn` | `#e0b44a` | Avisos |

### Tipografia
| Família | Fonte | Uso |
|---|---|---|
| `font-display` | Playfair Display 900 | Títulos, identidade |
| `font-serif` | Source Serif 4 | Corpo do texto |
| `font-sans` | Inter | Interface, labels |
| `font-mono` | JetBrains Mono | Dados, métricas, timestamps |

### Escala Tipográfica
- Hero H1: 46–72px · Matéria H1: 52px
- Corpo desktop: 19px / 1.65 · Corpo mobile: 17px / 1.65
- Eyebrow: 10–11px maiúsculas, letter-spacing 0.1–0.14em
- Mobile H1 hero: 24–30px · mínimo: 10px

---

## 10. Integrações Ativas

| Serviço | Uso | Status |
|---|---|---|
| Supabase | Banco + Storage | ✅ Ativo |
| Resend | Magic links + email transacional | ✅ Ativo |
| Google Gemini | AI (moderação, sugestões) | ✅ API key configurada |
| Stripe | Pagamentos com cartão | ⚠️ Integrado, webhook pronto |
| Pagar.me | PIX e boleto | ⚠️ Integrado, sem prod |
| Vercel Analytics | Pageviews anônimos | ✅ Ativo |
| Sentry | Error tracking | ⚠️ Desabilitado (sentry.server.config.ts) |

---

## 11. Pendências Conhecidas

| Item | Prioridade | Observação |
|---|---|---|
| Env vars no Vercel | Alta | Configurar manualmente no dashboard |
| Google OAuth | Alta | `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` são placeholders |
| Apple OAuth | Média | Placeholders — requer conta Apple Developer |
| Sentry | Baixa | Desabilitado — reativar com DSN real |
| `DIRECT_URL` no Prisma 7 | Info | Prisma 7 não suporta `directUrl` em `defineConfig` — usar porta 5432 na `DATABASE_URL` para migrações |
| Testes | Média | Vitest e Playwright configurados mas sem cobertura significativa |

---

*Voz Pública MS · Jornalismo independente do Mato Grosso do Sul*
