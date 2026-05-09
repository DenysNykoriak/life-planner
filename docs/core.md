# Project Docs Core

This docs set is a reusable starter for new projects.  
It is intentionally independent from any single app implementation.

## Baseline architecture (default)

Use this baseline first, then add only required modules.

- Monorepo with workspaces (`services/*`, `libs/*`)
- TypeScript-first services and apps
- Backend API (NestJS + Prisma is a proven default)
- Frontend SPA (React + Vite)
- API client package generated from OpenAPI
- Lint/format with Biome

This baseline does **not** require:

- routing
- i18n
- desktop wrapper

## How to use these docs

1. Start from this file and keep scope minimal.
2. Pick modules from `docs/modules/*` only when needed.
3. Keep one owner decision per module (for example one routing stack, one i18n stack).
4. Add short project-specific notes near chosen modules.

## Modules index

- `docs/getting-started.md` - checklist to bootstrap a new project from this docs set
- `docs/modules/backend-nest-prisma/README.md` - backend baseline module
- `docs/modules/frontend-react-vite/README.md` - frontend baseline module
- `docs/modules/server-state-tanstack-query/README.md` - optional server-state module
- `docs/modules/code-style-biome/README.md` - lint and formatting defaults
- `docs/modules/api-contract/README.md` - environment variables and HTTP contract
- `docs/modules/api-client/README.md` - generate typed client from OpenAPI
- `docs/modules/ui-mantine/README.md` - UI system with Mantine (recommended)
- `docs/modules/routing-tanstack-router/README.md` - optional SPA routing
- `docs/modules/forms-tanstack-form/README.md` - optional form state layer
- `docs/modules/i18n-i18next/README.md` - optional translations
- `docs/modules/desktop-tauri/README.md` - optional desktop shell

## Reference implementation notes

Current reference project follows this shape:

- backend in `services/api`
- frontend in `services/dashboard`
- generated client in `libs/api-client`

Treat that project as a best-practice example, not as a required structure.

## Real project structuring rules

- Keep every cross-cutting concern in one owner module (auth, storage, i18n, routing).
- Keep generated code in dedicated folders and never mix with handwritten code.
- Keep frontend and backend contracts aligned through OpenAPI and generated clients.
- Keep optional modules additive; baseline must still run when optional modules are removed.
