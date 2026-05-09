# Module: Frontend Baseline (React + Vite + TypeScript)

Use this as the default frontend baseline.

## Scope

- React SPA with Vite
- TypeScript strict mode
- UI module selected separately (Mantine recommended)
- Icons: Lucide (`lucide-react`) as the default icon set

## Required practices

- Keep entrypoint small and predictable
- Keep framework providers centralized
- Keep feature UI separated from generic primitives
- Keep TypeScript errors at zero

## Optional integrations

- Routing: `docs/modules/routing-tanstack-router/README.md`
- Forms: `docs/modules/forms-tanstack-form/README.md`
- i18n: `docs/modules/i18n-i18next/README.md`
- Server state: `docs/modules/server-state-tanstack-query/README.md`
- Server-state hooks: `docs/modules/server-state-hooks/README.md`
- UI: `docs/modules/ui-mantine/README.md`
- Authorization: `docs/modules/authorization-better-auth/README.md`

## Entry wiring (example)

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Root() {
	return (
		<>
			{/* RouterProvider, MantineProvider, i18n, etc. */}
			<h1>App</h1>
		</>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Root />
	</StrictMode>,
);
```

Combine providers in one place so feature code stays declarative.

Design notes:

- When using TanStack Router file routing, follow `docs/modules/routing-tanstack-router/README.md` for plugin + generated route tree wiring.
- Keep HTTP clients and auth helpers behind small modules consumed by hooks or route loaders.
