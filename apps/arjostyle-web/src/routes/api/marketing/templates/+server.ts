import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingTemplates } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const createTemplateSchema = z.object({
  business: z.enum(['silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle'], { message: 'Business is required' }),
  contentType: z.enum(['menu_image', 'promo_graphic', 'social_caption', 'story_post', 'reel_script', 'review_reply'], { message: 'Content type is required' }),
  name: z.string().min(1, 'Name is required'),
  promptTemplate: z.string().min(1, 'Prompt template is required'),
  captionTemplate: z.string().optional(),
  platform: z.enum(['facebook', 'tiktok', 'instagram', 'google_business'], { message: 'Platform is required' }),
  pipelineStage: z.enum(['awareness', 'interest', 'conversion', 'retention', 'advocacy'], { message: 'Pipeline stage is required' }),
  isActive: z.boolean().optional().default(true),
  variables: z.array(z.object({ key: z.string(), label: z.string(), defaultValue: z.string() })).optional(),
});

export const GET: RequestHandler = async ({ platform, url }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const business = url.searchParams.get('business');

    const results = await db.select().from(marketingTemplates).orderBy(desc(marketingTemplates.createdAt));

    let filtered = results;
    if (business) filtered = filtered.filter(r => r.business === business);

    return json(filtered);
  } catch (err) {
    console.error('GET /api/marketing/templates error:', err);
    return json({ error: 'Failed to fetch templates' }, { status: 500 });
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

    const parsed = createTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const db = getDb(platform?.env ?? {});

    const [created] = await db.insert(marketingTemplates).values({
      business: data.business,
      contentType: data.contentType,
      name: data.name,
      promptTemplate: data.promptTemplate,
      captionTemplate: data.captionTemplate,
      platform: data.platform,
      pipelineStage: data.pipelineStage,
      isActive: data.isActive,
      variables: data.variables,
    }).returning();

    return json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/marketing/templates error:', err);
    return json({ error: 'Failed to create template' }, { status: 500 });
  }
};
