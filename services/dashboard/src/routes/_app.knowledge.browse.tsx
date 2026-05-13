import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeBrowsePage } from "@/features/knowledge/KnowledgeBrowsePage";

export const Route = createFileRoute("/_app/knowledge/browse")({
	component: KnowledgeBrowsePage,
});
