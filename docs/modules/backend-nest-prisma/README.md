# Module: Backend Baseline (NestJS + Prisma)

Use this as the default backend stack for API-first projects.

## Scope

- HTTP API with NestJS
- Database access with Prisma
- OpenAPI export for typed client generation

## Required practices

- Validate config/environment on startup
- Keep DTO validation explicit
- Keep Prisma schema and migrations in sync
- Keep OpenAPI up to date after API changes

## Integration points

- Contract/env docs: `docs/modules/api-contract/README.md`
- Client generation: `docs/modules/api-client/README.md`
- Optional auth stack: `docs/modules/authorization-better-auth/README.md`
- Dates and API shapes: `docs/modules/dates-and-time/README.md`

## Prisma: split vendor vs application models

Use **multiple `.prisma` files in one Prisma project** (single `generator`, single `datasource`) so generated or vendor-aligned models do not mix with hand-written domain models.

Typical layout (names are conventional; match your generator and team conventions):

1. **Primary schema file** (often `schema.prisma`) — `generator`, `datasource`, and models owned by **auth tooling, imports from vendor docs, or other codegen** you rarely edit by hand.

2. **Application schema file** (often `app.prisma`) — **product domain models** only: entities your team designs and evolves in migrations.

Relations may cross files as long as everything belongs to the same migrated schema.

Small apps may keep one `schema.prisma` until vendor models grow; turning on a schema folder needs `prisma.config.ts` with `schema: "prisma"` so Prisma loads every `.prisma` file (see Prisma v6 location docs).

Example fragments (provider and models are illustrative):

```prisma
// Often: schema.prisma — generator, datasource, vendor / generated models
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model IdentityUser {
  id        String   @id
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```prisma
// Often: app.prisma — domain-only models
model Article {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

For instant fields in SQL databases, prefer Prisma **`DateTime`**; storage details depend on the provider. See `docs/modules/dates-and-time/README.md`.

## Nest bootstrap (HTTP + CORS)

Some HTTP stacks (session middleware, certain auth frameworks) need custom body parsing; follow the library you integrate.

```ts
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});

	app.enableCors({
		origin: true,
		credentials: true,
		exposedHeaders: [],
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	await app.listen(process.env.PORT ?? 8080, "0.0.0.0");
}
void bootstrap();
```

Add `exposedHeaders` entries only if your auth or upload stack sets response headers the browser must read.

## Feature module layout (concept)

Group by domain: each slice exports a Nest module with controller + service + DTOs. Shared guards, pipes, and interceptors live alongside generic infrastructure registration.

Design notes:

- Keep controllers thin and push rules into services.
- Keep database access behind services or repositories per domain boundary.
