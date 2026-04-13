import type { RequestHandler } from './$types';
import { getDb } from '$db';
import { bookings } from '$db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid booking ID format');

const patchSchema = z.object({
  status: z.enum(['Available', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Needs Info', 'Conflict'], {
    message: 'Status is required',
  }),
});

export const PATCH: RequestHandler = async ({ params, request, platform }) => {
  try {
    const idResult = uuidSchema.safeParse(params.id);
    if (!idResult.success) {
      return json({ error: 'Invalid booking ID format' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const db = getDb(platform?.env ?? {});

    const [updated] = await db
      .update(bookings)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(bookings.id, params.id))
      .returning();

    if (!updated) {
      return json({ error: 'Booking not found' }, { status: 404 });
    }

    return json({ success: true });
  } catch (err) {
    console.error('Failed to update booking status:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ params, platform }) => {
  try {
    const idResult = uuidSchema.safeParse(params.id);
    if (!idResult.success) {
      return json({ error: 'Invalid booking ID format' }, { status: 400 });
    }

    const db = getDb(platform?.env ?? {});
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, params.id))
      .limit(1);

    if (!booking) {
      return json({ error: 'Booking not found' }, { status: 404 });
    }

    return json(booking);
  } catch (err) {
    console.error('Failed to fetch booking:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
