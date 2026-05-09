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
		return {
			date: plan.date.getTime(),
			items: plan.items.map((i) => ({
				id: i.id,
				text: i.text,
				completed: i.completed,
				sortOrder: i.sortOrder,
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
			await this.prisma.planItem.createMany({
				data: dto.items.map((item, idx) => ({
					dailyPlanId: plan.id,
					text: item.text,
					completed: item.completed,
					sortOrder: item.sortOrder ?? idx,
				})),
			});
		}
		return this.getDay(userId, dayTimestampParam);
	}
}
