/**
 * Shared auth types used by Supabase-backed auth state/actions.
 */

export interface AuthUser {
	uid: string;
	email: string | null;
	displayName: string | null;
	emailVerified: boolean;
	/**
	 * Refreshes this user's auth metadata from Supabase.
	 * Used by the verify-email flow to poll for confirmation updates.
	 */
	reload: () => Promise<void>;
}
