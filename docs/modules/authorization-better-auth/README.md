# Module: Authorization (Better Auth)

Use this module when you want Better Auth for sign-in and organization-scoped roles and permissions.

## Scope

- Better Auth server instance mounted on the backend
- Cookie sessions for browser clients (with credentials on cross-origin requests when needed)
- Optional bearer token for API clients that cannot rely on cookies alone
- Organization plugin for membership, invitations, and access-control statements
- HTTP route protection aligned with your backend framework (NestJS guard pattern is a common fit)

## Integration points

- Contract and env: `docs/modules/api-contract/README.md`
- Backend baseline: `docs/modules/backend-nest-prisma/README.md`
- Frontend baseline: `docs/modules/frontend-react-vite/README.md`

## Access control model

- Define a **statement** map: resource keys and allowed actions (strings), extending organization defaults where you use the organization plugin.
- Define **roles** as compositions of those statements (for example owner, admin, member patterns).
- Scope checks to an **active organization** when data is tenant-scoped; permission APIs typically take `organizationId` plus the requested permission shape.

Keep statement keys and action names stable; they flow into decorators, client inference, and documentation.

## Typical request flow

1. User completes Better Auth routes under your chosen base path (for example `/auth`).
2. Browser clients send credentials on auth and API requests when using cookies.
3. Optional bearer token is attached for generated or hand-written HTTP clients when your stack uses both.
4. Protected handlers resolve the session and active organization, then verify permissions before running business logic.

## Required practices

**Backend**

- Mount Better Auth according to framework docs (including body parser requirements if applicable).
- Enable CORS with credentials when the SPA origin differs from the API; expose any custom auth response headers your client reads.
- Centralize permission definitions; avoid duplicating role matrices across files.
- Protect every sensitive route; do not rely on the frontend alone.
- For multi-tenant data, consistently filter by active organization (or equivalent tenant id).

**Frontend**

- Single auth client instance; avoid multiple conflicting base URLs or storage keys.
- After sign-in, ensure users have an active organization before hitting tenant-scoped screens.
- Treat permission hints in the UI as optional; failed API calls still define real authorization.

## Environment variables

Document these with your API contract module:

- Backend: database URL, public API base URL used by Better Auth, trusted frontend origins, secrets required by Better Auth.
- Frontend: public API base URL for the SPA build tool you use.

Names are project-specific; keep them listed in one place and validated on startup for the backend.

## Better Auth server (example)

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI } from "better-auth/plugins";
import { organization } from "better-auth/plugins/organization";
import { PrismaClient } from "@prisma/client";
import { ac, roles } from "./permissions";

const prisma = new PrismaClient();

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	basePath: "/auth",
	baseURL: process.env.API_URL,
	trustedOrigins: [process.env.FRONTEND_URL].filter(Boolean) as string[],
	emailAndPassword: { enabled: true },
	plugins: [
		bearer(),
		organization({ ac, roles }),
		openAPI({ disableDefaultReference: true }),
	],
});
```

## Statements and roles (example)

```ts
import { type AccessControl, type Role, createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
	document: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement) as AccessControl<typeof statement>;

const owner = ac.newRole({
	...ownerAc.statements,
	document: ["create", "read", "update", "delete"],
}) as Role;

const member = ac.newRole({
	...memberAc.statements,
	document: ["read"],
}) as Role;

export const roles = { owner, member };
```

## Permission decorator typing (NestJS example)

```ts
import { Reflector } from "@nestjs/core";
import type { ac } from "./permissions";

type Permissions = typeof ac.statements;

type MakeOptionalArray<T> = {
	[P in keyof T]: T[P] extends readonly (infer U)[] ? U[] : T[P];
};
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
type MakeOptional<T> = {
	[P in keyof T]?: T[P];
};

export type PermissionRequest = MakeOptional<MakeOptionalArray<DeepWriteable<Permissions>>>;

export const HasPermission = Reflector.createDecorator<PermissionRequest>();
```

## Permission guard (NestJS example)

```ts
import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { auth } from "./auth";
import { HasPermission } from "./has-permissions.decorator";

@Injectable()
export class HasPermissionGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(HasPermission, context.getHandler());
		if (!permissions) return true;

		const request = context.switchToHttp().getRequest();
		const headers = request.headers as Headers;

		const session = await auth.api.getSession({ headers });
		if (!session?.session.activeOrganizationId) {
			throw new UnauthorizedException("No active organization");
		}

		const hasPermission = await auth.api.hasPermission({
			headers,
			body: {
				organizationId: session.session.activeOrganizationId,
				permissions,
			},
		});

		if (!hasPermission.success) {
			throw new UnauthorizedException("Forbidden");
		}

		return true;
	}
}
```

Register globally or per controller depending on your Nest layout.

## Nest module wiring (example)

```ts
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth";
import { HasPermissionGuard } from "./has-permission.guard";

@Module({
	imports: [AuthModule.forRoot({ auth })],
	providers: [{ provide: APP_GUARD, useClass: HasPermissionGuard }],
})
export class AuthInfraModule {}
```

## React auth client (example)

```ts
import { organizationClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authOptions } from "my-api-client";

const authFetch: typeof fetch = async (input, init) => {
	const res = await fetch(input, { ...init, credentials: "include" });
	const token = res.headers.get("set-auth-token");
	if (token) {
		localStorage.setItem("better_auth_bearer_token", token);
	}
	return res;
};

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL,
	basePath: "/auth",
	fetchOptions: {
		credentials: "include",
		customFetchImpl: authFetch,
		auth: {
			type: "Bearer",
			token: () => localStorage.getItem("better_auth_bearer_token") ?? "",
		},
	},
	plugins: [
		organizationClient({
			ac: authOptions.ac,
			roles: authOptions.roles,
		}),
		inferAdditionalFields({
			user: {
				lastName: { type: "string", required: true },
				locale: { type: "string", required: false },
			},
		}),
	],
});
```

Replace the client package name with whatever exports `authOptions` aligned with your server access-control definitions.

## Generated OpenAPI client + bearer (example)

```ts
import { Configuration, DocumentsApi } from "my-api-client";

const configuration = new Configuration({
	basePath: import.meta.env.VITE_API_URL,
	credentials: "include",
	fetchApi: async (url, init) => {
		const token = localStorage.getItem("better_auth_bearer_token") ?? "";
		const headers = new Headers(init?.headers);
		if (token) headers.set("Authorization", `Bearer ${token}`);
		return fetch(url, { ...init, headers, credentials: "include" });
	},
});

export const documentsApi = new DocumentsApi(configuration);
```

## Wiring permissions to HTTP handlers

Attach a typed permission payload per route (decorator, metadata, or explicit guard). The guard should:

1. Load the session from the incoming request.
2. Require an active organization when your rules depend on it.
3. Call Better Auth’s permission API with `organizationId` and the route’s required permissions.
4. Fail closed (reject the request) when the check does not succeed.

## Controller usage (NestJS example)

```ts
import { Controller, Get } from "@nestjs/common";
import { HasPermission } from "./has-permissions.decorator";

@Controller("documents")
export class DocumentsController {
	@HasPermission({ document: ["read"] })
	@Get()
	list() {
		return [];
	}
}
```

## Best-practice checklist

- Align permission types between server config and generated or shared client types where possible.
- Add or update permission checks in the same change as new endpoints or new actions.
- Test at least two roles and the “no active organization” path for tenant-scoped APIs.
