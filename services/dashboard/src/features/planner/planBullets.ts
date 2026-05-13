import type { PlanItemWrite } from "@/lib/api/client";
import type { PlanItem } from "@/lib/api/types";

export type FlatBullet = {
	key: string;
	text: string;
	completed: boolean;
	depth: number;
};

export function itemsToFlat(items: PlanItem[]): FlatBullet[] {
	const parentDepth = new Map<string | null, number>();
	parentDepth.set(null, -1);
	const flat: FlatBullet[] = [];
	for (const item of items) {
		const pd = parentDepth.get(item.parentId ?? null);
		const depth = (pd ?? -1) + 1;
		parentDepth.set(item.id, depth);
		flat.push({
			key: item.id,
			text: item.text,
			completed: item.completed,
			depth,
		});
	}
	return flat;
}

export function planFingerprint(items: PlanItem[]): string {
	return itemsToFlat(items)
		.map((r) => `${r.key}:${r.completed}:${r.depth}:${r.text}`)
		.join("|");
}

export function draftFingerprintFlat(rows: FlatBullet[]): string {
	return rows.map((r) => `${r.key}:${r.completed}:${r.depth}:${r.text}`).join("|");
}

export function clampFlatDepths(rows: FlatBullet[]): FlatBullet[] {
	const out: FlatBullet[] = [];
	for (let i = 0; i < rows.length; i++) {
		const r = rows[i];
		if (i === 0) {
			out.push({ ...r, depth: 0 });
			continue;
		}
		const prevDepth = out[i - 1].depth;
		const d = Math.min(Math.max(r.depth, 0), prevDepth + 1);
		out.push({ ...r, depth: d });
	}
	return out;
}

export function extractSubtree(flat: FlatBullet[], index: number): FlatBullet[] {
	const td = flat[index].depth;
	const out = [flat[index]];
	let j = index + 1;
	while (j < flat.length && flat[j].depth > td) {
		out.push(flat[j]);
		j++;
	}
	return out;
}

export function removeSubtreeAt(flat: FlatBullet[], index: number): FlatBullet[] {
	const td = flat[index].depth;
	let end = index + 1;
	while (end < flat.length && flat[end].depth > td) {
		end++;
	}
	return [...flat.slice(0, index), ...flat.slice(end)];
}

export function lastDescendantIndex(flat: FlatBullet[], targetIndex: number): number {
	const td = flat[targetIndex].depth;
	let j = targetIndex + 1;
	while (j < flat.length && flat[j].depth > td) {
		j++;
	}
	return j - 1;
}

export type DropMode = "before" | "after" | "nest";

export function moveSubtreeByKeys(
	flat: FlatBullet[],
	activeKey: string,
	targetKey: string,
	mode: DropMode,
): FlatBullet[] {
	const fromIndex = flat.findIndex((r) => r.key === activeKey);
	const targetIndex = flat.findIndex((r) => r.key === targetKey);
	if (fromIndex < 0 || targetIndex < 0) return flat;

	const chunk = extractSubtree(flat, fromIndex);
	const chunkKeys = new Set(chunk.map((c) => c.key));
	if (chunkKeys.has(targetKey)) return flat;

	const without = removeSubtreeAt(flat, fromIndex);
	const tIdx = without.findIndex((r) => r.key === targetKey);
	if (tIdx < 0) return flat;

	let insertAt: number;
	let newRootDepth: number;

	if (mode === "before") {
		insertAt = tIdx;
		newRootDepth = without[tIdx].depth;
	} else if (mode === "after") {
		insertAt = lastDescendantIndex(without, tIdx) + 1;
		newRootDepth = without[tIdx].depth;
	} else {
		insertAt = lastDescendantIndex(without, tIdx) + 1;
		newRootDepth = without[tIdx].depth + 1;
	}

	const delta = newRootDepth - chunk[0].depth;
	const shifted = chunk.map((r) => ({ ...r, depth: r.depth + delta }));
	const next = [...without.slice(0, insertAt), ...shifted, ...without.slice(insertAt)];
	return clampFlatDepths(next);
}

export function tryIndentAt(flat: FlatBullet[], index: number): FlatBullet[] {
	if (index === 0) return flat;
	const prevDepth = flat[index - 1].depth;
	const chunk = extractSubtree(flat, index);
	if (chunk[0].depth >= prevDepth + 1) return flat;
	const delta = prevDepth + 1 - chunk[0].depth;
	const next = flat.slice();
	for (let i = index; i < index + chunk.length; i++) {
		next[i] = { ...next[i], depth: next[i].depth + delta };
	}
	return clampFlatDepths(next);
}

export function tryOutdentAt(flat: FlatBullet[], index: number): FlatBullet[] {
	const chunk = extractSubtree(flat, index);
	if (chunk[0].depth === 0) return flat;
	const next = flat.slice();
	for (let i = index; i < index + chunk.length; i++) {
		next[i] = { ...next[i], depth: Math.max(0, next[i].depth - 1) };
	}
	return clampFlatDepths(next);
}

export function removeSubtreeKey(flat: FlatBullet[], key: string): FlatBullet[] {
	const idx = flat.findIndex((r) => r.key === key);
	if (idx < 0) return flat;
	return removeSubtreeAt(flat, idx);
}

export function flatToPayload(flat: FlatBullet[]): PlanItemWrite[] {
	const trimmed = flat.map((r) => ({ ...r, text: r.text.trim() })).filter((r) => r.text.length > 0);
	const clamped = clampFlatDepths(trimmed);
	return clamped.map((row) => ({
		text: row.text,
		completed: row.completed,
		depth: row.depth,
	}));
}
