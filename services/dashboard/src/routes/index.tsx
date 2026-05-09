import { createFileRoute, redirect } from "@tanstack/react-router";
import { PlannerPage } from "@/features/planner/PlannerPage";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/login" });
		}
	},
	component: PlannerPage,
});
