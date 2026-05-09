# Module: Internationalization (i18next)

Optional module. Add only when multiple locales are a real product requirement.

## Install

- `i18next`
- `react-i18next`

## Translation code style options

Pick one style and keep it consistent across the app.

### Style A: Namespace per domain (recommended)

One folder per locale; JSON files per namespace (`common`, `auth`, …).

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

Keep small JSON files per feature and merge at startup. Use only if you have a clear merge strategy.

## Initialization (example)

Single bundle import style:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import uk from "./locales/uk.json";

const resources = {
	en: { translation: en },
	uk: { translation: uk },
};

export function initI18n(activeLocale: string): void {
	i18n.use(initReactI18next).init({
		resources,
		lng: activeLocale,
		fallbackLng: "en",
		interpolation: { escapeValue: false },
	});
}
```

## Sample dictionary excerpt

```json
{
	"signIn": {
		"title": "Welcome back",
		"email": "Email",
		"password": "Password",
		"submit": "Sign in",
		"invalidEmail": "Invalid email address",
		"passwordRequired": "Password is required"
	}
}
```

## Conventions

- Initialize i18n before first render if you want to avoid untranslated flash.
- Keep stable translation keys.
- Keep one source of truth for active locale (user settings + persistence).
- Avoid string concatenation for translated sentences.
- Prefer interpolation values over building strings in code.

## When to skip

If product has one language for now, skip this module until real translation needs appear.
