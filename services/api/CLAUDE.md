# API service — CLAUDE.md

See root `CLAUDE.md` for cross-cutting invariants.

## Module structure

```
src/
  app.module.ts          root module — wires ConfigModule, PrismaModule, AuthModule, feature modules
  auth.ts                createBetterAuth(prisma, env) factory
  config/env.validation  class-validator env schema, throws on startup if vars missing
  plans/                 plans domain (controller + service + dto/)
  prisma/                PrismaService (extends PrismaClient, connect/disconnect lifecycle)
```

## Key wiring decisions

**bodyParser: false** in `NestFactory.create` — required for Better Auth body parsing middleware to function correctly.

**CORS** — `credentials: true`, `exposedHeaders: ["set-auth-token"]`. The `set-auth-token` header must stay so browsers can read the bearer token. `disableTrustedOriginsCors: true` in `AuthModule.forRootAsync` because the app sets its own CORS.

**Auth is async** — `AuthModule.forRootAsync` injects `PrismaService` and `ConfigService` so Better Auth gets the live Prisma client (not a module-level singleton).

**Global ValidationPipe** — `whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true }`. Path params arrive as strings; `enableImplicitConversion` coerces `"123"` → `number` for typed params.

## Prisma schema

Single `schema.prisma` file (acceptable for this app size). Contains:
- Better Auth vendor models: `User`, `Session`, `Account`, `Verification` — do not hand-edit these.
- Domain models: `DailyPlan`, `PlanItem` — edit freely.

`DailyPlan` has a `@@unique([userId, date])` constraint — one plan per user per calendar day.
`PlanItem` has a self-referential `parent/children` relation via `parentId`. Items are stored flat and reconstructed into tree order by the service's `getDay` walker.

## Plans service pattern

`getDay` — upserts `DailyPlan`, then does a depth-first walk to return items in tree order (parent first, children follow).

`replaceDay` — deletes all existing items, then re-inserts from the ordered flat list in a single transaction. Parent IDs are resolved via a `stack[]` that tracks depth; `sortOrder` is a per-parent counter (client-sent `sortOrder` is ignored).

## Env variables (all required except PORT, FRONTEND_URL)

| Var | Notes |
|---|---|
| `PORT` | optional, default 3000 |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | min 32 chars |
| `API_URL` | public URL of this service (used by Better Auth for cookie domain) |
| `FRONTEND_URL` | optional, defaults to `http://localhost:5173`; added to Better Auth trusted origins |
