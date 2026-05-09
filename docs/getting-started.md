# Getting Started (Project Bootstrap)

Use this checklist when starting a new project with this docs set.

## 1) Pick baseline

- Start with `docs/core.md`
- Keep baseline minimal first
- Do not add optional modules unless required

## 2) Create workspace shape

Add backend package, frontend SPA package, and generated API client package to root workspaces (exact names are up to you). Example:

```json
{
	"workspaces": ["packages/*", "apps/*"]
}
```

## 3) Setup quality gates

- Add Biome config and root lint scripts
- Enable TypeScript strict mode where possible
- Make sure build and lint run in CI

## 4) Define contract early

- Document env variables in `docs/modules/api-contract/README.md`
- Expose OpenAPI from backend
- Generate and consume client in frontend

## 5) Add optional modules only when needed

- Server-state hooks: `docs/modules/server-state-hooks/README.md`
- Routing: `docs/modules/routing-tanstack-router/README.md`
- Forms: `docs/modules/forms-tanstack-form/README.md`
- i18n: `docs/modules/i18n-i18next/README.md`
- Desktop: `docs/modules/desktop-tauri/README.md`
- UI: `docs/modules/ui-mantine/README.md`
- Authorization: `docs/modules/authorization-better-auth/README.md`

Suggested first delivery scope:

1. API health endpoint + one real feature endpoint.
2. Frontend with one feature page.
3. Generated API client connected to that feature.
4. Biome and CI checks enabled.
