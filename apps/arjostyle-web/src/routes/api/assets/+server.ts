import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { mediaAssets } from '$db/schema';
import { eq, desc } from 'drizzle-orm';
import { checkRateLimit } from '$lib/server/rateLimit';
import { z } from 'zod';

const ALLOWED_CATEGORIES = [
	'tattoo',
	'painting',
	'flash',
	'design',
	'testimonial',
	'studio',
	'misc'
] as const;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB for admin uploads

// GET /api/assets?category=painting&limit=50&offset=0
export const GET: RequestHandler = async ({ url, platform }) => {
	try {
		const db = getDb(platform?.env ?? {});
		const category = url.searchParams.get('category') as (typeof ALLOWED_CATEGORIES)[number] | null;
		const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 200);
		const offset = parseInt(url.searchParams.get('offset') ?? '0');

		const query = db
			.select()
			.from(mediaAssets)
			.orderBy(desc(mediaAssets.displayOrder), desc(mediaAssets.createdAt))
			.limit(limit)
			.offset(offset);

		const results = category
			? await db
					.select()
					.from(mediaAssets)
					.where(eq(mediaAssets.category, category))
					.orderBy(desc(mediaAssets.displayOrder), desc(mediaAssets.createdAt))
					.limit(limit)
					.offset(offset)
			: await query;

		return json({ assets: results, total: results.length });
	} catch (err) {
		console.error('GET /api/assets error:', err);
		return json({ error: 'Failed to fetch assets' }, { status: 500 });
	}
};

const uploadSchema = z.object({
	category: z.enum(ALLOWED_CATEGORIES).default('misc'),
	title: z.string().optional(),
	altText: z.string().optional(),
	tags: z.string().optional() // comma-separated
});

// POST /api/assets — upload to R2 + save DB record
export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
	const ip = getClientAddress();
	if (!checkRateLimit(ip, 20, 60000)) {
		return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
	}

	try {
		const bucket = platform?.env?.ARJOSTYLE_BUCKET;
		if (!bucket) {
			return json({ error: 'R2 bucket not configured' }, { status: 500 });
		}

		let formData: FormData;
		try {
			formData = await request.formData();
		} catch {
			return json({ error: 'No file provided' }, { status: 400 });
		}
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}
		if (file.size > MAX_SIZE) {
			return json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
		}
		if (!ALLOWED_TYPES.includes(file.type)) {
			return json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF.' }, { status: 400 });
		}

		const parsed = uploadSchema.safeParse({
			category: formData.get('category'),
			title: formData.get('title'),
			altText: formData.get('altText'),
			tags: formData.get('tags')
		});
		if (!parsed.success) {
			return json({ error: parsed.error.flatten() }, { status: 400 });
		}
		const { category, title, altText, tags } = parsed.data;

		const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
		const key = `${category}/${Date.now()}-${sanitizedName}`;
		const buffer = await file.arrayBuffer();

		await bucket.put(key, buffer, {
			httpMetadata: { contentType: file.type }
		});

		const r2PublicUrl = process.env.R2_PUBLIC_URL ?? '';
		const fileUrl = `${r2PublicUrl}/${key}`;

		const db = getDb(platform?.env ?? {});
		const [asset] = await db
			.insert(mediaAssets)
			.values({
				key,
				url: fileUrl,
				originalFilename: file.name,
				mimeType: file.type,
				sizeBytes: file.size,
				category,
				title: title || file.name,
				altText,
				tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []
			})
			.returning();

		return json(asset, { status: 201 });
	} catch (err) {
		console.error('POST /api/assets error:', err);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
};
