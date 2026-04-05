import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** POST — Generate the defaultMappings.ts content from KV data */
export const POST: RequestHandler = async ({ request, platform }) => {
	const kv = platform?.env?.ARJOSTYLE_KV;

	// Accept mappings from request body (already have the data client-side)
	const mappings = await request.json();
	if (!mappings || typeof mappings !== 'object') {
		return json({ error: 'Invalid mappings data' }, { status: 400 });
	}

	// Generate TypeScript file content
	const tsContent = generateTsFile(mappings);

	return json({
		success: true,
		content: tsContent,
		timestamp: new Date().toISOString(),
	});
};

function generateTsFile(mappings: Record<string, unknown>): string {
	const jsonStr = JSON.stringify(mappings, null, 2);

	// Convert JSON to TypeScript object syntax (unquote simple keys)
	const tsObj = jsonStr
		.replace(/"(\w+)":/g, (_, key) => `${key}:`)
		// Re-quote keys with spaces/special chars
		.replace(/^(\s+)(\w[\w\s&/()]+\w):/gm, (_, indent, key) => {
			if (/\s|&|\/|\(|\)/.test(key)) {
				return `${indent}"${key}":`;
			}
			return `${indent}${key}:`;
		});

	return `import type { BodyPartMappings } from '$types/mapping';

export const defaultBodyPartMappings: BodyPartMappings = ${tsObj};
`;
}
