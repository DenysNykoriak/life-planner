# Module: Frontend Baseline (React + Vite + TypeScript)

Use this as the default frontend baseline.

## Scope

- React SPA with Vite
- TypeScript strict mode
- UI module selected separately (Mantine recommended)

## Suggested structure

- `src/app/` for providers and app bootstrapping
- `src/pages/` or `src/features/` for domain UI
- `src/lib/` for shared helpers and API adapters

## Required practices

- Keep entrypoint small and predictable
- Keep framework providers centralized
- Keep feature code separated from shared UI primitives
- Keep TypeScript errors at zero

## Optional integrations

- Routing: `docs/modules/routing-tanstack-router/README.md`
- Forms: `docs/modules/forms-tanstack-form/README.md`
- i18n: `docs/modules/i18n-i18next/README.md`
- Server state: `docs/modules/server-state-tanstack-query/README.md`
- UI: `docs/modules/ui-mantine/README.md`

## Real project example

```txt
src/app/providers/
src/features/auth/
src/features/folders/
src/components/common/
src/lib/api/
```

Design notes:

- Keep domain components inside `features/*`.
- Keep reusable UI primitives in `components/common`.
- Keep API-specific adapters in `lib/api` to avoid coupling UI with transport details.
