import { BETTER_AUTH_BEARER_STORAGE_KEY } from "./constants";
import { Configuration, KnowledgeApi, PlansApi, ProjectsApi } from "./generated/index";

export type LifePlannerApiClient = {
	plans: PlansApi;
	knowledge: KnowledgeApi;
	projects: ProjectsApi;
};

export function createLifePlannerApiClient(apiOrigin: string): LifePlannerApiClient {
	const basePath = `${apiOrigin.replace(/\/$/, "")}/api`;
	const configuration = new Configuration({
		basePath,
		credentials: "include",
		fetchApi: async (url, init) => {
			const headers = new Headers(init?.headers);
			if (typeof localStorage !== "undefined") {
				const token = localStorage.getItem(BETTER_AUTH_BEARER_STORAGE_KEY) ?? "";
				if (token) {
					headers.set("Authorization", `Bearer ${token}`);
				}
			}
			const res = await fetch(url, { ...init, headers, credentials: "include" });
			if (typeof localStorage !== "undefined") {
				const next = res.headers.get("set-auth-token");
				if (next) {
					localStorage.setItem(BETTER_AUTH_BEARER_STORAGE_KEY, next);
				}
			}
			return res;
		},
	});
	return {
		plans: new PlansApi(configuration),
		knowledge: new KnowledgeApi(configuration),
		projects: new ProjectsApi(configuration),
	};
}
