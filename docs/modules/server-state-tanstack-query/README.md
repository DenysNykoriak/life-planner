# Module: Server State (TanStack Query)

Optional module. Use when frontend consumes remote API data and needs caching/revalidation.

Hook naming, keys, and mutation patterns: `docs/modules/server-state-hooks/README.md`.

## Install

- `@tanstack/react-query`

## Recommended usage

- Create one shared `QueryClient` at app root
- Keep query keys centralized by domain
- Separate read queries from write mutations
- Invalidate affected queries after successful mutations

## Conventions

- Keep API calls in dedicated client/service layer
- Keep retries and stale times explicit for critical data
- Use optimistic updates only where rollback is safe

## When to skip

If app has almost no remote state, this module can be skipped.

## Provider setup (example)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

## Query + mutation (example)

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const itemsKey = ["items"] as const;

export function useItemsQuery() {
	return useQuery({
		queryKey: itemsKey,
		queryFn: fetchItems,
	});
}

export function useCreateItemMutation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createItem,
		onSuccess: () => qc.invalidateQueries({ queryKey: itemsKey }),
	});
}
```

Design notes:

- Keep query keys in one place per domain.
- Keep mutations and queries separate for predictable invalidation.
