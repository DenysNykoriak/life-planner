import { IsOptional, IsString, MinLength, ValidateIf } from "class-validator";

export class UpdateKnowledgeDto {
	@IsOptional()
	@IsString()
	@MinLength(1)
	text?: string;

	@IsOptional()
	@ValidateIf((o: UpdateKnowledgeDto) => o.projectId !== null)
	@IsString()
	projectId?: string | null;
}
