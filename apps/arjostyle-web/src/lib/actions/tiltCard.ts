import type { Action } from 'svelte/action';
import { browser } from '$app/environment';

interface TiltParams {
	maxTilt?: number;
	scale?: number;
	glare?: boolean;
}

export const tiltCard: Action<HTMLElement, TiltParams | undefined> = (node, params = {}) => {
	if (!browser) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const maxTilt = params?.maxTilt ?? 8;
	const scale = params?.scale ?? 1.02;

	node.style.transformStyle = 'preserve-3d';
	node.style.transition = 'transform 0.15s ease-out';

	function handleMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		const rotateX = (0.5 - y) * maxTilt;
		const rotateY = (x - 0.5) * maxTilt;
		node.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
	}

	function handleLeave() {
		node.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
		node.style.transition = 'transform 0.4s ease-out';
	}

	function handleEnter() {
		node.style.transition = 'transform 0.15s ease-out';
	}

	node.addEventListener('mousemove', handleMove);
	node.addEventListener('mouseleave', handleLeave);
	node.addEventListener('mouseenter', handleEnter);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMove);
			node.removeEventListener('mouseleave', handleLeave);
			node.removeEventListener('mouseenter', handleEnter);
			node.style.transform = '';
			node.style.transition = '';
			node.style.transformStyle = '';
		}
	};
};
