import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { appTheme } from "@/theme";

export function AppThemeProvider({ children }: { children: ReactNode }) {
	return (
		<MantineProvider theme={appTheme} defaultColorScheme="light">
			{children}
		</MantineProvider>
	);
}
