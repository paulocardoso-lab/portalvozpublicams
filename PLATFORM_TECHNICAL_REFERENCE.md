# Voz Pública MS — Referência Técnica de Arquitetura e Design
**Última Atualização:** 08 de Maio de 2026 (Pós-Restauração Visual)

Este documento serve como guia definitivo para a configuração, backup e restauração da plataforma Voz Pública MS, refletindo o estado atualizado após a estabilização técnica e a restauração 100% fiel da identidade visual.

## 1. Stack Tecnológica Core
- **Framework:** Next.js 16.2.6 (Turbopack)
- **Runtime UI:** React 19.2.6
- **ORM:** Prisma 7.8.0
- **Estilização:** Tailwind CSS v4.0.0 (CSS-first)
- **Autenticação:** NextAuth.js v5 (Beta 31)
- **Infraestrutura:** Supabase (Postgres), Resend (Transactional Email)

## 2. Configurações Críticas (Peculiaridades da Versão)

### 2.1 Prisma 7 (Datasource Externo)
- **Schema:** O arquivo `prisma/schema.prisma` **NÃO** contém URLs.
- **Configuração:** Gerenciada via `prisma.config.ts`.
- **Singleton & Safe Proxy:** Localizado em `src/lib/prisma.ts`. Protege o site contra quedas de banco e falhas de build.

### 2.2 Next.js 16 (Middleware)
- **Middleware:** O arquivo oficial de proteção de rotas é **`src/proxy.ts`**.
- **Regras:** Protege rotas `/admin/*` e gerencia sessões via NextAuth.

### 2.3 Tailwind CSS v4 (Design Tokens)
- **Padrão:** CSS-first via `globals.css`. Não utiliza `tailwind.config.ts`.
- **Classes Premium:** `.vp-monogram`, `.vp-headline`, `.vp-img-ph`, `.vp-tag-live`.

## 3. Identidade Visual e Layout (Fidelidade 100%)

### 3.1 Tipografia Editorial
- **Manchetes (Display):** `Playfair Display` (700). Tamanhos: 46px (Hero), 26px (Especial), 19px (Secundária).
- **Corpo do Texto (Serif):** `Source Serif 4` (17px no Lead).
- **UI & Metadados (Sans):** `Inter`.
- **Dados & Tickers (Mono):** `JetBrains Mono`.

### 3.2 Componentes de Marca
- **Monograma `[VP]|MS`**: Estrutura de bloco sólido. "VP" sobre fundo claro (`vp-text`), "MS" em texto plano ao lado.
- **Header (Masthead)**: 
    - Padding Utilitário: `8px 28px`.
    - Padding Logo: `18px 28px`.
    - Nav Links: `11px 14px`.
- **Grid da Home**:
    - Estrutura: `1fr 320px`.
    - Espaçamento (Gap): `32px`.
    - Padding Lateral: `24px 28px`.

## 4. Guia de Manutenção e Sincronização

### 4.1 Variáveis de Ambiente
- `DATABASE_URL`: Porta 6543 (Pooler Supabase).
- `DIRECT_URL`: Porta 5432 (Conexão direta para `db push`).

### 4.2 Comandos de Restauração
```powershell
# Sincronizar Banco (Use sempre porta 5432)
$env:DATABASE_URL="SUA_DIRECT_URL"; npx prisma db push

# Gerar Client e Build
npx prisma generate
npm run build
```

---
**Observação:** A fidelidade visual é mantida através do mapeamento de variáveis CSS no `globals.css` e o uso rigoroso das classes `vp-*` nos componentes de layout.
