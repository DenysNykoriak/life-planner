import { BETTER_AUTH_BEARER_STORAGE_KEY } from "@life-planner/api-client";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import type { UserMe } from "@/lib/api/types";
import { authClient } from "@/lib/auth-client";

type AuthContextValue = {
	user: UserMe | null;
	ready: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name?: string) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(u: { id: string; email: string; name: string; image?: string | null }): UserMe {
	return {
		id: u.id,
		email: u.email,
		name: u.name,
		image: u.image,
	};
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data: sessionData, isPending } = authClient.useSession();
	const user = sessionData?.user ? mapUser(sessionData.user) : null;

	const login = useCallback(async (email: string, password: string) => {
		const { error } = await authClient.signIn.email({
			email,
			password,
		});
		if (error) {
			throw new Error(error.message ?? "Login failed");
		}
	}, []);

	const register = useCallback(async (email: string, password: string, name?: string) => {
		const displayName = name?.trim() || email.split("@")[0] || "User";
		const { error } = await authClient.signUp.email({
			email,
			password,
			name: displayName,
		});
		if (error) {
			throw new Error(error.message ?? "Registration failed");
		}
	}, []);

	const logout = useCallback(async () => {
		await authClient.signOut();
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem(BETTER_AUTH_BEARER_STORAGE_KEY);
		}
	}, []);

	const value = useMemo(
		() => ({
			user,
			ready: !isPending,
			login,
			register,
			logout,
		}),
		[user, isPending, login, register, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return ctx;
}
