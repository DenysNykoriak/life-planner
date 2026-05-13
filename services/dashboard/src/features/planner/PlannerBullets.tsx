import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Button, Checkbox, Group, TextInput } from "@mantine/core";
import { ChevronLeft, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import {
	type DropMode,
	type FlatBullet,
	moveSubtreeByKeys,
	removeSubtreeKey,
	tryIndentAt,
	tryOutdentAt,
} from "@/features/planner/planBullets";

type PlannerBulletsProps = {
	rows: FlatBullet[];
	onChange: (next: FlatBullet[]) => void;
	onBlurCommit?: () => void;
	onAdd: () => void;
	addLabel?: string;
};

function SortableBulletRow({
	row,
	index,
	rows,
	onChange,
	registerRowEl,
	onBlurCommit,
}: {
	row: FlatBullet;
	index: number;
	rows: FlatBullet[];
	onChange: (next: FlatBullet[]) => void;
	registerRowEl: (id: string, el: HTMLDivElement | null) => void;
	onBlurCommit?: () => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: row.key,
	});

	const mergedRef = (node: HTMLDivElement | null) => {
		setNodeRef(node);
		registerRowEl(row.key, node);
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.55 : 1,
		paddingLeft: Math.min(row.depth, 12) * 12,
	} as const;

	const patchRow = (key: string, patch: Partial<FlatBullet>) => {
		onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
	};

	return (
		<Group ref={mergedRef} gap="sm" wrap="nowrap" align="flex-start" style={style}>
			<ActionIcon
				mt={6}
				variant="subtle"
				color="gray"
				size="sm"
				aria-label="Drag to reorder"
				{...listeners}
				{...attributes}
			>
				<GripVertical size={18} />
			</ActionIcon>
			<ActionIcon
				mt={6}
				variant="subtle"
				color="gray"
				size="sm"
				onClick={() => onChange(tryOutdentAt(rows, index))}
				aria-label="Outdent"
			>
				<ChevronLeft size={18} />
			</ActionIcon>
			<ActionIcon
				mt={6}
				variant="subtle"
				color="gray"
				size="sm"
				onClick={() => onChange(tryIndentAt(rows, index))}
				aria-label="Indent"
			>
				<ChevronRight size={18} />
			</ActionIcon>
			<Checkbox
				mt={6}
				checked={row.completed}
				onChange={(e) => patchRow(row.key, { completed: e.currentTarget.checked })}
				disabled={!row.text.trim()}
			/>
			<TextInput
				flex={1}
				variant="unstyled"
				placeholder="Bullet text"
				value={row.text}
				onChange={(e) => patchRow(row.key, { text: e.currentTarget.value })}
				onBlur={() => onBlurCommit?.()}
				onKeyDown={(e) => {
					if (e.key === "Tab") {
						e.preventDefault();
						if (e.shiftKey) {
							onChange(tryOutdentAt(rows, index));
						} else {
							onChange(tryIndentAt(rows, index));
						}
					}
				}}
				styles={{
					input: {
						fontSize: "var(--mantine-font-size-md)",
						paddingInline: 4,
					},
				}}
			/>
			<ActionIcon
				variant="subtle"
				color="gray"
				mt={6}
				onClick={() => onChange(removeSubtreeKey(rows, row.key))}
				aria-label="Remove bullet"
			>
				<Trash2 size={18} />
			</ActionIcon>
		</Group>
	);
}

export function PlannerBullets({
	rows,
	onChange,
	onBlurCommit,
	onAdd,
	addLabel = "Add bullet",
}: PlannerBulletsProps) {
	const rowRefs = useRef(new Map<string, HTMLDivElement>());
	const pointerYRef = useRef(0);
	const dragMetaRef = useRef<{ overId: string; zone: DropMode } | null>(null);

	const registerRowEl = (id: string, el: HTMLDivElement | null) => {
		const m = rowRefs.current;
		if (el) {
			m.set(id, el);
		} else {
			m.delete(id);
		}
	};

	const onPointerMove = (e: PointerEvent) => {
		pointerYRef.current = e.clientY;
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationDistance: 8,
		}),
	);

	const handleDragStart = () => {
		window.addEventListener("pointermove", onPointerMove);
	};

	const handleDragOver = (e: DragOverEvent) => {
		const over = e.over;
		if (!over) {
			dragMetaRef.current = null;
			return;
		}
		const id = String(over.id);
		const el = rowRefs.current.get(id);
		if (!el) {
			dragMetaRef.current = null;
			return;
		}
		const rect = el.getBoundingClientRect();
		const y = pointerYRef.current - rect.top;
		const ratio = rect.height > 0 ? y / rect.height : 0.5;
		let zone: DropMode;
		if (ratio < 0.28) {
			zone = "before";
		} else if (ratio > 0.72) {
			zone = "after";
		} else {
			zone = "nest";
		}
		dragMetaRef.current = { overId: id, zone };
	};

	const handleDragEnd = (e: DragEndEvent) => {
		window.removeEventListener("pointermove", onPointerMove);
		const meta = dragMetaRef.current;
		dragMetaRef.current = null;
		const { active, over } = e;
		if (!over || active.id === over.id) {
			return;
		}
		const activeKey = String(active.id);
		const overKey = String(over.id);
		const zone = meta && meta.overId === overKey ? meta.zone : "after";
		onChange(moveSubtreeByKeys(rows, activeKey, overKey, zone));
	};

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={rows.map((r) => r.key)} strategy={verticalListSortingStrategy}>
					{rows.map((row, index) => (
						<SortableBulletRow
							key={row.key}
							row={row}
							index={index}
							rows={rows}
							onChange={onChange}
							registerRowEl={registerRowEl}
							onBlurCommit={onBlurCommit}
						/>
					))}
				</SortableContext>
			</DndContext>
			<Button variant="light" leftSection={<Plus size={18} />} onClick={onAdd} mt="xs">
				{addLabel}
			</Button>
		</>
	);
}
