# PROMPT MESTRE — Voz Pública MS
## Para Google Antigravity, Windsurf, Cursor ou Claude Code

> **Cole este arquivo inteiro como contexto inicial do agente.** Ele contém instruções, escopo, tokens, rotas, modelos de dados, roadmap e critérios de pronto. Os arquivos `.jsx` no bundle são **referências de design** — leia-os antes de codificar para entender hierarquia visual e copy.

---

## 1. Identidade do projeto

Você vai construir **Voz Pública MS** (`vozpublicams.com.br`) — um portal de jornalismo independente para Mato Grosso do Sul, Brasil. Cobre Pantanal, fronteira Paraguai/Bolívia, povos indígenas (Guarani Kaiowá), agronegócio, política estadual, cidades (Campo Grande, Dourados, Três Lagoas, Corumbá).

**Modelo de negócio:** site 100% aberto (sem paywall) sustentado por **assinaturas/doações recorrentes** + publicidade ética curada. PIX é o método de pagamento principal. Recusa dinheiro de campanha eleitoral e do agronegócio direto.

**Posicionamento visual:** editorial clássico em dark mode, inspirado em NYT/Washington Post/ProPublica, com sotaque brasileiro/MS. Tipografia serifa (Playfair Display + Source Serif 4) e acento laranja `#d97757`.

---

## 2. Stack obrigatório

```yaml
frontend:
  framework: Next.js 14+ (App Router)
  language: TypeScript estrito
  styling: Tailwind CSS + CSS variables (mapear --vp-* em tailwind.config.ts)
  fonts: next/font (Playfair Display, Source Serif 4, Inter, JetBrains Mono)
  state: Zustand (cliente) + React Server Components

backend:
  cms: Strapi 5 (headless, auto-hospedado)
  database: PostgreSQL 16
  auth: NextAuth.js v5 com 2FA TOTP obrigatório p/ Editor-chefe e Super Admin
  payments: Stripe (cartão internacional) + Pagar.me (PIX/boleto BR) — PIX = padrão
  email: Resend (transacionais) + Mailchimp (newsletter)
  search: Meilisearch
  cache: Redis + Cloudflare CDN
  storage: S3-compatible (R2 da Cloudflare)
  analytics: Plausible (privacy-first)
  antispam: Cloudflare Turnstile
  monitoring: Sentry + Better Stack

infra:
  hosting: Vercel (frontend) + Railway/Fly.io (Strapi + Postgres)
  ci: GitHub Actions
  observability: OpenTelemetry → Better Stack
```

**NÃO porte para produção:** `design-canvas.jsx`, `ios-frame.jsx`, `pages/*` deste bundle. São wrappers de apresentação dos mocks. Reproduza pixel-a-pixel em código de produção.

---

## 3. Tokens de design (copie para `tailwind.config.ts`)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        vp: {
          bg: '#1a1a19',
          surface: '#262624',
          'surface-2': '#2f2f2d',
          'surface-3': '#3a3a37',
          border: '#3a3a37',
          'border-2': '#4a4a46',
          text: '#faf9f5',
          'text-2': '#d1cfc4',
          'text-3': '#8a887f',
          'text-4': '#5a5852',
          accent: '#d97757',
          'accent-hover': '#c96442',
          'accent-soft': 'rgba(217,119,87,0.12)',
          urgent: '#e85d4a',
          ok: '#7aa37a',
          warn: '#e0b44a',
        },
        // role colors
        role: {
          admin: '#e85d4a', editor: '#d97757', section: '#e0b44a',
          reporter: '#7aa2f7', columnist: '#c4a7e7',
          mod: '#7aa37a', finance: '#8a887f',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Source Serif 4"', 'Georgia', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: { DEFAULT: '0', sm: '2px', md: '4px', lg: '6px' }, // editorial = retas
    },
  },
};
```

**Escala tipográfica obrigatória:**
- Hero portal H1: 46–72px · Matéria H1: 52px · H2: 32px · H3: 22–26px
- Corpo matéria: 19px / line-height 1.65 (desktop) · 17px / 1.65 (mobile)
- Meta/byline: 12px · Eyebrow/tag: 10–11px MAIÚSCULAS letter-spacing 0.1–0.14em
- Mobile H1 hero: 24–30px · Mobile H1 matéria: 30px · Mobile título de card: 14–16px
- **Nunca <10px em UI; <12pt em print.**

---

## 4. Rotas (App Router)

```
app/
├── (public)/
│   ├── page.tsx                          # Home
│   ├── editorias/[slug]/page.tsx         # Editoria (Pantanal, Política, etc.)
│   ├── colunistas/[slug]/page.tsx        # Página de colunista
│   ├── [slug]/page.tsx                   # Matéria (slug único, fallback antes de editoria)
│   ├── busca/page.tsx                    # Busca
│   ├── newsletter/page.tsx               # Newsletter landing
│   ├── apoie/                            # Funil de doação
│   │   ├── page.tsx                      # Step 1: planos
│   │   ├── dados/page.tsx                # Step 2
│   │   ├── pagamento/page.tsx            # Step 3
│   │   └── obrigado/page.tsx             # Step 4
│   ├── entrar/page.tsx
│   ├── cadastro/page.tsx
│   └── eu/                               # Perfil do leitor (autenticado)
│       ├── page.tsx                      # Salvos
│       ├── historico/page.tsx
│       ├── comentarios/page.tsx
│       └── conta/page.tsx                # Configs
│
├── (admin)/admin/
│   ├── layout.tsx                        # Sidebar + topbar
│   ├── page.tsx                          # Dashboard
│   ├── materias/                         # Lista + editor
│   │   ├── page.tsx
│   │   └── [id]/page.tsx                 # Editor CMS
│   ├── kanban/page.tsx
│   ├── comentarios/page.tsx
│   ├── usuarios/page.tsx
│   ├── banners/page.tsx
│   ├── metricas/page.tsx
│   ├── assinaturas/page.tsx
│   ├── aparencia/page.tsx
│   ├── redes-sociais/page.tsx
│   ├── auditoria/page.tsx
│   ├── perfil/page.tsx
│   └── configuracoes/page.tsx
│
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── webhooks/{stripe,pagarme}/route.ts
    ├── newsletter/subscribe/route.ts
    └── revalidate/route.ts
```

---

## 5. Modelos de dados (Strapi/Prisma)

```prisma
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  name       String
  avatar     String?
  role       Role     @default(READER)
  bio        String?  @db.Text
  social     Json?    // { x, instagram, linkedin, bluesky }
  twoFA      Boolean  @default(false)
  twoFASecret String?
  city       String?
  state      String?  @default("MS")
  status     UserStatus @default(ACTIVE) // ACTIVE | BANNED | DELETED
  createdAt  DateTime @default(now())
  articles   Article[] @relation("Authors")
  comments   Comment[]
  savedArticles SavedArticle[]
  subscription Subscription?
  sessions   Session[]
}

enum Role { SUPER_ADMIN EDITOR_CHIEF SECTION_EDITOR REPORTER COLUMNIST MODERATOR FINANCE READER }

model Article {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  eyebrow     String?
  lead        String?  @db.Text
  body        Json     // Tiptap/Lexical document
  heroImage   String?
  heroCaption String?
  authors     User[]   @relation("Authors")
  sectionId   String
  section     Section  @relation(fields: [sectionId], references: [id])
  seriesId    String?
  series      Series?  @relation(fields: [seriesId], references: [id])
  tags        Tag[]
  status      ArticleStatus @default(DRAFT)
  publishedAt DateTime?
  scheduledAt DateTime?
  allowComments Boolean @default(true)
  paywall     Boolean  @default(false) // futuro — sempre false MVP
  sendPush    Boolean  @default(false)
  includeInNewsletter Boolean @default(true)
  views       Int      @default(0)
  readTimeMin Int?
  comments    Comment[]
  saves       SavedArticle[]
  versions    ArticleVersion[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([status, publishedAt])
  @@index([sectionId])
}

enum ArticleStatus { DRAFT IN_REVIEW APPROVED SCHEDULED PUBLISHED ARCHIVED }

model ArticleVersion {
  id        String   @id @default(cuid())
  articleId String
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  body      Json
  authorId  String
  createdAt DateTime @default(now())
}

model Section { id String @id @default(cuid()) slug String @unique name String description String? parentId String? articles Article[] }
model Series  { id String @id @default(cuid()) name String parts Int totalParts Int articles Article[] }
model Tag     { id String @id @default(cuid()) slug String @unique name String articles Article[] }

model Comment {
  id        String   @id @default(cuid())
  articleId String
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  guestName String?
  body      String   @db.Text
  status    CommentStatus @default(PENDING)
  flags     Int      @default(0)
  votes     Int      @default(0)
  parentId  String?
  parent    Comment? @relation("Replies", fields: [parentId], references: [id])
  replies   Comment[] @relation("Replies")
  ip        String?
  userAgent String?
  flagReason String?
  createdAt DateTime @default(now())
  @@index([status, createdAt])
}

enum CommentStatus { PENDING APPROVED HIDDEN SPAM BANNED }

model SavedArticle {
  userId    String
  articleId String
  user      User    @relation(fields: [userId], references: [id])
  article   Article @relation(fields: [articleId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, articleId])
}

model Subscription {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  plan        Plan
  amount      Int      // em centavos
  status      SubStatus @default(ACTIVE)
  method      PaymentMethod
  externalId  String?  // Stripe sub id ou Pagar.me id
  startedAt   DateTime @default(now())
  cancelledAt DateTime?
  transactions Transaction[]
}

enum Plan { READER SUPPORTER GUARDIAN PATRON CUSTOM }
enum SubStatus { ACTIVE PAST_DUE CANCELLED PAUSED }
enum PaymentMethod { PIX CARD BOLETO }

model Transaction {
  id            String @id @default(cuid())
  subscriptionId String
  subscription  Subscription @relation(fields: [subscriptionId], references: [id])
  amount        Int
  method        PaymentMethod
  status        TxStatus
  externalId    String?
  receiptUrl    String?
  createdAt     DateTime @default(now())
}
enum TxStatus { PENDING PAID FAILED REFUNDED }

model Campaign  { id String @id @default(cuid()) name String client String slot String creative String impressions Int @default(0) clicks Int @default(0) startsAt DateTime endsAt DateTime status String }
model AdSlot    { id String @id @default(cuid()) name String dimensions String page String position String }

model Newsletter      { id String @id @default(cuid()) name String slug String @unique description String @db.Text sentAt DateTime? subscribers NewsletterSubscriber[] }
model NewsletterSubscriber { id String @id @default(cuid()) email String newsletterId String newsletter Newsletter @relation(fields:[newsletterId], references:[id]) confirmed Boolean @default(false) createdAt DateTime @default(now()) @@unique([email, newsletterId]) }

model AuditLog { id String @id @default(cuid()) userId String? action String target String? ip String? status String createdAt DateTime @default(now()) @@index([createdAt]) }
```

---

## 6. Papéis e permissões (RBAC)

| Papel | Permissões |
|---|---|
| `SUPER_ADMIN` | Tudo (cobrança, infra, usuários). 2FA obrigatório. |
| `EDITOR_CHIEF` | Aprova/publica/despublica qualquer matéria. 2FA obrigatório. |
| `SECTION_EDITOR` | Publica na editoria atribuída; revisa repórteres. |
| `REPORTER` | Cria/edita próprias matérias; envia para revisão. |
| `COLUMNIST` | Publica na própria coluna sem revisão. |
| `MODERATOR` | Apenas fila de comentários. |
| `FINANCE` | Banners + assinaturas + métricas. |
| `READER` | Comenta, salva, gerencia apoio. |

Implemente com **CASL** ou função `can(user, action, resource)` no servidor. **Toda mutação deve checar permissão no servidor** — NUNCA confie em UI.

---

## 7. Roadmap de implementação (ordem obrigatória)

**Sprint 0 — Setup (3 dias)**
1. Repo Next.js 14 + TypeScript estrito + ESLint + Prettier + Husky
2. Tailwind config com tokens `--vp-*` mapeados
3. Fontes via `next/font` (Playfair, Source Serif 4, Inter, JetBrains)
4. Layout raiz dark mode default + classe `dark` em `<html>`
5. Strapi 5 + Postgres no Railway, schemas dos modelos acima
6. NextAuth com Email + Google + Apple providers; tabela User sincronizada com Strapi

**Sprint 1 — MVP de leitura mobile (1 sem)** ← prioridade #1
7. Home **mobile** (`pages/Mobile.jsx` → `MobileHome`) — tab bar, scroller editorias, hero, lista, mais lidas
8. Matéria **mobile** (`MobileArticle`) — barra de progresso, drop cap, citação, scorecard, barra inferior
9. Menu drawer (`MobileMenu`)
10. Newsletter landing mobile (`MobileNewsletter`) + endpoint `/api/newsletter/subscribe`
11. Login + Cadastro (`MobileLogin`, `MobileSignup`) com indicador força senha
12. Tab bar inferior compartilhada como Server Component

**Sprint 2 — MVP de leitura desktop (1 sem)**
13. Home desktop (`pages/Home.jsx`) — masthead sticky, hero, blocos, sidebar
14. Matéria desktop (`pages/Article.jsx`) — grid 3-col, share lateral, citação, drop cap
15. Editoria, Colunista, Busca (`pages/Pages2.jsx`)
16. Footer

**Sprint 3 — Conta do leitor + funil de apoio (1 sem)**
17. Perfil do leitor mobile + desktop (`MobileReaderProfile`)
18. Funil de doação 4 etapas (`MobileDonateAmount/Data/Pay/Success`)
19. Integração Pagar.me PIX + Stripe cartão; webhooks
20. E-mails transacionais (Resend): confirmação, recibo, reset senha

**Sprint 4 — Admin core (2 sem)**
21. Shell admin (`pages/AdminShell.jsx`) — sidebar 232px, topbar, badges
22. Dashboard com KPIs reais (queries no Postgres)
23. Editor CMS WYSIWYG (Tiptap) com auto-save 12s + versionamento + multi-autor
24. Fila kanban drag-and-drop (dnd-kit) com 6 colunas de status
25. Moderação de comentários com filas Aguardando/Sinalizados/Aprovados/Spam
26. Detecção automática de spam (Akismet ou regex) + censura de palavrões
27. Versão **mobile** do admin (Dashboard, Editor, Comentários)

**Sprint 5 — Admin avançado (2 sem)**
28. Usuários & permissões (matriz CASL + tabela com status online)
29. Banners & publicidade — slots configuráveis, contagem de impressões/cliques
30. Métricas (integração Plausible API + queries internas)
31. Assinaturas & doações (gestão de planos, transações, MRR)
32. Aparência (drag-and-drop dos blocos da home com dnd-kit)
33. Redes sociais (auto-post via Buffer ou direto Meta/X APIs) + fila
34. Logs de auditoria (queries da tabela AuditLog)
35. Configurações gerais (chaves API, integrações, LGPD, zona de perigo)

**Sprint 6 — Polimento e produção (1 sem)**
36. Acessibilidade WCAG AA (contraste, ARIA, navegação por teclado)
37. SEO (metadata API, JSON-LD para NewsArticle, sitemap dinâmico, RSS)
38. Performance (Lighthouse ≥95 em mobile, ISR para matérias, edge cache)
39. LGPD (banner consentimento, export/delete dados, anonimização IP)
40. Sentry + Better Stack + alertas
41. Backup automático Postgres + Strapi assets
42. Domínio `vozpublicams.com.br` + SSL + Cloudflare

---

## 8. Comportamentos críticos

- **Editor:** auto-save a cada 12s (`useDebouncedCallback`), histórico versionado, indicador de co-edição em tempo real (Yjs ou Liveblocks)
- **Live/breaking:** classe `vp-tag-live` + `animation: vp-pulse 2s infinite` (keyframes no `globals.css`)
- **Hover headlines:** `.vp-headline:hover { color: var(--vp-accent) }` em 0.15s
- **Publicação:** ao publicar, queue dispara para IG/FB/X/WhatsApp em paralelo se toggles ativos
- **2FA TOTP** obrigatório para `SUPER_ADMIN` e `EDITOR_CHIEF` — bloqueia login se não configurado
- **Auditoria:** todo login, publicação, exclusão, mudança de permissão, geração de API key gera entrada
- **Cache:** matérias publicadas com ISR (`revalidate: 60`) + revalidação on-publish via webhook
- **PIX:** webhook do Pagar.me marca subscription como ACTIVE assim que confirmado
- **Comentários:** spam detectado → status `SPAM` automático; flags ≥3 → `HIDDEN`
- **Newsletter:** double opt-in obrigatório (LGPD)

---

## 9. Hit-list de acessibilidade

- Contraste ≥4.5:1 (já garantido pelos tokens — texto principal sobre bg = 18.5:1)
- `outline: 2px solid var(--vp-accent)` em todos os interativos com foco
- Headings semânticos sem pular níveis
- `<label for>` em todo input
- `alt` em toda imagem (legendas viram alt)
- Navegação por teclado em menus, kanban (use dnd-kit que já é acessível), tabelas
- ARIA labels em ícones (busca, menu, redes)
- Skip-to-content link no topo
- `prefers-reduced-motion` respeitado nas animações

---

## 10. Considerações Brasil/MS

- **LGPD:** banner consentimento (Cookiebot ou próprio), exportação/exclusão de dados, anonimização de IP em analytics, DPO designado em `/privacidade`
- **Pagamentos:** PIX = aba 1 e padrão; cartão = conveniência; boleto = backup
- **WhatsApp Canal** prioritário em distribuição (peso = Instagram no BR)
- **Cobertura:** Campo Grande, Dourados, Três Lagoas, Corumbá, Ponta Porã, Naviraí
- **Editorias específicas:** Pantanal, Indígenas (Guarani Kaiowá), Agronegócio, Fronteira

---

## 11. Definition of Done por feature

- [ ] Reproduz pixel-a-pixel a referência do bundle (mobile + desktop)
- [ ] TypeScript sem `any`, sem `@ts-ignore`
- [ ] Testes unitários (Vitest) para lógica não-trivial (≥70% cobertura)
- [ ] Teste E2E (Playwright) para fluxo crítico se aplicável
- [ ] Lighthouse ≥95 mobile (Performance + A11y + Best Practices + SEO)
- [ ] WCAG AA validado (axe-core + revisão manual)
- [ ] LGPD review (se feature toca dados pessoais)
- [ ] Audit log se feature é admin-side
- [ ] Code review por outro humano

---

## 12. Como começar AGORA

```bash
npx create-next-app@latest voz-publica-ms --typescript --tailwind --app --src-dir --import-alias "@/*"
cd voz-publica-ms

# Setup base
npm i next-auth @auth/prisma-adapter prisma @prisma/client zustand
npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
npm i dnd-kit @dnd-kit/sortable
npm i resend stripe pagarme
npm i @sentry/nextjs zod
npm i -D @types/node vitest @testing-library/react playwright

# Inicialize tokens
# 1) Cole o snippet de tailwind.config.ts da seção 3
# 2) Cole o schema Prisma da seção 5 em prisma/schema.prisma
# 3) Carregue fontes em app/layout.tsx via next/font
# 4) Comece pela Home mobile (Sprint 1, item 7)
```

**Leia em ordem antes de começar:**
1. Este arquivo (`PROMPT_MESTRE.md`) — você está aqui
2. `README.md` — handoff técnico expandido com detalhes por tela
3. `Voz Pública MS.html` — abra no navegador para ver os 32 mocks lado a lado
4. `pages/Mobile.jsx` — comece por aqui (Sprint 1)
5. `pages/Home.jsx`, `pages/Article.jsx` — Sprint 2
6. `pages/MobileExtra.jsx` — Sprint 3
7. `pages/AdminShell.jsx` + demais admin — Sprint 4-5

---

## Bundle inclui

| Arquivo | O que tem |
|---|---|
| `PROMPT_MESTRE.md` | Este documento |
| `README.md` | Handoff técnico detalhado por tela (~250 linhas) |
| `Voz Pública MS.html` | Entry point — abre os 32 artboards em design canvas |
| `styles/tokens.css` | Tokens CSS completos (cores, tipografia, sombras, classes utilitárias) |
| `components/shared.jsx` | Masthead, SiteFooter, Monogram, ImgPH |
| `pages/Home.jsx` | Home desktop |
| `pages/Article.jsx` | Página de matéria desktop |
| `pages/Pages2.jsx` | Editoria, Colunista, Busca |
| `pages/AdminShell.jsx` | Shell admin + Dashboard |
| `pages/AdminEditor.jsx` | Editor CMS + Comentários |
| `pages/AdminMore.jsx` | Usuários, Banners, Aparência, Redes |
| `pages/AdminExtra.jsx` | Kanban, Métricas, Assinaturas, Auditoria, Configs, Perfil |
| `pages/Mobile.jsx` | 6 telas mobile core (3 portal + 3 admin) |
| `pages/MobileExtra.jsx` | 8 telas mobile (4 funil doação + newsletter + login + cadastro + perfil) |

**Total: 32 telas, 14 arquivos JSX, 1 README, 1 prompt mestre.**

---

## Suporte

Designs criados pelo time de produto/design. Esclarecimentos: voltar à conversa de design original. Mudanças de escopo: documentar em PR e revisar com Editor-chefe antes de implementar.

**Boa construção. O jornalismo de MS está esperando.**
