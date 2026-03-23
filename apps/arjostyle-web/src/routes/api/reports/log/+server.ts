import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { kpiActivityLog } from '$lib/db/schema';

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = getDb(platform?.env ?? {});
  const body = await request.json();

  const [created] = await db
    .insert(kpiActivityLog)
    .values({
      business: body.business,
      category: body.category,
      action: body.action,
      value: body.value || 1,
      metadata: body.metadata,
      notes: body.notes,
    })
    .returning();

  return json(created, { status: 201 });
};
