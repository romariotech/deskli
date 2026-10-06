# 0001 — Harness versionado e runner Playwright

Data: 2026-10-02. Estado: adotada.

## Problema

Especificação e documentação estavam dispersas, com README e AGENTS descrevendo um scaffold antigo. Verificações em scripts iniciavam Chromium por conta própria e sobrescreviam capturas na documentação. O teste de login antigo referenciava seletores e textos removidos.

## Decisão

Centralizar a especificação em `harness/design/design-system.md` e o guia em `harness/docs/catalogo.md`. Manter os antigos caminhos de documentação apenas como links de encaminhamento. Mover as capturas existentes para `harness/docs/screenshots/`, sem tratá-las como snapshots automatizados.

Migrar verificações vigentes para `tests/e2e/*.spec.js` usando fixtures, isolamento, timeout e relatórios do Playwright. Substituir a suíte obsoleta do login pela atual e por verificações complementares de formulário. Separar toasts do fluxo de chamados para uma falha de foco não impedir a execução dos testes de mensagens e anexos.

`scripts/prepare-login-image.mjs` é uma ferramenta legada de produção de asset, não um teste; permanece separada e não participa de `npm test`. Seu PNG de origem não está no checkout atual. Não executar para validar a interface.

## Consequências

`npm test` executa a suíte e inicia Vite em porta própria; `DESKLI_URL` permite uma origem externa explicitamente definida. Resultados transitórios ficam ignorados pelo Git. Não foram adicionadas bibliotecas, backend, CI remoto nem testes unitários artificiais. Revisões antigas mencionadas no README mas ausentes do disco não foram reconstruídas.
