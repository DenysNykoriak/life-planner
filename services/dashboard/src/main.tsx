import "@mantine/core/styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/app/AppProviders";
import { router } from "@/router";

const rootEl = document.getElementById("root");
if (!rootEl) {
	throw new Error("Missing #root element");
}

createRoot(rootEl).render(
	<StrictMode>
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	</StrictMode>,
);
