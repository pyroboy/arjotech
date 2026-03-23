import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingContent } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = getDb(platform?.env ?? {});
  const business = url.searchParams.get('business');
  const status = url.searchParams.get('status');

  let query = db.select().from(marketingContent).orderBy(desc(marketingContent.createdAt));

  const results = await query;

  // Filter in JS for simplicity (Drizzle dynamic where is verbose)
  let filtered = results;
  if (business) filtered = filtered.filter(r => r.business === business);
  if (status) filtered = filtered.filter(r => r.status === status);

  return json(filtered);
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = getDb(platform?.env ?? {});
  const body = await request.json();

  const [created] = await db.insert(marketingContent).values({
    business: body.business,
    contentType: body.contentType,
    platform: body.platform,
    pipelineStage: body.pipelineStage,
    status: body.status || 'draft',
    title: body.title,
    caption: body.caption,
    imageUrl: body.imageUrl,
    imagePrompt: body.imagePrompt,
    hashtags: body.hashtags,
    scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    aiModel: body.aiModel,
    aiPromptUsed: body.aiPromptUsed,
    generationCost: body.generationCost,
    notes: body.notes,
  }).returning();

  return json(created, { status: 201 });
};
