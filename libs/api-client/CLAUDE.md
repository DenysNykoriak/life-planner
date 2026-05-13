# api-client lib — CLAUDE.md

## What this is

Shared TypeScript package consumed by `services/dashboard`. Exports:
- Generated models + `PlansApi` class (TypeScript-fetch, from `src/generated/`)
- `createLifePlannerApiClient(origin)` — pre-configured client with cookie + bearer auth
- `BETTER_AUTH_BEARER_STORAGE_KEY` — localStorage key for the bearer token
- `authOptions` — placeholder for Better Auth access-control config (empty for now; needed if org plugin is added)

## Update workflow

1. Edit `openapi.json` (source of truth for the API contract)
2. Run `npm run build` — compiles `src/` → `dist/`
3. To also regenerate `src/generated/` from the spec: `npm run generate` then `npm run build`

> The `src/generated/` files have Biome lint/format disabled — edit them if regeneration is impractical, but prefer `npm run generate`.

## Key files

| File | Notes |
|---|---|
| `openapi.json` | Hand-maintained OpenAPI 3.0 spec — edit this when the API changes |
| `src/create-client.ts` | Configures `Configuration` with bearer intercept; creates `LifePlannerApiClient` |
| `src/auth-options.ts` | Exports `authOptions = {}` — extend here when adding Better Auth org plugin |
| `src/generated/` | Auto-generated, do not hand-edit unless regeneration is blocked |
| `dist/` | Compiled output — committed to repo; rebuild after any source change |

## PlanItemInputDto shape

Accepts: `text` (string), `completed` (boolean), `depth?` (int ≥ 0).  
Does NOT accept `id` or `sortOrder` — both are server-computed.
