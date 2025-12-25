/**
 * Auth Actions Module
 * 
 * This file contains all authentication action functions.
 * 
 * Will contain:
 * - `loginWithEmail(email, password)` - Sign in with email/password
 * - `signupWithEmail(email, password)` - Create account and auto-send verification email
 * - `sendMagicLink(email, next?: string)` - Send magic link email and store email in localStorage
 * - `verifyMagicLink(email)` - Verify magic link from URL and complete sign-in
 * - `resetPassword(email)` - Send password reset email
 * - `sendVerificationEmail(user)` - Resend email verification
 * - `logout()` - Sign out current user
 * 
 * All functions will import Firebase auth instance from ../firebase/config
 * May import user state from ./state.svelte.ts if needed for any actions
 * 
 * MAGIC LINK IMPLEMENTATION DETAILS:
 * 
 * `sendMagicLink(email, next?)`:
 * - Use Firebase's `sendSignInLinkToEmail(auth, email, actionCodeSettings)`
 * - actionCodeSettings must include:
 *   - `handleCodeInApp: true` (required for email link auth)
 *   - `url`: `${window.location.origin}/login` (stable route that receives the link)
 *   - If `next` param provided, append to URL: `?next=${encodeURIComponent(next)}`
 * - Store email in localStorage using `setMagicLinkEmail()` from ./storage.ts
 * - Import storage utilities from ./storage.ts
 * 
 * `verifyMagicLink(email)`:
 * - First check if URL contains magic link: `isSignInWithEmailLink(auth, window.location.href)`
 * - Retrieve stored email from localStorage using `getMagicLinkEmail()` from ./storage.ts
 * - Handle "open link on different device" case:
 *   - If stored email is missing, prompt user to enter their email address
 *   - This happens when user clicks link on a different device/browser than where they requested it
 * - Use `signInWithEmailLink(auth, email, window.location.href)` to complete sign-in
 * - On success:
 *   - Clear stored email using `clearMagicLinkEmail()` from ./storage.ts
 *   - Extract `next` query param from URL if present
 *   - Return the `next` value (or null) so caller can redirect appropriately
 * - Import storage utilities from ./storage.ts
 */

