import { getDayPlan, type PlanItemWrite, putDayPlan } from "@/lib/api/client";
import type { DayPlan } from "@/lib/api/types";

export async function fetchDayPlan(dayTimestampMs: number): Promise<DayPlan> {
	return getDayPlan(dayTimestampMs);
}

export async function saveDayPlan(
	dayTimestampMs: number,
	items: PlanItemWrite[],
): Promise<DayPlan> {
	return putDayPlan(dayTimestampMs, items);
}
