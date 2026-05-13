import { useEffect, useRef, useState } from "react";
import {
	draftFingerprintFlat,
	type FlatBullet,
	flatToPayload,
	itemsToFlat,
	planFingerprint,
} from "@/features/planner/planBullets";
import type { PlanItem } from "@/lib/api/types";
import type { SaveDayPlanInput } from "./usePlansActions";

type Mutate = (input: SaveDayPlanInput, opts?: { onSuccess?: () => void }) => void;

export function usePlanDraft(
	serverItems: PlanItem[] | undefined,
	mutate: Mutate,
	dayTs: number,
	enabled: boolean,
) {
	const [draft, setDraft] = useState<FlatBullet[]>([]);
	const [seed, setSeed] = useState("");
	const draftRef = useRef(draft);
	draftRef.current = draft;
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastSavedRef = useRef<string | null>(null);

	useEffect(() => {
		if (!serverItems) return;
		const fp = planFingerprint(serverItems);
		if (fp === seed) return;
		setDraft(itemsToFlat(serverItems));
		setSeed(fp);
		lastSavedRef.current = fp;
	}, [serverItems, seed]);

	useEffect(() => {
		if (!enabled) return;
		const fp = draftFingerprintFlat(draft);
		if (fp === lastSavedRef.current) return;
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			timerRef.current = null;
			const snapshot = draftRef.current;
			const snapFp = draftFingerprintFlat(snapshot);
			if (snapFp === lastSavedRef.current) return;
			mutate(
				{ dayTs, items: flatToPayload(snapshot) },
				{
					onSuccess: () => {
						lastSavedRef.current = snapFp;
					},
				},
			);
		}, 450);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [draft, enabled, dayTs, mutate]);

	const flush = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		const snapshot = draftRef.current;
		const snapFp = draftFingerprintFlat(snapshot);
		if (snapFp === lastSavedRef.current) return;
		mutate(
			{ dayTs, items: flatToPayload(snapshot) },
			{
				onSuccess: () => {
					lastSavedRef.current = snapFp;
				},
			},
		);
	};

	return { draft, setDraft, flush };
}
