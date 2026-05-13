import { useQuery } from "@tanstack/react-query";
import { getKnowledgeQueue } from "@/lib/api/client";
import { knowledgeKeys } from "@/lib/queryKeys";

export function useKnowledgeQueue() {
	const { data: queue } = useQuery({
		queryKey: knowledgeKeys.queue,
		queryFn: getKnowledgeQueue,
		refetchInterval: 2000,
	});
	return { queue: queue ?? [] };
}
