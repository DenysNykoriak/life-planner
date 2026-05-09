export const planKeys = {
	all: ["plans"] as const,
	day: (dayTimestampMs: number) => [...planKeys.all, dayTimestampMs] as const,
};
