# Testes e execução

Pré-requisitos: Node 24, `npm ci`, Chromium do Playwright e bibliotecas de sistema. No ambiente Podman, confirme `podman inspect deskli_app_1` e o bind mount do checkout antes de executar.

```sh
podman exec deskli_app_1 npx playwright install chromium
# Apenas quando faltarem bibliotecas Linux:
podman exec --user root deskli_app_1 npx playwright install-deps chromium
podman exec deskli_app_1 npm run build
podman exec deskli_app_1 npm test
```

Se o navegador estiver no cache já usado pelo projeto, adicione `-e PLAYWRIGHT_BROWSERS_PATH=/tmp/deskli-playwright` ao `podman exec`. Esse caminho é específico do ambiente e não é obrigatório na configuração.

| Comando | Cobertura |
| --- | --- |
| `npm test` / `npm run test:e2e` | Todas as suítes |
| `npm run test:login` | Altura, validação, senha, teclado, navegação e temas |
| `npm run test:compact` | Densidade, três rotas, responsividade e componentes |
| `npm run test:sidebar` | Ícones, tooltips, estado salvo, tablet e mobile |
| `npm run test:design-system` | Catálogo, chamados, anexos, toasts e contraste |
| `npm run test:list` | Lista os casos sem executar |
| `npm run test:report` | Abre o relatório HTML da última execução |

O runner inicia Vite em `http://127.0.0.1:4173`, exige a porta livre e encerra o servidor ao terminar. Não precisa iniciar o dev server manualmente. Com `DESKLI_URL` definido, usa essa origem e não gerencia o servidor. Cada teste tem contexto isolado, um worker, nenhum retry automático e timeout de 120s; asserções do Playwright aguardam até 5s.

Arquivos `*.spec.js` ficam em `tests/e2e/`. Os testes migrados mantêm cenários completos por fluxo; novas verificações independentes devem ser casos separados. Fixtures gerenciam browser/page; não usar processos Chromium manuais. Capturas por teste ficam em `test-results/`; falhas retêm trace e screenshot; relatório em `playwright-report/`. Esses diretórios não são versionados. Para investigar: `npx playwright show-trace caminho/trace.zip`.

Cobertura não equivale a certificação WCAG. Leitor de tela, zoom real, outros navegadores e backend não estão cobertos. Contrastes medem pares de tokens, não todos os estados renderizados. A migração mantém a regressão de Alt+T do Sonner como caso independente e visível; falhas não devem ser escondidas nem convertidas em sucesso silencioso.

## Resultado da migração — 2026-10-02

A execução integral inicial concluiu seis casos com sucesso e um com falha: `Toasts: acesso por Alt+T`. O catálogo de mensagens/anexos, login, densidade, sidebar, contrastes e cores/duração/fechamento de toast passaram. O defeito de foco já existia antes da migração; permanece como falha real (sem skip, retry ou falha esperada), com screenshot e trace próprios. Portanto `npm test` retorna exit 1 enquanto essa regressão estiver aberta. O teste complementar de formulário é executado separadamente após a migração.
