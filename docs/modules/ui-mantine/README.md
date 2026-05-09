# Module: UI System (Mantine)

Use this module when you need a component library and design system foundation for React apps.

## Why this module

Mantine gives a cohesive component set and theme layer instead of assembling many small UI libraries.

## Core packages

- `@mantine/core`
- `@mantine/hooks`

Add extra packages only if needed (`@mantine/form`, `@mantine/notifications`, `@mantine/dates`, ...).

## Icons

Use Lucide for icons (`lucide-react`). Import only the icons you need so bundles stay small.

```tsx
import { Camera, Trash2 } from "lucide-react";
import { ActionIcon, Button } from "@mantine/core";

export function Example() {
	return (
		<>
			<Button leftSection={<Camera size={18} />}>Photo</Button>
			<ActionIcon variant="subtle" aria-label="Delete">
				<Trash2 size={18} />
			</ActionIcon>
		</>
	);
}
```

## Setup notes

- Follow Mantine Vite setup (PostCSS pipeline as required by your Mantine major version).
- Wrap the tree with `MantineProvider` at the root.
- Centralize theme tokens (`colors`, `radius`, `spacing`, typography) in one theme object.

## Best practices

- Prefer Mantine components first, custom primitives second.
- Keep shared UI wrappers small and consistent.
- Avoid mixing multiple UI systems in the same app.

## Theme + provider (example)

```tsx
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	fontFamily: "system-ui, sans-serif",
	defaultRadius: "md",
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider defaultColorScheme="light" theme={theme}>
			{children}
		</MantineProvider>
	);
}
```

Design notes:

- Extend the theme object as product visual language stabilizes.
- Keep feature-specific styling local to components instead of growing global CSS.
