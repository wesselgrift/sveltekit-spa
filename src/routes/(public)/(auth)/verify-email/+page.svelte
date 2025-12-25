<script lang="ts">
	/**
	 * Verify Email Page
	 * 
	 * Email verification page accessible at /verify-email.
	 * 
	 * Will contain:
	 * - Import user from $lib/auth/state.svelte.ts
	 * - Import sendVerificationEmail from $lib/auth/actions.ts
	 * - Import goto from $app/navigation
	 * - Import $page from $app/stores to read next query param
	 * - Import ShadCN components: Button
	 * - $effect to auto-redirect when email is verified:
	 *   - IMPORTANT: Firebase user.emailVerified won't update in-memory until reload
	 *   - Poll with `await user.reload()` before checking `emailVerified`
	 *   - Re-check `user.emailVerified` after reload
	 *   - Only redirect when verified is true
	 *   - Extract `next` query param from URL: `$page.url.searchParams.get('next')`
	 *   - Redirect to: `goto(next ?? "/app")`
	 * - Consider adding manual "I verified, refresh" button as fallback UX
	 *   - Button calls `await user.reload()` then checks `emailVerified`
	 * - Display user email address
	 * - Resend verification email button using Button component
	 * - Link back to login using Button component
	 * - Success/error message display
	 */
</script>

<!-- TODO: Implement verify email page with ShadCN components -->

