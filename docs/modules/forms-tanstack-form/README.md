# Module: Forms (TanStack Form)

Optional module. Use when forms are complex enough to need dedicated field state and submission flow.

## Install

- `@tanstack/react-form`
- optionally `zod` for schema-first validation

## Recommended usage

- Create reusable field wrappers for consistent UI and validation rendering.
- Keep submit handlers thin and delegate API calls to services/hooks.
- Normalize backend validation errors before mapping to form fields.

## Conventions

- Keep typed defaults and submit payloads explicit.
- Keep one validation strategy across the app.
- For tiny forms, native state can be enough and this module can be skipped.

## Real project example

```txt
src/features/auth/forms/SignInForm.tsx
src/features/auth/forms/SignUpForm.tsx
src/features/folders/forms/CreateFolderForm.tsx
src/features/shared/form-fields/TextField.tsx
```

Design notes:

- Keep domain forms in domain folders.
- Keep shared field wrappers reusable and UI-system aware.
- Keep API error-to-field mapping in one helper per domain.
