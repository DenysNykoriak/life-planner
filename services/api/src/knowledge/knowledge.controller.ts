import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { CreateKnowledgeDto } from "./dto/create-knowledge.dto";
import { UpdateKnowledgeDto } from "./dto/update-knowledge.dto";
import { KnowledgeService } from "./knowledge.service";

@Controller("knowledge")
export class KnowledgeController {
	constructor(private readonly knowledge: KnowledgeService) {}

	@Post()
	create(@Session() session: UserSession, @Body() dto: CreateKnowledgeDto) {
		return this.knowledge.create(session.user.id, dto.text, dto.projectId);
	}

	@Get("queue")
	getQueue() {
		return this.knowledge.getQueue();
	}

	@Get()
	findAll(@Session() session: UserSession) {
		return this.knowledge.findAll(session.user.id);
	}

	@Patch(":id")
	update(@Session() session: UserSession, @Param("id") id: string, @Body() dto: UpdateKnowledgeDto) {
		return this.knowledge.update(session.user.id, id, { text: dto.text, projectId: dto.projectId });
	}

	@Delete(":id")
	@HttpCode(204)
	remove(@Session() session: UserSession, @Param("id") id: string) {
		return this.knowledge.remove(session.user.id, id);
	}
}
