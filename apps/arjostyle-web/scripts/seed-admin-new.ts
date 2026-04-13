import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { user, account } from '../src/lib/db/auth-schema-generated';
import { hashPassword } from '../src/lib/server/kv-session';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'arjomagno@gmail.com';
const ADMIN_PASSWORD = 'Arjo@2026!Secure';
const ADMIN_NAME = 'Arjo Magno';

async function seedAdmin() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema: { user, account } });

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL))
    .limit(1);

  if (existingUser) {
    console.log('Admin user already exists:', existingUser.email);
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.userId, existingUser.id));
    console.log('Password updated');
    return;
  }

  const userId = crypto.randomUUID();
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);

  await db.insert(user).values({
    id: userId,
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: 'local',
    providerId: 'credential',
    userId: userId,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Admin user created:', ADMIN_EMAIL);
  console.log('Password:', ADMIN_PASSWORD);

  await pool.end();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
