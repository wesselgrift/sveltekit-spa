/**
 * Auth LocalStorage Utilities
 * 
 * This file provides type-safe localStorage utilities for auth-related data.
 */

const STORAGE_KEY = '@sveltekit-spa/auth/magic-link-email';

// Store email address for magic link authentication flow.
// This email is stored when a magic link is sent, and retrieved when
// the user clicks the link to complete sign-in. This handles the case
// where the link is opened on the same device/browser.
export function setMagicLinkEmail(email: string): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, email);
	} catch (error) {
		// localStorage may be disabled or quota exceeded
		// Fail silently in production, but log in dev for debugging
		if (import.meta.env.DEV) {
			console.warn('Failed to store magic link email:', error);
		}
	}
}

// Retrieve stored email address for magic link authentication.
// Returns null if not in browser context, no email is stored, or localStorage is unavailable.
export function getMagicLinkEmail(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch (error) {
		// localStorage may be disabled
		if (import.meta.env.DEV) {
			console.warn('Failed to retrieve magic link email:', error);
		}
		return null;
	}
}

// Clear stored email address for magic link authentication.
// Should be called after successful sign-in, on logout, or when handling invalid/expired links.
// This prevents stale data and potential security issues.
export function clearMagicLinkEmail(): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		// localStorage may be disabled
		// Fail silently, but log in dev for debugging
		if (import.meta.env.DEV) {
			console.warn('Failed to clear magic link email:', error);
		}
	}
}
