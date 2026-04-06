export interface Painting {
	slug: string;
	title: string;
	medium: string;
	dimensions: string;
	year: number;
	price: number | null;
	status: 'available' | 'sold' | 'commissioned' | 'nfs';
	imageUrl: string;
	description?: string;
}

// Populate imageUrl from /admin/assets after uploading painting photos
export const paintings: Painting[] = [];
