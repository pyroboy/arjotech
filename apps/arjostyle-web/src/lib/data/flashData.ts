export interface FlashDesign {
	slug: string;
	title: string;
	style: string;
	size: 'small' | 'medium' | 'large';
	price: number;
	available: boolean;
	imageUrl: string;
	description?: string;
	tags: string[];
}

export const flashDesigns: FlashDesign[] = [
	{
		slug: 'sakura-branch',
		title: 'Sakura Branch',
		style: 'Fine Line / Japanese',
		size: 'small',
		price: 1500,
		available: true,
		imageUrl: '/flash/flash-sakura-1.jpg',
		description: 'Delicate sakura branch with three blossoms. Single-needle fine line work.',
		tags: ['japanese', 'floral', 'fine-line', 'sakura']
	},
	{
		slug: 'wave-koi-dynamics',
		title: 'Koi & Wave',
		style: 'Traditional / Japanese',
		size: 'medium',
		price: 3500,
		available: true,
		imageUrl: '/flash/flash-wave-1.jpg',
		description: 'Bold wave with koi motif. Classic tebori-inspired linework.',
		tags: ['japanese', 'wave', 'koi', 'traditional']
	},
	{
		slug: 'hanko-seal-wave',
		title: 'Hanko Seal Wave',
		style: 'Traditional / Bold Line',
		size: 'small',
		price: 1800,
		available: true,
		imageUrl: '/flash/flash-hanko-1.jpg',
		description: 'Hanko seal style bold wave with cherry blossom. Red and black ink.',
		tags: ['japanese', 'hanko', 'bold', 'wave', 'traditional']
	},
	{
		slug: 'sakura-fine-pair',
		title: 'Sakura Pair',
		style: 'Fine Line / Japanese',
		size: 'small',
		price: 1500,
		available: true,
		imageUrl: '/flash/flash-sakura-2.jpg',
		description: 'Matched sakura blossoms on branch. Perfect as a pair placement.',
		tags: ['japanese', 'floral', 'fine-line', 'sakura', 'pair']
	},
	{
		slug: 'wave-spiral-1',
		title: 'Wave Spiral',
		style: 'Traditional / Japanese',
		size: 'small',
		price: 2000,
		available: true,
		imageUrl: '/flash/flash-wave-2.jpg',
		description: 'Dynamic spiral wave with bold outlines. High contrast traditional style.',
		tags: ['japanese', 'wave', 'bold', 'traditional']
	},
	{
		slug: 'wave-classic-3',
		title: 'Classic Wave',
		style: 'Traditional / Japanese',
		size: 'medium',
		price: 3500,
		available: true,
		imageUrl: '/flash/flash-wave-3.jpg',
		description: 'Classic ukiyo-e inspired wave. Timeless bold graphic composition.',
		tags: ['japanese', 'wave', 'ukiyo-e', 'traditional']
	}
];
