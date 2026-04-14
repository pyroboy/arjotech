import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import * as authSchema from './auth-schema-generated';

export { schema, authSchema };

export function createDb(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema: { ...schema, ...authSchema } });
}

// For use in server-side SvelteKit load functions / API routes
export function getDb(env: { DATABASE_URL?: string } | { [key: string]: string }) {
  const url = (env as { DATABASE_URL?: string }).DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set — set it in Cloudflare Pages vars (production) or .env (local)'
    );
  }
  return createDb(url);
}
