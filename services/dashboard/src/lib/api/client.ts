import {
	createLifePlannerApiClient,
	FetchError,
	ResponseError,
	type UpdatePlanDto,
} from "@life-planner/api-client";
import type { DayPlan, KnowledgeEntry, Project } from "./types";

const origin = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const api = createLifePlannerApiClient(origin);

async function messageFromResponse(res: Response): Promise<string> {
	const text = await res.text();
	try {
		const j = JSON.parse(text) as { message?: string | string[] };
		if (Array.isArray(j.message)) return j.message.join(", ");
		if (typeof j.message === "string") return j.message;
	} catch {
		/* ignore */
	}
	return text || res.statusText;
}

async function mapApiError(error: unknown): Promise<never> {
	if (error instanceof ResponseError) {
		throw new Error(await messageFromResponse(error.response));
	}
	if (error instanceof FetchError) {
		throw new Error(error.message);
	}
	if (error instanceof Error) {
		throw error;
	}
	throw new Error(String(error));
}

export type PlanItemWrite = {
	text: string;
	completed: boolean;
	depth: number;
};

export async function getDayPlan(dayTimestampMs: number): Promise<DayPlan> {
	try {
		return await api.plans.getPlansDay(dayTimestampMs);
	} catch (e) {
		return mapApiError(e);
	}
}

export async function getKnowledgeQueue(): Promise<{ id: string; position: number }[]> {
	try {
		return await api.knowledge.getKnowledgeQueue();
	} catch (e) {
		return mapApiError(e);
	}
}

export async function getKnowledgeEntries(): Promise<KnowledgeEntry[]> {
	try {
		return await api.knowledge.getKnowledge();
	} catch (e) {
		return mapApiError(e);
	}
}

export async function createKnowledgeEntry(
	text: string,
	projectId?: string,
): Promise<KnowledgeEntry> {
	try {
		return await api.knowledge.postKnowledge({ text, projectId });
	} catch (e) {
		return mapApiError(e);
	}
}

export async function updateKnowledgeEntry(
	id: string,
	dto: { text?: string; projectId?: string | null },
): Promise<KnowledgeEntry> {
	try {
		return await api.knowledge.patchKnowledge(id, dto);
	} catch (e) {
		return mapApiError(e);
	}
}

export async function deleteKnowledgeEntry(id: string): Promise<void> {
	try {
		return await api.knowledge.deleteKnowledge(id);
	} catch (e) {
		return mapApiError(e);
	}
}

export async function getProjects(): Promise<Project[]> {
	try {
		return await api.projects.getProjects();
	} catch (e) {
		return mapApiError(e);
	}
}

export async function createProject(name: string): Promise<Project> {
	try {
		return await api.projects.postProject({ name });
	} catch (e) {
		return mapApiError(e);
	}
}

export async function deleteProject(id: string): Promise<void> {
	try {
		return await api.projects.deleteProject(id);
	} catch (e) {
		return mapApiError(e);
	}
}

export async function putDayPlan(dayTimestampMs: number, items: PlanItemWrite[]): Promise<DayPlan> {
	const body: UpdatePlanDto = {
		items: items.map((i) => ({
			text: i.text,
			completed: i.completed,
			depth: i.depth ?? 0,
		})),
	};
	try {
		return await api.plans.putPlansDay(dayTimestampMs, body);
	} catch (e) {
		return mapApiError(e);
	}
}
