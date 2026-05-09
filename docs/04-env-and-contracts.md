# Environment variables & HTTP contract

## API

- `PORT`, `DATABASE_URL`, secrets via Nest `ConfigModule`.
- `API_URL` — public base URL for OpenAPI export scripts if they fetch over HTTP.

## Dashboard

- `VITE_API_URL` — base URL for generated client `Configuration.basePath`.

## Contract

- REST JSON under `/api/...` (adjust prefix consistently).
- Cookies / bearer headers — match auth stack; frontend uses `credentials: 'include'` when using cookies.
