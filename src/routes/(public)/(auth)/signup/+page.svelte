<script lang="ts">
	/**
	 * Signup Page
	 * 
	 * Signup page accessible at /signup.
	 * 
	 * Will contain:
	 * - Import user from $lib/auth/state.svelte.ts
	 * - Import signupWithEmail from $lib/auth/actions.ts
	 * - Import goto from $app/navigation
	 * - Import $page from $app/stores to read next query param
	 * - Import ShadCN components: Input, Label, Button
	 * - Import getAuthErrorMessage from $lib/auth/errors.ts for user-friendly error messages
	 * - $effect to redirect to /app if already logged in (check user !== null)
	 * - Email, password, and confirm password fields using Input and Label components
	 * - Client-side validation (password match, min length)
	 * - Form submission handler that calls signupWithEmail
	 * - After successful signup:
	 *   - Extract `next` query param: `$page.url.searchParams.get('next')`
	 *   - Redirect to `/verify-email?next=${encodeURIComponent(next ?? '')}`
	 *   - Preserve any `next` param if user came from protected route
	 *   - Note: Redirect to /verify-email (not /app) since email needs verification first
	 * - Link to login using Button component
	 * - Error message display using getAuthErrorMessage() for user-friendly messages
	 */
</script>

<!-- TODO: Implement signup form with ShadCN components -->

