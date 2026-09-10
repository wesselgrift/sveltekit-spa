/**
 * Safe redirect validation for the `next` query parameter.
 * Prevents open redirect attacks by ensuring redirect targets
 * are relative paths within the app, not external URLs.
 */

// Validates that a redirect target is a safe relative path within the app.
// Returns the decoded path (plus search and hash) or the fallback.
// Rejects absolute URLs, protocol-relative URLs, backslash tricks and malformed encoding.
export function getSafeRedirect(next: string | null, fallback = '/app'): string {
	if (!next) return fallback;

	let decoded: string;
	try {
		decoded = decodeURIComponent(next);
	} catch {
		return fallback;
	}

	// Must be a plain path: no scheme, no protocol-relative URL, no backslashes.
	// Browsers resolve "/\evil.com" to "https://evil.com/", so backslashes are never safe.
	if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\')) {
		return fallback;
	}

	// Resolve against a fixed dummy origin. Anything that escapes it is rejected.
	const base = 'https://safe.invalid';
	let url: URL;
	try {
		url = new URL(decoded, base);
	} catch {
		return fallback;
	}
	if (url.origin !== base) return fallback;

	return url.pathname + url.search + url.hash;
}
