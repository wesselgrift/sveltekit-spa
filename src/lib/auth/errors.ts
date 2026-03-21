/**
 * Auth Error Handling Utilities
 *
 * This file maps Supabase auth errors to user-friendly error messages.
 */

// Map Supabase auth error codes/messages to user-friendly messages.
const ERROR_MESSAGES: Record<string, string> = {
	invalid_credentials: 'Invalid email or password.',
	email_not_confirmed: 'Please verify your email address before continuing.',
	user_already_exists: 'An account with this email already exists.',
	weak_password: 'Password is too weak. Please use a stronger password.',
	over_request_rate_limit: 'Too many requests. Please try again later.',
	over_email_send_rate_limit: 'Too many emails sent. Please try again shortly.',
	email_address_invalid: 'Please enter a valid email address.',
	reauthentication_needed: 'Your session has expired. Please log out and log in again.'
};

// Convert auth errors to user-friendly error messages.
export function getAuthErrorMessage(error: unknown): string {
	if (error && typeof error === 'object' && 'code' in error) {
		const codeValue = (error as { code?: unknown }).code;
		const errorCode = typeof codeValue === 'string' ? codeValue : '';
		if (ERROR_MESSAGES[errorCode]) {
			return ERROR_MESSAGES[errorCode];
		}
	}

	return 'An error occurred. Please try again.';
}
