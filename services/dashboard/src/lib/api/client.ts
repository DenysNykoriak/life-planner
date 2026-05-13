import {
	createLifePlannerApiClient,
	FetchError,
	ResponseError,
	type UpdatePlanDto,
} from "@life-planner/api-client";
import type { DayPlan } from "./types";

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
