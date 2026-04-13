import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingContent } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const createContentSchema = z.object({
  business: z.enum(['silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle'], { message: 'Business is required' }),
  contentType: z.enum(['menu_image', 'promo_graphic', 'social_caption', 'story_post', 'reel_script', 'review_reply'], { message: 'Content type is required' }),
  platform: z.enum(['facebook', 'tiktok', 'instagram', 'google_business'], { message: 'Platform is required' }),
  pipelineStage: z.enum(['awareness', 'interest', 'conversion', 'retention', 'advocacy'], { message: 'Pipeline stage is required' }),
  status: z.enum(['draft', 'generated', 'approved', 'scheduled', 'published', 'failed']).optional().default('draft'),
  title: z.string().min(1, 'Title is required'),
  caption: z.string().optional(),
  imageUrl: z.string().optional(),
  imagePrompt: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  scheduledAt: z.string().optional(),
  aiModel: z.string().optional(),
  aiPromptUsed: z.string().optional(),
  generationCost: z.number().optional(),
  notes: z.string().optional(),
});

export const GET: RequestHandler = async ({ platform, url }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const business = url.searchParams.get('business');
    const status = url.searchParams.get('status');

    const results = await db.select().from(marketingContent).orderBy(desc(marketingContent.createdAt));

    // Filter in JS for simplicity (Drizzle dynamic where is verbose)
    let filtered = results;
    if (business) filtered = filtered.filter(r => r.business === business);
    if (status) filtered = filtered.filter(r => r.status === status);

    return json(filtered);
  } catch (err) {
    console.error('GET /api/marketing/content error:', err);
    return json({ error: 'Failed to fetch marketing content' }, { status: 500 });
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

    const parsed = createContentSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = getDb(platform?.env ?? {});

    const [created] = await db.insert(marketingContent).values({
      business: data.business,
      contentType: data.contentType,
      platform: data.platform,
      pipelineStage: data.pipelineStage,
      status: data.status,
      title: data.title,
      caption: data.caption,
      imageUrl: data.imageUrl,
      imagePrompt: data.imagePrompt,
      hashtags: data.hashtags,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      aiModel: data.aiModel,
      aiPromptUsed: data.aiPromptUsed,
      generationCost: data.generationCost,
      notes: data.notes,
    }).returning();

    return json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/marketing/content error:', err);
    return json({ error: 'Failed to create marketing content' }, { status: 500 });
  }
};
