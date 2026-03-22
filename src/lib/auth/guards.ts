/**
 * Auth Guards Module
 *
 * Pure helper functions for evaluating auth status in protected layouts.
 * These functions are side-effect free — redirects based on the returned
 * status should be performed in an $effect, not inside the guard itself.
 */

import { authState } from './state.svelte';
import { getOnboardingStepByPath } from '$lib/config/features';

export type GuardStatus =
	| 'loading'
	| 'authenticated'
	| 'needs-auth'
	| 'needs-verification';

// Pure computation of auth status for protected route layouts.
// Must be used inside $derived — the caller is responsible for
// reacting to non-authenticated statuses via $effect (e.g. goto).
export function useProtectedRoute(): GuardStatus {
	if (authState.loading) return 'loading';
	if (authState.user === null) return 'needs-auth';
	if (!authState.user.emailVerified) return 'needs-verification';
	return 'authenticated';
}

// Returns true when the pathname matches one of the configured onboarding steps.
export function isOnboardingRoute(pathname: string): boolean {
	return getOnboardingStepByPath(pathname) !== undefined;
}