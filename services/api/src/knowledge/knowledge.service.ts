import { Injectable, NotFoundException } from "@nestjs/common";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { TagsQueueService } from "./tags-queue.service";

const MODEL_ID = "ai/qwen3.5:9B-UD-Q4_K_XL";

type KnowledgeEntryDto = {
	id: string;
	rawText: string;
	tags: string[];
	projectId: string | null;
	createdAt: number;
};

@Injectable()
export class KnowledgeService {
	private readonly modelRunner: ReturnType<typeof createOpenAICompatible>;

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
		private readonly tagsQueue: TagsQueueService,
	) {
		const baseURL =
			this.config.get<string>("MODEL_RUNNER_URL") ??
			"http://localhost:12434/engines/llama.cpp/v1";
		this.modelRunner = createOpenAICompatible({
			name: "docker-model-runner",
			baseURL,
		});
	}

	async create(
		userId: string,
		text: string,
		projectId?: string,
	): Promise<KnowledgeEntryDto> {
		const entry = await this.prisma.knowledgeEntry.create({
			data: { userId, rawText: text, tags: [], projectId: projectId ?? null },
		});
		this.tagsQueue.enqueue(entry.id, async () => {
			const tags = await this.extractTags(text);
			await this.prisma.knowledgeEntry.update({ where: { id: entry.id }, data: { tags } });
		});
		return this.toDto(entry);
	}

	async update(
		userId: string,
		id: string,
		dto: { text?: string; projectId?: string | null },
	): Promise<KnowledgeEntryDto> {
		const existing = await this.prisma.knowledgeEntry.findFirst({
			where: { id, userId },
		});
		if (!existing) throw new NotFoundException("Knowledge entry not found");

		const data: { rawText?: string; tags?: string[]; projectId?: string | null } = {};

		if (dto.text !== undefined) {
			data.rawText = dto.text;
			data.tags = [];
		}
		if (dto.projectId !== undefined) {
			data.projectId = dto.projectId;
		}

		const entry = await this.prisma.knowledgeEntry.update({ where: { id }, data });

		if (dto.text !== undefined) {
			const textToTag = dto.text;
			this.tagsQueue.enqueue(id, async () => {
				const tags = await this.extractTags(textToTag);
				await this.prisma.knowledgeEntry.update({ where: { id }, data: { tags } });
			});
		}

		return this.toDto(entry);
	}

	async remove(userId: string, id: string): Promise<void> {
		const existing = await this.prisma.knowledgeEntry.findFirst({
			where: { id, userId },
		});
		if (!existing) throw new NotFoundException("Knowledge entry not found");
		await this.prisma.knowledgeEntry.delete({ where: { id } });
	}

	getQueue(): { id: string; position: number }[] {
		return this.tagsQueue.getQueuedIds().map((id, index) => ({ id, position: index + 1 }));
	}

	async findAll(userId: string): Promise<KnowledgeEntryDto[]> {
		const entries = await this.prisma.knowledgeEntry.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
		return entries.map((e) => this.toDto(e));
	}

	private async extractTags(text: string): Promise<string[]> {
		try {
			const { text: raw } = await generateText({
				model: this.modelRunner(MODEL_ID),
				prompt: `Assign 3 to 5 short topic tags (1–3 words each) to categorize this text. Reply with only a comma-separated list of tags, nothing else:\n\n${text.slice(0, 2000)}\n/no_think`,
			});
			const tags = raw
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			console.log(tags);
			if (tags.length > 0) return tags;
		} catch (error) {
			console.error(error);
		}
		return ["Uncategorized"];
	}

	private toDto(entry: {
		id: string;
		rawText: string;
		tags: string[];
		projectId: string | null;
		createdAt: Date;
	}): KnowledgeEntryDto {
		return {
			id: entry.id,
			rawText: entry.rawText,
			tags: entry.tags,
			projectId: entry.projectId,
			createdAt: entry.createdAt.getTime(),
		};
	}
}
