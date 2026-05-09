import { useQueries } from "@tanstack/react-query";
import { getDayPlan } from "@/lib/api/client";
import { planKeys } from "@/lib/queryKeys";

export type UsePlansFetchOptions = {
	yesterdayTs: number;
	tomorrowTs: number;
	enabled: boolean;
};

export function usePlansFetch({ yesterdayTs, tomorrowTs, enabled }: UsePlansFetchOptions) {
	const [yesterdayQuery, tomorrowQuery] = useQueries({
		queries: [
			{
				queryKey: planKeys.day(yesterdayTs),
				queryFn: () => getDayPlan(yesterdayTs),
				enabled,
			},
			{
				queryKey: planKeys.day(tomorrowTs),
				queryFn: () => getDayPlan(tomorrowTs),
				enabled,
			},
		],
	});

	return {
		yesterdayPlan: yesterdayQuery.data,
		tomorrowPlan: tomorrowQuery.data,
		isLoading: yesterdayQuery.isPending || tomorrowQuery.isPending,
		error: yesterdayQuery.error ?? tomorrowQuery.error,
	};
}
