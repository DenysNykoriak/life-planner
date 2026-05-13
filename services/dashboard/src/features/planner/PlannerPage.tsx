import {
	Alert,
	AppShell,
	Badge,
	Box,
	Button,
	Card,
	Center,
	Container,
	Divider,
	Group,
	Loader,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { CalendarDays, LogOut, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { usePlansActions } from "@/features/planner/hooks/usePlansActions";
import { usePlansFetch } from "@/features/planner/hooks/usePlansFetch";
import { PlannerBullets } from "@/features/planner/PlannerBullets";
import {
	draftFingerprintFlat,
	type FlatBullet,
	flatToPayload,
	itemsToFlat,
	planFingerprint,
} from "@/features/planner/planBullets";

export function PlannerPage() {
	const navigate = useNavigate();
	const { user, ready, logout } = useAuth();
	const { saveYesterdayPlan, saveTomorrowPlan } = usePlansActions();

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

	const [yDraft, setYDraft] = useState<FlatBullet[]>([]);
	const [tDraft, setTDraft] = useState<FlatBullet[]>([]);
	const [ySeed, setYSeed] = useState("");
	const [tSeed, setTSeed] = useState("");

	const lastSavedY = useRef<string | null>(null);
	const lastSavedT = useRef<string | null>(null);
	const yDraftRef = useRef(yDraft);
	const tDraftRef = useRef(tDraft);
	yDraftRef.current = yDraft;
	tDraftRef.current = tDraft;
	const saveTimerY = useRef<ReturnType<typeof setTimeout> | null>(null);
	const saveTimerT = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!yesterdayPlan) return;
		const fp = planFingerprint(yesterdayPlan.items);
		if (fp !== ySeed) {
			setYDraft(itemsToFlat(yesterdayPlan.items));
			setYSeed(fp);
			lastSavedY.current = fp;
		}
	}, [yesterdayPlan, ySeed]);

	useEffect(() => {
		if (!tomorrowPlan) return;
		const fp = planFingerprint(tomorrowPlan.items);
		if (fp !== tSeed) {
			setTDraft(itemsToFlat(tomorrowPlan.items));
			setTSeed(fp);
			lastSavedT.current = fp;
		}
	}, [tomorrowPlan, tSeed]);

	useEffect(() => {
		if (!user || loadingPlans) return;
		const fp = draftFingerprintFlat(yDraft);
		if (fp === lastSavedY.current) return;
		if (saveTimerY.current) clearTimeout(saveTimerY.current);
		saveTimerY.current = setTimeout(() => {
			saveTimerY.current = null;
			const snapshot = yDraftRef.current;
			const snapFp = draftFingerprintFlat(snapshot);
			if (snapFp === lastSavedY.current) return;
			saveYesterdayPlan.mutate(
				{ dayTs: yesterdayTs, items: flatToPayload(snapshot) },
				{
					onSuccess: () => {
						lastSavedY.current = snapFp;
					},
				},
			);
		}, 450);
		return () => {
			if (saveTimerY.current) clearTimeout(saveTimerY.current);
		};
	}, [yDraft, user, loadingPlans, yesterdayTs, saveYesterdayPlan]);

	useEffect(() => {
		if (!user || loadingPlans) return;
		const fp = draftFingerprintFlat(tDraft);
		if (fp === lastSavedT.current) return;
		if (saveTimerT.current) clearTimeout(saveTimerT.current);
		saveTimerT.current = setTimeout(() => {
			saveTimerT.current = null;
			const snapshot = tDraftRef.current;
			const snapFp = draftFingerprintFlat(snapshot);
			if (snapFp === lastSavedT.current) return;
			saveTomorrowPlan.mutate(
				{ dayTs: tomorrowTs, items: flatToPayload(snapshot) },
				{
					onSuccess: () => {
						lastSavedT.current = snapFp;
					},
				},
			);
		}, 450);
		return () => {
			if (saveTimerT.current) clearTimeout(saveTimerT.current);
		};
	}, [tDraft, user, loadingPlans, tomorrowTs, saveTomorrowPlan]);

	const flushY = () => {
		if (saveTimerY.current) {
			clearTimeout(saveTimerY.current);
			saveTimerY.current = null;
		}
		const snapshot = yDraftRef.current;
		const snapFp = draftFingerprintFlat(snapshot);
		if (snapFp === lastSavedY.current) return;
		saveYesterdayPlan.mutate(
			{ dayTs: yesterdayTs, items: flatToPayload(snapshot) },
			{
				onSuccess: () => {
					lastSavedY.current = snapFp;
				},
			},
		);
	};

	const flushT = () => {
		if (saveTimerT.current) {
			clearTimeout(saveTimerT.current);
			saveTimerT.current = null;
		}
		const snapshot = tDraftRef.current;
		const snapFp = draftFingerprintFlat(snapshot);
		if (snapFp === lastSavedT.current) return;
		saveTomorrowPlan.mutate(
			{ dayTs: tomorrowTs, items: flatToPayload(snapshot) },
			{
				onSuccess: () => {
					lastSavedT.current = snapFp;
				},
			},
		);
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
				depth: 0,
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
												Drag the grip to reorder. Drop on the middle of a row to nest, top/bottom
												third for before/after. Tab / Shift+Tab or arrows adjust nesting. Bullets
												save after you pause typing.
											</Text>
											<Divider />
											{yDraft.length === 0 ? (
												<Text size="sm" c="dimmed">
													Add bullets below or carry tasks from an earlier day when you plan
													tomorrow.
												</Text>
											) : (
												<Stack gap="xs">
													<PlannerBullets
														rows={yDraft}
														onChange={setYDraft}
														onBlurCommit={flushY}
														onAdd={() =>
															setYDraft((rows) => [
																...rows,
																{
																	key: crypto.randomUUID(),
																	text: "",
																	completed: false,
																	depth: 0,
																},
															])
														}
													/>
												</Stack>
											)}
											{yDraft.length === 0 ? (
												<Button
													variant="light"
													leftSection={<Plus size={18} />}
													onClick={() =>
														setYDraft([
															{
																key: crypto.randomUUID(),
																text: "",
																completed: false,
																depth: 0,
															},
														])
													}
												>
													Add bullet
												</Button>
											) : null}
											{saveYesterdayPlan.isError ? (
												<Text size="sm" c="red">
													{saveYesterdayPlan.error instanceof Error
														? saveYesterdayPlan.error.message
														: "Could not save yesterday"}
												</Text>
											) : null}
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
													<PlannerBullets
														rows={tDraft}
														onChange={setTDraft}
														onBlurCommit={flushT}
														onAdd={() =>
															setTDraft((rows) => [
																...rows,
																{
																	key: crypto.randomUUID(),
																	text: "",
																	completed: false,
																	depth: 0,
																},
															])
														}
													/>
												</Stack>
											)}
											{tDraft.length === 0 ? (
												<Button
													variant="light"
													leftSection={<Plus size={18} />}
													onClick={() =>
														setTDraft([
															{
																key: crypto.randomUUID(),
																text: "",
																completed: false,
																depth: 0,
															},
														])
													}
												>
													Add bullet
												</Button>
											) : null}
											{saveTomorrowPlan.isError ? (
												<Text size="sm" c="red">
													{saveTomorrowPlan.error instanceof Error
														? saveTomorrowPlan.error.message
														: "Could not save tomorrow"}
												</Text>
											) : null}
										</Stack>
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
