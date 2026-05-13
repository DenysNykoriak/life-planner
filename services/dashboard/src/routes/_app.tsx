import { Box, Button, Group, Text } from "@mantine/core";
import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarDays, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export const Route = createFileRoute("/_app")({
	beforeLoad: ({ context }) => {
		if (!context.session?.user) {
			throw redirect({ to: "/login" });
		}
	},
	component: AppLayout,
});

function AppLayout() {
	const { user, logout } = useAuth();
	const { location } = useRouterState();
	const isKnowledge = location.pathname.startsWith("/knowledge");
	const headerHeight = isKnowledge ? 108 : 64;

	return (
		<Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<Box
				component="header"
				style={{
					height: headerHeight,
					position: "sticky",
					top: 0,
					zIndex: 100,
					background: "white",
					borderBottom: "1px solid var(--mantine-color-gray-2)",
					flexShrink: 0,
				}}
			>
				{/* Row 1: logo + feature nav + user */}
				<Group justify="space-between" px="md" h={64} align="center" wrap="nowrap">
					<Group gap="xs" style={{ flexShrink: 0 }}>
						<Box
							style={{
								width: 36,
								height: 36,
								borderRadius: 10,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background:
									"linear-gradient(135deg, var(--mantine-color-ink-5), var(--mantine-color-ink-7))",
								color: "white",
								flexShrink: 0,
							}}
						>
							<CalendarDays size={20} strokeWidth={1.75} />
						</Box>
						<Text fw={700} size="lg" style={{ whiteSpace: "nowrap" }}>
							Life Planner
						</Text>
					</Group>

					{/* Feature tabs */}
					<Group gap="xs">
						<Button
							component={Link}
							to="/planner"
							variant={!isKnowledge ? "filled" : "subtle"}
							color="ink"
							size="sm"
							leftSection={<CalendarDays size={16} />}
						>
							Day Planner
						</Button>
						<Button
							component={Link}
							to="/knowledge"
							variant={isKnowledge ? "filled" : "subtle"}
							color="ink"
							size="sm"
							leftSection={<BookOpen size={16} />}
						>
							Knowledge
						</Button>
					</Group>

					{/* User */}
					<Group gap="sm" style={{ flexShrink: 0 }}>
						<Text size="sm" c="dimmed" visibleFrom="sm">
							{user?.email}
						</Text>
						<Button
							variant="light"
							size="sm"
							leftSection={<LogOut size={16} />}
							onClick={() => {
								void logout();
							}}
						>
							Log out
						</Button>
					</Group>
				</Group>

				{/* Row 2: Knowledge sub-nav */}
				{isKnowledge ? (
					<Group
						px="md"
						h={44}
						align="center"
						gap="xs"
						style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
					>
						<Button
							component={Link}
							to="/knowledge"
							variant={location.pathname === "/knowledge" ? "filled" : "subtle"}
							color="ink"
							size="xs"
							leftSection={<Plus size={14} />}
						>
							Add Entry
						</Button>
						<Button
							component={Link}
							to="/knowledge/browse"
							variant={location.pathname === "/knowledge/browse" ? "filled" : "subtle"}
							color="ink"
							size="xs"
							leftSection={<BookOpen size={14} />}
						>
							Browse
						</Button>
					</Group>
				) : null}
			</Box>

			{/* Page content */}
			<Box style={{ flex: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
}
