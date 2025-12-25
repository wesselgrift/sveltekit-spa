/**
 * Auth Module Barrel Export
 * 
 * Convenience barrel export for cleaner imports.
 * 
 * Re-exports everything from:
 * - state.svelte.ts (user, loading, initAuth)
 * - actions.ts (all auth action functions)
 * - guards.ts (requireAuth, requireVerifiedEmail)
 * - errors.ts (getAuthErrorMessage)
 * - storage.ts (setMagicLinkEmail, getMagicLinkEmail, clearMagicLinkEmail)
 * 
 * Usage: import { user, loginWithEmail, requireAuth, getAuthErrorMessage } from '$lib/auth'
 */

