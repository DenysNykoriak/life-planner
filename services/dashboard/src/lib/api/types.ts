export type UserMe = {
	id: string;
	email: string;
	name: string;
	image?: string | null;
};

export type { DayPlanDto as DayPlan, PlanItemDto as PlanItem } from "@life-planner/api-client";
