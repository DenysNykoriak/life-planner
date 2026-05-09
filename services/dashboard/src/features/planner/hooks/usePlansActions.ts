import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type PlanItemWrite, putDayPlan } from "@/lib/api/client";
import { planKeys } from "@/lib/queryKeys";

export type SaveEveningReviewInput = {
	yesterdayTs: number;
	tomorrowTs: number;
	yesterdayItems: PlanItemWrite[];
	tomorrowItems: PlanItemWrite[];
};

export function usePlansActions() {
	const queryClient = useQueryClient();

	const saveEveningReview = useMutation({
		mutationKey: ["plans", "saveEveningReview"] as const,
		mutationFn: async ({
			yesterdayTs,
			tomorrowTs,
			yesterdayItems,
			tomorrowItems,
		}: SaveEveningReviewInput) => {
			await putDayPlan(yesterdayTs, yesterdayItems);
			await putDayPlan(tomorrowTs, tomorrowItems);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: planKeys.all });
		},
	});

	return { saveEveningReview };
}
