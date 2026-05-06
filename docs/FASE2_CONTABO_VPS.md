# Plano de Implantação: Fase 2 (Backend & Infra) — Contabo VPS

Este documento detalha a estratégia de transição do ambiente de desenvolvimento para a infraestrutura de produção hospedada na **Contabo**, garantindo performance, segurança e escalabilidade para o **Voz Pública MS**.

---

## 🏗️ 1. Arquitetura da Infraestrutura (Self-Hosted)

Diferente de soluções Serverless (Vercel/Supabase), o uso de um VPS exige gestão manual da pilha:

| Componente | Tecnologia Sugerida | Papel |
| :--- | :--- | :--- |
| **Servidor** | Contabo VPS (Ubuntu 22.04) | Host principal da aplicação e banco. |
| **Containerização** | Docker + Docker Compose | Isolamento e facilidade de migração. |
| **Banco de Dados** | PostgreSQL 16 (Docker) | Persistência de dados local no VPS. |
| **Proxy Reverso** | Nginx | Roteamento de tráfego e terminação SSL. |
| **Certificado SSL** | Let's Encrypt (Certbot) | HTTPS automatizado. |
| **Process Manager** | PM2 ou Docker | Garantir que o Next.js rode 24/7. |
| **CI/CD** | GitHub Actions | Deploy automatizado via SSH. |

---

## 🗺️ Roadmap de Sprints (Fase 2)

### ⚙️ Sprint 6: Preparação do VPS e Banco de Dados
**Objetivo:** Ter o ambiente "vazio" pronto para receber código.
- [ ] **Setup Inicial:** Configurar Firewall (UFW), criar usuário non-root e instalar Docker/Docker Compose.
- [ ] **Database Setup:** Subir container PostgreSQL com volume persistente e backups automáticos (cronjob).
- [ ] **Prisma Sync:** Atualizar `DATABASE_URL` e rodar `npx prisma migrate deploy` a partir da máquina local/CI para o VPS.
- [ ] **Auth Secret:** Gerar chaves de produção para o NextAuth.

### 🚀 Sprint 7: Deploy e Proxy Reverso
**Objetivo:** Colocar o site no ar com domínio oficial e HTTPS.
- [ ] **Nginx Config:** Configurar o `sites-available` para apontar para a porta 3000 do Next.js.
- [ ] **SSL:** Rodar `certbot --nginx` para garantir o cadeado verde.
- [ ] **Pipeline CI/CD:** Criar `.github/workflows/deploy.yml` para que cada `git push main` gere um build e reinicie o serviço no VPS.
- [ ] **Variáveis de Ambiente:** Configurar o arquivo `.env.production` no servidor com as chaves reais.

### 🔐 Sprint 8: Autenticação e Segurança
**Objetivo:** Implementar o fluxo de login seguro em produção.
- [ ] **Magic Links:** Configurar o Resend para disparar e-mails via domínio @vozpublica.com.br.
- [ ] **OAuth:** Registrar a URL de produção no Google Cloud e Apple Developer Console.
- [ ] **Middleware:** Validar a proteção de rotas `/admin` em ambiente Linux (Node.js runtime).

### 📁 Sprint 9: CMS e Storage (Cloudflare R2)
**Objetivo:** Gerenciar mídias de forma eficiente sem sobrecarregar o disco do VPS.
- [ ] **S3 Compatibility:** Integrar o Cloudflare R2 para uploads do editor.
- [ ] **Asset Delivery:** Configurar subdomínio (ex: `cdn.vozpublica.com.br`) para servir imagens.
- [ ] **Kanban Real:** Ligar o backend do CMS às ações de publicação.

### 📊 Sprint 10: Dashboards e Monitoramento
**Objetivo:** Monetização e monitoramento de saúde do sistema.
- [ ] **Gateway:** Integrar Pagar.me/Stripe com Webhooks apontando para o IP/Domínio do VPS.
- [ ] **Monitoring:** Instalar `htop` e monitoramento de uptime (Uptime Robot).
- [ ] **Audit Logs:** Garantir que o banco registre todas as ações administrativas para conformidade.

---

## 🛡️ Considerações de Segurança no VPS
1. **SSH:** Desabilitar login por senha (usar apenas chaves SSH).
2. **Postgres:** Não expor a porta 5432 para a internet (acesso apenas via Docker network ou SSH Tunnel).
3. **Fail2Ban:** Instalar para prevenir ataques de força bruta no SSH.

---

> [!TIP]
> O uso da Contabo oferece um excelente custo-benefício em termos de RAM e CPU, permitindo que o PostgreSQL e o Next.js rodem confortavelmente na mesma instância sem degradação de performance inicial.
