import { flashDesigns } from '$lib/data/flashData';
import { error } from '@sveltejs/kit';

export const load = ({ params }: { params: { slug: string } }) => {
	const design = flashDesigns.find((d) => d.slug === params.slug);
	if (!design) throw error(404, 'Flash design not found');
	return { design };
};
