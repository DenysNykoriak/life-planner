import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { UpdatePlanDto } from "./dto/update-plan.dto";

function parseDayTimestampToDate(raw: string): Date {
	if (!/^\d+$/.test(raw)) {
		throw new BadRequestException("Invalid day timestamp, use Unix milliseconds");
	}
	const ms = Number(raw);
	if (!Number.isSafeInteger(ms) || ms < 0) {
		throw new BadRequestException("Day timestamp out of range");
	}
	return new Date(ms);
}

@Injectable()
export class PlansService {
	constructor(private readonly prisma: PrismaService) {}

	async getDay(userId: string, dayTimestampParam: string) {
		const date = parseDayTimestampToDate(dayTimestampParam);
		let plan = await this.prisma.dailyPlan.findUnique({
			where: { userId_date: { userId, date } },
			include: { items: { orderBy: { sortOrder: "asc" } } },
		});
		if (!plan) {
			plan = await this.prisma.dailyPlan.create({
				data: { userId, date },
				include: { items: { orderBy: { sortOrder: "asc" } } },
			});
		}
		const byParent = new Map<string | null, typeof plan.items>();
		for (const item of plan.items) {
			const p = item.parentId ?? null;
			const list = byParent.get(p);
			if (list) list.push(item);
			else byParent.set(p, [item]);
		}
		for (const list of byParent.values()) {
			list.sort((a, b) => a.sortOrder - b.sortOrder);
		}

		const ordered: typeof plan.items = [];
		const walk = (parentId: string | null) => {
			const kids = byParent.get(parentId);
			if (!kids) return;
			for (const k of kids) {
				ordered.push(k);
				walk(k.id);
			}
		};
		walk(null);

		return {
			date: plan.date.getTime(),
			items: ordered.map((i) => ({
				id: i.id,
				text: i.text,
				completed: i.completed,
				sortOrder: i.sortOrder,
				parentId: i.parentId ?? null,
			})),
		};
	}

	async replaceDay(userId: string, dayTimestampParam: string, dto: UpdatePlanDto) {
		const date = parseDayTimestampToDate(dayTimestampParam);
		const plan = await this.prisma.dailyPlan.upsert({
			where: { userId_date: { userId, date } },
			create: { userId, date },
			update: {},
		});
		await this.prisma.planItem.deleteMany({ where: { dailyPlanId: plan.id } });
		if (dto.items.length > 0) {
			await this.prisma.$transaction(async (tx) => {
				const stack: string[] = [];
				const siblingCounter = new Map<string | null, number>();
				for (const item of dto.items) {
					const depth = item.depth ?? 0;
					while (stack.length > depth) {
						stack.pop();
					}
					const parentId = depth === 0 ? null : stack[depth - 1];
					const sortOrder = siblingCounter.get(parentId) ?? 0;
					siblingCounter.set(parentId, sortOrder + 1);
					const row = await tx.planItem.create({
						data: {
							dailyPlanId: plan.id,
							parentId,
							sortOrder,
							text: item.text,
							completed: item.completed,
						},
					});
					stack.push(row.id);
				}
			});
		}
		return this.getDay(userId, dayTimestampParam);
	}
}
