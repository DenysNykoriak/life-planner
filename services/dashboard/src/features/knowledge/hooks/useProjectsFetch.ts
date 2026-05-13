import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/api/client";
import { projectKeys } from "@/lib/queryKeys";

export function useProjectsFetch() {
	const {
		data: projects,
		isLoading,
		error,
	} = useQuery({
		queryKey: projectKeys.all,
		queryFn: getProjects,
	});
	return { projects, isLoading, error };
}
