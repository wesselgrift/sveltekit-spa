/**
 * Auth Actions Module
 *
 * This file contains all authentication action functions.
 */

import { authState } from './state.svelte';
import type { AuthUser } from './types';
import { supabase } from '$lib/supabase/client';
import {
	deleteCurrentAuthUser,
	deleteUserProfile,
	syncProfileForCurrentUser,
	upsertUserProfile
} from '$lib/supabase/profiles';

function getRedirectUrl(path: string): string | undefined {
	if (typeof window === 'undefined') {
		return undefined;
	}

	return `${window.location.origin}${path}`;
}

function toUserSnapshot(user: {
	id: string;
	email?: string | null;
	email_confirmed_at?: string | null;
	user_metadata?: { display_name?: string };
}): AuthUser {
	return {
		uid: user.id,
		email: user.email ?? null,
		displayName: user.user_metadata?.display_name ?? null,
		emailVerified: Boolean(user.email_confirmed_at),
		reload: async () => {
			// The canonical reload behavior is handled by auth state.
			// This placeholder keeps this snapshot shape compatible.
		}
	};
}

async function getCurrentUserOrThrow(): Promise<AuthUser> {
	if (authState.user) {
		return authState.user;
	}

	const { data, error } = await supabase.auth.getUser();
	if (error || !data.user) {
		throw new Error('No user signed in');
	}

	return toUserSnapshot(data.user);
}

// Sign in with email and password.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function loginWithEmail(email: string, password: string): Promise<void> {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		throw error;
	}
}

// Create a new account with email and password, then send verification email.
// The user will need to verify their email before they can access protected features.
// Profile creation is handled after session establishment in auth state sync.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function signupWithEmail(firstName: string, lastName: string, email: string, password: string): Promise<void> {
	const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				display_name: displayName
			},
			emailRedirectTo: getRedirectUrl('/verify-email/')
		}
	});
	if (error) {
		throw error;
	}
}

// Send password reset email to the user.
// The user will receive an email with a link to reset their password.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function resetPassword(email: string): Promise<void> {
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: getRedirectUrl('/set-new-password/')
	});

	if (error) {
		throw error;
	}
}

// Verify password reset action code from URL.
// Returns the email address associated with the Supabase recovery token.
// Throws auth errors if token is invalid or expired.
export async function verifyPasswordResetCode(code: string): Promise<string> {
	const { data, error } = await supabase.auth.verifyOtp({
		type: 'recovery',
		token_hash: code
	});

	if (error) {
		throw error;
	}

	return data.user?.email ?? '';
}

// Confirm password reset with new password.
// Uses Supabase recovery token, then updates the password for that session.
export async function confirmPasswordReset(code: string, newPassword: string): Promise<void> {
	const { error: verifyError } = await supabase.auth.verifyOtp({
		type: 'recovery',
		token_hash: code
	});
	if (verifyError) {
		throw verifyError;
	}

	const { error: updateError } = await supabase.auth.updateUser({
		password: newPassword
	});
	if (updateError) {
		throw updateError;
	}
}

// Confirm password reset when Supabase already established a recovery session
// from a hash-based email link (e.g. #access_token=...&type=recovery).
export async function completeRecoveredPasswordReset(newPassword: string): Promise<void> {
	const { data, error: sessionError } = await supabase.auth.getSession();
	if (sessionError) {
		throw sessionError;
	}
	if (!data.session) {
		throw new Error('Password recovery session is missing. Please request a new reset link.');
	}

	const { error } = await supabase.auth.updateUser({
		password: newPassword
	});
	if (error) {
		throw error;
	}
}

// Resend email verification to the current user.
// Useful when the user didn't receive the initial verification email or it expired.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function sendVerificationEmail(user: AuthUser): Promise<void> {
	if (!user.email) {
		throw new Error('No user email available');
	}

	const { error } = await supabase.auth.resend({
		type: 'signup',
		email: user.email,
		options: {
			emailRedirectTo: getRedirectUrl('/verify-email/')
		}
	});
	if (error) {
		throw error;
	}
}

// Resend signup verification by email when no session is active yet.
export async function resendSignupVerification(email: string): Promise<void> {
	const { error } = await supabase.auth.resend({
		type: 'signup',
		email,
		options: {
			emailRedirectTo: getRedirectUrl('/verify-email/')
		}
	});
	if (error) {
		throw error;
	}
}

// Sign out the current user.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function logout(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}
}

// Change the user's email address.
// Requires the current password for re-authentication.
// Sends a verification email to the new address - email only updates after verification.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function changeEmail(currentPassword: string, newEmail: string): Promise<void> {
	const user = await getCurrentUserOrThrow();
	if (!user.email) {
		throw new Error('No user email available');
	}

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: currentPassword
	});
	if (signInError) {
		throw signInError;
	}

	const { error } = await supabase.auth.updateUser(
		{ email: newEmail },
		{ emailRedirectTo: getRedirectUrl('/verify-email/') }
	);
	if (error) {
		throw error;
	}
}

// Change the user's password.
// Requires the current password for re-authentication.
// Password updates immediately after successful call.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
	const user = await getCurrentUserOrThrow();
	if (!user.email) {
		throw new Error('No user email available');
	}

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: currentPassword
	});
	if (signInError) {
		throw signInError;
	}

	const { error } = await supabase.auth.updateUser({ password: newPassword });
	if (error) {
		throw error;
	}
}

// Delete the current user's account permanently.
// Requires the current password for re-authentication.
// This action is irreversible and will delete all user data.
// Deletes profile data first, then calls a SQL function that removes auth user.
// Throws Supabase auth errors that should be caught and displayed to the user.
export async function deleteAccount(currentPassword: string): Promise<void> {
	const user = await getCurrentUserOrThrow();
	if (!user.email) {
		throw new Error('No user email available');
	}

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: currentPassword
	});
	if (signInError) {
		throw signInError;
	}

	await deleteUserProfile(user.uid);

	await deleteCurrentAuthUser();
	await logout();
}

// Updates the display name metadata for the current auth user.
export async function updateDisplayName(displayName: string): Promise<void> {
	const { error } = await supabase.auth.updateUser({
		data: {
			display_name: displayName
		}
	});
	if (error) {
		throw error;
	}

	// Keep profile row consistent with auth metadata after display name updates.
	await syncProfileForCurrentUser();
}
