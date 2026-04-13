import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/db';
import { jobOpportunities } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform }) => {
	try {
		const db = getDb(platform?.env ?? {});

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

		const normalized = jobs.map(j => {
			let remoteDisplay = 'Unknown';
			if (typeof j.remote === 'boolean') {
				remoteDisplay = j.remote ? 'Remote' : 'On-site';
			} else if (typeof j.remote === 'string') {
				const r = j.remote.toLowerCase();
				remoteDisplay = r === 'true' || r === 'remote' ? 'Remote' : r === 'false' || r === 'on-site' ? 'On-site' : 'Unknown';
			}

			let tagsDisplay = '';
			if (Array.isArray(j.yourTags)) {
				tagsDisplay = (j.yourTags as string[]).join(', ');
			} else if (typeof j.yourTags === 'string') {
				tagsDisplay = j.yourTags;
			}

			return {
				...j,
				remote: remoteDisplay,
				yourTags: tagsDisplay,
			};
		});

		return { jobs: normalized };
	} catch (err) {
		console.error('Failed to load jobs:', err);
		return { jobs: [], error: 'Failed to load jobs' };
	}
};

export const actions: Actions = {
	updateStatus: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
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
		} catch (err) {
			console.error('Failed to update job status:', err);
			return { success: false, error: 'Failed to update status' };
		}
	},
};
