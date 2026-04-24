import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { testimonials } from '$db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const SOURCES = ['google', 'instagram', 'facebook', 'direct'] as const;

const updateSchema = z.object({
	clientName: z.string().min(1).optional(),
	clientHandle: z.string().optional().nullable(),
	rating: z.number().int().min(1).max(5).optional(),
	quote: z.string().min(1).optional(),
	tattooStyle: z.string().optional().nullable(),
	tattooImageUrl: z.string().url().optional().nullable().or(z.literal('')),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	source: z.enum(SOURCES).optional(),
	isFeatured: z.boolean().optional(),
	displayOrder: z.number().int().optional()
});

// PATCH /api/testimonials/[id] — update a testimonial
export const PATCH: RequestHandler = async ({ params, request, platform }) => {
	try {
		const db = getDb(platform?.env ?? {});
		const body = await request.json();
		const parsed = updateSchema.safeParse(body);

		if (!parsed.success) {
			return json({ error: parsed.error.flatten() }, { status: 400 });
		}

		const updates: Record<string, unknown> = {
			...parsed.data,
			updatedAt: new Date()
		};

		// Clean up empty strings
		if (updates.tattooImageUrl === '') updates.tattooImageUrl = null;

		const [updated] = await db
			.update(testimonials)
			.set(updates)
			.where(eq(testimonials.id, params.id))
			.returning();

		if (!updated) {
			return json({ error: 'Testimonial not found' }, { status: 404 });
		}

		return json(updated);
	} catch (err) {
		console.error('PATCH /api/testimonials/[id] error:', err);
		return json({ error: 'Update failed' }, { status: 500 });
	}
};

// DELETE /api/testimonials/[id] — delete a testimonial
export const DELETE: RequestHandler = async ({ params, platform }) => {
	try {
		const db = getDb(platform?.env ?? {});

		const [existing] = await db
			.select()
			.from(testimonials)
			.where(eq(testimonials.id, params.id))
			.limit(1);

		if (!existing) {
			return json({ error: 'Testimonial not found' }, { status: 404 });
		}

		await db.delete(testimonials).where(eq(testimonials.id, params.id));

		return json({ deleted: true, id: params.id });
	} catch (err) {
		console.error('DELETE /api/testimonials/[id] error:', err);
		return json({ error: 'Delete failed' }, { status: 500 });
	}
};
