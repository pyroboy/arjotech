import { browser } from '$app/environment';
import { prefersReducedMotion } from './gsap';

let lenis: InstanceType<typeof import('@studio-freight/lenis').default> | null = null;

export async function initSmoothScroll() {
	if (!browser || prefersReducedMotion()) return;

	const { default: Lenis } = await import('@studio-freight/lenis');
	const { gsap, ScrollTrigger } = await import('./gsap');

	lenis = new Lenis({
		duration: 0.4,
		easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		smoothWheel: true,
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		touchMultiplier: 2
	});

	lenis.on('scroll', ScrollTrigger.update);

	gsap.ticker.add((time: number) => {
		lenis?.raf(time * 1000);
	});
	gsap.ticker.lagSmoothing(0);
}

export function destroySmoothScroll() {
	if (lenis) {
		lenis.destroy();
		lenis = null;
	}
}
