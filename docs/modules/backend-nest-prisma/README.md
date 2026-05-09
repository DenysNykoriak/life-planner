# Module: Backend Baseline (NestJS + Prisma)

Use this as the default backend stack for API-first projects.

## Scope

- HTTP API with NestJS
- Database access with Prisma
- OpenAPI export for typed client generation

## Suggested structure

- `src/modules/<feature>/` for feature modules
- `src/common/` for shared guards/interceptors/pipes
- `prisma/schema.prisma` and `prisma/migrations/*`

## Required practices

- Validate config/environment on startup
- Keep DTO validation explicit
- Keep Prisma schema and migrations in sync
- Keep OpenAPI up to date after API changes

## Integration points

- Contract/env docs: `docs/modules/api-contract/README.md`
- Client generation: `docs/modules/api-client/README.md`

## Real project example

```txt
src/modules/auth/
src/modules/folders/
src/modules/files/
src/common/
prisma/schema.prisma
prisma/migrations/
```

Design notes:

- Keep one module per business domain.
- Keep controllers thin and push rules into services.
- Keep Prisma access centralized per module boundary.
