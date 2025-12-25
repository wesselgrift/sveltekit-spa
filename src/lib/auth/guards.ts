/**
 * Auth Guards Module
 * 
 * This file contains helper functions for route protection.
 * 
 * Will contain:
 * - `requireAuth()` - Check if user is authenticated, redirect to /login if not
 * - `requireVerifiedEmail()` - Check if email is verified, redirect to /verify-email if not
 * 
 * These functions will:
 * - Read from the user state rune imported from ./state.svelte.ts
 * - Use goto() from $app/navigation for client-side redirects
 * - Return boolean indicating if requirement is met
 */

