# Module: Desktop Shell (Tauri 2)

Optional module. Use only if the web app also needs a desktop distribution.

## Recommended shape

- Ship the desktop shell using Tauri’s default layout next to the Vite app (see Tauri init docs for the latest folder convention).
- Map `frontendDist` to built frontend output.
- Use `devUrl` for local Vite development.

## Runtime integration

- Guard desktop-only APIs behind environment checks.
- Keep storage abstraction so web and desktop implementations can differ safely.
- Add plugins only when required (store, OS, geolocation, etc.).

## When to skip

If you only target web deployment, do not include this module.

## Desktop detection (example)

```ts
export function isTauri(): boolean {
	return typeof window !== "undefined" && "__TAURI__" in window;
}
```

## Storage adapter (example)

```ts
export interface KeyValueStore {
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<void>;
	delete(key: string): Promise<void>;
}

export function createWebStore(): KeyValueStore {
	return {
		async get(key) {
			return localStorage.getItem(key);
		},
		async set(key, value) {
			localStorage.setItem(key, value);
		},
		async delete(key) {
			localStorage.removeItem(key);
		},
	};
}

export async function createDesktopStore(): Promise<KeyValueStore> {
	const { load } = await import("@tauri-apps/plugin-store");
	const store = await load("app-store.json", { defaults: {}, autoSave: true });
	return {
		async get(key) {
			return (await store.get<string>(key)) ?? null;
		},
		async set(key, value) {
			await store.set(key, value);
			await store.save();
		},
		async delete(key) {
			await store.delete(key);
			await store.save();
		},
	};
}
```

Design notes:

- Choose the store implementation once at startup based on `isTauri()`.
- Keep Tauri plugin imports dynamic so web builds do not bundle desktop code eagerly.
