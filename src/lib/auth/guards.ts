/**
 * Auth Guards Module
 * 
 * This file contains helper functions for route protection.
 */

import { goto } from '$app/navigation';
import type { Page } from '@sveltejs/kit';
import { authState } from './state.svelte';

// Check if user is authenticated, redirect to /login if not.
// Captures the original destination and includes it as a `next` query param
// so the user can be redirected back after successful login.
// Returns true if user is authenticated, false if redirected to login.
export function requireAuth(page: Page): boolean {
	if (authState.user === null) {
		// Capture original destination (pathname + search params)
		const destination = page.url.pathname + page.url.search;
		// Redirect to login with next param for redirect after auth
		goto(`/login?next=${encodeURIComponent(destination)}`);
		return false;
	}
	return true;
}

// Check if user's email is verified, redirect to /verify-email if not.
// Only checks if user is authenticated first (calls requireAuth).
// Captures the original destination and includes it as a `next` query param
// so the user can be redirected back after email verification.
// Returns true if email is verified, false if redirected.
export function requireVerifiedEmail(page: Page): boolean {
	// First check if user is authenticated
	if (!requireAuth(page)) {
		return false;
	}

	// Check if email is verified
	if (authState.user && !authState.user.emailVerified) {
		// Capture original destination (pathname + search params)
		const destination = page.url.pathname + page.url.search;
		// Redirect to verify-email page with next param for redirect after verification
		goto(`/verify-email?next=${encodeURIComponent(destination)}`);
		return false;
	}

	return true;
}
