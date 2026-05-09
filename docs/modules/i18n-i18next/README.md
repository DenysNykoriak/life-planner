# Module: Internationalization (i18next)

Optional module. Add only when multiple locales are a real product requirement.

## Install

- `i18next`
- `react-i18next`

## Suggested structure

- locale resources under `src/locales/*`
- i18n initialization in one library file (`src/lib/i18n.ts` or equivalent)

## Translation code style options

Pick one style and keep it consistent across the app.

### Style A: Namespace per domain (recommended)

```txt
src/locales/
  en/
    common.json
    auth.json
    settings.json
  uk/
    common.json
    auth.json
    settings.json
```

```json
{
	"buttons": {
		"save": "Save",
		"cancel": "Cancel"
	}
}
```

Usage:

```ts
t("buttons.save", { ns: "common" });
```

### Style B: Flat keys with prefixes

```json
{
	"common.buttons.save": "Save",
	"auth.signIn.title": "Sign in"
}
```

Usage:

```ts
t("auth.signIn.title");
```

### Style C: Feature-local dictionaries + merge

```txt
src/features/auth/i18n/en.json
src/features/auth/i18n/uk.json
src/features/profile/i18n/en.json
src/features/profile/i18n/uk.json
```

Use this only if app is strongly feature-modular and you have a merge step at startup/build.

## Conventions

- Initialize i18n before first render if you want to avoid untranslated flash.
- Keep stable translation keys.
- Keep one source of truth for active locale (user settings + persistence).
- Avoid string concatenation for translated sentences.
- Prefer interpolation values over building strings in code.

## Real project example

```txt
src/lib/i18n.ts
src/components/LocaleSync.tsx
src/components/LocalePicker.tsx
src/locales/en/common.json
src/locales/uk/common.json
```

Example key naming:

- `common.buttons.save`
- `auth.signIn.title`
- `folders.emptyState.description`

## When to skip

If product has one language for now, skip this module until real translation needs appear.
