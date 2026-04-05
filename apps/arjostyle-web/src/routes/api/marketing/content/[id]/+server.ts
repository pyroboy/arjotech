import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingContent } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid content ID format');

const updateContentSchema = z.object({
  business: z.enum(['silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle']).optional(),
  contentType: z.enum(['menu_image', 'promo_graphic', 'social_caption', 'story_post', 'reel_script', 'review_reply']).optional(),
  platform: z.enum(['facebook', 'tiktok', 'instagram', 'google_business']).optional(),
  pipelineStage: z.enum(['awareness', 'interest', 'conversion', 'retention', 'advocacy']).optional(),
  status: z.enum(['draft', 'generated', 'approved', 'scheduled', 'published', 'failed']).optional(),
  title: z.string().min(1).optional(),
  caption: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imagePrompt: z.string().optional().nullable(),
  hashtags: z.array(z.string()).optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  aiModel: z.string().optional().nullable(),
  aiPromptUsed: z.string().optional().nullable(),
  generationCost: z.number().optional().nullable(),
  reach: z.number().int().optional().nullable(),
  engagement: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  shares: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
  approvedBy: z.string().optional().nullable(),
}).strict();

export const PATCH: RequestHandler = async ({ request, platform, params }) => {
  try {
    const idResult = uuidSchema.safeParse(params.id);
    if (!idResult.success) {
      return json({ error: 'Invalid content ID format' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = updateContentSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const db = getDb(platform?.env ?? {});

    const updateData = {
      ...parsed.data,
      updatedAt: new Date(),
      scheduledAt: typeof parsed.data.scheduledAt === 'string' ? new Date(parsed.data.scheduledAt) : parsed.data.scheduledAt,
      publishedAt: typeof parsed.data.publishedAt === 'string' ? new Date(parsed.data.publishedAt) : parsed.data.publishedAt,
    };

    const [updated] = await db.update(marketingContent)
      .set(updateData)
      .where(eq(marketingContent.id, params.id))
      .returning();

    if (!updated) return json({ error: 'Not found' }, { status: 404 });
    return json(updated);
  } catch (err) {
    console.error(`PATCH /api/marketing/content/${params.id} error:`, err);
    return json({ error: 'Failed to update content' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ platform, params }) => {
  try {
    const idResult = uuidSchema.safeParse(params.id);
    if (!idResult.success) {
      return json({ error: 'Invalid content ID format' }, { status: 400 });
    }

    const db = getDb(platform?.env ?? {});

    await db.delete(marketingContent)
      .where(eq(marketingContent.id, params.id));

    return json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/marketing/content/${params.id} error:`, err);
    return json({ error: 'Failed to delete content' }, { status: 500 });
  }
};
