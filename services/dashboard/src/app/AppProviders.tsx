import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/AuthContext";
import { AppThemeProvider } from "./AppThemeProvider";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<AppThemeProvider>
				<AuthProvider>{children}</AuthProvider>
			</AppThemeProvider>
		</QueryProvider>
	);
}
