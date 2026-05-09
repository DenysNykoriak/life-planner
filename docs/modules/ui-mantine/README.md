# Module: UI System (Mantine)

Use this module when you need a component library and design system foundation for React apps.

## Why this module

Mantine replaces Tailwind + DaisyUI in this docs baseline.

## Core packages

- `@mantine/core`
- `@mantine/hooks`

Add extra packages only if needed (`@mantine/form`, `@mantine/notifications`, `@mantine/dates`, ...).

## Setup notes

- Follow Mantine Vite setup.
- Keep PostCSS config required by Mantine preset.
- Wrap app with `MantineProvider` at entry/root.
- Centralize theme tokens (`colors`, `radius`, `spacing`, typography) in one theme file.

## Best practices

- Prefer Mantine components first, custom primitives second.
- Keep shared UI wrappers in one module (`ui/` or similar).
- Avoid mixing multiple UI systems in the same app.

## Real project example

```txt
src/theme/index.ts
src/app/providers/MantineProvider.tsx
src/components/common/AppShell.tsx
src/components/common/ConfirmModal.tsx
```

Design notes:

- Keep all theme tokens in `theme/index.ts`.
- Keep design-system wrappers in `components/common`.
- Keep feature-specific styling in feature folders, not global theme.
