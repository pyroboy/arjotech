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
		slug: 'sakura-branch-fine-line',
		title: 'Sakura Branch',
		style: 'Fine Line / Japanese',
		size: 'small',
		price: 180,
		available: true,
		imageUrl:
			'http://hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-14%2Fe862ebc2-e966-4d4e-9cc2-fd81668786aa_aigc.jpeg',
		description: 'Delicate sakura branch with three blossoms. Single-needle fine line work.',
		tags: ['japanese', 'floral', 'fine-line', 'sakura']
	},
	{
		slug: 'wave-koi-rib',
		title: 'Koi & Wave',
		style: 'Traditional / Japanese',
		size: 'medium',
		price: 320,
		available: true,
		imageUrl:
			'http://hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-14%2F260be4fe-4e07-421d-9320-dbce5d7c0f71_aigc.jpeg',
		description: 'Bold wave with koi motif. Classic tebori-inspired linework.',
		tags: ['japanese', 'wave', 'koi', 'traditional']
	},
	{
		slug: 'wave-hanko-seal',
		title: 'Hanko Seal Wave',
		style: 'Traditional / Bold Line',
		size: 'small',
		price: 150,
		available: true,
		imageUrl:
			'http://hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-14%2Fb20a309a-7016-4985-8b4d-eb0266b1b49b_aigc.jpeg',
		description: 'Hanko seal style bold wave with cherry blossom. Red and black ink.',
		tags: ['japanese', 'hanko', 'bold', 'wave', 'traditional']
	}
];
