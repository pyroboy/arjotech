import type { Action } from 'svelte/action';
import { browser } from '$app/environment';

interface MagneticParams {
	strength?: number;
}

export const magnetic: Action<HTMLElement, MagneticParams | undefined> = (node, params = {}) => {
	if (!browser) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const strength = params?.strength ?? 0.3;

	function handleMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = (e.clientX - cx) * strength;
		const dy = (e.clientY - cy) * strength;
		node.style.transform = `translate(${dx}px, ${dy}px)`;
		node.style.transition = 'transform 0.2s ease-out';
	}

	function handleLeave() {
		node.style.transform = 'translate(0, 0)';
		node.style.transition = 'transform 0.4s ease-out';
	}

	node.addEventListener('mousemove', handleMove);
	node.addEventListener('mouseleave', handleLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMove);
			node.removeEventListener('mouseleave', handleLeave);
			node.style.transform = '';
			node.style.transition = '';
		}
	};
};
