import {
	Alert,
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
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { usePlanDraft } from "@/features/planner/hooks/usePlanDraft";
import { usePlansActions } from "@/features/planner/hooks/usePlansActions";
import { usePlansFetch } from "@/features/planner/hooks/usePlansFetch";
import { PlannerBullets } from "@/features/planner/PlannerBullets";

export function PlannerPage() {
	const { user, ready } = useAuth();
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

	const planEnabled = Boolean(user) && !loadingPlans;

	const {
		draft: yDraft,
		setDraft: setYDraft,
		flush: flushY,
	} = usePlanDraft(yesterdayPlan?.items, saveYesterdayPlan.mutate, yesterdayTs, planEnabled);

	const {
		draft: tDraft,
		setDraft: setTDraft,
		flush: flushT,
	} = usePlanDraft(tomorrowPlan?.items, saveTomorrowPlan.mutate, tomorrowTs, planEnabled);

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
			<Center style={{ minHeight: "100%" }}>
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
			<Container size="sm" pt="xl">
				<Stack gap="lg">
					<div>
						<Title order={2}>Evening review</Title>
						<Text c="dimmed" mt={4} size="xs">
							Today · {dayjs(todayTs).format("dddd, MMM D")}
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
										Drag the grip to reorder. Drop on the middle of a row to nest, top/bottom third
										for before/after. Tab / Shift+Tab or arrows adjust nesting. Bullets save after
										you pause typing.
									</Text>
									<Divider />
									{yDraft.length === 0 ? (
										<Text size="sm" c="dimmed">
											Add bullets below or carry tasks from an earlier day when you plan tomorrow.
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
	);
}
