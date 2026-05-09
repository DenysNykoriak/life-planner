# Core stack (default baseline)

Use this when no optional layers are requested.

## Repo & tooling

- **Monorepo**: workspaces `services/*`, `libs/*`.
- **Runtime/package manager**: **Bun** at repo root (`packageManager` field).
- **Lint + format**: **Biome** (root `biome.json`), `biome check .`.
- **Editor**: format on save with Biome where possible.

## TypeScript

- **SPA** (Vite): `strict`, `verbatimModuleSyntax`, bundler resolution, `noUnusedLocals` / `noUnusedParameters`.
- **API** (Node/Nest): `module`/`moduleResolution` **NodeNext**, decorators + `emitDecoratorMetadata` for Nest.

## Backend service (`services/api`)

- **NestJS**: modular `modules/<feature>/`, global pipes/interceptors as needed.
- **Prisma**: `prisma/schema.prisma`, migrations under `prisma/migrations/`.
- **Auth**: pick one stack per product (e.g. better-auth + Nest bridge); document env vars in `04-env-and-contracts.md`.
- **OpenAPI**: `@nestjs/swagger` on controllers/DTOs; expose JSON document (e.g. `/api/open-api`) for codegen.

## Frontend shell (`services/dashboard`) — minimal

- **Vite** + **React** + **TypeScript**.
- **TanStack Query** is acceptable as the default **server-state** layer for REST APIs (optional doc can say “skip if using something else”).
- Entry: initialize cross-cutting concerns before render only when those packages exist (see optional docs).

## Shared library (`libs/api-client`)

- Generated from the API **OpenAPI** document; built as publishable/workspace package.
- See `07-api-client-generation.md`.

## Optional docs (use only when needed)

| Need                          | Doc                                      |
| ----------------------------- | ---------------------------------------- |
| File routes, loaders, layouts | `01-optional-routing-tanstack-router.md` |
| Form library & patterns       | `02-optional-forms-tanstack-form.md`     |
| Translations                  | `03-optional-i18next.md`                 |
| Component UI system           | `06-ui-mantine.md`                       |
| Desktop wrapper               | `05-optional-tauri.md`                   |
