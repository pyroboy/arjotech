import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/db';
import { jobOpportunities, jobSources, jobKeywords, jobTags } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform }) => {
	try {
		const db = getDb(platform?.env ?? {});

		const [jobs, sources, keywords, tags] = await Promise.all([
			db.select({
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
				.orderBy(desc(jobOpportunities.createdAt)),
			db.select().from(jobSources).orderBy(jobSources.displayOrder),
			db.select().from(jobKeywords).orderBy(jobKeywords.keyword),
			db.select().from(jobTags).orderBy(jobTags.name),
		]);

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

		return { jobs: normalized, sources, keywords, tags };
	} catch (err) {
		console.error('Failed to load jobs:', err);
		return { jobs: [], sources: [], keywords: [], tags: [], error: 'Failed to load data' };
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

	addSource: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const name = data.get('name') as string;
			const baseUrl = data.get('baseUrl') as string;
			const searchPath = data.get('searchPath') as string || '';

			if (!name || !baseUrl) {
				return { success: false, error: 'Name and base URL are required' };
			}

			await db.insert(jobSources).values({
				name,
				baseUrl,
				searchPath,
			});

			return { success: true };
		} catch (err) {
			console.error('Failed to add source:', err);
			return { success: false, error: 'Failed to add source' };
		}
	},

	deleteSource: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const id = data.get('id') as string;

			if (!id) {
				return { success: false, error: 'Missing id' };
			}

			await db.delete(jobSources).where(eq(jobSources.id, id));
			return { success: true };
		} catch (err) {
			console.error('Failed to delete source:', err);
			return { success: false, error: 'Failed to delete source' };
		}
	},

	toggleSource: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const id = data.get('id') as string;
			const isActive = data.get('isActive') === 'true';

			await db.update(jobSources).set({ isActive: !isActive }).where(eq(jobSources.id, id));
			return { success: true };
		} catch (err) {
			console.error('Failed to toggle source:', err);
			return { success: false, error: 'Failed to toggle source' };
		}
	},

	addKeyword: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const keyword = data.get('keyword') as string;
			const sourceId = data.get('sourceId') as string || null;

			if (!keyword) {
				return { success: false, error: 'Keyword is required' };
			}

			await db.insert(jobKeywords).values({
				keyword,
				sourceId: sourceId || null,
			});

			return { success: true };
		} catch (err) {
			console.error('Failed to add keyword:', err);
			return { success: false, error: 'Failed to add keyword' };
		}
	},

	deleteKeyword: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const id = data.get('id') as string;

			if (!id) {
				return { success: false, error: 'Missing id' };
			}

			await db.delete(jobKeywords).where(eq(jobKeywords.id, id));
			return { success: true };
		} catch (err) {
			console.error('Failed to delete keyword:', err);
			return { success: false, error: 'Failed to delete keyword' };
		}
	},

	addTag: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const name = data.get('name') as string;
			const color = data.get('color') as string || '#fbbf24';
			const category = data.get('category') as string || null;

			if (!name) {
				return { success: false, error: 'Tag name is required' };
			}

			await db.insert(jobTags).values({ name, color, category });
			return { success: true };
		} catch (err) {
			console.error('Failed to add tag:', err);
			return { success: false, error: 'Failed to add tag' };
		}
	},

	deleteTag: async ({ request, platform }) => {
		try {
			const db = getDb(platform?.env ?? {});
			const data = await request.formData();
			const id = data.get('id') as string;

			if (!id) {
				return { success: false, error: 'Missing id' };
			}

			await db.delete(jobTags).where(eq(jobTags.id, id));
			return { success: true };
		} catch (err) {
			console.error('Failed to delete tag:', err);
			return { success: false, error: 'Failed to delete tag' };
		}
	},
};
