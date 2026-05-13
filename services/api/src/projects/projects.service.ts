import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type ProjectDto = {
	id: string;
	name: string;
	createdAt: number;
};

@Injectable()
export class ProjectsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userId: string, name: string): Promise<ProjectDto> {
		const project = await this.prisma.project.create({ data: { userId, name } });
		return this.toDto(project);
	}

	async findAll(userId: string): Promise<ProjectDto[]> {
		const projects = await this.prisma.project.findMany({
			where: { userId },
			orderBy: { createdAt: "asc" },
		});
		return projects.map((p) => this.toDto(p));
	}

	async remove(userId: string, id: string): Promise<void> {
		const existing = await this.prisma.project.findFirst({ where: { id, userId } });
		if (!existing) throw new NotFoundException("Project not found");
		await this.prisma.project.delete({ where: { id } });
	}

	private toDto(p: { id: string; name: string; createdAt: Date }): ProjectDto {
		return { id: p.id, name: p.name, createdAt: p.createdAt.getTime() };
	}
}
