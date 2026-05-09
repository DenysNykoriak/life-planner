import type { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI } from "better-auth/plugins";

export type BetterAuthEnv = {
	baseURL: string;
	secret: string;
	trustedOrigins: string[];
};

export function createBetterAuth(prisma: PrismaClient, env: BetterAuthEnv) {
	return betterAuth({
		secret: env.secret,
		baseURL: env.baseURL,
		basePath: "/auth",
		trustedOrigins: env.trustedOrigins,
		database: prismaAdapter(prisma, {
			provider: "postgresql",
		}),
		emailAndPassword: {
			enabled: true,
		},
		plugins: [bearer(), openAPI({ disableDefaultReference: true })],
	});
}
