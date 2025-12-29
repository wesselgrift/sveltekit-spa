<script lang="ts">
    /**
     * Protected Route Layout
     * 
     * Guards authenticated routes using useProtectedRoute. Shows loading spinner
     * during auth check, redirects unauthenticated users, renders children only
     * when user is authenticated and email verified.
     */

	import { useProtectedRoute } from '$lib/auth/guards';
    import { Spinner } from '$lib/components/ui/spinner';

	let { children } = $props();
	const status = $derived(useProtectedRoute());
</script>

{#if status === 'loading'}
	<!-- Show loading state while auth is initializing -->
	<div class="flex items-center justify-center min-h-screen">
		<Spinner class="size-6" />
	</div>
{:else if status === 'authenticated'}
	<!-- Only render children when authenticated AND email is verified -->
	{@render children()}
{:else}
	<!-- Show redirecting state while redirect happens -->
	<div class="flex items-center justify-center min-h-screen">
		<Spinner class="size-6" />
	</div>
{/if}