import type { RequestHandler } from './$types';
import { getDb } from '$db';
import { bookings } from '$db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ params, request, platform }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const { status } = await request.json();

    if (!status) {
      return json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return json({ error: 'Invalid status' }, { status: 400 });
    }

    await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, params.id));

    return json({ success: true });
  } catch (err) {
    console.error('Failed to update booking status:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ params, platform }) => {
  try {
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
