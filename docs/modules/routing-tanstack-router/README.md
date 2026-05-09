# Module: Routing (TanStack Router)

Optional module. Add only when SPA navigation, layouts, or route-level data handling is required.

## Install

- `@tanstack/react-router`
- `@tanstack/router-plugin` (for Vite integration)

## Recommended usage

- Prefer file-based routes for medium/large apps.
- Keep route tree generated and out of manual edits.
- Co-locate route components with route-level logic.

## Conventions

- Define one app root route for shared layout/providers.
- Keep auth/permission checks at route boundaries.
- For simple single-screen apps, skip this module.

## Real project example

```txt
src/routes/__root.tsx
src/routes/sign-in.tsx
src/routes/sign-up.tsx
src/routes/folders.tsx
src/routeTree.gen.ts
```

Design notes:

- Keep route file names close to URL intent.
- Keep shared providers in root route only.
- Keep generated route tree committed or regenerated in CI.
