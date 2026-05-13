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
	@IsString()
	text!: string;

	@IsBoolean()
	completed!: boolean;

	@IsOptional()
	@IsInt()
	@Min(0)
	depth?: number;
}

export class UpdatePlanDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PlanItemInputDto)
	items!: PlanItemInputDto[];
}
