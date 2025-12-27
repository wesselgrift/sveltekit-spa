/**
 * Auth Guards Module
 * Helper functions for route protection and auth redirects.
 */

import { goto } from '$app/navigation';
import { page } from '$app/state';
import { authState } from './state.svelte';
import type { Page } from '@sveltejs/kit';

export type GuardStatus = 
	| 'loading'
	| 'redirecting'
	| 'authenticated'
	| 'needs-auth'
	| 'needs-verification';

// Reactive guard for protected route layouts. Handles redirects and returns status.
export function useProtectedRoute(): GuardStatus {
	if (authState.loading) {
		return 'loading';
	}

	if (authState.user === null) {
		if (page.url.pathname !== '/login') {
			const destination = page.url.pathname + page.url.search;
			goto(`/login?next=${encodeURIComponent(destination)}`);
			return 'redirecting';
		}
		return 'needs-auth';
	}

	if (!authState.user.emailVerified) {
		if (page.url.pathname !== '/verify-email') {
			const destination = page.url.pathname + page.url.search;
			goto(`/verify-email?next=${encodeURIComponent(destination)}`);
			return 'redirecting';
		}
		return 'needs-verification';
	}

	return 'authenticated';
}

// For use in load functions. Redirects to login if not authenticated.
export function requireAuth(page: Page): boolean {
	if (authState.user === null) {
		const destination = page.url.pathname + page.url.search;
		goto(`/login?next=${encodeURIComponent(destination)}`);
		return false;
	}
	return true;
}

// For use in load functions. Checks auth then email verification.
export function requireVerifiedEmail(page: Page): boolean {
	if (!requireAuth(page)) {
		return false;
	}

	if (authState.user && !authState.user.emailVerified) {
		const destination = page.url.pathname + page.url.search;
		goto(`/verify-email?next=${encodeURIComponent(destination)}`);
		return false;
	}

	return true;
}