<script lang="ts">
	/**
	 * Root Layout
	 * 
	 * Root layout that wraps all routes.
	 * 
	 * IMPORTANT: This layout always renders children immediately.
	 * Do NOT gate rendering behind auth loading state here, as this would
	 * unnecessarily block public routes (homepage, login) from rendering.
	 * 
	 * Public routes should render immediately without waiting for Firebase auth.
	 * If a global loading indicator is needed, show it alongside content, not instead of it.
	 * 
	 * Auth loading gates should only be implemented in protected route layouts
	 * (e.g., (protected)/app/+layout.svelte).
	 */
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import { onMount } from 'svelte';
    import { ModeWatcher, resetMode } from "mode-watcher";

    // Have mode watcher follow system theme
    onMount(() => {
        resetMode();
    });

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
{@render children()}
