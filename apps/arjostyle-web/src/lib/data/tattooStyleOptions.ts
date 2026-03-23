export interface TattooStyle {
	id: string;
	name: string;
	imageUrl: string;
	description: string;
}

export const TATTOO_STYLES: TattooStyle[] = [
	{
		id: 'traditional',
		name: 'Traditional',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/traditional_tattoo.jpg',
		description: 'Bold outlines, limited color palette, classic American style'
	},
	{
		id: 'neo-traditional',
		name: 'Neo-Traditional',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/neo_traditional_tattoo.jpg',
		description: 'Modern take on traditional with more detail and colors'
	},
	{
		id: 'japanese',
		name: 'Japanese',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/japanese_tattoo.jpg',
		description: 'Irezumi style, bold designs with cultural motifs'
	},
	{
		id: 'blackwork',
		name: 'Blackwork',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/blackwork_tattoo.jpg',
		description: 'Solid black ink, geometric or illustrative designs'
	},
	{
		id: 'fineline',
		name: 'Fine Line',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/fineline_tattoo.jpg',
		description: 'Delicate thin lines, minimalist and detailed'
	},
	{
		id: 'geometric',
		name: 'Geometric',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/geometric_tattoo.jpg',
		description: 'Mathematical patterns, sacred geometry, clean lines'
	},
	{
		id: 'dotwork',
		name: 'Dotwork',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/dotwork_tattoo.jpg',
		description: 'Made entirely of dots, stippling technique'
	},
	{
		id: 'realism',
		name: 'Realism',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/realism_tattoo.jpg',
		description: 'Photo-realistic artwork, high detail'
	},
	{
		id: 'watercolor',
		name: 'Watercolor',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/watercolor_tattoo.jpg',
		description: 'Fluid color washes, painterly effect'
	},
	{
		id: 'tribal',
		name: 'Tribal',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/tribal_tattoo.jpg',
		description: 'Cultural patterns, bold black, traditional motifs'
	},
	{
		id: 'minimalist',
		name: 'Minimalist',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/minimalist_tattoo.jpg',
		description: 'Simple, clean designs with minimal elements'
	},
	{
		id: 'illustrative',
		name: 'Illustrative',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/illustrative_tattoo.jpg',
		description: 'Comic/book illustration style'
	},
	{
		id: 'lettering',
		name: 'Lettering',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/lettering_tattoo.jpg',
		description: 'Typography, quotes, calligraphy'
	},
	{
		id: 'surrealism',
		name: 'Surrealism',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/surrealism_tattoo.jpg',
		description: 'Dream-like, abstract, fantastical imagery'
	},
	{
		id: 'portrait',
		name: 'Portrait',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/portrait_tattoo.jpg',
		description: 'Realistic faces and figures'
	},
	{
		id: 'nature',
		name: 'Nature / Botanical',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/nature_tattoo.jpg',
		description: 'Flowers, plants, animals, natural elements'
	},
	{
		id: 'mandala',
		name: 'Mandala',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/mandala_tattoo.jpg',
		description: 'Circular spiritual and geometric designs'
	},
	{
		id: 'anime',
		name: 'Anime / Manga',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/anime_tattoo.jpg',
		description: 'Japanese animation and comic style'
	},
	{
		id: 'chicano',
		name: 'Chicano',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/chicano_tattoo.jpg',
		description: 'Black and grey, cultural Mexican-American art'
	},
	{
		id: 'biomechanical',
		name: 'Biomechanical',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/biomechanical_tattoo.jpg',
		description: 'Machine/organic hybrid, 3D effect'
	},
	{
		id: 'horror',
		name: 'Horror / Dark Art',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/horror_tattoo.jpg',
		description: 'Dark themes, macabre, gothic imagery'
	},
	{
		id: 'floral',
		name: 'Floral',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/floral_tattoo.jpg',
		description: 'Flowers and botanical elements as primary focus'
	},
	{
		id: 'abstract',
		name: 'Abstract',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/abstract_tattoo.jpg',
		description: 'Non-representational, expressive forms'
	},
	{
		id: 'blackgrey',
		name: 'Black & Grey',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/blackgrey_tattoo.jpg',
		description: 'Shading and tonal work without color'
	},
	{
		id: 'neojapo',
		name: 'Neo-Japanese',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/neojapo_tattoo.jpg',
		description: 'Modern Japanese fusion with contemporary elements'
	},
	{
		id: 'ignorant',
		name: 'Ignorant Style',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/ignorant_tattoo.jpg',
		description: "Raw, childlike, intentionally 'bad' aesthetic"
	},
	{
		id: 'sketch',
		name: 'Sketch',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/sketch_tattoo.jpg',
		description: 'Looks like a pencil sketch, rough lines'
	},
	{
		id: 'blackandgrey-realism',
		name: 'B&G Realism',
		imageUrl: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/bgr_tattoo.jpg',
		description: 'Hyper-realistic in black and grey tones'
	}
];
