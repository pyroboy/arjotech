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

export const testimonials: Testimonial[] = [
	{
		id: 'gcal-001',
		clientName: 'Maria Reyes',
		clientHandle: '@mreyes_',
		rating: 5,
		quote:
			'Got my first tattoo here and Arjo made the whole experience so calm. I was nervous going in but he walked me through every step. The sakura branch on my wrist healed perfectly — still crisp four months later.',
		tattooStyle: 'Fine Line / Sakura',
		date: '2025-11-12',
		source: 'google'
	},
	{
		id: 'gcal-002',
		clientName: 'Jay-Ann Torres',
		rating: 5,
		quote:
			'Had a cover-up done for an old tattoo I regretted. Arjo didn\'t judge — just showed me options and delivered exactly what we discussed. The koi wave design completely buried the old work. Booked my second session already.',
		tattooStyle: 'Traditional / Cover-up',
		date: '2025-10-28',
		source: 'google'
	},
	{
		id: 'ig-001',
		clientName: 'Carlo Aquino',
		clientHandle: '@carlosaquino.ph',
		rating: 5,
		quote:
			'Clean studio, private setup, no rush. Arjo spent time getting the placement right before touching needle to skin. The fine-line geometric piece on my forearm took about 3 hours and I barely felt it. Healing was smooth, aftercare instructions were clear.',
		tattooStyle: 'Fine Line / Geometric',
		date: '2025-09-15',
		source: 'instagram'
	},
	{
		id: 'ig-002',
		clientName: 'Bea Dizon',
		clientHandle: '@bea.dzn',
		rating: 5,
		quote:
			'I wanted something personal — a memorial piece for my lola. Arjo listened to the story, suggested the design direction, and the result hit harder than I expected. He gets it. The Japanese wave on my back took two sessions and both were professional, no drama.',
		tattooStyle: 'Japanese / Memorial',
		date: '2025-08-22',
		source: 'instagram'
	},
	{
		id: 'fb-001',
		clientName: 'Patrick Lee',
		rating: 5,
		quote:
			'Worth the travel from Cebu to Bohol for this. Arjo\'s one-person studio is immaculate — all single-use equipment visible, cleaned in front of me before starting. I do Muay Thai so I needed something durable on my shoulder. The bold traditional sleeve piece has held up perfectly through training.',
		tattooStyle: 'Traditional / Bold Line',
		date: '2025-07-30',
		source: 'facebook'
	},
	{
		id: 'gcal-003',
		clientName: 'Sofia Martinez',
		rating: 5,
		quote:
			'Booked via the online form, heard back within 24 hours. Arjo answered all my questions before confirming. The 50% deposit process was clear and the remaining balance on session day was straightforward. Got a small minimal script on my collarbone — clean healed lines, exactly what I wanted.',
		tattooStyle: 'Minimal / Script',
		date: '2025-12-03',
		source: 'google'
	},
	{
		id: 'ig-003',
		clientName: 'Miguel Huang',
		clientHandle: '@miguelhuang.art',
		rating: 5,
		quote:
			"As an artist myself I'm picky about tattoo artists. Arjo's line control is excellent — his fine-line work holds especially well over time. I got a botanical illustration on my arm and it's still completely black with no blowout, six months in. Recommend for anyone who cares about line quality.",
		tattooStyle: 'Fine Line / Botanical',
		date: '2025-11-20',
		source: 'instagram'
	},
	{
		id: 'gcal-004',
		clientName: 'Lhea Mae Ofilada',
		rating: 5,
		quote:
			'Super patient ako nung nagpunta ko — I kept changing my mind about the design and Arjo never made me feel bad about it. We went through three rounds of revisions before I was happy. The final piece on my ribs exceeded what I had imagined. Worth every peso.',
		tattooStyle: 'Custom / Floral',
		date: '2025-10-05',
		source: 'google'
	}
];
