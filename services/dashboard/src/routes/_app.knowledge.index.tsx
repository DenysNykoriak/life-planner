import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeAddPage } from "@/features/knowledge/KnowledgeAddPage";

export const Route = createFileRoute("/_app/knowledge/")({
	component: KnowledgeAddPage,
});
