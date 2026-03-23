import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingTemplates } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = getDb(platform?.env ?? {});
  const business = url.searchParams.get('business');

  const results = await db.select().from(marketingTemplates).orderBy(desc(marketingTemplates.createdAt));

  let filtered = results;
  if (business) filtered = filtered.filter(r => r.business === business);

  return json(filtered);
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = getDb(platform?.env ?? {});
  const body = await request.json();

  const [created] = await db.insert(marketingTemplates).values({
    business: body.business,
    contentType: body.contentType,
    name: body.name,
    promptTemplate: body.promptTemplate,
    captionTemplate: body.captionTemplate,
    platform: body.platform,
    pipelineStage: body.pipelineStage,
    isActive: body.isActive ?? true,
    variables: body.variables,
  }).returning();

  return json(created, { status: 201 });
};
