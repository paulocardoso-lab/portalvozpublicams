# Correção do painel administrativo

Este documento consolida os sprints de correção executados no painel administrativo e a ordem recomendada de build/validação.

## Sprint 1 - Núcleo crítico

Escopo:

- Usuários & permissões: criação de usuário com senha temporária, validação, hash e auditoria.
- Automação RSS: validação de feed, retorno de resumo real, logs de falha e fallback de conteúdo.
- Aparência/configurações: leitura real de `SiteSetting`, chaves sociais unificadas e controle `ENABLE_RSS`.

Build recomendado:

```bash
npm run lint
npm run build
npm run smoke:prod -- http://localhost:3000
npm run health:admin
```

Critério de aceite:

- `/admin/users` permite criar usuário.
- `/admin/rss` informa resultado da sincronização manual.
- `/admin/settings` salva `ENABLE_RSS`.
- `/admin/appearance` recarrega settings salvos.

## Sprint 2 - Painéis operacionais

Escopo:

- Comentários: aprovar, ocultar, spam, banir e excluir.
- Kanban: mudança de status editorial persistente.
- Editorias: edição inline de nome, slug, descrição, menu e ordem.
- Assinaturas: ativar, pausar, inadimplente e cancelar.

Build recomendado:

```bash
npm run lint
npm run build
npm run smoke:admin -- http://localhost:3000
npm run health:admin
```

Critério de aceite:

- Todas as actions críticas registram `AuditLog`.
- Mudanças de status aparecem após refresh.
- Slugs duplicados de editoria são bloqueados.
- Assinaturas mudam de status sem apagar histórico.

## Sprint 3 - Saúde e integrações mínimas

Escopo:

- Redes sociais deixa de ser placeholder e salva canais oficiais.
- `/admin/health` mostra estado operacional do sistema.
- `scripts/check-admin-health.js` valida ambiente e dados base sem expor segredos.

Build recomendado:

```bash
npm run lint
npm run build
npm run health:admin
npm run smoke:admin -- http://localhost:3000
```

Critério de aceite:

- `/admin/social` salva e recarrega canais.
- `/admin/health` não mostra `fail` em ambiente pronto.
- `health:admin` pode emitir `WARN` para integrações opcionais, mas não `FAIL`.

## Sprint 4 - Smoke administrativo

Escopo:

- `scripts/smoke-admin-auth.js`.
- `npm run smoke:admin`.
- Modo sem credenciais valida proteção das rotas.
- Modo com credenciais valida login e carregamento das páginas admin.

Build recomendado:

```bash
npm run smoke:prod -- http://localhost:3000
npm run smoke:admin -- http://localhost:3000
```

Com credenciais:

```powershell
$env:ADMIN_SMOKE_EMAIL="admin@example.com"
$env:ADMIN_SMOKE_PASSWORD="senha-temporaria"
npm run smoke:admin -- http://localhost:3000
```

Critério de aceite:

- Sem credenciais: todas as rotas admin redirecionam para `/login`.
- Com credenciais: todas as rotas admin carregam sem erro de aplicação.

## Sprint 5 - Auditoria e runbook

Escopo:

- `/admin/audit` com filtros por busca, status e período.
- Exibição de `details`.
- `docs/ADMIN_OPERACAO.md`.

Build recomendado:

```bash
npm run lint
npm run build
npm run smoke:admin -- http://localhost:3000
```

Critério de aceite:

- Filtros de auditoria preservam URL.
- Ações recentes aparecem com usuário, alvo, status e detalhes.
- Runbook cobre fechamento local, saúde, auditoria e RSS.

## Sprint 6 - Fechamento

Escopo:

- Atalho `npm run health:admin`.
- Matriz final de build por sprint.
- Ordem única de validação para entrega.

Build recomendado:

```bash
npm run lint
npm run build
npm run smoke:prod -- http://localhost:3000
npm run smoke:admin -- http://localhost:3000
npm run health:admin
```

Critério de aceite:

- Build passa.
- Smoke público passa.
- Smoke admin sem credenciais passa.
- Smoke admin autenticado passa quando credenciais forem fornecidas.
- Health admin não tem `FAIL`.

## Ordem final sugerida

1. Subir o servidor local.
2. Rodar `npm run lint`.
3. Rodar `npm run build`.
4. Rodar `npm run smoke:prod -- http://localhost:3000`.
5. Rodar `npm run smoke:admin -- http://localhost:3000` sem credenciais.
6. Rodar `npm run smoke:admin -- http://localhost:3000` com credenciais.
7. Rodar `npm run health:admin`.
8. Validar manualmente `/admin/users`, `/admin/rss`, `/admin/social`, `/admin/health` e `/admin/audit`.
