import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import { TagsQueueService } from "./tags-queue.service";

@Module({
	imports: [PrismaModule],
	controllers: [KnowledgeController],
	providers: [KnowledgeService, TagsQueueService],
})
export class KnowledgeModule {}
