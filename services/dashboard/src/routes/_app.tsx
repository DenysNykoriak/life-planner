import { Box, Button, Group, Stack, Text } from "@mantine/core";
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

const HEADER_HEIGHT = "3.75rem";
const SIDEBAR_WIDTH = "13.75rem";

function AppLayout() {
	const { user, logout } = useAuth();
	const { location } = useRouterState();
	const isKnowledge = location.pathname.startsWith("/knowledge");

	return (
		<Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<Box
				component="header"
				style={{
					height: HEADER_HEIGHT,
					position: "sticky",
					top: 0,
					zIndex: 100,
					background: "white",
					borderBottom: "1px solid var(--mantine-color-gray-2)",
					flexShrink: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					paddingInline: "var(--mantine-spacing-md)",
					gap: "var(--mantine-spacing-md)",
				}}
			>
				{/* Logo */}
				<Group gap="xs" style={{ flexShrink: 0 }}>
					<Box
						style={{
							width: "2.25rem",
							height: "2.25rem",
							borderRadius: "0.625rem",
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

				{/* Contextual sub-nav */}
				<Group gap="xs" style={{ flex: 1 }}>
					{isKnowledge && (
						<>
							<Button
								component={Link}
								to="/knowledge"
								variant={location.pathname === "/knowledge" ? "filled" : "subtle"}
								color="ink"
								size="sm"
								leftSection={<Plus size={16} />}
							>
								Add Entry
							</Button>
							<Button
								component={Link}
								to="/knowledge/browse"
								variant={location.pathname === "/knowledge/browse" ? "filled" : "subtle"}
								color="ink"
								size="sm"
								leftSection={<BookOpen size={16} />}
							>
								Browse
							</Button>
						</>
					)}
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
						onClick={() => void logout()}
					>
						Log out
					</Button>
				</Group>
			</Box>

			{/* Body */}
			<Box style={{ flex: 1, display: "flex" }}>
				{/* Sidebar */}
				<Box
					component="nav"
					style={{
						width: SIDEBAR_WIDTH,
						flexShrink: 0,
						position: "sticky",
						top: HEADER_HEIGHT,
						height: `calc(100vh - ${HEADER_HEIGHT})`,
						alignSelf: "flex-start",
						background: "white",
						borderRight: "1px solid var(--mantine-color-gray-2)",
						display: "flex",
						flexDirection: "column",
						padding: "var(--mantine-spacing-md)",
					}}
				>
					<Stack gap="xs">
						<Button
							component={Link}
							to="/planner"
							variant={!isKnowledge ? "filled" : "subtle"}
							color="ink"
							size="sm"
							leftSection={<CalendarDays size={16} />}
							justify="flex-start"
							fullWidth
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
							justify="flex-start"
							fullWidth
						>
							Knowledge
						</Button>
					</Stack>
				</Box>

				{/* Page content */}
				<Box style={{ flex: 1, overflow: "auto" }}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}
