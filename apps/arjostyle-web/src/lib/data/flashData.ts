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

// Populate after designing flash pieces and uploading via /admin/assets (category: flash)
export const flashDesigns: FlashDesign[] = [];
