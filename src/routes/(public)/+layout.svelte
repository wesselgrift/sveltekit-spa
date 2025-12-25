<script lang="ts">
	/**
	 * Public Route Layout
	 * 
	 * Simple layout wrapper for public routes (homepage and auth pages).
	 * No authentication checks - all routes under (public) are accessible without auth.
	 * 
	 * Will contain:
	 * - Simple wrapper that renders children
	 * - No auth guards or redirects
	 */

	let { children } = $props();
</script>

{@render children()}

