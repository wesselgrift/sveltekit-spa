/**
 * Auth Module Barrel Export
 * 
 * Convenience barrel export for cleaner imports.
 */

// Re-export state
export { authState, initAuth } from './state.svelte';

// Re-export actions
export {
	loginWithEmail,
	signupWithEmail,
	resetPassword,
	verifyPasswordResetCode,
	confirmPasswordReset,
	completeRecoveredPasswordReset,
	sendVerificationEmail,
	resendSignupVerification,
	logout,
	performLogout,
	changeEmail,
	changePassword,
	deleteAccount,
	updateDisplayName
} from './actions';

// Re-export guards
export { requireAuth, requireVerifiedEmail } from './guards';

// Re-export error handling
export { getAuthErrorMessage } from './errors';

// Re-export auth types
export type { AuthUser } from './types';
