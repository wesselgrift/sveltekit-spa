/**
 * Auth LocalStorage Utilities
 * 
 * This file provides type-safe localStorage utilities for auth-related data.
 * 
 * Will contain:
 * - `setMagicLinkEmail(email: string): void` - Store email for magic link flow
 * - `getMagicLinkEmail(): string | null` - Retrieve stored email
 * - `clearMagicLinkEmail(): void` - Clear stored email
 * 
 * STORAGE KEY NAMING:
 * - Use namespaced key: `@sveltekit-spa/auth/magic-link-email`
 * - Namespace pattern: `@<app-name>/<module>/<key>`
 * - This prevents conflicts with other apps/libraries
 * - Use consistent namespace pattern for future auth-related storage
 * 
 * CLEANUP STRATEGY:
 * - Clear email on successful magic link sign-in (in verifyMagicLink)
 * - Clear email on obvious failure paths (invalid link, expired link)
 * - Clear email on logout (in logout action)
 * - This prevents stale data and security issues
 * 
 * BROWSER CHECK:
 * - All functions should check `typeof window !== 'undefined'` before accessing localStorage
 * - Return null/do nothing if not in browser context
 * 
 * Usage:
 * ```typescript
 * // Store email when sending magic link
 * setMagicLinkEmail(email);
 * 
 * // Retrieve email when verifying link
 * const email = getMagicLinkEmail();
 * 
 * // Clear after successful sign-in
 * clearMagicLinkEmail();
 * ```
 */

