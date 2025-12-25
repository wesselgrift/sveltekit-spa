<script lang="ts">
	/**
	 * Login Page
	 * 
	 * Login page accessible at /login.
	 * 
	 * Will contain:
	 * - Import user and loading from $lib/auth/state.svelte.ts
	 * - Import auth actions from $lib/auth/actions.ts (loginWithEmail, sendMagicLink, verifyMagicLink)
	 * - Import goto from $app/navigation
	 * - Import $page from $app/stores to read next query param
	 * - Import isSignInWithEmailLink from firebase/auth
	 * - Import auth instance from $lib/firebase/config
	 * - Import getMagicLinkEmail from $lib/auth/storage.ts
	 * - Import ShadCN components: Input, Label, Button
	 * - Import getAuthErrorMessage from $lib/auth/errors.ts for user-friendly error messages
	 * - $effect to redirect to /app if already logged in (check user !== null)
	 * - On mount, handle magic link verification FIRST (before showing form):
	 *   - Check if URL contains magic link: `isSignInWithEmailLink(auth, window.location.href)`
	 *   - If yes:
	 *     - Retrieve stored email: `getMagicLinkEmail()` from storage
	 *     - If email missing, prompt user to enter email (different device case)
	 *     - Call `verifyMagicLink(email)` to complete sign-in
	 *     - On success, extract `next` query param: `$page.url.searchParams.get('next')`
	 *     - Redirect: `goto(next ?? "/app")`
	 * - Email/password form using Input and Label components
	 * - Toggle between password and magic link authentication
	 * - Form submission handlers:
	 *   - Email/password: call `loginWithEmail(email, password)`
	 *   - Magic link: call `sendMagicLink(email, next)` passing next param if present
	 * - After successful login (any method), redirect: `goto(next ?? "/app")`
	 * - Links to signup and reset password using Button components
	 * - Error message display using getAuthErrorMessage() for user-friendly messages
	 */
</script>

<!-- TODO: Implement login form with ShadCN components -->

