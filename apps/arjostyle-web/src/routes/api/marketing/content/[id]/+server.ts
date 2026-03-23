import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingContent } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ request, platform, params }) => {
  const db = getDb(platform?.env ?? {});
  const body = await request.json();

  const [updated] = await db.update(marketingContent)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(marketingContent.id, params.id))
    .returning();

  if (!updated) return json({ error: 'Not found' }, { status: 404 });
  return json(updated);
};

export const DELETE: RequestHandler = async ({ platform, params }) => {
  const db = getDb(platform?.env ?? {});

  await db.delete(marketingContent)
    .where(eq(marketingContent.id, params.id));

  return json({ ok: true });
};
