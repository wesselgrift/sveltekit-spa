/**
 * Auth Error Handling Utilities
 * 
 * This file maps Firebase auth error codes to user-friendly error messages.
 */

import type { FirebaseError } from 'firebase/app';

// Map Firebase auth error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
	'auth/user-not-found': 'No account found with this email address.',
	'auth/wrong-password': 'Incorrect password. Please try again.',
	'auth/email-already-in-use': 'An account with this email already exists.',
	'auth/invalid-email': 'Please enter a valid email address.',
	'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
	'auth/user-disabled': 'This account has been disabled. Please contact support.',
	'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
	'auth/network-request-failed': 'Network error. Please check your connection.',
	'auth/invalid-action-code': 'This verification link is invalid or has expired.',
	'auth/expired-action-code': 'This verification link has expired. Please request a new one.',
	'auth/invalid-credential': 'Invalid email or password.',
	'auth/operation-not-allowed': 'This sign-in method is not enabled.'
};

// Convert Firebase auth errors to user-friendly error messages.
// Checks the error.code property and returns a mapped message, or a generic fallback
// for unknown error codes. Suitable for displaying in toast notifications or alert components.
export function getAuthErrorMessage(error: unknown): string {
	// Check if error is a FirebaseError with a code property
	if (error && typeof error === 'object' && 'code' in error) {
		const firebaseError = error as FirebaseError;
		const errorCode = firebaseError.code;

		// Return mapped message if code exists in our mapping
		if (errorCode && ERROR_MESSAGES[errorCode]) {
			return ERROR_MESSAGES[errorCode];
		}
	}

	// Fallback for unknown errors or non-Firebase errors
	return 'An error occurred. Please try again.';
}
