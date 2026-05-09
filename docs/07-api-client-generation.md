# Building `libs/api-client` from the API OpenAPI document

Goal: a **typed**, **versioned** HTTP client consumed by the dashboard as `workspace:*`.

## 1. Produce `openapi.json` from Nest

- Decorate controllers/DTOs with `@nestjs/swagger`.
- In development (or CI), generate JSON:
  - Either **write from app instance** (`SwaggerModule.createDocument` → `writeFileSync('openapi.json', ...)`),
  - Or **HTTP fetch** after API boots: `GET ${API_URL}/api/open-api` → save body to `services/api/openapi.json`.
    Commit `openapi.json` **or** generate in CI before client build — pick one policy per repo.

## 2. Create workspace package `libs/api-client`

Suggested `package.json`:

- `"type": "module"`
- `exports` for `.` → `dist/index.js` + types
- `files`: `["dist"]`
- Scripts: `generate`, `build`

## 3. Generate TypeScript sources

Use OpenAPI Generator CLI (`@openapitools/openapi-generator-cli`):

- Input: `../../services/api/openapi.json` (path relative to lib)
- Generator: **`typescript-fetch`**
- Output: e.g. `./src/generated`
- Config file `openapi-generator-config.json` for package name, supports ES modules, etc.
  Example script:

```json
"generate": "rm -rf ./src/generated && bunx @openapitools/openapi-generator-cli generate -i ../../services/api/openapi.json -g typescript-fetch -o ./src/generated --skip-validate-spec -c openapi-generator-config.json"
```
