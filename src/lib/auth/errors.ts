/**
 * Auth Error Handling Utilities
 * 
 * This file maps Firebase auth error codes to user-friendly error messages.
 * 
 * Will contain:
 * - `getAuthErrorMessage(error: FirebaseError): string` - Maps Firebase errors to user-friendly strings
 * 
 * Common Firebase auth error codes to map:
 * - `auth/user-not-found` -> "No account found with this email address."
 * - `auth/wrong-password` -> "Incorrect password. Please try again."
 * - `auth/email-already-in-use` -> "An account with this email already exists."
 * - `auth/invalid-email` -> "Please enter a valid email address."
 * - `auth/weak-password` -> "Password is too weak. Please use at least 6 characters."
 * - `auth/user-disabled` -> "This account has been disabled. Please contact support."
 * - `auth/too-many-requests` -> "Too many failed attempts. Please try again later."
 * - `auth/network-request-failed` -> "Network error. Please check your connection."
 * - `auth/invalid-action-code` -> "This verification link is invalid or has expired."
 * - `auth/expired-action-code` -> "This verification link has expired. Please request a new one."
 * - `auth/invalid-credential` -> "Invalid email or password."
 * - `auth/operation-not-allowed` -> "This sign-in method is not enabled."
 * 
 * Implementation:
 * - Check `error.code` property for Firebase error code
 * - Return appropriate user-friendly message
 * - For unknown errors, return generic message: "An error occurred. Please try again."
 * - Suitable for display in toast notifications or alert components
 * 
 * Usage:
 * ```typescript
 * try {
 *   await loginWithEmail(email, password);
 * } catch (error) {
 *   const message = getAuthErrorMessage(error);
 *   // Display message to user
 * }
 * ```
 */

