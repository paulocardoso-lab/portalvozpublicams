# Governanca de Seguranca e Dados

Este documento define o procedimento operacional para limpeza, retencao e revisao de dados da plataforma Voz Publica MS.

## Dados sensiveis mapeados

| Grupo | Tabelas/campos | Risco | Regra operacional |
| --- | --- | --- | --- |
| Identidade e auth | `User.email`, `User.cpf`, `User.passwordHash`, `User.twoFASecret`, `Account.*token`, `Session.sessionToken`, `VerificationToken.token` | Conta, credenciais e identificadores pessoais | Nunca expor em pagina publica, API publica, log ou backup compartilhado. Selecionar campos explicitamente com `select`. |
| Denuncias | `Tip.name`, `Tip.email`, `Tip.content`, `Tip.internalNotes`, `Tip.attachments` | Fonte jornalistica, relato sensivel e notas internas | Acesso apenas administrativo. Exportacao somente com aprovacao editorial/juridica. |
| Comentarios | `Comment.ip`, `Comment.userAgent`, `Comment.body`, `Comment.guestName` | Identificacao indireta e conteudo moderavel | Exibir publicamente apenas comentarios aprovados e campos minimos. IP/user-agent so para moderacao/auditoria. |
| Newsletter | `NewsletterSubscriber.email` | Contato pessoal | Usar apenas para envio consentido. Remover em caso de descadastro/solicitacao. |
| Assinaturas e transacoes | `Subscription.externalId`, `Transaction.externalId`, `Transaction.receiptUrl`, `User.cpf` | Dados financeiros e identificadores de pagamento | Evitar carregar transacoes quando a tela so precisa de resumo. Reconciliacao financeira em ambiente restrito. |
| Auditoria | `AuditLog.ip`, `AuditLog.details`, `AuditLog.userId` | Trilha operacional e dado tecnico | Mostrar IP mascarado na interface. Manter detalhes apenas quando justificarem rastreabilidade. |

## Politica de retencao sugerida

| Tipo de dado | Retencao padrao | Acao ao expirar |
| --- | --- | --- |
| Noticias publicadas | Indeterminada, enquanto houver interesse editorial | Arquivar ou anonimizar autoria se houver necessidade juridica. |
| Rascunhos e versoes de materia | 180 dias apos publicacao ou descarte | Remover `ArticleVersion` antigas que nao sejam necessarias para auditoria editorial. |
| Comentarios aprovados | Enquanto a materia estiver publicada | Remover/anonimizar mediante solicitacao legitima. |
| Comentarios pendentes/spam/ocultos | 90 dias | Excluir registros e metadados tecnicos associados. |
| IP/user-agent de comentarios | 90 dias | Anonimizar ou excluir quando nao houver investigacao ativa. |
| Denuncias novas/arquivadas | 180 dias, salvo apuracao ativa | Excluir ou anonimizar nome/e-mail/notas, mantendo apenas registro editorial minimo quando necessario. |
| Newsletter | Ate descadastro ou solicitacao | Excluir `NewsletterSubscriber` do e-mail solicitado. |
| Assinaturas/transacoes | Prazo fiscal/legal aplicavel | Manter apenas dados necessarios para obrigacao legal e suporte financeiro. |
| Logs de auditoria | 365 dias | Excluir logs antigos ou remover `ip/details` quando nao forem mais necessarios. |
| Metricas agregadas | 24 meses | Consolidar para estatisticas mensais e apagar granularidade diaria antiga. |

## Procedimento de limpeza completa

Use este fluxo quando for necessario zerar dados operacionais da plataforma, preservando usuarios administrativos por padrao.

1. Confirmar ambiente e banco alvo em `.env` e `.env.local`.
2. Rodar dry-run:

```bash
npm run cleanup:data
```

3. Conferir as contagens retornadas.
4. Executar somente apos confirmacao explicita:

```bash
npm run cleanup:data -- --execute
```

5. Guardar o backup gerado em `scratch/backups/` em local seguro quando a limpeza for real.
6. Validar contagens finais no console.
7. Rodar build/checks antes de publicar:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Para tambem remover usuarios nao administrativos, usar `--include-users` somente em ambiente controlado:

```bash
npm run cleanup:data -- --execute --include-users
```

## Checklist de backup antes de limpeza

- [ ] Ambiente confirmado: local, staging ou producao.
- [ ] `DATABASE_URL` revisada.
- [ ] Dry-run executado e contagens salvas.
- [ ] Janela de manutencao comunicada quando aplicavel.
- [ ] Backup automatico do script gerado em `scratch/backups/`.
- [ ] Backup externo do banco confirmado quando for producao.
- [ ] Responsavel pela aprovacao registrado.
- [ ] Plano de rollback definido.

## Checklist mensal de governanca

- [ ] Revisar se novas queries Prisma usam `select` explicito em dados sensiveis.
- [ ] Verificar se endpoints publicos nao retornam stack trace, env vars ou mensagens internas.
- [ ] Revisar usuarios administrativos e papeis (`Role`).
- [ ] Remover sessoes/tokens expirados quando aplicavel.
- [ ] Anonimizar ou expurgar IP/user-agent fora da janela de retencao.
- [ ] Revisar denuncias arquivadas e notas internas antigas.
- [ ] Conferir se backups locais continuam ignorados pelo Git.
- [ ] Testar headers de seguranca em staging/producao.

## Criterio para novas funcionalidades

Antes de criar qualquer pagina, action ou API que lide com dados pessoais:

1. Coletar somente o dado necessario para a finalidade declarada.
2. Validar entrada com schema.
3. Proteger mutacoes administrativas com `requireAdmin()` ou `requireSuperAdmin()`.
4. Selecionar campos explicitamente no Prisma.
5. Evitar gravar IP, user-agent, e-mail ou CPF em logs livres.
6. Definir prazo de retencao no momento da implementacao.
