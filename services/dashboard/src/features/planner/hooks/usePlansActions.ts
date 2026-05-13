import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type PlanItemWrite, putDayPlan } from "@/lib/api/client";
import { planKeys } from "@/lib/queryKeys";

export type SaveDayPlanInput = {
	dayTs: number;
	items: PlanItemWrite[];
};

export function usePlansActions() {
	const queryClient = useQueryClient();

	const mutationFn = async ({ dayTs, items }: SaveDayPlanInput) => {
		await putDayPlan(dayTs, items);
	};

	const onSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: planKeys.all });
	};

	const saveYesterdayPlan = useMutation({
		mutationKey: ["plans", "saveYesterday"] as const,
		mutationFn,
		onSettled,
	});

	const saveTomorrowPlan = useMutation({
		mutationKey: ["plans", "saveTomorrow"] as const,
		mutationFn,
		onSettled,
	});

	return { saveYesterdayPlan, saveTomorrowPlan };
}
