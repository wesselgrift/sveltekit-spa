/**
 * Safe redirect validation for the `next` query parameter.
 * Prevents open redirect attacks by ensuring redirect targets
 * are relative paths within the app, not external URLs.
 */

// Validates that a redirect target is a safe relative path within the app.
// Rejects absolute URLs, protocol-relative URLs, and encoded bypass attempts.
export function getSafeRedirect(next: string | null, fallback = '/app'): string {
	if (!next) return fallback;

	let decoded: string;
	try {
		decoded = decodeURIComponent(next);
	} catch {
		return fallback;
	}

	if (!decoded.startsWith('/') || decoded.startsWith('//')) return fallback;

	const lower = decoded.toLowerCase();
	if (lower.includes('javascript:') || lower.includes('data:')) return fallback;

	return next;
}
