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

## Example environment files

Backend:

```bash
PORT=8080
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB"
API_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

Frontend (Vite):

```bash
VITE_API_URL=http://localhost:8080
```

Design notes:

- List every required variable in your team wiki or onboarding doc.
- Keep auth and storage contracts explicit (headers, cookies, payload shapes).
- Keep API path/version policy stable to avoid client churn.
