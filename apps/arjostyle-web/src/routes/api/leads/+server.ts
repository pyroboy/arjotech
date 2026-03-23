import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { leads } from '$db/schema';
import { desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ platform, url }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const business = url.searchParams.get('business');
    const status = url.searchParams.get('status');

    const results = await db.select().from(leads).orderBy(desc(leads.createdAt));

    let filtered = results;
    if (business) filtered = filtered.filter(r => r.business === business);
    if (status) filtered = filtered.filter(r => r.status === status);

    return json(filtered);
  } catch (err) {
    console.error('GET /api/leads error:', err);
    return json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const body = await request.json();

    const [created] = await db.insert(leads).values({
      business: body.business,
      status: body.status || 'new',
      source: body.source || 'other',
      name: body.name,
      phone: body.phone,
      email: body.email,
      facebook: body.facebook,
      instagram: body.instagram,
      interest: body.interest,
      estimatedValue: body.estimatedValue,
      notes: body.notes,
      nextFollowUpAt: body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null,
    }).returning();

    return json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/leads error:', err);
    return json({ error: 'Failed to create lead' }, { status: 500 });
  }
};
