import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { getDb, authSchema } from "../db";

export function createAuth(env: { DATABASE_URL?: string; BASE_URL?: string } | { [key: string]: string }) {
  const url = (env as { DATABASE_URL?: string }).DATABASE_URL ?? process.env.DATABASE_URL;
  const baseUrl = (env as { BASE_URL?: string }).BASE_URL ?? process.env.BETTER_AUTH_URL ?? 'https://arjostyle.com';
  const db = getDb({ DATABASE_URL: url });
  
  return betterAuth({
    baseURL: baseUrl,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    trustedOrigins: ["https://arjostyle.com", "https://www.arjostyle.com", "http://localhost:5173"],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;