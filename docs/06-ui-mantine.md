# UI system — Mantine

Use **Mantine** instead of Tailwind + DaisyUI when building dashboards or apps that need a component library.

Official setup: [Mantine — Getting started](https://mantine.dev/getting-started/) (Vite guide recommended for SPA).

## Packages

- Minimum: `@mantine/core`, `@mantine/hooks`
- Add others only when needed: `@mantine/form`, `@mantine/dates`, `@mantine/notifications`, etc.

## PostCSS (required by Mantine’s default workflow)

Install dev deps:

- `postcss`, `postcss-preset-mantine`, `postcss-simple-vars`

Add `postcss.config.cjs` at the **app root** (e.g. `services/dashboard/`):

```js
module.exports = {
	plugins: {
		"postcss-preset-mantine": {},
		"postcss-simple-vars": {
			variables: {
				"mantine-breakpoint-xs": "36em",
				"mantine-breakpoint-sm": "48em",
				"mantine-breakpoint-md": "62em",
				"mantine-breakpoint-lg": "75em",
				"mantine-breakpoint-xl": "88em",
			},
		},
	},
};
```
