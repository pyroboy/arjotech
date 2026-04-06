import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { mediaAssets } from '$db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const patchSchema = z.object({
	title: z.string().optional(),
	altText: z.string().optional(),
	tags: z.array(z.string()).optional(),
	category: z
		.enum(['tattoo', 'painting', 'flash', 'design', 'testimonial', 'studio', 'misc'])
		.optional(),
	displayOrder: z.number().int().optional(),
	isPublic: z.boolean().optional()
});

// PATCH /api/assets/[id] — update metadata only (no file change)
export const PATCH: RequestHandler = async ({ params, request, platform }) => {
	try {
		const db = getDb(platform?.env ?? {});
		const body = await request.json();
		const parsed = patchSchema.safeParse(body);

		if (!parsed.success) {
			return json({ error: parsed.error.flatten() }, { status: 400 });
		}

		const updates: Record<string, unknown> = {
			...parsed.data,
			updatedAt: new Date()
		};

		const [updated] = await db
			.update(mediaAssets)
			.set(updates)
			.where(eq(mediaAssets.id, params.id))
			.returning();

		if (!updated) {
			return json({ error: 'Asset not found' }, { status: 404 });
		}

		return json(updated);
	} catch (err) {
		console.error('PATCH /api/assets/[id] error:', err);
		return json({ error: 'Update failed' }, { status: 500 });
	}
};

// DELETE /api/assets/[id] — remove from R2 + DB
export const DELETE: RequestHandler = async ({ params, platform }) => {
	try {
		const db = getDb(platform?.env ?? {});

		const [asset] = await db
			.select()
			.from(mediaAssets)
			.where(eq(mediaAssets.id, params.id))
			.limit(1);

		if (!asset) {
			return json({ error: 'Asset not found' }, { status: 404 });
		}

		const bucket = platform?.env?.ARJOSTYLE_BUCKET;
		if (bucket) {
			await bucket.delete(asset.key);
		}

		await db.delete(mediaAssets).where(eq(mediaAssets.id, params.id));

		return json({ deleted: true, key: asset.key });
	} catch (err) {
		console.error('DELETE /api/assets/[id] error:', err);
		return json({ error: 'Delete failed' }, { status: 500 });
	}
};
