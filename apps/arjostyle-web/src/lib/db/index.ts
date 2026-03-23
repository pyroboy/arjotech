import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// For use in server-side SvelteKit load functions / API routes
export function getDb(env: { DATABASE_URL?: string } | { [key: string]: string }) {
  const url = (env as { DATABASE_URL?: string }).DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return createDb(url);
}
