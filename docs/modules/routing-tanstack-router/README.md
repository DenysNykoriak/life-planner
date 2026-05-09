# Module: Routing (TanStack Router)

Optional module. Add only when SPA navigation, layouts, or route-level data handling is required.

## Install

- `@tanstack/react-router`
- `@tanstack/router-plugin` (for Vite integration)

## Recommended usage

- Prefer file-based routes for medium/large apps.
- Keep the generated route tree read-only.
- Keep every file route module in one folder so URLs stay easy to trace.

## Conventions

- Define one root route for shared layout and providers.
- Keep auth checks at route boundaries (`beforeLoad`, loaders, or layout routes).
- Use `createFileRoute` per route file.

## Vite plugin (example)

```ts
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tanstackRouter(), react()],
});
```

## Router bootstrap (example)

```tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
```

The plugin emits a generated route tree module (filename depends on plugin settings); treat it as read-only.

## Root layout route (example)

```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<Outlet />
		</>
	),
});
```

## Protected screen (example)

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
	beforeLoad: async ({ context }) => {
		if (context.session) {
			throw redirect({ to: "/" });
		}
	},
	component: SignIn,
});

function SignIn() {
	return null;
}
```

Wire `context.session` from your router setup or loader layer.

## When to skip

For simple single-screen apps, skip this module.
