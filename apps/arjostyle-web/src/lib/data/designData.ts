export interface DesignProject {
	slug: string;
	title: string;
	client: string;
	category: 'logo' | 'menu' | 'brand' | 'signage' | 'other';
	year: number;
	imageUrl: string;
	beforeImageUrl?: string;
	description: string;
	tags: string[];
}

// Populate after gathering past design projects and uploading via /admin/assets (category: design)
export const designProjects: DesignProject[] = [];
