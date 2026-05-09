# Module: Desktop Shell (Tauri 2)

Optional module. Use only if the web app also needs a desktop distribution.

## Recommended shape

- Keep Tauri project beside frontend app (`src-tauri/` + web source).
- Map `frontendDist` to built frontend output.
- Use `devUrl` for local Vite development.

## Runtime integration

- Guard desktop-only APIs behind environment checks.
- Keep storage abstraction so web and desktop implementations can differ safely.
- Add plugins only when required (store, OS, geolocation, etc.).

## When to skip

If you only target web deployment, do not include this module.

## Real project example

```txt
services/dashboard/src-tauri/
services/dashboard/src/lib/platform.ts
services/dashboard/src/lib/storage/webStore.ts
services/dashboard/src/lib/storage/tauriStore.ts
```

Design notes:

- Keep platform checks in one adapter module.
- Keep web and desktop storage implementations behind same interface.
- Keep Tauri plugin usage isolated from generic feature code.
