import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { leads } from '$db/schema';
import { desc } from 'drizzle-orm';
import { z } from 'zod';

const createLeadSchema = z.object({
  business: z.enum(['silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle'], {
    required_error: 'Business is required',
  }),
  status: z.enum(['new', 'contacted', 'responded', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost', 'dormant']).optional().default('new'),
  source: z.enum(['facebook', 'instagram', 'tiktok', 'google', 'walk_in', 'referral', 'dm', 'email', 'phone', 'website', 'other']).optional().default('other'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')).or(z.literal(undefined)),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  interest: z.string().optional(),
  estimatedValue: z.number().optional(),
  notes: z.string().optional(),
  nextFollowUpAt: z.string().optional(),
});

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
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = createLeadSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = getDb(platform?.env ?? {});

    const [created] = await db.insert(leads).values({
      business: data.business,
      status: data.status,
      source: data.source,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      facebook: data.facebook,
      instagram: data.instagram,
      interest: data.interest,
      estimatedValue: data.estimatedValue,
      notes: data.notes,
      nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null,
    }).returning();

    return json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/leads error:', err);
    return json({ error: 'Failed to create lead' }, { status: 500 });
  }
};
