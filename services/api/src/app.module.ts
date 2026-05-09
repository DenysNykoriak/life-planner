import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { createBetterAuth } from "./auth";
import { validateEnv } from "./config/env.validation";
import { PlansModule } from "./plans/plans.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: validateEnv,
		}),
		PrismaModule,
		AuthModule.forRootAsync({
			isGlobal: true,
			imports: [PrismaModule],
			inject: [PrismaService, ConfigService],
			useFactory: (prisma: PrismaService, config: ConfigService) => ({
				auth: createBetterAuth(prisma, {
					baseURL: config.getOrThrow<string>("API_URL"),
					secret: config.getOrThrow<string>("BETTER_AUTH_SECRET"),
					trustedOrigins: [config.get<string>("FRONTEND_URL") ?? "http://localhost:5173"],
				}),
				disableTrustedOriginsCors: true,
				bodyParser: {
					json: { limit: "2mb" },
					urlencoded: { limit: "2mb", extended: true },
				},
			}),
		}),
		PlansModule,
	],
})
export class AppModule {}
