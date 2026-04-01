import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { leads } from '$db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid lead ID format');

const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'responded', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost', 'dormant']).optional(),
  source: z.enum(['facebook', 'instagram', 'tiktok', 'google', 'walk_in', 'referral', 'dm', 'email', 'phone', 'website', 'other']).optional(),
  business: z.enum(['silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle']).optional(),
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  interest: z.string().optional().nullable(),
  estimatedValue: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  lastContactedAt: z.string().optional().nullable(),
  nextFollowUpAt: z.string().optional().nullable(),
  convertedAt: z.string().optional().nullable(),
  convertedValue: z.number().optional().nullable(),
  lostReason: z.string().optional().nullable(),
  dmsSent: z.number().int().optional(),
  dmsReceived: z.number().int().optional(),
  callsMade: z.number().int().optional(),
}).strict();

export const PATCH: RequestHandler = async ({ request, platform, params }) => {
  try {
    const idResult = uuidSchema.safeParse(params.id);
    if (!idResult.success) {
      return json({ error: 'Invalid lead ID format' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const data = { ...parsed.data } as Record<string, unknown>;

    // Handle date fields
    if (data.lastContactedAt) data.lastContactedAt = new Date(data.lastContactedAt as string);
    if (data.nextFollowUpAt) data.nextFollowUpAt = new Date(data.nextFollowUpAt as string);
    if (data.convertedAt) data.convertedAt = new Date(data.convertedAt as string);

    const db = getDb(platform?.env ?? {});

    const [updated] = await db.update(leads)
      .set({ ...data, updatedAt: new Date() })
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
    const idResult = uuidSchema.safeParse(params.id);
    if (!idResult.success) {
      return json({ error: 'Invalid lead ID format' }, { status: 400 });
    }

    const db = getDb(platform?.env ?? {});
    await db.delete(leads).where(eq(leads.id, params.id));
    return json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/leads/${params.id} error:`, err);
    return json({ error: 'Failed to delete lead' }, { status: 500 });
  }
};
