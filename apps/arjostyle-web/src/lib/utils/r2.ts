/**
 * Helpers for serving images from Cloudflare R2.
 * R2 has no built-in image transforms — we use native HTML attributes
 * for responsive loading instead of URL-based transforms.
 */

export function r2ImgProps(
	url: string,
	alt: string,
	sizes = '(max-width: 768px) 100vw, 50vw'
): { src: string; alt: string; loading: 'lazy'; sizes: string } {
	return { src: url, alt, loading: 'lazy', sizes };
}

/**
 * Returns a thumbnail URL. R2 doesn't transform, so this just returns
 * the same URL — swap this function if Cloudflare Images is added later.
 */
export function r2Thumb(url: string): string {
	return url;
}
