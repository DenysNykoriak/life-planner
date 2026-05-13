import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateKnowledgeDto {
	@IsString()
	@MinLength(1)
	text!: string;

	@IsOptional()
	@IsString()
	projectId?: string;
}
