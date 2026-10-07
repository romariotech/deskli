# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Deskli is a Vue 3 + TypeScript helpdesk frontend (Vite, Tailwind CSS 4, shadcn-vue, Reka UI). It is a demo: authentication, tickets and uploads are **simulated** — do not invent backend contracts. Routes: login, Home, design-system catalog, 404.

`AGENTS.md` and `harness/` hold the project knowledge (written in Portuguese). Read `harness/README.md` first; the canonical visual spec is `harness/design/design-system.md`, and the pre-delivery checklist is `harness/checklists/delivery.md`. Keep implementation, docs and tests changing together.

## Commands

Node 24 + npm (lockfile). Tooling is meant to run in the Podman container (`compose.yaml` bind-mounts the checkout at `/app`); verify with `podman inspect deskli_app_1` before `podman exec deskli_app_1 <cmd>`.

- `npm run dev` — Vite dev server (port 5173)
- `npm run build` — `vue-tsc -b && vite build` (this is the type check; there is no lint script)
- `npm test` — all Playwright suites; `npm run test:login | test:compact | test:sidebar | test:design-system` for targeted suites; `npm run test:list` lists cases
- Single file/case: `npx playwright test tests/e2e/login.spec.js -g "<title>"`

The Playwright runner starts its own Vite on port 4173 (`--strictPort`, port must be free) unless `DESKLI_URL` is set. One worker, no retries, Chromium only. Browser install and artifact details: `harness/docs/testing.md`. Known state: `Toasts: acesso por Alt+T` is a real pre-existing failure, so `npm test` exits 1 — don't mask it with skip/retry.

## Architecture

Dependency flow: pages/containers compose features and `src/components/` (product components built on primitives), which reuse `src/components/ui/` primitives (shadcn-vue/Reka UI; focus and keyboard live there). No business rules in primitives. Don't add a second component library or new layers/dependencies without need.

- `src/App.vue` hosts the single toast (vue-sonner) outlet; `src/router/index.ts` defines routes; `src/layouts/AppLayout.vue` is the sidebar + header shell.
- `src/features/tickets/components/` — messages, attachments, list, composer. State and simulated operations live in `src/pages/design-system/TicketPlayground.vue`.
- Styling: semantic tokens, Tailwind 4 and shared density/state/geometry all live in `src/assets/index.css`.
- Tests: `tests/e2e/*.spec.js` using fixture-owned browser contexts (never launch Chromium manually). Don't add validation scripts under `scripts/`; per-test evidence goes through `testInfo.outputPath`; don't overwrite `harness/docs/screenshots/`.

## Conventions that aren't obvious

- Vue SFCs with `<script setup lang="ts">`, `@/` imports, two-space indent, no semicolons.
- Design: DM Sans, semantic colors, light/dark/system theme, 32px compact controls with 44px touch targets; never shrink the 16px root or use zoom to compact. Don't clip content to hide scroll; login must fit the heights covered by tests.
- Desktop sidebar collapses to icons (tooltips, saved preference); mobile opens a panel.
- Preserve drafts and keep public replies separate from internal notes.
- Commits: concise imperative subjects. PRs: problem, resulting behavior, validation, screenshots when relevant, backend dependencies.
