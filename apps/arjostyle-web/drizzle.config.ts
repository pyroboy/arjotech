import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/lib/db/auth-schema-generated.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});