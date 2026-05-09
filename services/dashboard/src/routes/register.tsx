import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/RegisterPage";

export const Route = createFileRoute("/register")({
	beforeLoad: ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/" });
		}
	},
	component: RegisterPage,
});
