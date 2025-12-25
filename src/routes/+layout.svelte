<script lang="ts">
	/**
	 * Root Layout
	 * 
	 * Root layout that wraps all routes.
	 * 
	 * Will contain:
	 * - Import loading from $lib/auth/state.svelte.ts
	 * - Show loading spinner/spinner while auth state initializes
	 * - Only render children when loading is false
	 * - Prevents flash of content before auth state is determined
	 */
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- TODO: Add loading state check and spinner -->
{@render children()}
