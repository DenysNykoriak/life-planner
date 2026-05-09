import { createTheme, type MantineColorsTuple } from "@mantine/core";

const ink: MantineColorsTuple = [
	"#f6f5ff",
	"#e8e6ff",
	"#cdc9fa",
	"#afa8f5",
	"#9288ef",
	"#7c73e8",
	"#6f67e6",
	"#5d56cd",
	"#524cb8",
	"#4540a3",
];

export const appTheme = createTheme({
	primaryColor: "ink",
	colors: {
		ink,
	},
	fontFamily: "'DM Sans', system-ui, sans-serif",
	defaultRadius: "md",
	headings: {
		fontFamily: "'DM Sans', system-ui, sans-serif",
		fontWeight: "600",
	},
});
