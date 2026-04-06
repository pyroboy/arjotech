import type { Action } from 'svelte/action';
import { browser } from '$app/environment';

interface CounterParams {
	target: number;
	suffix?: string;
	prefix?: string;
	duration?: number;
	decimal?: boolean;
}

export const animateCounter: Action<HTMLElement, CounterParams> = (node, params) => {
	if (!browser) return;

	const { target, suffix = '', prefix = '', duration = 1.5, decimal = false } = params;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.textContent = `${prefix}${decimal ? target.toFixed(1) : target}${suffix}`;
		return;
	}

	node.textContent = `${prefix}0${suffix}`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				observer.disconnect();
				animate();
			}
		},
		{ threshold: 0.5 }
	);

	function animate() {
		const start = performance.now();
		const durationMs = duration * 1000;

		function tick(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / durationMs, 1);
			const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
			const current = eased * target;

			node.textContent = `${prefix}${decimal ? current.toFixed(1) : Math.round(current)}${suffix}`;

			if (progress < 1) {
				requestAnimationFrame(tick);
			}
		}

		requestAnimationFrame(tick);
	}

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
