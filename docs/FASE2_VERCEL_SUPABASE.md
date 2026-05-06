# Plano de Implantação: Fase 2 (Backend & Infra) — Vercel & Supabase

Este plano detalha a estratégia de implantação utilizando uma stack **Serverless/Managed**, ideal para o **Voz Pública MS** devido à facilidade de escala, baixa manutenção de infraestrutura e integração nativa com o ecossistema Next.js.

---

## 🏗️ 1. Arquitetura da Stack (Serverless)

| Componente | Tecnologia | Papel |
| :--- | :--- | :--- |
| **Hosting & CI/CD** | **Vercel** | Hospedagem do Next.js, Edge Functions e Analytics. |
| **Banco de Dados** | **Supabase (Postgres)** | Banco de dados relacional gerenciado. |
| **Autenticação** | **NextAuth.js + Supabase** | Gestão de sessões e usuários. |
| **E-mails** | **Resend** | Disparo de Magic Links e Newsletters. |
| **Storage** | **Supabase Storage** | Armazenamento de imagens e arquivos do CMS. |
| **Pagamentos** | **Stripe / Pagar.me** | Processamento de doações e assinaturas. |
| **Monitoramento** | **Sentry + Vercel Analytics** | Rastreamento de erros e métricas de tráfego. |

---

## 🗺️ Roadmap de Sprints (Fase 2)

### ⚙️ Sprint 6: Conexão Supabase & Prisma
**Objetivo:** Estabelecer a base de dados na nuvem.
- [x] **Supabase Setup:** Criar projeto, configurar `Pooling` (Transaction Mode) para Serverless.
- [x] **Prisma Integration:** Atualizar `DATABASE_URL` e `DIRECT_URL` (para migrações) no `.env`.
- [x] **Migração Inicial:** Rodar `npx prisma migrate deploy` para o banco de produção do Supabase.
- [x] **RLS:** Configurar políticas de Row Level Security se necessário (ou gerenciar via App Layer).

### 🚀 Sprint 7: Deploy Vercel & Domínios
**Objetivo:** Pipeline de deploy contínuo e ambiente de produção.
- [x] **Vercel Link:** Conectar repositório GitHub à Vercel.
- [x] **Domain:** Apontar o DNS do domínio `vozpublica.com.br` para a Vercel.
- [x] **Environment Variables:** Configurar todas as chaves (DATABASE, AUTH_SECRET, etc.) no painel da Vercel.
- [x] **Edge Middleware:** Validar proteção de rotas administrativas na infra da Vercel.

### 🔐 Sprint 8: Comunicação & Auth (Resend)
**Objetivo:** Fluxos de e-mail e login funcional.
- [x] **Resend Setup:** Validar domínio e configurar DNS (DKIM/SPF).
- [x] **NextAuth:** Configurar `EmailProvider` usando a chave do Resend.
- [x] **Templates:** Criar templates de e-mail personalizados para o Voz Pública MS.

### 📁 Sprint 9: CMS & Media (Supabase Storage)
**Objetivo:** Gestão de ativos sem servidor.
- [x] **Buckets:** Criar buckets `articles` e `profiles` no Supabase Storage.
- [x] **API Integration:** Implementar Server Actions para upload direto para o bucket.
- [x] **Editor Sync:** Garantir que o editor do Admin salve as URLs das imagens do Supabase.

### 📊 Sprint 10: Inteligência & Pagamentos
**Objetivo:** Finalizar o ciclo de negócio e monitoramento.
- [x] **Webhooks:** Configurar endpoints de recebimento de pagamento para atualizar status de assinante.
- [x] **Vercel Analytics:** Ativar Speed Insights e Web Vitals.
- [x] **Sentry:** Integrar monitoramento de erros para capturar bugs em tempo real.

### ✨ Sprint 11: Engajamento & Refinamento
**Objetivo:** Polimento final e ferramentas de interação.
- [x] **SEO Dinâmico:** Metadados e OpenGraph para todas as matérias.
- [x] **Busca Global:** Página de busca integrada ao banco de dados.
- [x] **Newsletter:** Componente de captura de leads na Home.
- [x] **Admin Dashboard:** Painel inicial com métricas reais do Prisma.
- [x] **Página de Denúncia:** Canal seguro para jornalismo investigativo.

---

## 💡 Por que escolher esta Stack?
1. **Zero Ops:** Você não precisa se preocupar com atualizações de segurança de SO ou patches de banco.
2. **Global:** Performance otimizada via Edge Network da Vercel.
3. **Escalabilidade:** O Supabase e a Vercel escalam automaticamente conforme o tráfego cresce.

---

> [!IMPORTANT]
> Para o banco de dados via Prisma na Vercel, é **altamente recomendado** o uso do Supabase Connection Pool (porta 6543) para evitar exaustão de conexões em funções Serverless.
