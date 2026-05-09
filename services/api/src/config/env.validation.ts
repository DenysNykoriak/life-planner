import { plainToInstance } from "class-transformer";
import {
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	MinLength,
	validateSync,
} from "class-validator";

class Env {
	@IsOptional()
	@IsNumberString()
	PORT?: string;

	@IsString()
	@IsNotEmpty()
	DATABASE_URL!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(32)
	BETTER_AUTH_SECRET!: string;

	@IsString()
	@IsNotEmpty()
	API_URL!: string;

	@IsOptional()
	@IsString()
	FRONTEND_URL?: string;
}

export function validateEnv(config: Record<string, unknown>) {
	const validated = plainToInstance(Env, config, { enableImplicitConversion: true });
	const errors = validateSync(validated, { skipMissingProperties: false });
	if (errors.length > 0) {
		throw new Error(errors.map((e) => JSON.stringify(e.constraints)).join(", "));
	}
	return validated;
}
