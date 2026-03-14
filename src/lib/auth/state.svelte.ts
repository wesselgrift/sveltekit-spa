/**
 * Manages reactive auth state using Svelte 5 runes.
 */

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabase/client';
import { syncProfileForCurrentUser } from '$lib/supabase/profiles';
import type { AuthUser } from './types';

const PASSWORD_RECOVERY_FLAG = 'auth:password-recovery';

// Reactive auth state
export const authState = $state({
	user: null as AuthUser | null,
	loading: true as boolean
});

// Prevents duplicate listener registration in dev/HMR
let listenerRegistered = false;

// Normalizes Supabase user shape to the existing app-level auth shape.
function toAuthUser(user: SupabaseUser): AuthUser {
	const authUser: AuthUser = {
		uid: user.id,
		email: user.email ?? null,
		displayName: (user.user_metadata?.display_name as string | undefined) ?? null,
		emailVerified: Boolean(user.email_confirmed_at),
		reload: async () => {
			const latestUser = await fetchLatestUser();

			if (!latestUser) {
				authState.user = null;
				return;
			}

			// Keep the same object reference so call-sites awaiting reload can
			// inspect updated fields without waiting for a re-read from authState.
			authUser.uid = latestUser.id;
			authUser.email = latestUser.email ?? null;
			authUser.displayName =
				(latestUser.user_metadata?.display_name as string | undefined) ?? null;
			authUser.emailVerified = Boolean(latestUser.email_confirmed_at);
			authState.user = authUser;
		}
	};

	return authUser;
}

// Reads the latest authenticated user from Supabase.
async function fetchLatestUser(): Promise<SupabaseUser | null> {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		console.error('Failed to fetch latest auth user:', error);
		return null;
	}

	return data.user;
}

// Initializes Supabase auth state listener.
export function initAuth(): void {
	if (listenerRegistered) {
		return;
	}

	listenerRegistered = true;

	void supabase.auth
		.getSession()
		.then(({ data, error }) => {
			if (error) {
				console.error('Failed to read auth session:', error);
				authState.user = null;
				authState.loading = false;
				return;
			}

			authState.user = data.session?.user ? toAuthUser(data.session.user) : null;
			authState.loading = false;

			// Profile upsert must happen under an authenticated session to satisfy RLS.
			if (data.session?.user) {
				void syncProfileForCurrentUser().catch((profileError: unknown) => {
					console.error('Failed to sync user profile after session init:', profileError);
				});
			}
		})
		.catch((error: unknown) => {
			console.error('Unexpected auth initialization error:', error);
			authState.user = null;
			authState.loading = false;
		});

	supabase.auth.onAuthStateChange((event, session) => {
		authState.user = session?.user ? toAuthUser(session.user) : null;
		authState.loading = false;

		// Hash-based recovery links can land on "/#access_token=...&type=recovery".
		// Persist a short-lived flag for the set-new-password screen and redirect
		// there when recovery starts outside that route.
		if (event === 'PASSWORD_RECOVERY' && typeof window !== 'undefined') {
			window.sessionStorage.setItem(PASSWORD_RECOVERY_FLAG, '1');
			if (
				window.location.pathname !== '/set-new-password/' &&
				window.location.pathname !== '/set-new-password'
			) {
				void goto('/set-new-password/');
			}
		}

		// Keep profile row in sync when auth state changes (sign-in, token refresh, etc).
		if (session?.user) {
			void syncProfileForCurrentUser().catch((profileError: unknown) => {
				console.error('Failed to sync user profile after auth state change:', profileError);
			});
		}
	});
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
	initAuth();
}
