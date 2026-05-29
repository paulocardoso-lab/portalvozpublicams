# Producao, Monitoramento e Resposta

Este runbook descreve como publicar, validar, monitorar e responder incidentes da plataforma Voz Publica MS.

## Antes do deploy

1. Conferir branch e diff que sera publicado.
2. Validar variaveis de ambiente sem imprimir segredos:

```bash
npm run validate:env
```

3. Rodar checks locais:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

4. Confirmar que `CRON_SECRET` esta configurado no provedor e nos jobs agendados.
5. Confirmar que os dominios usados por imagens, analytics, Supabase, Sentry e scripts externos estao cobertos pela CSP em `next.config.ts`.
6. Confirmar que backups operacionais estao fora do Git (`scratch/backups/`).

## Smoke test pos-deploy

Depois de publicar em staging ou producao, executar:

```bash
npm run smoke:prod -- https://seu-dominio.com
```

O smoke test valida:

- Home e login respondendo.
- `/admin` e `/eu` redirecionando anonimos para login.
- `/api/health` retornando status enxuto.
- `/api/debug-vars` fechado com 404.
- Crons sem segredo retornando 401.
- Headers principais de seguranca presentes.

## Checklist de headers

As respostas publicas devem conter:

- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`

Se aparecer bloqueio de recurso legitimo no navegador, ajustar a CSP com dominio especifico. Evitar liberar dominios amplos como `*.com.br`.

## Monitoramento inicial

Nas primeiras 24 horas apos deploy, acompanhar:

- Erros 5xx em rotas publicas e admin.
- Falhas de login.
- Retornos 401/403 nos crons.
- Picos de 429 em newsletter, comentarios, denuncias e ads tracking.
- Bloqueios de CSP no console/Sentry.
- Erros de Supabase Storage em upload ou exibicao de imagens.
- Falhas de e-mail Resend em newsletter/denuncias.
- Falhas Stripe no webhook quando pagamentos estiverem ativos.

## Sinais de incidente

Tratar como incidente se ocorrer:

- Exposicao de variaveis, stack trace ou dados pessoais em endpoint publico.
- Alteracao administrativa sem usuario autorizado.
- Aumento anormal de comentarios/denuncias/newsletter em curto intervalo.
- Cron executando sem segredo valido.
- Vazamento de backup, dump ou arquivo `.env`.
- Erro de CSP que quebre login, admin ou renderizacao de materias.

## Resposta a incidente

1. Pausar deploys nao relacionados.
2. Preservar evidencias: horario, rota, usuario, IP mascarado, logs relevantes e versao publicada.
3. Se houver risco ativo, desabilitar rota/job/feature no provedor ou reverter deploy.
4. Rotacionar segredos afetados: `CRON_SECRET`, Auth, banco, Supabase, Resend, Stripe e Sentry conforme o caso.
5. Executar limpeza ou anonimização quando houver dado indevido.
6. Registrar causa raiz, impacto, correcao e prevencao.
7. Comunicar partes afetadas quando houver obrigacao legal ou editorial.

## Rollback

Preferir rollback pelo provedor de deploy para a ultima versao saudavel.

Checklist:

- [ ] Identificar versao atual e versao alvo.
- [ ] Confirmar se houve migracao de banco incompatível.
- [ ] Reverter deploy.
- [ ] Rodar smoke test no dominio.
- [ ] Conferir login/admin/health/crons.
- [ ] Registrar motivo e tempo de indisponibilidade.

## Rotina semanal

- [ ] Rodar smoke test em producao.
- [ ] Revisar erros de Sentry/logs.
- [ ] Conferir 429 e possiveis abusos.
- [ ] Conferir usuarios administrativos ativos.
- [ ] Revisar se jobs agendados continuam usando `Authorization: Bearer CRON_SECRET`.
- [ ] Conferir se novas origens externas exigem ajuste de CSP.

## Rotina mensal

Usar em conjunto com `docs/SEGURANCA_DADOS_GOVERNANCA.md`.

- [ ] Revisar retencao de logs, comentarios, denuncias e metricas.
- [ ] Validar backup antes de qualquer limpeza real.
- [ ] Verificar se novas tabelas/campos sensiveis foram adicionados.
- [ ] Revisar acessos administrativos.
- [ ] Testar plano de rollback em staging.
