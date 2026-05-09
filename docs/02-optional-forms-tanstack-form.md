# Optional: Forms — TanStack Form

Use when the product needs a **structured form state** layer (validation, submission, field APIs).

## Install

- `@tanstack/react-form`
- Pair with **Zod** (`zod`) for schemas if you standardize on schema-first validation.

## Conventions

- Wrap fields in small components; keep submit handlers thin — call API hooks/services.
- For server errors, map field errors from API responses in one place.

## Code style

- No extra comments unless the form file is long and needs a single section title.
- Prefer explicit types for form default values and submit payloads.
