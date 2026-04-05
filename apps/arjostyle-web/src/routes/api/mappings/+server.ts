import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { defaultBodyPartMappings } from '$lib/data/defaultMappings';
import { getDb } from '$lib/db';
import { bodyPartMappings } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { BodyPartMappings } from '$types/mapping';

const KV_KEY = 'body_part_mappings';

/** Convert DB rows to the nested BodyPartMappings format */
function rowsToMappings(rows: typeof bodyPartMappings.$inferSelect[]): BodyPartMappings {
	const result: BodyPartMappings = {};
	for (const row of rows) {
		if (!row.isActive) continue;
		if (!result[row.category]) result[row.category] = {};
		result[row.category][row.placement] = {
			position: [row.positionX, row.positionY, row.positionZ],
			scale: row.scale,
			cameraAzimuth: row.cameraAzimuth ?? undefined,
			cameraPolar: row.cameraPolar ?? undefined,
			cameraDistance: row.cameraDistance ?? undefined,
			placementSizeLimits: {
				min: row.sizeLimitMin ?? 0.5,
				max: row.sizeLimitMax ?? 12,
				multiplier: row.sizeLimitMultiplier ?? 1,
			},
			placementPainInfo: {
				level: row.painLevel ?? 1,
				reason: row.painReason ?? undefined,
			},
		};
	}
	return result;
}

/** Convert nested BodyPartMappings to flat DB rows for upsert */
function mappingsToRows(mappings: BodyPartMappings) {
	const rows: (typeof bodyPartMappings.$inferInsert)[] = [];
	for (const [category, placements] of Object.entries(mappings)) {
		for (const [placement, data] of Object.entries(placements)) {
			rows.push({
				category,
				placement,
				positionX: data.position[0],
				positionY: data.position[1],
				positionZ: data.position[2],
				scale: data.scale,
				cameraAzimuth: data.cameraAzimuth ?? null,
				cameraPolar: data.cameraPolar ?? null,
				cameraDistance: data.cameraDistance ?? null,
				sizeLimitMin: data.placementSizeLimits?.min ?? null,
				sizeLimitMax: data.placementSizeLimits?.max ?? null,
				sizeLimitMultiplier: data.placementSizeLimits?.multiplier ?? null,
				painLevel: data.placementPainInfo?.level ?? null,
				painReason: data.placementPainInfo?.reason ?? null,
				isActive: true,
			});
		}
	}
	return rows;
}

/** GET — Read from KV (fast) → fallback to Neon → fallback to defaults */
export const GET: RequestHandler = async ({ platform }) => {
	const kv = platform?.env?.ARJOSTYLE_KV;

	// 1. Try KV cache (fastest)
	if (kv) {
		const cached = await kv.get(KV_KEY, 'json');
		if (cached && typeof cached === 'object' && Object.keys(cached).length > 0) {
			return json(cached);
		}
	}

	// 2. Try Neon DB
	const dbUrl = platform?.env?.DATABASE_URL;
	if (dbUrl) {
		try {
			const db = getDb({ DATABASE_URL: dbUrl });
			const rows = await db.select().from(bodyPartMappings).where(eq(bodyPartMappings.isActive, true));
			if (rows.length > 0) {
				const mappings = rowsToMappings(rows);
				// Populate KV cache
				if (kv) await kv.put(KV_KEY, JSON.stringify(mappings));
				return json(mappings);
			}
		} catch (e) {
			console.error('Neon read error:', e);
		}
	}

	// 3. Fallback to hardcoded defaults, seed both stores
	if (kv) await kv.put(KV_KEY, JSON.stringify(defaultBodyPartMappings));
	return json(defaultBodyPartMappings);
};

/** PUT — Save to Neon (permanent) + KV (cache) */
export const PUT: RequestHandler = async ({ request, platform }) => {
	const body = await request.json() as BodyPartMappings;
	if (!body || typeof body !== 'object') {
		return json({ error: 'Invalid mappings data' }, { status: 400 });
	}

	const kv = platform?.env?.ARJOSTYLE_KV;
	const dbUrl = platform?.env?.DATABASE_URL;
	let savedToNeon = false;
	let savedToKV = false;

	// 1. Save to Neon (permanent)
	if (dbUrl) {
		try {
			const db = getDb({ DATABASE_URL: dbUrl });
			const rows = mappingsToRows(body);

			// Mark all existing as inactive, then insert new
			await db.update(bodyPartMappings).set({ isActive: false }).where(eq(bodyPartMappings.isActive, true));
			if (rows.length > 0) {
				await db.insert(bodyPartMappings).values(rows);
			}
			savedToNeon = true;
		} catch (e) {
			console.error('Neon write error:', e);
		}
	}

	// 2. Save to KV (cache)
	if (kv) {
		await kv.put(KV_KEY, JSON.stringify(body));
		savedToKV = true;
	}

	if (!savedToNeon && !savedToKV) {
		return json({ error: 'No storage available' }, { status: 503 });
	}

	return json({
		success: true,
		savedToNeon,
		savedToKV,
		timestamp: new Date().toISOString(),
	});
};
