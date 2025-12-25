<script lang="ts">
	/**
	 * Protected Route Layout
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { user, loading } from '$lib/auth';

	let { children } = $props();
	let redirecting = $state(false);

	// Watch auth state and redirect if not authenticated
	// Only runs redirect logic after loading completes to prevent premature redirects
	$effect(() => {
		// Wait for auth to finish loading
		if (loading) {
			return;
		}

		// If user is not authenticated and not already redirecting, redirect to login
		if (user === null && !redirecting) {
			// Prevent redirecting to login if already on login page
			if (page.url.pathname !== '/login') {
				redirecting = true;
				const destination = page.url.pathname + page.url.search;
				goto(`/login?next=${encodeURIComponent(destination)}`);
			}
		}
	});
</script>

{#if loading}
	<!-- Show loading state while auth is initializing -->
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
			<p class="mt-4 text-sm text-muted-foreground">Loading...</p>
		</div>
	</div>
{:else if user}
	<!-- Only render children when authenticated -->
	{@render children()}
{:else}
	<!-- Show redirecting state while redirect happens -->
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
			<p class="mt-4 text-sm text-muted-foreground">Redirecting...</p>
		</div>
	</div>
{/if}
