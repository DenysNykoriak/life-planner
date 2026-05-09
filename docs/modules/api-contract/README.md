# Module: API Contract and Environment

Define runtime variables and API contract early so frontend, backend, and generated client stay aligned.

## Environment variables

### Backend

- `PORT`
- `DATABASE_URL`
- auth/storage secrets
- optional public API URL for tooling that fetches OpenAPI over HTTP

### Frontend

- `VITE_API_URL` (or equivalent public API base URL)

## HTTP contract rules

- Keep one API prefix convention (example: `/api/...`).
- Pick one auth transport strategy per project (cookies or bearer token).
- If using cookies, configure frontend requests with credentials enabled.
- Version breaking API changes and regenerate client immediately.

## Best-practice checklist

- Document every required env variable in one place.
- Validate backend env variables on startup.
- Keep contract updates and client regeneration in the same PR when possible.

## Real project example

```txt
services/api/src/config/
services/api/.env.example
services/dashboard/.env.example
docs/modules/api-contract/README.md
```

Design notes:

- Keep `.env.example` files updated with required variables only.
- Keep auth and storage contracts explicit (headers, cookies, payload shapes).
- Keep API path/version policy stable to avoid client churn.
