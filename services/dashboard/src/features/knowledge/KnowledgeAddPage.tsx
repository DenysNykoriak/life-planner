import { Alert, Box, Button, Container, Select, Stack, Text, Textarea, Title } from "@mantine/core";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useKnowledgeActions } from "@/features/knowledge/hooks/useKnowledgeActions";
import { useProjectsFetch } from "@/features/knowledge/hooks/useProjectsFetch";

export function KnowledgeAddPage() {
	const [text, setText] = useState("");
	const [projectId, setProjectId] = useState<string | null>(null);
	const { addEntry } = useKnowledgeActions();
	const { projects } = useProjectsFetch();

	const projectOptions = [
		{ value: "", label: "No project" },
		...(projects ?? []).map((p) => ({ value: p.id, label: p.name })),
	];

	const onSubmit = () => {
		if (!text.trim()) return;
		addEntry.mutate(
			{ text: text.trim(), projectId: projectId || undefined },
			{ onSuccess: () => setText("") },
		);
	};

	return (
		<Box
			style={{
				minHeight: "100%",
				background: "linear-gradient(180deg, #f7f6ff 0%, #f3f8ff 35%, #ffffff 100%)",
			}}
			pb="xl"
		>
			<Container size="sm" pt="xl">
				<Stack gap="lg">
					<div>
						<Title order={2}>Add to Knowledge Base</Title>
						<Text c="dimmed" mt={4} size="xs">
							Paste a definition, concept, or note. AI will assign topic tags automatically.
						</Text>
					</div>
					<Textarea
						placeholder="Paste your text here…"
						minRows={8}
						autosize
						value={text}
						onChange={(e) => setText(e.currentTarget.value)}
					/>
					<Select
						label="Project"
						data={projectOptions}
						value={projectId ?? ""}
						onChange={(v) => setProjectId(v || null)}
						clearable
					/>
					<Button
						leftSection={<Sparkles size={18} />}
						onClick={onSubmit}
						loading={addEntry.isPending}
						disabled={!text.trim()}
					>
						Save &amp; Categorize
					</Button>
					{addEntry.isSuccess ? (
						<Alert color="green" title="Saved">
							Entry saved. Tags are being generated in the background — check Browse in a moment.
						</Alert>
					) : null}
					{addEntry.isError ? (
						<Alert color="red" title="Could not save">
							{addEntry.error instanceof Error ? addEntry.error.message : "Unexpected error"}
						</Alert>
					) : null}
				</Stack>
			</Container>
		</Box>
	);
}
