<script lang="ts">
	/**
	 * Protected Route Layout
	 */

	import { useProtectedRoute } from '$lib/auth/guards';

	let { children } = $props();
	const status = $derived(useProtectedRoute());
</script>

{#if status === 'loading'}
	<!-- Show loading state while auth is initializing -->
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
			<p class="mt-4 text-sm text-muted-foreground">Loading...</p>
		</div>
	</div>
{:else if status === 'authenticated'}
	<!-- Only render children when authenticated AND email is verified -->
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