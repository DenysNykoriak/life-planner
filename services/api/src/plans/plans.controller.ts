import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { PlansService } from "./plans.service";

@Controller("plans")
export class PlansController {
	constructor(private readonly plans: PlansService) {}

	@Get("day/:dayTimestamp")
	getDay(@Session() session: UserSession, @Param("dayTimestamp") dayTimestamp: string) {
		return this.plans.getDay(session.user.id, dayTimestamp);
	}

	@Put("day/:dayTimestamp")
	replaceDay(
		@Session() session: UserSession,
		@Param("dayTimestamp") dayTimestamp: string,
		@Body() dto: UpdatePlanDto,
	) {
		return this.plans.replaceDay(session.user.id, dayTimestamp, dto);
	}
}
