import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import type { ReactNode } from "react";
import { appTheme } from "@/theme";

export function AppThemeProvider({ children }: { children: ReactNode }) {
	return (
		<MantineProvider theme={appTheme} defaultColorScheme="light">
			<ModalsProvider>{children}</ModalsProvider>
		</MantineProvider>
	);
}
