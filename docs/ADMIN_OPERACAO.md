# Operação do painel administrativo

Este guia resume os checks adicionados nos sprints de correção do painel admin.

## Fechamento local

Rode estes comandos antes de publicar:

```bash
npm run lint
npm run build
npm run smoke:prod -- http://localhost:3000
npm run smoke:admin -- http://localhost:3000
node scripts/check-admin-health.js
```

Também há um atalho equivalente:

```bash
npm run health:admin
```

O `smoke:admin` funciona sem credenciais para validar proteção das rotas. Para testar as páginas autenticadas, defina:

```powershell
$env:ADMIN_SMOKE_EMAIL="admin@example.com"
$env:ADMIN_SMOKE_PASSWORD="senha-temporaria"
npm run smoke:admin -- http://localhost:3000
```

## Saúde do sistema

A tela `/admin/health` mostra:

- banco de dados
- autenticação
- dados base
- automação RSS
- cron
- storage
- IA editorial
- e-mail transacional

Estados `warn` indicam operação possível com funcionalidade limitada. Estados `fail` precisam ser corrigidos antes de produção.

## Auditoria

A tela `/admin/audit` agora permite filtrar por:

- busca textual em ação, alvo, usuário ou status
- status
- período de 24 horas, 7 dias, 30 dias ou 90 dias

Use a auditoria para confirmar ações críticas como criação de usuário, moderação de comentários, mudança de status editorial, assinatura e settings.

## RSS

Para ativar automação:

1. Acesse `/admin/settings`.
2. Ative `Automação RSS`.
3. Cadastre ao menos uma fonte ativa em `/admin/rss`.
4. Confirme `CRON_SECRET` em produção.

O check `node scripts/check-admin-health.js` avisará se o RSS estiver pausado.

## Plano por sprint

A matriz completa de build e aceite por sprint está em [`ADMIN_CORRECAO_SPRINTS.md`](./ADMIN_CORRECAO_SPRINTS.md).
