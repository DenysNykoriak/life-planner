# Life Planner — CLAUDE.md

## Monorepo layout

| Path | Purpose |
|---|---|
| `services/api/` | NestJS backend (HTTP API + auth) |
| `services/dashboard/` | React SPA |
| `libs/api-client/` | TypeScript-fetch client generated from OpenAPI |

Workspaces: `package.json` root links all three. Run `npm install` at root.

## Stack

| Concern | Choice |
|---|---|
| Backend | NestJS + Prisma + PostgreSQL |
| Auth | Better Auth — email/password, cookie session + bearer fallback |
| Frontend | React 18 + Vite + TanStack Router (file routes) + TanStack Query + Mantine |
| API contract | `libs/api-client/openapi.json` → generated TypeScript client |
| Lint/format | Biome — tabs, double quotes, 100-char line width |

## Cross-cutting invariants

**Dates** — ms Unix timestamps (`int64`) in API path params and JSON bodies. Prisma `DateTime` in DB. `dayjs` for UI display only.

**Auth transport** — cookie (`better-auth.session_token`) + `set-auth-token` response header captured as bearer. Token key: `BETTER_AUTH_BEARER_STORAGE_KEY` (exported from `@life-planner/api-client`).

**Route protection** — guards live in route `beforeLoad` (TanStack Router), NOT in component `useEffect`. The root route fetches the session once; child routes read `context.session`.

**DTO whitelisting** — `ValidationPipe({ whitelist: true, transform: true })` on the backend strips unknown fields silently.

**Plan input** — `PlanItemInputDto` accepts only `text`, `completed`, `depth`. `sortOrder` is server-computed from iteration order; `id` is ignored. Do not add them back.

**api-client dist** — after editing `libs/api-client/openapi.json` or `src/`, rebuild: `cd libs/api-client && npm run build`.

## Adding a new domain feature

1. Add Prisma model to `services/api/prisma/schema.prisma` → `npx prisma migrate dev --name <name>`
2. Create `services/api/src/<domain>/` with `<domain>.module.ts`, `<domain>.controller.ts`, `<domain>.service.ts`, `dto/`
3. Register the module in `services/api/src/app.module.ts`
4. Update `libs/api-client/openapi.json` → `cd libs/api-client && npm run build`
5. Add `services/dashboard/src/lib/queryKeys.ts` entry
6. Add `services/dashboard/src/features/<domain>/hooks/use<Domain>Fetch.ts` + `use<Domain>Actions.ts`
7. Add page components under `services/dashboard/src/features/<domain>/`
8. Add route files `_app.<domain>.tsx` (or `_app.<domain>.index.tsx` + `_app.<domain>.browse.tsx`) under `services/dashboard/src/routes/`
9. Add feature tab + optional sub-nav links to `routes/_app.tsx` header if this is a top-level nav feature
