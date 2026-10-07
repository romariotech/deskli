# Repository Guidelines

## Start here

Read `harness/README.md`, then the task-relevant context and rules. The canonical visual specification is `harness/design/design-system.md`; the catalog guide is `harness/docs/catalogo.md`. User instructions take precedence over local conventions.

## Structure

Deskli is a Vue 3 + TypeScript frontend using Vite, Tailwind CSS 4, shadcn-vue and Reka UI. Routes include login, Home, design-system catalog and 404. Authentication, tickets and uploads are simulated; do not invent backend contracts.

- Primitives: `src/components/ui/`.
- Product components built on primitives: `src/components/` (root).
- Ticket components: `src/features/tickets/components/`.
- Pages/layout: `src/pages/`, `src/layouts/`.
- Tokens, shared geometry and states: `src/assets/index.css`.
- Project knowledge: `harness/`; executable tests: `tests/e2e/`.

## Development

Use Node 24 and npm with `package-lock.json`. Run tooling in the project Podman container after verifying the bind mount. `npm run dev` starts development; `npm run build` checks TypeScript and builds. Use Vue SFCs with `<script setup lang="ts">`, PascalCase components, camelCase functions, `use*` composables and `@/` shared imports. Follow two-space indentation and no semicolons in Vue/TypeScript.

## Design and validation

Follow the canonical design system: semantic colors, DM Sans, compact density, light/dark/system and touch targets. Sidebar collapses to icons on desktop. Preserve public/internal draft separation and accessible focus.

Tests use Playwright runner and `*.spec.js`, with fixture-owned browser contexts. `npm test` runs all; `npm run test:login`, `test:compact`, `test:sidebar`, `test:design-system` target suites. The runner starts Vite on port 4173 unless `DESKLI_URL` is set. Read `harness/docs/testing.md` for browser installation and artifacts. Do not add validation scripts under `scripts/` or overwrite historical screenshots.

Run build for code changes and relevant tests; report actual results and limitations. Keep implementation, docs and tests aligned. Before delivery use `harness/checklists/delivery.md`. PRs describe the problem, resulting behavior, validation, screenshots when relevant, and backend dependencies. Use concise imperative commit subjects.
