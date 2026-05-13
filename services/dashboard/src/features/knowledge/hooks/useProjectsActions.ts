import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject } from "@/lib/api/client";
import { projectKeys } from "@/lib/queryKeys";

export function useProjectsActions() {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: projectKeys.all });

	const addProject = useMutation({
		mutationFn: (name: string) => createProject(name),
		onSettled: invalidate,
	});

	const removeProject = useMutation({
		mutationFn: (id: string) => deleteProject(id),
		onSettled: invalidate,
	});

	return { addProject, removeProject };
}
