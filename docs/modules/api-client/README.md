# Module: API Client Generation (OpenAPI)

Use this module when frontend apps should consume a typed client package instead of handwritten fetch logic.

## Goal

Generate and publish a TypeScript client from backend OpenAPI, then consume it as a workspace package.

## Flow

1. Generate `openapi.json` from backend app.
2. Run OpenAPI Generator (`typescript-fetch` is a practical default).
3. Output generated code to a dedicated folder (example: `src/generated`).
4. Build library and expose typed exports.
5. Consume via workspace dependency in frontend apps.

## Package shape

Recommended library setup:

- `type: "module"`
- clear `exports` map
- scripts: `generate`, `build`
- generated files excluded from manual edits

## CI usage

- Regenerate client when API contract changes.
- Fail CI if generated output is stale (either commit artifacts or regenerate during pipeline).

## Real project example

```txt
libs/api-client/
  src/generated/
  src/index.ts
  openapi-generator-config.json
  package.json
```

Design notes:

- Export only stable public methods/types from `src/index.ts`.
- Treat `src/generated` as read-only.
- Keep custom wrappers outside generated folder to avoid overwrite during regeneration.
