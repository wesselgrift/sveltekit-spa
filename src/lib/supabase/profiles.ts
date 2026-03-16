/**
 * Supabase profile persistence for auth-coupled user data.
 */

import { supabase } from './client';
import { onboardingStepCount } from '$lib/config/features';

export interface UserProfile {
	id: string;
	email: string | null;
	display_name: string | null;
	favorite_fruit?: string | null;
	favorite_drink?: string | null;
	onboarding_step?: number | null;
	onboarding_completed_at?: string | null;
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

// Reads the authenticated user's profile row from user_profiles.
// Returns null when no row is present yet.
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
	const { data: authData, error: authError } = await supabase.auth.getUser();
	if (authError) {
		throw authError;
	}

	if (!authData.user) {
		return null;
	}

	const { data, error } = await supabase
		.from('user_profiles')
		.select(
			'id, email, display_name, favorite_fruit, favorite_drink, onboarding_step, onboarding_completed_at, created_at'
		)
		.eq('id', authData.user.id)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data;
}

export interface UserProfileUpdate {
	email?: string | null;
	display_name?: string | null;
	favorite_fruit?: string | null;
	favorite_drink?: string | null;
	onboarding_step?: number | null;
	onboarding_completed_at?: string | null;
}

// Updates the authenticated user's profile row using partial fields.
export async function updateCurrentUserProfile(values: UserProfileUpdate): Promise<void> {
	const { data: authData, error: authError } = await supabase.auth.getUser();
	if (authError) {
		throw authError;
	}

	if (!authData.user) {
		throw new Error('No authenticated user found');
	}

	const { error } = await supabase.from('user_profiles').update(values).eq('id', authData.user.id);
	if (error) {
		throw error;
	}
}

// Persists one onboarding step field and marks progress.
export async function saveOnboardingStep(
	stepNumber: number,
	field: 'favorite_fruit' | 'favorite_drink',
	value: string
): Promise<void> {
	await updateCurrentUserProfile({
		[field]: value,
		onboarding_step: stepNumber
	});
}

// Completes onboarding with the final step field and completion timestamp.
export async function completeOnboarding(finalValue: string): Promise<void> {
	await updateCurrentUserProfile({
		favorite_drink: finalValue,
		onboarding_step: onboardingStepCount,
		onboarding_completed_at: new Date().toISOString()
	});
}

// Returns true when onboarding has explicitly been marked complete.
export function isOnboardingComplete(profile: UserProfile | null): boolean {
	return Boolean(profile?.onboarding_completed_at);
}

// Computes the next required onboarding step, clamped to the configured range.
export function getNextOnboardingStep(profile: UserProfile | null): number {
	if (!profile) {
		return 1;
	}

	if (isOnboardingComplete(profile)) {
		return onboardingStepCount;
	}

	const savedStep = profile.onboarding_step ?? 0;
	const nextStep = Math.min(Math.max(savedStep + 1, 1), onboardingStepCount);
	return nextStep;
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
