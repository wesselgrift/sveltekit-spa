/**
 * Auth Actions Module
 * 
 * This file contains all authentication action functions.
 * 
 * Will contain:
 * - `loginWithEmail(email, password)` - Sign in with email/password
 * - `signupWithEmail(email, password)` - Create account and auto-send verification email
 * - `sendMagicLink(email)` - Send magic link email and store email in localStorage
 * - `verifyMagicLink(email)` - Verify magic link from URL and complete sign-in
 * - `resetPassword(email)` - Send password reset email
 * - `sendVerificationEmail(user)` - Resend email verification
 * - `logout()` - Sign out current user
 * 
 * All functions will import Firebase auth instance from ../firebase/config
 * May import user state from ./state.svelte.ts if needed for any actions
 */

