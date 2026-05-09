import { BETTER_AUTH_BEARER_STORAGE_KEY } from "@life-planner/api-client";
import { createAuthClient } from "better-auth/react";

const authFetch: typeof fetch = async (input, init) => {
	const res = await fetch(input, { ...init, credentials: "include" });
	const token = res.headers.get("set-auth-token");
	if (token && typeof localStorage !== "undefined") {
		localStorage.setItem(BETTER_AUTH_BEARER_STORAGE_KEY, token);
	}
	return res;
};

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
	basePath: "/auth",
	fetchOptions: {
		credentials: "include",
		customFetchImpl: authFetch,
		auth: {
			type: "Bearer",
			token: () =>
				typeof localStorage !== "undefined"
					? (localStorage.getItem(BETTER_AUTH_BEARER_STORAGE_KEY) ?? "")
					: "",
		},
	},
});
