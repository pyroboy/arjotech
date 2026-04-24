import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { testimonials } from '$db/schema';
import { desc, eq } from 'drizzle-orm';
import { checkRateLimit } from '$lib/server/rateLimit';
import { z } from 'zod';

const SOURCES = ['google', 'instagram', 'facebook', 'direct'] as const;
type Source = (typeof SOURCES)[number];

// GET /api/testimonials — list all testimonials
export const GET: RequestHandler = async ({ url, platform }) => {
	try {
		const db = getDb(platform?.env ?? {});
		const source = url.searchParams.get('source') as Source | null;
		const featured = url.searchParams.get('featured');
		const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100'), 200);

		let results;
		if (source && SOURCES.includes(source)) {
			results = await db
				.select()
				.from(testimonials)
				.where(eq(testimonials.source, source))
				.orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt))
				.limit(limit);
		} else if (featured === 'true') {
			results = await db
				.select()
				.from(testimonials)
				.where(eq(testimonials.isFeatured, true))
				.orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt))
				.limit(limit);
		} else {
			results = await db
				.select()
				.from(testimonials)
				.orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt))
				.limit(limit);
		}

		return json({ testimonials: results, total: results.length });
	} catch (err) {
		console.error('GET /api/testimonials error:', err);
		return json({ error: 'Failed to fetch testimonials' }, { status: 500 });
	}
};

const createSchema = z.object({
	clientName: z.string().min(1, 'Client name is required'),
	clientHandle: z.string().optional(),
	rating: z.number().int().min(1).max(5),
	quote: z.string().min(1, 'Quote is required'),
	tattooStyle: z.string().optional(),
	tattooImageUrl: z.string().url().optional().or(z.literal('')),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
	source: z.enum(SOURCES).default('direct'),
	isFeatured: z.boolean().default(false),
	displayOrder: z.number().int().default(0)
});

// POST /api/testimonials — create a new testimonial
export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
	const ip = getClientAddress();
	if (!checkRateLimit(ip, 30, 60000)) {
		return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
	}

	try {
		const body = await request.json();
		const parsed = createSchema.safeParse(body);

		if (!parsed.success) {
			return json({ error: parsed.error.flatten() }, { status: 400 });
		}

		const db = getDb(platform?.env ?? {});
		const [testimonial] = await db
			.insert(testimonials)
			.values({
				clientName: parsed.data.clientName,
				clientHandle: parsed.data.clientHandle || null,
				rating: parsed.data.rating,
				quote: parsed.data.quote,
				tattooStyle: parsed.data.tattooStyle || null,
				tattooImageUrl: parsed.data.tattooImageUrl || null,
				date: parsed.data.date,
				source: parsed.data.source,
				isFeatured: parsed.data.isFeatured,
				displayOrder: parsed.data.displayOrder
			})
			.returning();

		return json(testimonial, { status: 201 });
	} catch (err) {
		console.error('POST /api/testimonials error:', err);
		return json({ error: 'Failed to create testimonial' }, { status: 500 });
	}
};
