import { useQuery } from "@tanstack/react-query";
import { getKnowledgeEntries } from "@/lib/api/client";
import { knowledgeKeys } from "@/lib/queryKeys";

export function useKnowledgeFetch() {
	const { data: entries, isLoading, error } = useQuery({
		queryKey: knowledgeKeys.all,
		queryFn: getKnowledgeEntries,
		refetchInterval: (query) =>
			query.state.data?.some((e) => e.tags.length === 0) ? 2000 : false,
	});
	return { entries, isLoading, error };
}
