<script lang="ts">
	/**
	 * Protected Route Layout
	 * 
	 * Protected layout with auth guard for /app route.
	 * 
	 * Will contain:
	 * - Import user and loading from $lib/auth/state.svelte.ts
	 * - Import goto from $app/navigation
	 * - $effect that watches user state and redirects to /login if not authenticated
	 * - Show loading state while checking auth
	 * - Only render children if user is authenticated
	 * - Prevents flash of unauthenticated content
	 */

	let { children } = $props();
</script>

<!-- TODO: Implement auth guard with $effect and loading state -->

{@render children()}

