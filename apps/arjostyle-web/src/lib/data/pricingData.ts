import { formatCurrency } from '$lib/utils/formatters';

export const MINIMUM_BASE_PRICE = 1000;

export const tattooTiers = [
	{
		label: 'Tiny',
		size: '1–2 inches',
		startingAt: MINIMUM_BASE_PRICE,
		description: 'Small symbols, initials, minimal linework',
		examples: ['Small symbols', 'Initials', 'Minimal linework']
	},
	{
		label: 'Small',
		size: '3–4 inches',
		startingAt: 1500,
		description: 'Simple designs with moderate detail',
		examples: ['Simple florals', 'Small animals', 'Script text']
	},
	{
		label: 'Medium',
		size: '5–8 inches',
		startingAt: 2500,
		description: 'Detailed pieces with shading and texture',
		examples: ['Detailed portraits', 'Complex florals', 'Full hand pieces']
	},
	{
		label: 'Large',
		size: '9–12 inches',
		startingAt: 4500,
		description: 'Full back panels, thigh pieces, large statement works',
		examples: ['Back panels', 'Thigh pieces', 'Large Japanese']
	},
	{
		label: 'Sleeve / Full Coverage',
		size: '12+ inches',
		startingAt: 6000,
		description: 'Multi-session full coverage — priced per session',
		examples: ['Full sleeves', 'Body suits', 'Full back']
	}
];

export const addOns = [
	{ label: 'Color', note: 'Additional charge per session' },
	{ label: 'Cover-up', note: 'Complexity-dependent, assessed in consultation' },
	{ label: 'Touch-up', note: 'One free touch-up within 2–3 months of healing' }
];

export const bookingTerms = [
	{ label: 'Deposit', value: '50% of total (non-refundable, secures your slot)' },
	{ label: 'Balance', value: 'Remaining 50% in cash on appointment day' },
	{ label: 'Payment', value: 'GCash or bank transfer for deposit; cash for balance' },
	{ label: 'Cancellation', value: '48–72 hours notice required to reschedule; deposit forfeited otherwise' },
	{ label: 'Touch-up', value: 'One free touch-up within 2–3 months, provided aftercare was followed' }
];

export const paintingPrices = [
	{ label: 'Small Canvas (up to 30×40 cm)', startingAt: 3500 },
	{ label: 'Medium Canvas (up to 50×60 cm)', startingAt: 6000 },
	{ label: 'Large Canvas (up to 80×100 cm)', startingAt: 10000 },
	{ label: 'Custom Commission', startingAt: null, note: 'Inquire for quote based on size and complexity' }
];

export const designPackages = [
	{
		label: 'Logo Design',
		startingAt: 2500,
		includes: ['3 initial concepts', '2 revision rounds', 'Final files (SVG, PNG, PDF)']
	},
	{
		label: 'Menu Design',
		startingAt: 1500,
		includes: ['Single-page menu layout', '1 revision round', 'Print-ready PDF']
	},
	{
		label: 'Brand Identity',
		startingAt: 8000,
		includes: ['Logo', 'Color palette', 'Typography', 'Business card', 'Brand guide PDF']
	}
];

export { formatCurrency };
