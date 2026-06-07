<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:portal-voz-publica-bindings -->
# Rotina padrao de vinculo — Portal Voz Publica MS

Sempre que estiver desenvolvendo em `C:\.PORTALVOZPUBLICA`, trate este workspace como pertencente exclusivamente ao **Portal Voz Publica MS**.

## Identidade do projeto

| Servico | Valor correto |
|---|---|
| Conta/e-mail operacional | `paulofernandogarciacardoso@gmail.com` |
| GitHub repo | `github.com/paulocardoso-lab/portalvozpublicams` |
| Git remote | `https://github.com/paulocardoso-lab/portalvozpublicams.git` |
| Branch de producao | `main` |
| Vercel scope | `paulocardoso-labs-projects` |
| Vercel project | `sitevozpublicamsoficial` |
| Vercel projectId | `prj_1B26sr89ctqmDO9bEn7gQKOJgCVR` |
| Vercel orgId | `team_lpNHKzXfGFMEXoGfUFSjme6d` |
| Producao | `https://www.vozpublicams.com.br` |

## Antes de qualquer deploy ou link externo

1. Confirmar o Git remoto:

```powershell
git remote -v
```

O `origin` deve apontar para `https://github.com/paulocardoso-lab/portalvozpublicams.git`.

2. Confirmar a branch:

```powershell
git branch --show-current
```

Para deploy de producao, a branch esperada e `main`.

3. Confirmar o vinculo local da Vercel, se existir:

```powershell
Get-Content -LiteralPath .vercel/project.json
```

O arquivo deve conter:

```json
{
  "projectId": "prj_1B26sr89ctqmDO9bEn7gQKOJgCVR",
  "orgId": "team_lpNHKzXfGFMEXoGfUFSjme6d",
  "projectName": "sitevozpublicamsoficial"
}
```

Se `.vercel/project.json` nao existir ou estiver errado, vincular explicitamente:

```powershell
npx vercel login
npx vercel link --yes --project sitevozpublicamsoficial --scope paulocardoso-labs-projects
npx vercel pull --yes --environment production --scope paulocardoso-labs-projects
```

4. Confirmar que a Vercel enxerga o projeto correto:

```powershell
npx vercel project ls --scope paulocardoso-labs-projects
```

A lista deve conter `sitevozpublicamsoficial`.

## Travas de seguranca

- Nunca fazer deploy se a Vercel CLI estiver autenticada em outro escopo que nao `paulocardoso-labs-projects`.
- Nunca vincular este workspace a projetos OneTwoBrand, AgroDoc ou qualquer projeto que nao seja `sitevozpublicamsoficial`.
- Nunca salvar tokens, senhas ou chaves neste arquivo. Autenticacao deve ser feita via Git Credential Manager, GitHub CLI, Vercel CLI ou variaveis de ambiente.
- Se o vinculo Vercel estiver errado, remover apenas `C:\.PORTALVOZPUBLICA\.vercel` apos confirmar que o caminho resolvido esta dentro do workspace.
- Antes de deployar, rodar `npm run build` ou `npx vercel build --prod --scope paulocardoso-labs-projects`.
- Depois do deploy, validar `https://www.vozpublicams.com.br/api/health` e esperar `200 OK` com `{"status":"ok"}`.

## Regra inviolavel da logomarca

- Nunca distorcer a logomarca do Voz Publica MS.
- Nunca aplicar `scale-x-*`, `scale-y-*`, `transform: scaleX(...)`, `transform: scaleY(...)`, `object-fit: fill` ou largura/altura arbitrarias que alterem a proporcao original.
- Para redimensionar a logo, controlar apenas uma dimensao principal: preferir `height` fixo com `width: auto` e `object-fit: contain`, ou `width` fixo com `height: auto`.
- Qualquer componente de marca deve preservar a proporcao do arquivo original, incluindo uploads vindos de `BRAND_LOGO_URL`.
<!-- END:portal-voz-publica-bindings -->
