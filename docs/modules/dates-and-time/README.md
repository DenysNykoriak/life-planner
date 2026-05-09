# Module: Dates and Time

Pick one representation for domain dates/times and keep UI formatting separate.

## Prisma and databases

- In Prisma schema, store instants with **`DateTime`** (`@default(now())`, `@updatedAt`, nullable instants when needed).
- Common SQL providers map `DateTime` to **timestamp-like** column types (exact SQL type names vary by database).
- Only use raw integers or strings in Prisma for instants if you intentionally chose that model.

## Storage and logic (API / JSON)

- Persist dates as **Unix time in milliseconds** (`bigint` or `number` where safe).
- Transport the same in JSON bodies and path/query params (numeric), not ISO strings.
- Prisma `DateTime` fields surface as runtime `Date` values (or serialized forms) in application code—convert at API boundaries when the contract uses millisecond integers.

## UI

- Keep timestamps until render or input boundaries.
- Format with **dayjs** (and project-wide locale plugins when you add i18n).
- Call dayjs at the component (or colocated helper inside the same file) when usage is small; avoid extra `lib/dates.ts`-style wrappers that only re-export one-liners.

## Naming

- Prefer names like `dayTimestampMs` or `expiresAtMs` so units stay obvious.

## Checklist

- OpenAPI uses integer (`format: int64`) for millisecond instants when the contract exposes them.
- Prisma fields use `BigInt` when numeric values can exceed `Number.MAX_SAFE_INTEGER`; cast at API edges when you standardize on `number` in JSON.
- Prisma schema uses `DateTime` for persisted instants when using timestamp-like SQL columns.
