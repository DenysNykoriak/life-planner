import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

export class PlanItemInputDto {
	@IsOptional()
	@IsString()
	id?: string;

	@IsString()
	text!: string;

	@IsBoolean()
	completed!: boolean;

	@IsInt()
	@Min(0)
	sortOrder!: number;
}

export class UpdatePlanDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PlanItemInputDto)
	items!: PlanItemInputDto[];
}
