<script lang="ts">
	/**
	 * Protected Route Layout
	 * 
	 * Protected layout with auth guard for /app route.
	 * 
	 * Will contain:
	 * - Import user and loading from $lib/auth/state.svelte.ts
	 * - Import goto from $app/navigation
	 * - Import $page from $app/stores to capture redirect intent
	 * - Show loading spinner while loading === true
	 * - Gate rendering of children behind both loading === false AND user !== null
	 * - $effect that watches user state and redirects to /login if not authenticated
	 *   - IMPORTANT: Only run redirect logic after loading completes (loading === false)
	 *   - Capture original destination: $page.url.pathname + $page.url.search
	 *   - Redirect to /login?next=${encodeURIComponent(destination)}
	 * - Prevents flash of unauthenticated content
	 */

	let { children } = $props();
</script>

<!-- TODO: Implement auth guard with $effect and loading state -->

{@render children()}

