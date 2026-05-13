import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKnowledgeEntry, deleteKnowledgeEntry, updateKnowledgeEntry } from "@/lib/api/client";
import { knowledgeKeys } from "@/lib/queryKeys";

export function useKnowledgeActions() {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: knowledgeKeys.all });

	const addEntry = useMutation({
		mutationFn: ({ text, projectId }: { text: string; projectId?: string }) =>
			createKnowledgeEntry(text, projectId),
		onSettled: invalidate,
	});

	const editEntry = useMutation({
		mutationFn: ({
			id,
			text,
			projectId,
		}: {
			id: string;
			text?: string;
			projectId?: string | null;
		}) => updateKnowledgeEntry(id, { text, projectId }),
		onSettled: invalidate,
	});

	const removeEntry = useMutation({
		mutationFn: (id: string) => deleteKnowledgeEntry(id),
		onSettled: invalidate,
	});

	return { addEntry, editEntry, removeEntry };
}
