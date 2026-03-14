/**
 * Supabase profile persistence for auth-coupled user data.
 */

import { supabase } from './client';

export interface UserProfile {
	id: string;
	email: string | null;
	display_name: string | null;
	created_at?: string;
}

// Ensures the authenticated user's profile row exists and is up to date.
// This must run only when a valid session is present so RLS allows the write.
export async function syncProfileForCurrentUser(): Promise<void> {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		throw error;
	}

	if (!data.user) {
		return;
	}

	await upsertUserProfile({
		id: data.user.id,
		email: data.user.email ?? null,
		display_name: (data.user.user_metadata?.display_name as string | undefined) ?? null
	});
}

// Creates or updates the current user's profile record.
export async function upsertUserProfile(profile: UserProfile): Promise<void> {
	const { error } = await supabase.from('user_profiles').upsert(profile);
	if (error) {
		throw error;
	}
}

// Deletes the current user's profile record by auth uid.
export async function deleteUserProfile(userId: string): Promise<void> {
	const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
	if (error) {
		throw error;
	}
}

// Calls an RLS-safe SQL function that deletes auth user + cascaded data.
export async function deleteCurrentAuthUser(): Promise<void> {
	const { error } = await supabase.rpc('delete_current_user');
	if (error) {
		throw error;
	}
}
