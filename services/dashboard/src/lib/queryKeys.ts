export const planKeys = {
	all: ["plans"] as const,
	day: (dayTimestampMs: number) => [...planKeys.all, dayTimestampMs] as const,
};

export const knowledgeKeys = {
	all: ["knowledge"] as const,
	queue: ["knowledge", "queue"] as const,
};

export const projectKeys = {
	all: ["projects"] as const,
};
