# Module: Server-state hooks (TanStack Query)

Use this pattern when the SPA loads remote data and performs writes through small hooks instead of calling HTTP clients directly from components.

## Related docs

- Data library: `docs/modules/server-state-tanstack-query/README.md`
- Generated client: `docs/modules/api-client/README.md`
- Auth client: `docs/modules/authorization-better-auth/README.md`

## Goals

- One place per domain for reads (`useQuery`) and writes (`useMutation`).
- Stable `queryKey` shapes so invalidation stays predictable.
- UI components stay thin: they call hooks and render loading/error/data.

## Naming

- **Fetch hook** — `useThingFetch` (or `useThingsQuery`): wraps `useQuery`, returns data aliases (`items`, `rows`, …) plus `isLoading` / `error`.
- **Actions hook** — `useThingActions`: wraps several `useMutation` instances, returns an object like `{ createThing, updateThing, deleteThing }`.
- **Combined hook** — one hook returns `{ list, upload, remove }` when reads and writes are always used together and share the same key prefix.
- **Permission hook** — `useThingPermission`: thin `useQuery` calling `authClient.organization.hasPermission`, returns booleans for buttons.

## Query keys

Include every input that changes the response:

```ts
queryKey: ["folders", parentId, all];
queryKey: ["items", parentId];
queryKey: ["attachments", entityId];
```

Use `as const` shared keys when several mutations invalidate the same list:

```ts
const organizationsQueryKey = ["organizations"] as const;
```

## Fetch hook (example)

```ts
import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "./api-setup";

type Options = { parentId?: string };

export function useItemsFetch(options: Options = {}) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["items", options.parentId],
		queryFn: async () => {
			const response = await itemsApi.list({ parentId: options.parentId });
			return response.data;
		},
	});

	return { items: data, isLoading, error };
}
```

## Actions hook without optimistic UI (example)

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "./api-setup";

export function useItemsActions() {
	const queryClient = useQueryClient();

	const createItem = useMutation({
		mutationKey: ["items", "create"],
		mutationFn: async (body: { name: string }) => {
			const response = await itemsApi.create({ createItemDto: body });
			return response.data;
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});

	return { createItem };
}
```

## Actions hook with optimistic list update (example)

Cancel in-flight queries, snapshot previous cache, patch list, roll back on error, then invalidate when settled:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "./api-setup";

export function useItemsActionsOptimistic() {
	const queryClient = useQueryClient();

	const createItem = useMutation({
		mutationKey: ["items", "create"],
		mutationFn: async (dto: { name: string }) => {
			const response = await itemsApi.create({ createItemDto: dto });
			return response.data;
		},
		onMutate: async (dto) => {
			await queryClient.cancelQueries({ queryKey: ["items"] });
			const prev = queryClient.getQueryData<unknown[]>(["items"]);
			queryClient.setQueriesData({ queryKey: ["items"] }, (old: unknown[] | undefined) => {
				if (!Array.isArray(old)) return old;
				return [
					...old,
					{
						...dto,
						id: "temp-" + Date.now(),
						createdAt: new Date(),
					},
				];
			});
			return { prev };
		},
		onError: (_err, _dto, context) => {
			if (context?.prev !== undefined) {
				queryClient.setQueriesData({ queryKey: ["items"] }, context.prev);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});

	return { createItem };
}
```

## Dependent query (`enabled`) (example)

Skip network calls until required ids exist:

```ts
useQuery({
	queryKey: ["attachments", entityId],
	queryFn: () => fetchAttachments(entityId!),
	enabled: !!entityId,
});
```

## Tenant list + create (example)

Pattern for any auth or tenancy SDK: queries call the SDK; mutations invalidate shared keys on success. Replace types and method names with whatever your provider exposes.

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenantClient } from "./tenant-client-setup";

const tenantsKey = ["tenants"] as const;

export function useTenantsQuery() {
	return useQuery({
		queryKey: tenantsKey,
		queryFn: async () => {
			const result = await tenantClient.listWorkspaces();
			if (!result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
	});
}

export function useCreateTenantMutation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input: { name: string; slug: string }) => {
			const result = await tenantClient.createWorkspace(input);
			if (result.error) throw new Error(result.error.message ?? "Failed");
			return result.data;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: tenantsKey }),
	});
}
```

## Permission booleans for UI (example)

Server remains authoritative; this only hides or disables controls:

```ts
import { useQuery } from "@tanstack/react-query";
import { tenantClient } from "./tenant-client-setup";

export function useCanEditItems() {
	const { data } = useQuery({
		queryKey: ["itemEditPermissions"],
		queryFn: async () => {
			const caps = await tenantClient.resourceCapabilities("item");
			return {
				canUpdate: caps.includes("update"),
				canDelete: caps.includes("delete"),
			};
		},
	});
	return {
		canUpdate: data?.canUpdate ?? false,
		canDelete: data?.canDelete ?? false,
	};
}
```

## Manual `fetch` inside a mutation (example)

Use when multipart or routes are easier without the typed client:

```ts
import { useMutation } from "@tanstack/react-query";

export function usePreviewUpload() {
	return useMutation({
		mutationKey: ["import", "preview"],
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/import/preview`, {
				method: "POST",
				body: formData,
				credentials: "include",
				headers: {},
			});
			if (!res.ok) throw new Error(await res.text());
			return res.json();
		},
	});
}
```

Attach bearer headers the same way your app does for other authenticated requests.

## Plain async helpers next to hooks

Export functions that do not need React when callbacks or other hooks should reuse the same IO:

```ts
export async function uploadAttachment(entityId: string, file: File) {
	const response = await attachmentsApi.uploadRaw({ entityId, file });
	const json = await response.raw.json();
	if (json.data == null) throw new Error(json?.message ?? "Upload failed");
	return json.data;
}

export function useAttachments(entityId: string | null) {
	const upload = useMutation({
		mutationFn: ({ file }: { file: File }) => uploadAttachment(entityId!, file),
	});
	return { upload };
}
```

## Practices

- Keep `mutationKey` distinct per operation for DevTools clarity.
- Invalidate every query key affected by a write (related lists, detail views, permissions if cached).
- Derive view-specific shapes (`useMemo`) after `useQuery` when the API shape differs from what the UI needs.
