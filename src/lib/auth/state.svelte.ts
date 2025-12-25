/**
 * Auth State Module
 * 
 * This file manages the reactive auth state using Svelte 5 runes.
 */

import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/config';

// Create reactive state object that can be mutated
// Using an object allows us to mutate properties while keeping reactivity
// Components can import: import { authState } from '$lib/auth/state.svelte.ts'
// Then use reactively: {authState.user} or {authState.loading}
export const authState = $state({
	user: null as User | null,
	loading: true as boolean
});

// Export convenience references for direct access
// Components can import: import { user, loading } from '$lib/auth/state.svelte.ts'
// These maintain reactivity when authState properties change
export const user = $derived(authState.user);
export const loading = $derived(authState.loading);

// Module-level flag to prevent duplicate listener registration in dev/HMR
// In development, hot module reload can cause this module to re-execute,
// which would register multiple listeners and cause duplicate state updates.
let listenerRegistered = false;

// Initialize Firebase auth state listener.
// Sets up onAuthStateChanged to update user and loading state reactively.
// Only registers listener once, even if called multiple times (prevents HMR issues).
// Should be called once from root layout or app initialization.
export function initAuth(): void {
	// Prevent duplicate listener registration
	if (listenerRegistered) {
		return;
	}

	listenerRegistered = true;

	// Set up auth state listener
	// This fires immediately with current auth state, then on every auth change
	// Mutating authState properties triggers reactivity in components using them
	onAuthStateChanged(auth, (firebaseUser) => {
		authState.user = firebaseUser;
		// Set loading to false after first auth state check completes
		authState.loading = false;
	});
}

// Auto-initialize auth listener in browser context
// This ensures auth state is available immediately when the module is imported
// in browser environments, without requiring explicit initAuth() calls.
if (typeof window !== 'undefined') {
	initAuth();
}
