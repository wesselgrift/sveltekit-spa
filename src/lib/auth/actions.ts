/**
 * Auth Actions Module
 * 
 * This file contains all authentication action functions.
 */

import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
	sendPasswordResetEmail,
	verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
	confirmPasswordReset as firebaseConfirmPasswordReset,
	sendEmailVerification,
	signOut,
	reauthenticateWithCredential,
	EmailAuthProvider,
	verifyBeforeUpdateEmail,
	updatePassword,
	deleteUser,
	type User
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserDocument, deleteUserDocument } from '../firestore/users';

// Sign in with email and password.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function loginWithEmail(email: string, password: string): Promise<void> {
	await signInWithEmailAndPassword(auth, email, password);
}

// Create a new account with email and password, then send verification email.
// The user will need to verify their email before they can access protected features.
// Also creates a Firestore user document to store additional profile data.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function signupWithEmail(firstName: string, lastName: string, email: string, password: string): Promise<void> {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	
	// Set display name on Firebase Auth user
	await updateProfile(userCredential.user, {
		displayName: `${firstName.trim()} ${lastName.trim()}`
	});

	// Create user document in Firestore with profile data
	await createUserDocument(userCredential.user);
    
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

// Change the user's email address.
// Requires the current password for re-authentication.
// Sends a verification email to the new address - email only updates after verification.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function changeEmail(currentPassword: string, newEmail: string): Promise<void> {
	const user = auth.currentUser;
	if (!user || !user.email) throw new Error('No user signed in');

	// Re-authenticate with current password
	const credential = EmailAuthProvider.credential(user.email, currentPassword);
	await reauthenticateWithCredential(user, credential);

	// Send verification to new email (email only changes after verification)
	await verifyBeforeUpdateEmail(user, newEmail);
}

// Change the user's password.
// Requires the current password for re-authentication.
// Password updates immediately after successful call.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
	const user = auth.currentUser;
	if (!user || !user.email) throw new Error('No user signed in');

	// Re-authenticate with current password
	const credential = EmailAuthProvider.credential(user.email, currentPassword);
	await reauthenticateWithCredential(user, credential);

	// Update to new password (takes effect immediately)
	await updatePassword(user, newPassword);
}

// Delete the current user's account permanently.
// Requires the current password for re-authentication.
// This action is irreversible and will delete all user data.
// Deletes Firestore document first, then the Auth user.
// Throws Firebase auth errors that should be caught and displayed to the user.
export async function deleteAccount(currentPassword: string): Promise<void> {
	const user = auth.currentUser;
	if (!user || !user.email) throw new Error('No user signed in');

	// Re-authenticate with current password
	const credential = EmailAuthProvider.credential(user.email, currentPassword);
	await reauthenticateWithCredential(user, credential);

	// Delete the user's Firestore document first (while still authenticated)
	await deleteUserDocument(user.uid);

	// Delete the Firebase Auth user
	await deleteUser(user);
}
