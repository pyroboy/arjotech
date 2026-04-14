import type { PageServerLoad } from './$types';
import { getDb } from '$lib/db';
import { jobOpportunities } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

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
				createdAt: jobOpportunities.createdAt,
			})
			.from(jobOpportunities)
			.orderBy(desc(jobOpportunities.createdAt));

		const normalized = jobs.map((j) => {
			let remoteDisplay = 'Unknown';
			if (typeof j.remote === 'boolean') {
				remoteDisplay = j.remote ? 'Remote' : 'On-site';
			} else if (typeof j.remote === 'string') {
				const r = j.remote.toLowerCase();
				remoteDisplay =
					r === 'true' || r === 'remote' ? 'Remote' : r === 'false' || r === 'on-site' ? 'On-site' : r || 'Unknown';
			}

			let tagsDisplay = '';
			if (Array.isArray(j.yourTags)) {
				tagsDisplay = (j.yourTags as string[]).join(', ');
			} else if (typeof j.yourTags === 'string') {
				tagsDisplay = j.yourTags;
			}

			return { ...j, remote: remoteDisplay, yourTags: tagsDisplay };
		});

		return { opportunities: normalized };
	} catch (err) {
		console.error('Failed to load opportunities:', err);
		return { opportunities: [], error: 'Failed to load opportunities' };
	}
};
