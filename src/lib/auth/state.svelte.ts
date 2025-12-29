/**
 * Manages reactive auth state using Svelte 5 runes.
 */

import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/config';

// Reactive auth state
export const authState = $state({
	user: null as User | null,
	loading: true as boolean
});

// Prevents duplicate listener registration in dev/HMR
let listenerRegistered = false;

// Initializes Firebase auth state listener
export function initAuth(): void {
	if (listenerRegistered) {
		return;
	}

	listenerRegistered = true;

	onAuthStateChanged(auth, (firebaseUser) => {
		authState.user = firebaseUser;
		authState.loading = false;
	});
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
	initAuth();
}
