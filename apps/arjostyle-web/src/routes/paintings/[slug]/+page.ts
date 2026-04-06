import { paintings } from '$lib/data/paintingsData';
import { error } from '@sveltejs/kit';

export const load = ({ params }: { params: { slug: string } }) => {
	const painting = paintings.find((p) => p.slug === params.slug);
	if (!painting) throw error(404, 'Painting not found');
	return { painting };
};
