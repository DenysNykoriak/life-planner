import {
	ActionIcon,
	Autocomplete,
	Badge,
	Box,
	Button,
	Card,
	Center,
	Container,
	Divider,
	Group,
	Loader,
	Modal,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import { Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useKnowledgeActions } from "@/features/knowledge/hooks/useKnowledgeActions";
import { useKnowledgeFetch } from "@/features/knowledge/hooks/useKnowledgeFetch";
import { useKnowledgeQueue } from "@/features/knowledge/hooks/useKnowledgeQueue";
import { useProjectsActions } from "@/features/knowledge/hooks/useProjectsActions";
import { useProjectsFetch } from "@/features/knowledge/hooks/useProjectsFetch";
import type { KnowledgeEntry } from "@/lib/api/types";

export function KnowledgeBrowsePage() {
	const { entries, isLoading, error } = useKnowledgeFetch();
	const { projects } = useProjectsFetch();
	const { editEntry, removeEntry } = useKnowledgeActions();
	const { addProject } = useProjectsActions();
	const { queue } = useKnowledgeQueue();
	const queueMap = useMemo(() => new Map(queue.map((item) => [item.id, item.position])), [queue]);

	// Filters
	const [tagSearch, setTagSearch] = useState("");
	const [textSearch, setTextSearch] = useState("");
	const [projectFilter, setProjectFilter] = useState<string>("all");

	// Edit modal
	const [editTarget, setEditTarget] = useState<KnowledgeEntry | null>(null);
	const [editText, setEditText] = useState("");
	const [editProjectId, setEditProjectId] = useState<string | null>(null);
	const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);

	// Delete confirmation
	const [deleteTarget, setDeleteTarget] = useState<KnowledgeEntry | null>(null);
	const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

	// New project modal
	const [newProjectName, setNewProjectName] = useState("");
	const [projectModalOpened, { open: openProjectModal, close: closeProjectModal }] =
		useDisclosure(false);

	const allTags = useMemo(() => {
		const set = new Set<string>();
		for (const e of entries ?? []) {
			for (const t of e.tags) set.add(t);
		}
		return Array.from(set).sort();
	}, [entries]);

	const filtered = useMemo(() => {
		let result = entries ?? [];
		if (projectFilter === "none") {
			result = result.filter((e) => e.projectId == null);
		} else if (projectFilter !== "all") {
			result = result.filter((e) => e.projectId === projectFilter);
		}
		if (tagSearch.trim()) {
			const q = tagSearch.trim().toLowerCase();
			result = result.filter((e) => e.tags.some((t) => t.toLowerCase().includes(q)));
		}
		if (textSearch.trim()) {
			const q = textSearch.trim().toLowerCase();
			result = result.filter((e) => e.rawText.toLowerCase().includes(q));
		}
		return result;
	}, [entries, projectFilter, tagSearch, textSearch]);

	const projectSelectData = [
		{ value: "", label: "No project" },
		...(projects ?? []).map((p) => ({ value: p.id, label: p.name })),
	];

	const projectFilterData = [
		{ value: "all", label: "All entries" },
		{ value: "none", label: "No project" },
		...(projects ?? []).map((p) => ({ value: p.id, label: p.name })),
	];

	const handleEditOpen = (entry: KnowledgeEntry) => {
		setEditTarget(entry);
		setEditText(entry.rawText);
		setEditProjectId(entry.projectId ?? null);
		openEdit();
	};

	const handleEditSave = () => {
		if (!editTarget) return;
		const textChanged = editText.trim() !== editTarget.rawText;
		editEntry.mutate(
			{
				id: editTarget.id,
				text: textChanged ? editText.trim() : undefined,
				projectId: editProjectId,
			},
			{ onSuccess: closeEdit },
		);
	};

	const handleDeleteOpen = (entry: KnowledgeEntry) => {
		setDeleteTarget(entry);
		openDelete();
	};

	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		removeEntry.mutate(deleteTarget.id, { onSuccess: closeDelete });
	};

	const handleProjectChange = (entry: KnowledgeEntry, value: string | null) => {
		editEntry.mutate({ id: entry.id, projectId: value || null });
	};

	const handleCreateProject = () => {
		if (!newProjectName.trim()) return;
		addProject.mutate(newProjectName.trim(), {
			onSuccess: () => {
				setNewProjectName("");
				closeProjectModal();
			},
		});
	};

	if (isLoading) {
		return (
			<Center style={{ minHeight: "100%" }} py="xl">
				<Loader />
			</Center>
		);
	}

	return (
		<Box
			style={{
				minHeight: "100%",
				background: "linear-gradient(180deg, #f7f6ff 0%, #f3f8ff 35%, #ffffff 100%)",
			}}
			pb="xl"
		>
			<Container size="md" pt="xl">
				<Stack gap="xl">
					{/* Header */}
					<Group justify="space-between" align="flex-end">
						<div>
							<Title order={2}>Browse Knowledge</Title>
							<Text c="dimmed" mt={4} size="xs">
								{filtered.length} of {entries?.length ?? 0}{" "}
								{entries?.length === 1 ? "entry" : "entries"}
							</Text>
						</div>
						<Button
							variant="light"
							color="ink"
							size="sm"
							leftSection={<Plus size={16} />}
							onClick={openProjectModal}
						>
							New project
						</Button>
					</Group>

					{/* Filters */}
					<Card withBorder padding="sm" radius="md">
						<Group gap="sm" wrap="wrap">
							<Autocomplete
								placeholder="Search by tag…"
								data={allTags}
								value={tagSearch}
								onChange={setTagSearch}
								leftSection={<Search size={14} />}
								style={{ flex: 1, minWidth: 160 }}
								size="sm"
							/>
							<TextInput
								placeholder="Search in text…"
								value={textSearch}
								onChange={(e) => setTextSearch(e.currentTarget.value)}
								leftSection={<Search size={14} />}
								style={{ flex: 1, minWidth: 160 }}
								size="sm"
							/>
							<Select
								data={projectFilterData}
								value={projectFilter}
								onChange={(v) => setProjectFilter(v ?? "all")}
								style={{ minWidth: 160 }}
								size="sm"
							/>
						</Group>
					</Card>

					{error ? (
						<Text c="red" size="sm">
							{error instanceof Error ? error.message : "Could not load entries"}
						</Text>
					) : null}

					{filtered.length === 0 && !error ? (
						<Text c="dimmed">No entries match the current filters.</Text>
					) : null}

					{/* Entries */}
					<Stack gap="md">
						{filtered.map((entry) => (
							<Card key={entry.id} withBorder shadow="sm" radius="lg" padding="lg">
								<Stack gap="sm">
									<Group justify="space-between" align="flex-start" wrap="nowrap">
										<Text size="sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, flex: 1 }}>
											{entry.rawText}
										</Text>
										<Group gap={4} style={{ flexShrink: 0 }}>
											<ActionIcon
												variant="subtle"
												color="gray"
												size="sm"
												onClick={() => handleEditOpen(entry)}
											>
												<Pencil size={14} />
											</ActionIcon>
											<ActionIcon
												variant="subtle"
												color="violet"
												size="sm"
												onClick={() =>
													modals.openConfirmModal({
														title: "Regenerate tags",
														children: (
															<Text size="sm">
																AI will re-analyze this entry and replace the current tags.
															</Text>
														),
														labels: { confirm: "Regenerate", cancel: "Cancel" },
														confirmProps: { color: "ink" },
														onConfirm: () =>
															editEntry.mutate({ id: entry.id, text: entry.rawText }),
													})
												}
											>
												<RefreshCw size={14} />
											</ActionIcon>
											<ActionIcon
												variant="subtle"
												color="red"
												size="sm"
												onClick={() => handleDeleteOpen(entry)}
											>
												<Trash2 size={14} />
											</ActionIcon>
										</Group>
									</Group>

									<Divider />

									<Group justify="space-between" align="center" wrap="wrap" gap="xs">
										<Group gap={6} wrap="wrap">
											{entry.tags.length === 0 ? (
												queueMap.has(entry.id) ? (
													<Badge variant="dot" color="blue" size="sm">
														Categorizing… #{queueMap.get(entry.id)}
													</Badge>
												) : (
													<Badge variant="light" color="gray" size="sm">
														Uncategorized
													</Badge>
												)
											) : (
												entry.tags.map((tag) => (
													<Badge key={tag} variant="light" color="ink" size="sm">
														{tag}
													</Badge>
												))
											)}
										</Group>
										<Group gap="sm" align="center">
											<Select
												data={projectSelectData}
												value={entry.projectId ?? ""}
												onChange={(v) => handleProjectChange(entry, v)}
												placeholder="No project"
												size="xs"
												style={{ minWidth: 140 }}
												clearable
											/>
											<Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
												{dayjs(entry.createdAt).format("MMM D, YYYY")}
											</Text>
										</Group>
									</Group>
								</Stack>
							</Card>
						))}
					</Stack>
				</Stack>
			</Container>

			{/* Edit modal */}
			<Modal opened={editOpened} onClose={closeEdit} title="Edit entry" size="lg" centered>
				<Stack gap="md">
					<Textarea
						value={editText}
						onChange={(e) => setEditText(e.currentTarget.value)}
						minRows={6}
						autosize
						data-autofocus
					/>
					<Select
						label="Project"
						data={projectSelectData}
						value={editProjectId ?? ""}
						onChange={(v) => setEditProjectId(v || null)}
						clearable
					/>
					{editEntry.isError ? (
						<Text size="sm" c="red">
							{editEntry.error instanceof Error ? editEntry.error.message : "Could not save"}
						</Text>
					) : null}
					<Group justify="flex-end">
						<Button variant="default" onClick={closeEdit} disabled={editEntry.isPending}>
							Cancel
						</Button>
						<Button
							color="ink"
							onClick={handleEditSave}
							loading={editEntry.isPending}
							disabled={!editText.trim()}
						>
							Save
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Delete confirmation */}
			<Modal opened={deleteOpened} onClose={closeDelete} title="Delete entry" size="sm" centered>
				<Stack gap="md">
					<Text size="sm">Are you sure you want to delete this entry? This cannot be undone.</Text>
					{deleteTarget ? (
						<Text size="xs" c="dimmed" lineClamp={3} style={{ whiteSpace: "pre-wrap" }}>
							{deleteTarget.rawText}
						</Text>
					) : null}
					{removeEntry.isError ? (
						<Text size="sm" c="red">
							{removeEntry.error instanceof Error ? removeEntry.error.message : "Could not delete"}
						</Text>
					) : null}
					<Group justify="flex-end">
						<Button variant="default" onClick={closeDelete} disabled={removeEntry.isPending}>
							Cancel
						</Button>
						<Button color="red" onClick={handleDeleteConfirm} loading={removeEntry.isPending}>
							Delete
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* New project modal */}
			<Modal
				opened={projectModalOpened}
				onClose={closeProjectModal}
				title="New project"
				size="sm"
				centered
			>
				<Stack gap="md">
					<TextInput
						placeholder="Project name"
						value={newProjectName}
						onChange={(e) => setNewProjectName(e.currentTarget.value)}
						onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
						data-autofocus
					/>
					{addProject.isError ? (
						<Text size="sm" c="red">
							{addProject.error instanceof Error ? addProject.error.message : "Could not create"}
						</Text>
					) : null}
					<Group justify="flex-end">
						<Button variant="default" onClick={closeProjectModal} disabled={addProject.isPending}>
							Cancel
						</Button>
						<Button
							color="ink"
							onClick={handleCreateProject}
							loading={addProject.isPending}
							disabled={!newProjectName.trim()}
						>
							Create
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Box>
	);
}
