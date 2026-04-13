import { createDb } from '../src/lib/db';
import { sql } from 'drizzle-orm';

const db = createDb(process.env.DATABASE_URL!);

async function dropOldTables() {
  try {
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS accounts CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS verifications CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    console.log('Old auth tables dropped');
  } catch (e) {
    console.error('Error dropping tables:', e);
  }
}

dropOldTables();