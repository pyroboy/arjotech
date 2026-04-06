import type { Action } from 'svelte/action';
import { browser } from '$app/environment';

interface ScrollRevealParams {
	y?: number;
	x?: number;
	scale?: number;
	opacity?: number;
	duration?: number;
	delay?: number;
	stagger?: number;
	children?: boolean;
	start?: string;
	once?: boolean;
}

export const scrollReveal: Action<HTMLElement, ScrollRevealParams | undefined> = (
	node,
	params = {}
) => {
	if (!browser) return;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let trigger: any = null;

	async function setup(p: ScrollRevealParams) {
		const { prefersReducedMotion } = await import('$lib/utils/gsap');
		if (prefersReducedMotion()) return;

		const { gsap } = await import('$lib/utils/gsap');

		const {
			y = 40,
			x = 0,
			scale = 1,
			opacity = 0,
			duration = 0.8,
			delay = 0,
			stagger = 0.1,
			children = false,
			start = 'top 85%',
			once = true
		} = p;

		const targets = children ? node.children : node;

		gsap.set(targets, { y, x, scale, opacity });

		const tween = gsap.to(targets, {
			y: 0,
			x: 0,
			scale: 1,
			opacity: 1,
			duration,
			delay,
			stagger: children ? stagger : 0,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: node,
				start,
				toggleActions: once ? 'play none none none' : 'play reverse play reverse'
			}
		});

		trigger = tween.scrollTrigger;
	}

	setup(params ?? {});

	return {
		update(newParams) {
			if (trigger) {
				trigger.kill();
				trigger = null;
			}
			setup(newParams ?? {});
		},
		destroy() {
			if (trigger) {
				trigger.kill();
			}
		}
	};
};
