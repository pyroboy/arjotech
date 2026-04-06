import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { browser } from '$app/environment';

let initialized = false;

export function initGSAP() {
	if (!browser || initialized) return;
	gsap.registerPlugin(ScrollTrigger);
	initialized = true;
}

export function prefersReducedMotion(): boolean {
	if (!browser) return true;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
