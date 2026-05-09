import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/LoginPage";

export const Route = createFileRoute("/login")({
	beforeLoad: ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});
