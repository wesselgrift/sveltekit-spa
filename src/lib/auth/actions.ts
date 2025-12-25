/**
 * Auth Actions Module
 * 
 * This file contains all authentication action functions.
 */

import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink,
	sendPasswordResetEmail,
	verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
	confirmPasswordReset as firebaseConfirmPasswordReset,
	sendEmailVerification,
	signOut,
	type User
} from 'firebase/auth';
import { auth } from '../firebase/config';
import {
	setMagicLinkEmail,
	getMagicLinkEmail,
	clearMagicLinkEmail
} from './storage';

// Sign in with email and password.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function loginWithEmail(email: string, password: string): Promise<void> {
	await signInWithEmailAndPassword(auth, email, password);
}

// Create a new account with email and password, then send verification email.
// The user will need to verify their email before they can access protected features.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function signupWithEmail(email: string, password: string): Promise<void> {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	// Automatically send verification email after account creation
	await sendEmailVerification(userCredential.user);
}

// Send magic link (passwordless sign-in) email to the user.
// Stores the email in localStorage for retrieval when the link is clicked.
// If `next` param is provided, it's appended to the magic link URL for redirect after sign-in.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function sendMagicLink(email: string, next?: string): Promise<void> {
	const actionCodeSettings = {
		handleCodeInApp: true,
		url: `${window.location.origin}/login${next ? `?next=${encodeURIComponent(next)}` : ''}`
	};

	await sendSignInLinkToEmail(auth, email, actionCodeSettings);
	// Store email for retrieval when link is clicked (handles same-device case)
	setMagicLinkEmail(email);
}

// Verify and complete magic link sign-in.
// Checks if the current URL contains a magic link, retrieves stored email,
// and completes the sign-in process. Handles the "different device" case
// where stored email might be missing (uses provided email parameter).
// Returns the `next` query param value if present, or null.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function verifyMagicLink(email?: string): Promise<string | null> {
	// Verify URL contains a magic link
	if (!isSignInWithEmailLink(auth, window.location.href)) {
		throw new Error('Invalid magic link');
	}

	// Retrieve stored email first (same device case)
	// If missing, use provided email parameter (different device case)
	const emailToUse = getMagicLinkEmail() || email;
	if (!emailToUse) {
		throw new Error('Email is required to verify magic link');
	}

	// Complete sign-in with email link
	await signInWithEmailLink(auth, emailToUse, window.location.href);

	// Clear stored email after successful sign-in
	clearMagicLinkEmail();

	// Extract and return next query param for redirect
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('next');
}

// Send password reset email to the user.
// The user will receive an email with a link to reset their password.
// Configure action URL in Firebase Console to point to your reset password handler page.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function resetPassword(email: string): Promise<void> {
	await sendPasswordResetEmail(auth, email);
}

// Verify password reset action code from URL.
// Returns the email address associated with the reset code.
// Throws Firebase auth errors if code is invalid or expired.
export async function verifyPasswordResetCode(code: string): Promise<string> {
	return await firebaseVerifyPasswordResetCode(auth, code);
}

// Confirm password reset with new password.
// Uses the action code from the reset email URL and sets the new password.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function confirmPasswordReset(code: string, newPassword: string): Promise<void> {
	await firebaseConfirmPasswordReset(auth, code, newPassword);
}

// Resend email verification to the current user.
// Useful when the user didn't receive the initial verification email or it expired.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function sendVerificationEmail(user: User): Promise<void> {
	await sendEmailVerification(user);
}

// Sign out the current user.
// Clears the auth state and also clears any stored magic link email.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function logout(): Promise<void> {
	await signOut(auth);
	// Clear magic link email on logout to prevent stale data
	clearMagicLinkEmail();
}
