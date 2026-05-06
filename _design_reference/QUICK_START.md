# Quick Start — Voz Pública MS

```bash
# 1. Clone/setup Next.js base
npx create-next-app@latest voz-publica-ms --typescript --tailwind --app --src-dir
cd voz-publica-ms

# 2. Cole tokens em tailwind.config.ts (ver PROMPT_MESTRE.md §3)
# 3. Cole schema em prisma/schema.prisma (ver PROMPT_MESTRE.md §5)
# 4. Configure next/font em app/layout.tsx:
#    - Playfair Display (display)
#    - Source Serif 4 (serif)
#    - Inter (sans)
#    - JetBrains Mono (mono)

# 5. Instale dependências essenciais
npm i next-auth @auth/prisma-adapter prisma @prisma/client zustand zod
npm i @tiptap/react @tiptap/starter-kit @dnd-kit/core @dnd-kit/sortable
npm i resend stripe pagarme @sentry/nextjs

# 6. Comece pela Home MOBILE (70% do tráfego)
#    Referência: pages/Mobile.jsx → MobileHome
#    Sprint 1 do roadmap
```

## Ordem de leitura
1. **PROMPT_MESTRE.md** — escopo, tokens, modelos, roadmap completo
2. **README.md** — detalhe por tela
3. **Voz Pública MS.html** — abra no navegador para ver os 32 mocks
4. **pages/Mobile.jsx** — Sprint 1 (comece aqui)

## Definition of Done
- [ ] Pixel-a-pixel com a referência
- [ ] TypeScript estrito
- [ ] Lighthouse ≥95 mobile
- [ ] WCAG AA
- [ ] LGPD compliance se toca dados
- [ ] Audit log se for admin-side

## Stack
Next.js 14 · TypeScript · Tailwind · Strapi 5 · Postgres · NextAuth (2FA) · Pagar.me (PIX) + Stripe · Resend · Plausible · Cloudflare
