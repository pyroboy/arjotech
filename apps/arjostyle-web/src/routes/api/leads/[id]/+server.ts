import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { leads } from '$db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ request, platform, params }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const body = await request.json();

    // Handle date fields
    if (body.lastContactedAt) body.lastContactedAt = new Date(body.lastContactedAt);
    if (body.nextFollowUpAt) body.nextFollowUpAt = new Date(body.nextFollowUpAt);
    if (body.convertedAt) body.convertedAt = new Date(body.convertedAt);

    const [updated] = await db.update(leads)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(leads.id, params.id))
      .returning();

    if (!updated) return json({ error: 'Not found' }, { status: 404 });
    return json(updated);
  } catch (err) {
    console.error(`PATCH /api/leads/${params.id} error:`, err);
    return json({ error: 'Failed to update lead' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ platform, params }) => {
  try {
    const db = getDb(platform?.env ?? {});
    await db.delete(leads).where(eq(leads.id, params.id));
    return json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/leads/${params.id} error:`, err);
    return json({ error: 'Failed to delete lead' }, { status: 500 });
  }
};
