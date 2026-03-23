import type { PageServerLoad } from './$types';
import { getDb } from '$db';
import { bookings } from '$db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const allBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(100);
    return { bookings: allBookings };
  } catch (err) {
    console.error('Failed to load bookings:', err);
    return { bookings: [] };
  }
};
