# ANTIGRAVITY.md — Voz Pública MS
## Instruções para Google Antigravity (agente de desenvolvimento)

> **Cole este arquivo na raiz do workspace ANTES de iniciar qualquer agente.** Ele orienta o Antigravity sobre escopo, padrões, ordem de execução e como usar o bundle de design anexado.

---

## 0. Contexto rápido

Você (agente Antigravity) vai construir o **Voz Pública MS** (`vozpublicams.com.br`) — portal de jornalismo independente para Mato Grosso do Sul, Brasil. Cobertura: Pantanal, fronteira (Paraguai/Bolívia), povos indígenas (Guarani Kaiowá), agronegócio, política estadual.

**Modelo:** site 100% aberto sustentado por doações recorrentes via PIX. Recusa dinheiro de campanha eleitoral e do agronegócio direto.

**Visual:** editorial clássico em dark mode (NYT/Washington Post/ProPublica) com sotaque MS — Playfair Display + Source Serif 4, acento laranja `#d97757`.

---

## 1. Bundle de design anexado

Na pasta `_design_reference/` você encontra **37 telas mockadas** + documentação:

```
_design_reference/
├── PROMPT_MESTRE.md          ← LEIA PRIMEIRO. Escopo, tokens, schema, RBAC, roadmap.
├── README.md                  ← Detalhe por tela (~250 linhas)
├── QUICK_START.md             ← Comandos npm e ordem de leitura
├── Voz Pública MS.html        ← Abra com `npx serve` para ver os 37 mocks
├── styles/tokens.css          ← Tokens originais (cole em globals.css)
├── components/shared.jsx      ← Masthead, Footer, primitivos
├── pages/
│   ├── Home.jsx               (Sprint 2 — desktop)
│   ├── Article.jsx            (Sprint 2)
│   ├── Pages2.jsx             (Editoria, Colunista, Busca)
│   ├── Mobile.jsx             (Sprint 1 — mobile leitura) ← COMECE AQUI
│   ├── MobileExtra.jsx        (Sprint 3 — funil doação, conta)
│   ├── AdminShell.jsx         (Sprint 4 — admin shell + dashboard)
│   ├── AdminEditor.jsx        (Sprint 4 — CMS + comentários)
│   ├── AdminMore.jsx          (Sprint 5 — usuários, banners, aparência)
│   ├── AdminExtra.jsx         (Sprint 5 — kanban, métricas, etc.)
│   └── MissingScreens.jsx     (Sobre, Equipe, Denúncia segura, Onboarding, 404)
└── ios-frame.jsx + design-canvas.jsx  ← APENAS apresentação. NÃO portar.
```

**Os arquivos `.jsx` são REFERÊNCIAS DE DESIGN.** Estão em React+Babel inline para apresentação. Você deve **reescrevê-los como código de produção** (Server Components + Client Components do Next.js), preservando hierarquia visual, copy e tokens.

---

## 2. Stack obrigatório (não desvie sem aprovação)

```yaml
frontend:
  framework: Next.js 14+ App Router
  language: TypeScript estrito (sem any, sem @ts-ignore)
  styling: Tailwind CSS (mapeie tokens vp-* em tailwind.config.ts)
  fonts: next/font (Playfair Display, Source Serif 4, Inter, JetBrains Mono)
  state: Zustand (cliente) + RSC (servidor)
  rich-editor: Tiptap

backend:
  cms: Strapi 5 (auto-hospedado em Railway/Fly.io)
  db: PostgreSQL 16 + Prisma
  auth: NextAuth v5 + 2FA TOTP (obrigatório p/ SUPER_ADMIN e EDITOR_CHIEF)
  payments: Pagar.me (PIX padrão) + Stripe (cartão)
  email: Resend (transacional) + Mailchimp (newsletter)
  search: Meilisearch
  cache: Redis + Cloudflare CDN
  storage: Cloudflare R2 (S3-compatible)
  analytics: Plausible (LGPD-friendly)
  monitoring: Sentry + Better Stack
  antispam: Cloudflare Turnstile

infra:
  hosting: Vercel (front) + Railway (Strapi+Postgres)
  ci: GitHub Actions
```

---

## 3. Como o Antigravity deve operar

### 3.1 Início de cada sessão
1. Reabra `_design_reference/PROMPT_MESTRE.md` para refrescar contexto
2. Verifique a Sprint atual (`docs/SPRINT_STATUS.md` — você manterá este arquivo)
3. Liste a próxima task da Sprint
4. **Apresente plano em bullets ANTES de codar** e aguarde "ok"

### 3.2 Ao implementar uma tela
1. Abra a referência JSX correspondente em `_design_reference/pages/`
2. Inspecione tokens em `_design_reference/styles/tokens.css`
3. Reproduza pixel-a-pixel — copy, espaçamento, hierarquia, fontes
4. Use Server Components quando possível; `"use client"` apenas se houver estado/eventos
5. Substitua placeholders (`<ImgPH>`) por `<Image>` do `next/image`
6. Conecte a dados reais via Prisma (não mockar em produção; usar `lib/mock-data.ts` apenas em dev)
7. Adicione testes (Vitest + Testing Library) para lógica não-trivial
8. Rode `npm run lint && npm run typecheck && npm test` antes de finalizar

### 3.3 Padrões de código
- **Sem `any`, sem `@ts-ignore`, sem `eslint-disable`** sem justificativa em PR
- Componentes em PascalCase, hooks em `useCamelCase`, utils em `camelCase`
- Server Actions em `app/_actions/*.ts` com validação Zod
- Toda mutação backend valida permissão server-side (CASL ou função `can()`)
- Imagens sempre via `next/image` com `alt` descritivo
- Nunca hardcode strings de UI — extraia para `lib/copy.ts` para futura i18n

### 3.4 Commits
Convenção: `tipo(escopo): mensagem` em **português**.
```
feat(home-mobile): tab bar inferior com 4 abas
fix(editor): auto-save deixava de disparar em texto longo
chore(deps): bump @tiptap/react para 2.5
docs(claude): atualiza ordem de leitura
```

### 3.5 PRs
- Branch: `feat/sprint1-home-mobile`, `fix/auto-save`
- PR template inclui: screenshot mobile + desktop, checklist DoD, link para mock
- Não aprove próprio PR — humano sempre revisa antes de merge

---

## 4. Roadmap (siga em ordem)

| Sprint | Duração | Entregáveis |
|---|---|---|
| **0** | 3 dias | Setup Next.js + Tailwind tokens + Prisma + Strapi + NextAuth |
| **1** | 1 sem | **Mobile leitura**: Home, Matéria, Menu, Newsletter, Login, Cadastro |
| **2** | 1 sem | **Desktop leitura**: Home, Matéria, Editoria, Colunista, Busca, Footer |
| **3** | 1 sem | Conta do leitor + funil doação 4 etapas + integração Pagar.me |
| **4** | 2 sem | Admin core: shell, dashboard, editor CMS (Tiptap), kanban, comentários, mobile admin |
| **5** | 2 sem | Admin avançado: usuários, banners, métricas, assinaturas, aparência, redes, auditoria, configs |
| **6** | 1 sem | Polimento: a11y WCAG AA, SEO, Lighthouse ≥95, LGPD, Sentry, deploy |

**Total estimado:** 10–14 semanas com 1 dev sênior full-time.

**Detalhamento item-a-item:** ver `_design_reference/PROMPT_MESTRE.md §7`.

---

## 5. Tokens (cole em `tailwind.config.ts`)

```ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vp: {
          bg: '#1a1a19', surface: '#262624', 'surface-2': '#2f2f2d', 'surface-3': '#3a3a37',
          border: '#3a3a37', 'border-2': '#4a4a46',
          text: '#faf9f5', 'text-2': '#d1cfc4', 'text-3': '#8a887f', 'text-4': '#5a5852',
          accent: '#d97757', 'accent-hover': '#c96442', 'accent-soft': 'rgba(217,119,87,0.12)',
          urgent: '#e85d4a', ok: '#7aa37a', warn: '#e0b44a',
        },
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
      borderRadius: { DEFAULT: '0', sm: '2px', md: '4px', lg: '6px' },
    },
  },
};
```

**Escala tipográfica:** Hero H1 46–72px · Matéria H1 52px · Corpo 19px/1.65 desktop · 17px/1.65 mobile · Eyebrow 10–11px maiúsculas letter-spacing 0.1–0.14em · Mobile H1 hero 24–30px · **nunca <10px**.

---

## 6. Schema Prisma (cole em `prisma/schema.prisma`)

Schema completo está em `_design_reference/PROMPT_MESTRE.md §5`. Modelos principais:
- `User` (8 roles + 2FA + status), `Article` (slug, body JSON Tiptap, status, autores múltiplos, versões), `Comment` (status, flags, votes, replies), `Subscription`+`Transaction` (Pagar.me/Stripe), `Section`, `Series`, `Tag`, `Newsletter`+`NewsletterSubscriber`, `Campaign`+`AdSlot`, `AuditLog`, `SavedArticle`.

---

## 7. RBAC obrigatório

| Role | Permissões |
|---|---|
| `SUPER_ADMIN` | Tudo. **2FA obrigatório.** |
| `EDITOR_CHIEF` | Aprova/publica/despublica qualquer matéria. **2FA obrigatório.** |
| `SECTION_EDITOR` | Publica na editoria atribuída. |
| `REPORTER` | Cria/edita próprias matérias; envia para revisão. |
| `COLUMNIST` | Publica na própria coluna sem revisão. |
| `MODERATOR` | Apenas fila de comentários. |
| `FINANCE` | Banners + assinaturas + métricas. |
| `READER` | Comenta, salva, gerencia apoio. |

**Toda mutação valida no servidor.** Use CASL ou função `can(user, action, resource)`. NUNCA confie em UI.

---

## 8. Comportamentos críticos

- **Editor:** auto-save 12s (`useDebouncedCallback`), versionamento, co-edição em tempo real (Yjs/Liveblocks)
- **Live/breaking:** classe `vp-tag-live` + animação pulse 2s
- **Hover headlines:** `color: var(--vp-accent)` em 0.15s
- **Publicação:** queue dispara para IG/FB/X/WhatsApp em paralelo
- **2FA TOTP** obrigatório para SUPER_ADMIN e EDITOR_CHIEF
- **Auditoria:** todo login/publicação/exclusão/permissão/API key gera `AuditLog`
- **Cache:** matérias publicadas com ISR `revalidate: 60` + revalidação on-publish via webhook
- **PIX:** webhook Pagar.me → marca subscription `ACTIVE` ao confirmar
- **Comentários:** spam detectado → `SPAM` automático; flags ≥3 → `HIDDEN`
- **Newsletter:** double opt-in obrigatório (LGPD)

---

## 9. Acessibilidade (WCAG AA, obrigatório)

- Contraste ≥4.5:1 (já garantido pelos tokens)
- `outline: 2px solid var(--vp-accent)` em foco
- Headings semânticos sem pular níveis · `<label for>` em todo input · `alt` em toda imagem
- Navegação por teclado em menus, kanban (use `dnd-kit` que já é acessível), tabelas
- ARIA labels em ícones · Skip-to-content no topo
- `prefers-reduced-motion` respeitado

---

## 10. LGPD (Brasil — não opcional)

- Banner consentimento (Cookiebot ou próprio)
- Exportação/exclusão de dados pessoais via `/eu/conta`
- Anonimização de IP em analytics (Plausible já faz)
- DPO designado em `/privacidade`
- Auditoria de acesso a dados pessoais
- Retenção: comentários removidos voluntariamente em 30 dias; IPs em 72h

---

## 11. Definition of Done por feature

- [ ] Pixel-a-pixel com a referência em `_design_reference/pages/`
- [ ] TypeScript estrito, sem `any`, sem `@ts-ignore`
- [ ] Testes unitários (Vitest) ≥70% cobertura na lógica não-trivial
- [ ] Teste E2E (Playwright) para fluxo crítico se aplicável
- [ ] Lighthouse ≥95 mobile (Performance + A11y + Best Practices + SEO)
- [ ] WCAG AA validado (axe-core + revisão manual)
- [ ] LGPD review se feature toca dados pessoais
- [ ] Audit log se feature é admin-side
- [ ] Code review por humano antes de merge

---

## 12. Setup inicial (rode no terminal do Antigravity)

```bash
npx create-next-app@latest voz-publica-ms --typescript --tailwind --app --src-dir --import-alias "@/*"
cd voz-publica-ms

# Dependências
npm i next-auth @auth/prisma-adapter prisma @prisma/client zustand zod
npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
npm i @dnd-kit/core @dnd-kit/sortable
npm i resend stripe pagarme
npm i @sentry/nextjs
npm i -D vitest @testing-library/react @testing-library/jest-dom playwright @types/node

# Estrutura inicial
mkdir -p src/app/{(public),(admin)/admin,api} src/components src/lib src/server
mkdir -p _design_reference docs

# Cole o bundle de design dentro de _design_reference/
# Cole tokens do §5 em tailwind.config.ts
# Cole schema do §6 em prisma/schema.prisma

npx prisma generate
npx prisma migrate dev --name init
```

---

## 13. Primeiro prompt para o agente Antigravity

Após criar o workspace com este `ANTIGRAVITY.md` na raiz e o bundle em `_design_reference/`, cole:

> **Tarefa inicial:** Leia `ANTIGRAVITY.md` e `_design_reference/PROMPT_MESTRE.md` na íntegra. Em seguida, inspecione `_design_reference/pages/Mobile.jsx` (componente `MobileHome`) e `_design_reference/styles/tokens.css`.
>
> Execute a **Sprint 0** completa:
> 1. Configurar `tailwind.config.ts` com os tokens `vp-*` da §5
> 2. Carregar fontes via `next/font` em `app/layout.tsx` (Playfair Display, Source Serif 4, Inter, JetBrains Mono)
> 3. Aplicar dark mode default em `<html class="dark">`
> 4. Colar schema Prisma da §6 e rodar `prisma migrate dev`
> 5. Configurar NextAuth v5 com providers Email + Google + Apple e tabela User sincronizada
> 6. Criar `docs/SPRINT_STATUS.md` rastreando progresso
>
> **Apresente o plano em bullets antes de executar.** Aguarde minha aprovação. Ao concluir, abra PR com screenshots e checklist de DoD.

---

## 14. Sessões seguintes

A cada nova sessão, comece com:

> Continuar Sprint atual. Leia `docs/SPRINT_STATUS.md`, identifique a próxima task pendente, abra a referência de design correspondente em `_design_reference/pages/`, apresente o plano e aguarde ok.

---

## 15. O que **NÃO** fazer

- ❌ Não copie `design-canvas.jsx`, `ios-frame.jsx`, `_design_reference/Voz Pública MS.html` para produção. São apenas wrappers de apresentação.
- ❌ Não invente componentes que não estão no design — pergunte antes.
- ❌ Não pule Sprint 1 (mobile) para fazer admin direto. 70% do tráfego é mobile leitor.
- ❌ Não aceite PR sem revisão humana.
- ❌ Não publique para produção sem rodar Lighthouse + axe-core + Playwright.
- ❌ Não use IA para gerar texto editorial real (a redação escreve). Apenas placeholders em dev.

---

## 16. Recursos externos referenciados

- **Strapi 5 docs:** https://docs.strapi.io
- **Next.js App Router:** https://nextjs.org/docs/app
- **Pagar.me API:** https://docs.pagar.me
- **Tiptap:** https://tiptap.dev
- **dnd-kit:** https://docs.dndkit.com
- **CASL:** https://casl.js.org
- **WCAG AA checklist:** https://www.w3.org/WAI/WCAG22/quickref/

---

**Pronto. O Antigravity tem tudo o que precisa.** Boa construção — o jornalismo de MS está esperando.
