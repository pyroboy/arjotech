import { json, type RequestHandler } from '@sveltejs/kit';
import { getDb } from '$db/index';
import { schedulingSlots } from '$db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, platform }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const date = url.searchParams.get('date');

    if (!date) {
      return json({ error: 'date parameter required' }, { status: 400 });
    }

    const slots = await db
      .select()
      .from(schedulingSlots)
      .where(eq(schedulingSlots.date, date));

    return json(slots);
  } catch {
    // Database not configured — return empty slots for prototype
    return json([]);
  }
};
