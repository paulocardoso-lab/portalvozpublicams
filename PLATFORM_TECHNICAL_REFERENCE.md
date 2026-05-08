# Voz Pública MS — Referência Técnica de Arquitetura e Restauração
**Última Atualização:** 08 de Maio de 2026

Este documento serve como guia definitivo para a configuração, backup e restauração da plataforma Voz Pública MS, refletindo o estado atualizado após a migração para a stack moderna (Next 16 / Prisma 7 / Tailwind 4).

## 1. Stack Tecnológica Core
- **Framework:** Next.js 16.2.6 (Turbopack)
- **Runtime UI:** React 19.2.6
- **ORM:** Prisma 7.8.0
- **Estilização:** Tailwind CSS v4.0.0 (CSS-first)
- **Autenticação:** NextAuth.js v5 (Beta 31)
- **Infraestrutura:** Supabase (Postgres), Resend (Transactional Email)

## 2. Configurações Críticas (Peculiaridades da Versão)

### 2.1 Prisma 7 (Breaking Changes)
- **Schema:** O arquivo `prisma/schema.prisma` **NÃO** deve conter as propriedades `url` ou `directUrl` no bloco `datasource`.
- **Configuração Central:** Toda a conectividade é gerenciada pelo arquivo `prisma.config.ts` na raiz.
- **Singleton & Safe Proxy:** Localizado em `src/lib/prisma.ts`. Implementa um Proxy que evita falhas críticas (TypeErrors) durante o build ou em caso de queda do banco, retornando fallbacks seguros (arrays vazios).

### 2.2 Next.js 16 (Middleware -> Proxy)
- **Convenção:** O arquivo de middleware foi renomeado de `middleware.ts` para **`src/proxy.ts`**.
- **Função:** A função exportada deve se chamar `proxy(req: NextRequest)`. Sem isso, o roteamento protegido de admin falhará.

### 2.3 Tailwind CSS v4
- **Configuração:** Não utiliza `tailwind.config.ts`. Toda a configuração de temas e tokens está dentro do `src/app/globals.css` usando a diretiva `@theme`.
- **Fontes:** As fontes Source Serif 4 e Playfair Display são carregadas via `next/font` no `layout.tsx` e mapeadas como variáveis CSS.

## 3. Guia de Restauração e Sincronização

### 3.1 Variáveis de Ambiente Obrigatórias
```env
DATABASE_URL= (Porta 6543 para transações)
DIRECT_URL= (Porta 5432 para migrações/push)
NEXTAUTH_URL= (URL base do site)
AUTH_SECRET= (Chave de criptografia de sessão)
RESEND_API_KEY= (Envio de e-mails)
```

### 3.2 Procedimento de Sincronização de Banco (Prisma)
Devido ao uso do Pooler do Supabase, o comando padrão de sincronização falha em portas de transação. Use sempre a porta direta:
```powershell
# Exemplo de comando seguro para sincronização:
$env:DATABASE_URL="SUA_DIRECT_URL_AQUI"; npx prisma db push
```

### 3.3 Build de Produção
O pipeline de build está otimizado para ignorar erros de banco temporários:
```bash
npm run build
# Ordem de execução: prisma generate -> next build
```

## 4. Identidade Visual (Design Tokens)
- **Cores Principais:**
  - Background: `#1a1a19` (`--vp-bg`)
  - Accent (Laranja): `#d97757` (`--vp-accent`)
  - Texto: `#faf9f5` (`--vp-text`)
- **Tipografia:**
  - Display (Títulos): `Playfair Display`
  - Body (Texto): `Source Serif 4`
  - UI/Metadados: `Inter`
  - Monospaced: `JetBrains Mono`

## 5. Estrutura de Pastas Estratégica
- `src/app/(public)`: Rotas abertas ao público.
- `src/app/(auth)`: Fluxo de login e perfil.
- `src/app/admin`: Painel administrativo protegido.
- `src/proxy.ts`: Lógica de proteção de rotas (Middleware).
- `src/lib/prisma.ts`: Cliente Prisma resiliente.

---
**Observação de Manutenção:** Ao atualizar dependências, sempre verifique se o Prisma 7 e o Tailwind 4 não introduziram novas quebras de sintaxe no arquivo `globals.css` e no `schema.prisma`.
