import {
	ActionIcon,
	Alert,
	AppShell,
	Badge,
	Box,
	Button,
	Card,
	Center,
	Checkbox,
	Container,
	Divider,
	Group,
	Loader,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { CalendarDays, LogOut, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { usePlansActions } from "@/features/planner/hooks/usePlansActions";
import { usePlansFetch } from "@/features/planner/hooks/usePlansFetch";
import type { PlanItem } from "@/lib/api/types";

type DraftItem = {
	key: string;
	text: string;
	completed: boolean;
};

function itemsToDraft(items: PlanItem[]): DraftItem[] {
	return items.map((i) => ({
		key: i.id,
		text: i.text,
		completed: i.completed,
	}));
}

function draftFingerprint(items: PlanItem[]): string {
	return items.map((i) => `${i.id}:${i.completed}:${i.text}`).join("|");
}

function toPayload(
	drafts: DraftItem[],
): Array<{ text: string; completed: boolean; sortOrder: number }> {
	return drafts
		.map((d, idx) => ({
			text: d.text.trim(),
			completed: d.completed,
			sortOrder: idx,
		}))
		.filter((d) => d.text.length > 0);
}

export function PlannerPage() {
	const navigate = useNavigate();
	const { user, ready, logout } = useAuth();
	const { saveEveningReview } = usePlansActions();

	const todayTs = useMemo(() => dayjs().startOf("day").valueOf(), []);
	const yesterdayTs = useMemo(
		() => dayjs(todayTs).subtract(1, "day").startOf("day").valueOf(),
		[todayTs],
	);
	const tomorrowTs = useMemo(
		() => dayjs(todayTs).add(1, "day").startOf("day").valueOf(),
		[todayTs],
	);

	const {
		yesterdayPlan,
		tomorrowPlan,
		isLoading: loadingPlans,
		error: queryError,
	} = usePlansFetch({
		yesterdayTs,
		tomorrowTs,
		enabled: Boolean(user),
	});

	useEffect(() => {
		if (ready && !user) {
			void navigate({ to: "/login" });
		}
	}, [ready, user, navigate]);

	const [yDraft, setYDraft] = useState<DraftItem[]>([]);
	const [tDraft, setTDraft] = useState<DraftItem[]>([]);
	const [ySeed, setYSeed] = useState("");
	const [tSeed, setTSeed] = useState("");

	useEffect(() => {
		if (!yesterdayPlan) return;
		const fp = draftFingerprint(yesterdayPlan.items);
		if (fp !== ySeed) {
			setYDraft(itemsToDraft(yesterdayPlan.items));
			setYSeed(fp);
		}
	}, [yesterdayPlan, ySeed]);

	useEffect(() => {
		if (!tomorrowPlan) return;
		const fp = draftFingerprint(tomorrowPlan.items);
		if (fp !== tSeed) {
			setTDraft(itemsToDraft(tomorrowPlan.items));
			setTSeed(fp);
		}
	}, [tomorrowPlan, tSeed]);

	const updateY = (key: string, patch: Partial<DraftItem>) => {
		setYDraft((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
	};

	const updateT = (key: string, patch: Partial<DraftItem>) => {
		setTDraft((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
	};

	const removeY = (key: string) => {
		setYDraft((rows) => rows.filter((r) => r.key !== key));
	};

	const removeT = (key: string) => {
		setTDraft((rows) => rows.filter((r) => r.key !== key));
	};

	const addTomorrowRow = () => {
		setTDraft((rows) => [...rows, { key: crypto.randomUUID(), text: "", completed: false }]);
	};

	const carryIncompleteForward = () => {
		const incomplete = yDraft.filter((d) => !d.completed && d.text.trim().length > 0);
		const existing = new Set(tDraft.map((d) => d.text.trim().toLowerCase()));
		const appended = incomplete
			.filter((d) => !existing.has(d.text.trim().toLowerCase()))
			.map((d) => ({
				key: crypto.randomUUID(),
				text: d.text.trim(),
				completed: false,
			}));
		setTDraft((rows) => [...rows, ...appended]);
	};

	const doneCount = yDraft.filter((d) => d.completed && d.text.trim()).length;
	const totalYesterday = yDraft.filter((d) => d.text.trim()).length;
	const openYesterday = totalYesterday - doneCount;

	if (!ready || !user) {
		return (
			<Center style={{ minHeight: "100vh" }}>
				<Loader />
			</Center>
		);
	}

	return (
		<AppShell header={{ height: 72 }} padding="md">
			<AppShell.Header px="md" style={{ display: "flex", alignItems: "center" }}>
				<Group justify="space-between" w="100%" wrap="nowrap">
					<Group gap="sm">
						<Box
							style={{
								width: 40,
								height: 40,
								borderRadius: 12,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background:
									"linear-gradient(135deg, var(--mantine-color-ink-5), var(--mantine-color-ink-7))",
								color: "white",
							}}
						>
							<CalendarDays size={22} strokeWidth={1.75} />
						</Box>
						<div>
							<Text fw={700} size="lg">
								Life Planner
							</Text>
							<Text size="xs" c="dimmed">
								Today · {dayjs(todayTs).format("dddd, MMM D")}
							</Text>
						</div>
					</Group>
					<Group gap="sm">
						<Text size="sm" c="dimmed" visibleFrom="sm">
							{user.email}
						</Text>
						<Button
							variant="light"
							size="sm"
							leftSection={<LogOut size={18} />}
							onClick={() => {
								void logout().then(() => {
									void navigate({ to: "/login" });
								});
							}}
						>
							Log out
						</Button>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Main>
				<Box
					style={{
						minHeight: "calc(100vh - 72px)",
						background: "linear-gradient(180deg, #f7f6ff 0%, #f3f8ff 35%, #ffffff 100%)",
					}}
					pb="xl"
				>
					<Container size="sm">
						<Stack gap="lg">
							<div>
								<Title order={2}>Evening review</Title>
								<Text c="dimmed" mt={6}>
									Mark what you finished yesterday, move open items forward, and sketch tomorrow.
								</Text>
							</div>

							{queryError ? (
								<Alert color="red" title="Could not load plans">
									{queryError instanceof Error ? queryError.message : "Unexpected error"}
								</Alert>
							) : null}

							{loadingPlans ? (
								<Center py="xl">
									<Loader />
								</Center>
							) : (
								<>
									<Card withBorder shadow="sm" radius="lg" padding="lg">
										<Stack gap="md">
											<Group justify="space-between" align="flex-start">
												<div>
													<Text fw={600} size="lg">
														Yesterday
													</Text>
													<Text size="sm" c="dimmed">
														{dayjs(yesterdayTs).format("dddd, MMM D")}
													</Text>
												</div>
												{totalYesterday > 0 ? (
													<Badge variant="light" color={openYesterday === 0 ? "green" : "ink"}>
														{doneCount}/{totalYesterday} done
													</Badge>
												) : (
													<Badge variant="light" color="gray">
														No bullets yet
													</Badge>
												)}
											</Group>
											<Text size="sm" c="dimmed">
												Check items you completed. Anything left unchecked can roll into tomorrow.
											</Text>
											<Divider />
											{yDraft.length === 0 ? (
												<Text size="sm" c="dimmed">
													Add bullets below or carry tasks from an earlier day when you plan
													tomorrow.
												</Text>
											) : (
												<Stack gap="xs">
													{yDraft.map((row) => (
														<Group key={row.key} gap="sm" wrap="nowrap" align="flex-start">
															<Checkbox
																mt={6}
																checked={row.completed}
																onChange={(e) =>
																	updateY(row.key, { completed: e.currentTarget.checked })
																}
																disabled={!row.text.trim()}
															/>
															<TextInput
																flex={1}
																variant="unstyled"
																placeholder="Bullet text"
																value={row.text}
																onChange={(e) => updateY(row.key, { text: e.currentTarget.value })}
																styles={{
																	input: {
																		fontSize: "var(--mantine-font-size-md)",
																		paddingInline: 4,
																	},
																}}
															/>
															<ActionIcon
																variant="subtle"
																color="gray"
																onClick={() => removeY(row.key)}
																aria-label="Remove bullet"
															>
																<Trash2 size={18} />
															</ActionIcon>
														</Group>
													))}
												</Stack>
											)}
											<Button
												variant="light"
												leftSection={<Plus size={18} />}
												onClick={() =>
													setYDraft((rows) => [
														...rows,
														{ key: crypto.randomUUID(), text: "", completed: false },
													])
												}
											>
												Add bullet
											</Button>
										</Stack>
									</Card>

									<Card withBorder shadow="sm" radius="lg" padding="lg">
										<Stack gap="md">
											<div>
												<Text fw={600} size="lg">
													Tomorrow
												</Text>
												<Text size="sm" c="dimmed">
													{dayjs(tomorrowTs).format("dddd, MMM D")}
												</Text>
											</div>
											<Group gap="sm">
												<Button variant="outline" onClick={carryIncompleteForward}>
													Move unchecked here
												</Button>
												<Text size="xs" c="dimmed" maw={260}>
													Copies yesterday&apos;s open bullets into tomorrow without duplicates.
												</Text>
											</Group>
											<Divider />
											{tDraft.length === 0 ? (
												<Text size="sm" c="dimmed">
													Add what you want on deck for tomorrow.
												</Text>
											) : (
												<Stack gap="xs">
													{tDraft.map((row) => (
														<Group key={row.key} gap="sm" wrap="nowrap" align="flex-start">
															<Checkbox
																mt={6}
																checked={row.completed}
																onChange={(e) =>
																	updateT(row.key, { completed: e.currentTarget.checked })
																}
																disabled={!row.text.trim()}
															/>
															<TextInput
																flex={1}
																variant="unstyled"
																placeholder="Bullet text"
																value={row.text}
																onChange={(e) => updateT(row.key, { text: e.currentTarget.value })}
																styles={{
																	input: {
																		fontSize: "var(--mantine-font-size-md)",
																		paddingInline: 4,
																	},
																}}
															/>
															<ActionIcon
																variant="subtle"
																color="gray"
																onClick={() => removeT(row.key)}
																aria-label="Remove bullet"
															>
																<Trash2 size={18} />
															</ActionIcon>
														</Group>
													))}
												</Stack>
											)}
											<Button
												variant="light"
												leftSection={<Plus size={18} />}
												onClick={addTomorrowRow}
											>
												Add bullet
											</Button>
										</Stack>
									</Card>

									<Card withBorder radius="lg" padding="lg" bg="var(--mantine-color-body)">
										<Group justify="space-between" align="center">
											<div>
												<Text fw={600}>Save changes</Text>
												<Text size="sm" c="dimmed">
													Writes both yesterday and tomorrow plans.
												</Text>
											</div>
											<Button
												size="md"
												loading={saveEveningReview.isPending}
												onClick={() =>
													saveEveningReview.mutate({
														yesterdayTs,
														tomorrowTs,
														yesterdayItems: toPayload(yDraft),
														tomorrowItems: toPayload(tDraft),
													})
												}
											>
												Save day
											</Button>
										</Group>
										{saveEveningReview.isError ? (
											<Text mt="sm" size="sm" c="red">
												{saveEveningReview.error instanceof Error
													? saveEveningReview.error.message
													: "Save failed"}
											</Text>
										) : null}
									</Card>
								</>
							)}
						</Stack>
					</Container>
				</Box>
			</AppShell.Main>
		</AppShell>
	);
}
