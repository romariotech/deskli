# Deskli

Frontend de atendimento com Vue 3, TypeScript, Vite, Tailwind 4, shadcn-vue e Reka UI. Login, Home e catálogo são demonstrativos, sem backend ou autenticação real.

## Contexto do projeto

Comece pelo [harness](harness/README.md). Consulte o [design system oficial](harness/design/design-system.md), o [catálogo](harness/docs/catalogo.md) e a [arquitetura](harness/context/architecture.md).

## Desenvolvimento

Node 24 (`.nvmrc`) e npm com lockfile. Use o container do checkout:

```sh
podman compose up -d --build
podman exec deskli_app_1 npm ci
podman exec deskli_app_1 npm run dev -- --host 0.0.0.0
```

Acesse a porta 5173. `/` redireciona para `/login`; outras rotas: `/home` e `/design-system`. Em produção, configurar history fallback para `index.html`.

## Validação

```sh
podman exec deskli_app_1 npm run build
podman exec deskli_app_1 npm test
```

A suíte Playwright gerencia seu servidor na porta 4173. Instalação do navegador, comandos por suíte e relatórios estão em [testes](harness/docs/testing.md). As verificações executáveis estão em `tests/e2e/`, não em `scripts/`.
