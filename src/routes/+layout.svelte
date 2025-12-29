<script lang="ts">
    /**
     * Root Layout
     * 
     * Wraps all routes. Handles theme initialization (ModeWatcher) and preloads
     * logo assets to prevent flash. SSR disabled via +layout.ts.
     */

	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import logoLight from '$lib/assets/logo.svg';
	import logoDark from '$lib/assets/logo-dark.svg';
    import { onMount } from 'svelte';
    import { ModeWatcher, resetMode } from "mode-watcher";

    let { children } = $props();

    onMount(() => {
        resetMode(); // Match system theme with ModeWather
    });

</script>

<svelte:head>
    <link rel="icon" href={favicon} />

	<!-- Preload logo assets for instant rendering -->
	<link rel="preload" href={logoLight} as="image" />
	<link rel="preload" href={logoDark} as="image" />
</svelte:head>

<ModeWatcher />

{@render children()}
