import {
	Anchor,
	Button,
	Center,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";

export function RegisterPage() {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await register(email.trim(), password, name.trim() || undefined);
			void navigate({ to: "/" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Center
			px="md"
			style={{
				minHeight: "100vh",
				background: "linear-gradient(145deg, #f6f5ff 0%, #e8f4ff 40%, #ffffff 100%)",
			}}
		>
			<Paper withBorder shadow="md" p="xl" radius="lg" maw={420} w="100%">
				<Stack gap="lg">
					<div>
						<Title order={2}>Create account</Title>
						<Text c="dimmed" size="sm" mt={4}>
							Start planning your days with Life Planner
						</Text>
					</div>
					<form onSubmit={onSubmit}>
						<Stack gap="md">
							<TextInput
								label="Name"
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<TextInput
								label="Email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<PasswordInput
								label="Password"
								description="At least 8 characters"
								autoComplete="new-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							{error ? (
								<Text size="sm" c="red">
									{error}
								</Text>
							) : null}
							<Button type="submit" loading={loading} fullWidth>
								Register
							</Button>
						</Stack>
					</form>
					<Text size="sm" ta="center" c="dimmed">
						Already have an account?{" "}
						<Anchor
							href="/login"
							onClick={(e) => {
								e.preventDefault();
								void navigate({ to: "/login" });
							}}
						>
							Sign in
						</Anchor>
					</Text>
				</Stack>
			</Paper>
		</Center>
	);
}
