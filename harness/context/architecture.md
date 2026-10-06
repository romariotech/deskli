# Arquitetura atual

- `src/main.ts`, `src/App.vue`: montagem, router e único host de toast.
- `src/router/index.ts`: rotas e carregamento das páginas.
- `src/layouts/AppLayout.vue`: composição do shell com sidebar e cabeçalho.
- `src/pages/`: login, Home, 404 e catálogo.
- `src/components/ui/`: primitivas shadcn-vue/Reka UI; foco e teclado ficam com as primitivas.
- `src/components/deskli/`: contratos compartilhados do produto.
- `src/features/tickets/components/`: mensagens, anexos, lista e compositor.
- `src/pages/design-system/TicketPlayground.vue`: estado e operações simuladas.
- `src/assets/index.css`: tokens semânticos e Tailwind 4.
- `src/styles/deskli.css`: densidade, estados e geometria compartilhada.
- `tests/e2e/` e `playwright.config.ts`: descoberta, isolamento e execução dos testes Chromium.

Fluxo de dependências: páginas e contêineres compõem features e wrappers; estes reutilizam primitivas. Regras de negócio não devem entrar em primitivas. Adote a estrutura existente antes de introduzir camadas ou dependências novas.

Node 24 e npm com lockfile. O compose monta o checkout em `/app`; confirme o mount antes de executar ferramentas via Podman. O servidor da suíte usa a porta 4173 e o desenvolvimento usa 5173.
