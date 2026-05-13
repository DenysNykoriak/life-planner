import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
	constructor(private readonly projects: ProjectsService) {}

	@Post()
	create(@Session() session: UserSession, @Body() dto: CreateProjectDto) {
		return this.projects.create(session.user.id, dto.name);
	}

	@Get()
	findAll(@Session() session: UserSession) {
		return this.projects.findAll(session.user.id);
	}

	@Delete(":id")
	@HttpCode(204)
	remove(@Session() session: UserSession, @Param("id") id: string) {
		return this.projects.remove(session.user.id, id);
	}
}
