export type UserMe = {
	id: string;
	email: string;
	name: string;
	image?: string | null;
};

export type {
	DayPlanDto as DayPlan,
	KnowledgeEntryDto as KnowledgeEntry,
	PlanItemDto as PlanItem,
	ProjectDto as Project,
} from "@life-planner/api-client";
