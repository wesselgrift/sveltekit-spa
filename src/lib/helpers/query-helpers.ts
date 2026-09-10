/**
 * Query string builders shared by the auth pages.
 * Kept out of .svelte files so the plain URLSearchParams instance does not
 * trip svelte/prefer-svelte-reactivity (it is a throwaway, not state).
 */

// Builds the query string for the verify-email page: `?email=...&next=...`.
// `next` is omitted when null so the page falls back to its default target.
export function buildVerifyEmailQuery(email: string, next: string | null): string {
	const params = new URLSearchParams();
	params.set('email', email);
	if (next) {
		params.set('next', next);
	}
	return `?${params.toString()}`;
}
