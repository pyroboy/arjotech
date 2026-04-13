import { createDb } from '../src/lib/db';
import { sql } from 'drizzle-orm';

const db = createDb(process.env.DATABASE_URL!);

async function main() {
  await db.execute(sql`DROP TABLE IF EXISTS "session" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "account" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "verification" CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS "user" CASCADE`);
  console.log('Auth tables dropped');
}

main();