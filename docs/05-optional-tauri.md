# Optional: Tauri 2 desktop shell

Same as before: `src-tauri/` beside the Vite app, `frontendDist` → `dist`, `devUrl` → Vite URL.

- Frontend: detect `window.__TAURI__`; use `@tauri-apps/plugin-store` when persistent secure storage is needed.

See Tauri v2 docs alongside your chosen UI stack (Mantine works as normal React components).
