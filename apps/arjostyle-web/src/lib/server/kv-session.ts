import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { user, account } from "../db/auth-schema-generated";
import type { KVNamespace } from "@cloudflare/workers-types";

export const SESSION_COOKIE_NAME = "better-auth.session_token";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  createdAt: number;
  expiresAt: number;
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getKV(env: Record<string, unknown>): KVNamespace | null {
  const kv = env.ARJOSTYLE_KV;
  if (!kv || typeof kv !== "object") {
    console.warn("ARJOSTYLE_KV not configured");
    return null;
  }
  return kv as KVNamespace;
}

export async function createSession(
  env: Record<string, unknown>,
  userId: string
): Promise<string | null> {
  const kv = getKV(env);
  if (!kv) return null;

  const db = getDb({ DATABASE_URL: env.DATABASE_URL as string });
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userRecord) return null;

  const now = Date.now();
  const sessionData: SessionData = {
    userId,
    email: userRecord.email,
    name: userRecord.name,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  const token = generateToken();
  const key = `session:${token}`;

  try {
    await kv.put(key, JSON.stringify(sessionData), {
      expirationTtl: Math.floor(SESSION_TTL_MS / 1000),
    });
    return token;
  } catch (err) {
    console.error("Failed to create session in KV:", err);
    return null;
  }
}

export async function getSession(
  env: Record<string, unknown>,
  token: string
): Promise<SessionData | null> {
  const kv = getKV(env);
  if (!kv || !token) return null;

  const key = `session:${token}`;

  try {
    const data = await kv.get(key);
    if (!data) return null;

    const session: SessionData = JSON.parse(data);

    if (session.expiresAt < Date.now()) {
      await kv.delete(key);
      return null;
    }

    return session;
  } catch (err) {
    console.error("Failed to get session from KV:", err);
    return null;
  }
}

export async function deleteSession(
  env: Record<string, unknown>,
  token: string
): Promise<void> {
  const kv = getKV(env);
  if (!kv || !token) return;

  const key = `session:${token}`;
  try {
    await kv.delete(key);
  } catch (err) {
    console.error("Failed to delete session from KV:", err);
  }
}

export async function verifyCredentials(
  env: Record<string, unknown>,
  email: string,
  password: string
): Promise<{ userId: string; name: string } | null> {
  const db = getDb({ DATABASE_URL: env.DATABASE_URL as string });

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!userRecord) return null;

  const [accountRecord] = await db
    .select()
    .from(account)
    .where(eq(account.userId, userRecord.id))
    .limit(1);

  if (!accountRecord?.password) {
    console.error("No password found for user:", email);
    return null;
  }

  const bcrypt = await import("bcryptjs").catch(() => null);
  if (!bcrypt) {
    console.error("bcryptjs not available");
    return null;
  }

  try {
    const isValid = await bcrypt.compare(password, accountRecord.password);
    if (!isValid) return null;

    return { userId: userRecord.id, name: userRecord.name };
  } catch (err) {
    console.error("Password verification failed:", err);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 12);
}
