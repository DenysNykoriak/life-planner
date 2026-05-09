# Module: API Client Generation (OpenAPI)

Use this module when frontend apps should consume a typed client package instead of handwritten fetch logic.

## Goal

Generate and publish a TypeScript client from backend OpenAPI, then consume it as a workspace package.

## Flow

1. Produce an OpenAPI JSON document from the backend (HTTP endpoint or build artifact).
2. Run OpenAPI Generator (`typescript-fetch` is a practical default).
3. Output generated code to a dedicated folder inside the client package.
4. Build the library and expose typed exports.
5. Consume via workspace dependency in frontend apps.

## Package shape

Recommended library metadata:

```json
{
	"name": "my-api-client",
	"type": "module",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js",
			"require": "./dist/index.cjs"
		}
	},
	"scripts": {
		"generate": "openapi-generator-cli generate -i \"$OPENAPI_SPEC\" -g typescript-fetch -o ./src/generated -c openapi-generator-config.json",
		"build": "vite build"
	}
}
```

Adjust `-i` to wherever your OpenAPI JSON lives after export.

## Generator options (example)

```json
{
	"generateSourceCodeOnly": true,
	"supportsES6": true,
	"withSeparateModelsAndApi": true,
	"modelPackage": "models",
	"apiPackage": "api",
	"useSingleRequestParameter": true,
	"usePromises": true,
	"platform": "browser"
}
```

## Public exports (example)

Re-export generated APIs and any shared auth metadata your SPA needs:

```ts
export * from "./generated/src";

export const authOptions = {
	ac,
	roles,
};
```

Define `ac` and `roles` in one shared module that both backend and client can import, or duplicate only the minimal shape the client plugin requires—pick one approach and stay consistent.

## CI usage

- Regenerate client when API contract changes.
- Fail CI if generated output is stale (either commit artifacts or regenerate during pipeline).

Design notes:

- Treat generated output as read-only.
- Keep custom wrappers outside generated folders so regeneration never deletes hand-written code.
