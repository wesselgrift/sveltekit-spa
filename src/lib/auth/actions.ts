/**
 * Auth Actions Module
 * 
 * This file contains all authentication action functions.
 */

import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
	confirmPasswordReset as firebaseConfirmPasswordReset,
	sendEmailVerification,
	signOut,
	type User
} from 'firebase/auth';
import { auth } from '../firebase/config';

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
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function logout(): Promise<void> {
	await signOut(auth);
}
