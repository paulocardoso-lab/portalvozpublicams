# Voz Pública MS — Sprint Status

## Resumo Geral
- **Sprint Atual:** 4 (Iniciando)
- **Status da Sprint 3:** ✅ Concluída
- **Status da Sprint 2:** ✅ Concluída
- **Status da Sprint 1:** ✅ Concluída
- **Status da Sprint 0:** ✅ Concluída

---

## 🏁 Sprint 0: Setup e Fundação
**Status:** ✅ 100% Finalizado

### Tarefas Entregues:
- [x] Inicialização do Next.js 14+ (App Router) com TypeScript e Tailwind v4.
- [x] Instalação e configuração de dependências base (`next-auth`, `prisma`, `zustand`, `zod`, `tiptap`, etc).
- [x] Estilização e Tokens de Design mapeados (Integração das cores editoriais `--vp-*` ao `@theme inline` do CSS via `globals.css`).
- [x] Configuração de tipografia via `next/font` (`Playfair Display`, `Source Serif 4`, `Inter`, `JetBrains Mono`).
- [x] Ativação de dark mode padrão na aplicação (`<html class="dark">` adicionado em `layout.tsx`).
- [x] Configuração e provisionamento do Banco de Dados PostgreSQL com Prisma ORM e schema validado (Prisma v7 migration applied com sucesso).
- [x] Configuração do NextAuth v5 (Auth.js) com PrismaAdapter e providers (Google, Apple, Resend).

---

## 🏁 Sprint 1: MVP de Leitura Mobile
**Status:** ✅ 100% Finalizado

### Tarefas Entregues:
- [x] 1. Implementar a **Home Mobile** (`MobileHome`), incluindo masthead, scroller de editorias, destaque hero, e listagens de notícias.
- [x] 2. Implementar a tab bar inferior (`MobileTabBar`) como componente persistente.
- [x] 3. Criar a página de **Matéria Mobile** (`MobileArticle`) com barra de progresso, componentes de texto da matéria (Tiptap read-only), citações e barra interativa.
- [x] 4. Desenvolver o **Menu Drawer** lateral de navegação (`MobileMenu`).
- [x] 5. Implementar a tela de **Newsletter** mobile (`MobileNewsletter`) e integrar com o endpoint `/api/newsletter/subscribe`.
- [x] 6. Criar os fluxos de Autenticação mobile: **Login** e **Cadastro** com indicação de força de senha.

---

## 🏁 Sprint 2: MVP de Leitura Desktop
**Status:** ✅ 100% Finalizado

### Tarefas Entregues:
- [x] 1. Implementar a **Home Desktop** (`Home.jsx`), incluindo o Masthead Desktop, grid de destaques, bloco Ao Vivo horizontal e Footer global (`SiteFooter`).
- [x] 2. Criar a **Matéria Desktop** (`Article.jsx`), com sidebar flutuante (ícones de engajamento e newsletter) e centralização de texto rica.
- [x] 3. Desenvolver as páginas de listagem (`Pages2.jsx`): **Editoria** e **Busca**.
- [x] 4. Desenvolver a página de **Colunista** (`Pages2.jsx`).

---

## 🏁 Sprint 3: Conta do Leitor e Funil de Doação
**Status:** ✅ 100% Finalizado

### Tarefas Entregues:
- [x] 1. Criar a página de **Conta do Leitor** (`MobileReaderProfile`), incluindo o painel de métricas (salvas/lidas/comentários), abas de navegação e menu de configurações.
- [x] 2. Implementar a **Etapa 1 do Funil de Doação** (`MobileDonateAmount`), incluindo barras de meta mensal e a seleção de planos (Leitor/Apoiador/Guardião).
- [x] 3. Implementar a **Etapa 2 do Funil de Doação** (`MobileDonateData`), com formulário de dados cadastrais (Nome, CPF, Endereço) e opt-ins.
- [x] 4. Implementar a **Etapa 3 do Funil de Doação** (`MobileDonatePay`), exibindo as abas de métodos de pagamento, mockup de QR Code PIX e status de confirmação aguardando Pagar.me.
- [x] 5. Implementar a **Etapa 4 do Funil de Doação** (`MobileDonateSuccess`), a tela de conclusão e direcionamento final para o conteúdo exclusivo.

---

## 🛠️ Sprint 4: Admin Core e CMS
**Status:** ✅ 100% Finalizado

### Backlog Imediato:
- [x] 1. Criar o layout global restrito (`AdminShell`) com barra lateral de navegação escura e cabeçalho, aplicado em `src/app/(admin)/layout.tsx`.
- [x] 2. Desenvolver a tela inicial do Admin (`Dashboard`) em `/admin`, com componentes de estatísticas (`Stat`), gráficos de linha dinâmicos (`Sparkline`) e métricas de tráfego/atividades.
- [x] 3. Implementar a tela do Editor de Matérias (`AdminEditor`) em `/admin/editor`, contendo o mockup do Tiptap, configurações de formatação, campos de SEO, autoria e opções de publicação.
- [x] 4. Construir o painel de Moderação de Comentários (`AdminComments`) em `/admin/comments`, permitindo aprovar, ocultar e banir comentários ou usuários, além de destacar sinalizações (spam).
- [x] 5. Responsividade no Admin: assegurar que jornalistas consigam revisar matérias e checar alertas em trânsito através do celular.

---

## 🛠️ Sprint 5: Admin Avançado
**Status:** ✅ 100% Finalizado

### Backlog Imediato:
- [x] 1. **Fila Editorial (Kanban)** em `/admin/kanban`: Gestão visual de pautas, rascunhos, revisão e agendamento.
- [x] 2. **Usuários & Permissões** em `/admin/users`: Matriz de acesso e listagem da equipe.
- [x] 3. **Banners & Publicidade** em `/admin/ads`: Gestão de campanhas, slots e visualizador de layout.
- [x] 4. **Aparência & Layout** em `/admin/appearance`: Configuração do design system e reordenação de blocos da home.
- [x] 5. **Redes Sociais** em `/admin/social`: Fila de postagem e integrações (IG, FB, X).
- [x] 6. **Métricas & Tráfego** em `/admin/metrics`: Gráficos de audiência, origem e performance editorial.
- [x] 7. **Assinaturas & Doações** em `/admin/subscriptions`: Gestão financeira, campanhas de apoio e histórico de pagamentos.
- [x] 8. **Perfil, Configurações e Auditoria** em `/admin/profile`, `/admin/settings` e `/admin/audit`.

---

🎉 **Todas as Sprints de Interface Mockadas Concluídas!**

---

👉 **PRÓXIMO PASSO:** O planejamento das Sprints de Integração (Banco, Auth, Pagamentos e APIs) já está disponível em [`docs/FASE2_BACKEND.md`](./FASE2_BACKEND.md).
