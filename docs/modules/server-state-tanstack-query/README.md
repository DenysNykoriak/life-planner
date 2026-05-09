# Module: Server State (TanStack Query)

Optional module. Use when frontend consumes remote API data and needs caching/revalidation.

## Install

- `@tanstack/react-query`

## Recommended usage

- Create one shared `QueryClient` at app root
- Keep query keys centralized by feature
- Separate read queries from write mutations
- Invalidate affected queries after successful mutations

## Conventions

- Keep API calls in dedicated client/service layer
- Keep retries and stale times explicit for critical data
- Use optimistic updates only where rollback is safe

## When to skip

If app has almost no remote state, this module can be skipped.

## Real project example

```txt
src/lib/queryClient.ts
src/lib/queryKeys/folders.ts
src/features/folders/queries/useFoldersQuery.ts
src/features/folders/mutations/useCreateFolderMutation.ts
```

Design notes:

- Keep query keys in one place per domain.
- Keep mutations and queries separate for predictable invalidation.
- Keep caching policy close to each query hook.
