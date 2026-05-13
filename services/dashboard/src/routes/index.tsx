import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		throw redirect({ to: context.session?.user ? "/planner" : "/login" });
	},
	component: () => null,
});
