import type { PageServerLoad, Actions } from './$types';
import { createDb } from '$lib/db';
import { jobOpportunities } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const DATABASE_URL = process.env.DATABASE_URL;
	if (!DATABASE_URL) {
		return { jobs: [], error: 'DATABASE_URL not configured' };
	}

	const db = createDb(DATABASE_URL);

	const jobs = await db
		.select({
			id: jobOpportunities.id,
			title: jobOpportunities.title,
			company: jobOpportunities.company,
			url: jobOpportunities.url,
			source: jobOpportunities.source,
			fit: jobOpportunities.fit,
			payRange: jobOpportunities.payRange,
			location: jobOpportunities.location,
			remote: jobOpportunities.remote,
			jobType: jobOpportunities.jobType,
			status: jobOpportunities.status,
			notes: jobOpportunities.notes,
			fitSummary: jobOpportunities.fitSummary,
			yourTags: jobOpportunities.yourTags,
			jdSnippet: jobOpportunities.jdSnippet,
			foundAt: jobOpportunities.foundAt,
			appliedAt: jobOpportunities.appliedAt,
		})
		.from(jobOpportunities)
		.orderBy(desc(jobOpportunities.createdAt));

	// Normalize remote: 'true'/'Remote' → 'Remote', 'false'/'On-site' → 'On-site', null/other → 'Unknown'
	const normalized = jobs.map(j => {
		const r = (j.remote ?? '').toLowerCase();
		return {
			...j,
			remote: r === 'true' || r === 'remote' ? 'Remote' : r === 'false' || r === 'on-site' ? 'On-site' : 'Unknown',
		};
	});

	return { jobs: normalized };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const DATABASE_URL = process.env.DATABASE_URL;
		if (!DATABASE_URL) {
			return { success: false, error: 'DATABASE_URL not configured' };
		}
		const db = createDb(DATABASE_URL);
		const data = await request.formData();
		const id = data.get('id') as string;
		const status = data.get('status') as string;

		if (!id || !status) {
			return { success: false, error: 'Missing id or status' };
		}

		await db
			.update(jobOpportunities)
			.set({ status: status as any, updatedAt: new Date() })
			.where(eq(jobOpportunities.id, id));

		return { success: true };
	},
};
