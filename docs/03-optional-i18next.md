# Optional: i18n — i18next + react-i18next

Use when the product needs **translations**.

## Install

- `i18next`, `react-i18next`

## Structure

- `src/locales/<lang>.json` — namespaces or flat keys (pick one convention per app).
- `src/lib/i18n.ts` — `initReactI18next`, resources, fallback language.

## Conventions

- Initialize i18n **before** first render if you need zero flash of untranslated strings.
- Sync locale with persisted preference (localStorage / Tauri store) in a tiny `LocaleSync` component or equivalent.

## Code style

- Keys: stable, descriptive; avoid embedding English sentences as keys in new code if you use namespaces.
