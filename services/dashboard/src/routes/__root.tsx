import { createRootRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createRootRoute({
	beforeLoad: async () => {
		const { data } = await authClient.getSession();
		return { session: data };
	},
	component: () => <Outlet />,
});
