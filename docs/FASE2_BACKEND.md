# Voz Pública MS — Fase 2: Backend & Integrações

Este documento define a arquitetura técnica e o cronograma de Sprints para a segunda fase do projeto, onde transformamos as interfaces (mockups) da Fase 1 em uma plataforma funcional, integrada com banco de dados, serviços de autenticação, pagamentos e armazenamento em nuvem.

---

## 🏗️ Arquitetura Tecnológica

### Stack Escolhida
- **Banco de Dados:** PostgreSQL (hospedado no Supabase ou Vercel Postgres).
- **ORM:** Prisma (tipagem forte, migrações seguras e integração perfeita com TypeScript).
- **Autenticação:** NextAuth.js (Auth.js v5) — suporte a Magic Links (via Resend), Google e Apple. Proteção via Edge Middleware.
- **Armazenamento de Mídia:** Cloudflare R2 ou AWS S3 para imagens e arquivos do CMS (baixo custo de egress).
- **Gateway de Pagamentos:** Pagar.me ou Stripe (processamento de PIX e cartão para assinaturas).
- **Disparo de E-mails:** Resend (alta entregabilidade para recibos, newsletters e magic links).

---

## 🗺️ Roadmap de Sprints (Fase 2)

### ⚙️ Sprint 6: Banco de Dados, Schema e Auth Base
**Objetivo:** Estabelecer o coração de dados e segurança.
- [ ] Refinar o esquema Prisma (`schema.prisma`): Tabelas de `User`, `Account`, `Session`, `Article`, `Category`, `Comment`, `Subscription`.
- [ ] Rodar a primeira migração para a nuvem (`npx prisma migrate deploy`).
- [ ] Configurar NextAuth.js com provedores OAuth e banco de dados via Prisma Adapter.
- [ ] Implementar middleware no Next.js para proteger as rotas `/admin` (verificando `role`) e `/conta` (verificando sessão logada).

### 📰 Sprint 7: Dinamização da Leitura Pública
**Objetivo:** Fazer o site principal buscar matérias reais do banco.
- [ ] Substituir mockups por **Server Actions** ou chamadas ao Prisma (`prisma.article.findMany`) nas rotas `/` (Home), `/secao/[slug]` e `/autor/[slug]`.
- [ ] Implementar paginação ou "Carregar mais" na listagem.
- [ ] Criar endpoint de contagem de visualizações dinâmico por matéria.
- [ ] Conectar o formulário da newsletter à tabela no banco ou API do Mailchimp/Resend.

### ✍️ Sprint 8: CMS Funcional e Uploads
**Objetivo:** Fazer a Redação conseguir redigir e postar de verdade.
- [ ] Ligar a tela de `/admin/editor` ao banco para operações de rascunho (Create/Update).
- [ ] Integrar bucket S3/R2 para que o arraste e solte de imagens no editor gere uma URL pública.
- [ ] Dinamizar a tela do Kanban (`/admin/kanban`) refletindo o status real (`status: 'DRAFT' | 'REVIEW' | 'PUBLISHED'`) das matérias.
- [ ] Ligar o sistema de comentários públicos à moderação no `/admin/comments`.

### 💳 Sprint 9: Assinaturas e Funil de Pagamento
**Objetivo:** Processamento de pagamentos em tempo real.
- [ ] Integrar a API do gateway (ex: Pagar.me) na aba de Pagamento da doação.
- [ ] Gerar QR Code PIX dinamicamente e verificar o status da transação.
- [ ] Configurar Webhooks para que, ao cair o pagamento, o Prisma atualize a conta do usuário (`subscription_status: 'ACTIVE'`).
- [ ] Dinamizar o painel `/conta` para exibir o histórico de doações.

### 📊 Sprint 10: Dashboards Reais e Configurações
**Objetivo:** Ligar os relatórios e opções do admin.
- [ ] Construir as agregações Prisma para gerar o Dashboard inicial de receita e novas contas.
- [ ] Plugar o Google Analytics Data API (ou equivalente) para preencher a tela de tráfego (`/admin/metrics`).
- [ ] Conectar as chaves da aba de configurações (`/admin/settings`) salvando e validando na tabela global.
- [ ] Finalizar o sistema gerando os Logs de Auditoria para qualquer ação de escrita nas tabelas críticas.

---

*Status Inicial:* Planejamento aprovado. Aguardando disparo da Sprint 6.
