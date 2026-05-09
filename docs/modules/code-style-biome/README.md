# Module: Code Style (Biome)

Use this module as the default formatter/linter setup for the whole repo.

## Recommended defaults

- Tabs
- Line width: 100
- LF line endings
- Double quotes
- Semicolons always
- Trailing commas where valid
- Import organization enabled

## Practical setup

- Keep one root Biome config for workspace-wide rules.
- Ignore generated/build outputs (`dist`, `build`, `coverage`, `generated`, `node_modules`).
- Use overrides only when framework-specific parsing is required (example: decorator-heavy Nest files).

## CI and local workflow

- Root script: `biome check .`
- Optional auto-fix: `biome check --write .`
- Run in CI before build/test steps to fail fast on style issues.

## Example Biome config

```json
{
	"$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	},
	"files": {
		"ignore": ["node_modules/**", "dist/**", "build/**", "coverage/**", "generated/**"]
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab",
		"lineEnding": "lf",
		"lineWidth": 100
	},
	"organizeImports": {
		"enabled": true
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "double",
			"semicolons": "always",
			"trailingCommas": "all"
		}
	},
	"overrides": [
		{
			"include": ["**/nest-backend/**/*.ts"],
			"javascript": {
				"parser": {
					"unsafeParameterDecoratorsEnabled": true
				}
			}
		}
	]
}
```

Adjust `include` globs to match wherever you keep Nest sources.

Design notes:

- Keep root Biome config as single source of truth.
- Keep per-package scripts thin: call the same root command.
