export interface Testimonial {
	id: string;
	clientName: string;
	clientHandle?: string;
	rating: number;
	quote: string;
	tattooStyle?: string;
	tattooImageUrl?: string;
	date: string;
	source: 'google' | 'instagram' | 'facebook' | 'direct';
}

// Seed with real testimonials after collecting from clients
export const testimonials: Testimonial[] = [];
