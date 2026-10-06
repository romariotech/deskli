# Regras de desenvolvimento

- Vue SFC com `script setup lang="ts"`, componentes PascalCase, funções camelCase, composables `use*`, imports compartilhados com `@/`.
- Dois espaços, sem ponto e vírgula em TypeScript/Vue; respeitar o estilo do arquivo.
- Reutilizar primitivas e wrappers; não criar uma segunda biblioteca de componentes.
- Consultar `harness/design/design-system.md`: DM Sans, cores semânticas, claro/escuro/sistema, controles compactos de 32px e toque de 44px. Não diminuir a raiz de 16px nem usar zoom para compactar.
- Sidebar desktop recolhe para ícones; celular abre painel. Preservar teclado, nomes acessíveis, tooltips e preferência salva.
- Não cortar conteúdo para esconder scroll. Login deve caber nas dimensões cobertas pelos testes, com erros visíveis, mantendo acesso em telas baixas.
- Preservar rascunhos e separar resposta pública de nota interna. Identificar simulações e dependências do backend.
- Testes novos ficam em `tests/e2e/*.spec.js` e usam fixtures do Playwright. Não iniciar Chromium manualmente em scripts de verificação.
- Evidências automáticas usam `testInfo.outputPath`; não sobrescrever documentação histórica. Não apresentar capturas como comparação visual por pixel sem snapshots e asserções próprios.
- Implementação, contratos, documentação e testes pertinentes devem mudar juntos.
