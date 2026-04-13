import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { kpiActivityLog } from '$lib/db/schema';
import { z } from 'zod';

const logSchema = z.object({
  business: z.enum(['silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle'], { message: 'Business is required' }),
  category: z.string().min(1, 'Category is required'),
  action: z.string().min(1, 'Action is required'),
  value: z.number().optional().default(1),
  metadata: z.record(z.string(), z.any()).optional(),
  notes: z.string().optional(),
});

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = logSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = getDb(platform?.env ?? {});

    const [created] = await db
      .insert(kpiActivityLog)
      .values({
        business: data.business,
        category: data.category,
        action: data.action,
        value: data.value,
        metadata: data.metadata,
        notes: data.notes,
      })
      .returning();

    return json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/reports/log error:', err);
    return json({ error: 'Failed to log activity' }, { status: 500 });
  }
};
