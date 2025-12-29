<script lang="ts">
	/**
	 * Login Page
	 * 
	 * Login page accessible at /login.
	 * Handles redirect to /app/* with nextParam after login
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
    import { Logo } from '$lib/components/ui/logo';
    import { Spinner } from '$lib/components/ui/spinner';
    import { Login as LoginForm } from '$lib/components/auth';

	// Get next param for redirect after login
	const nextParam = $derived(page.url.searchParams.get('next'));

	// Redirect if user is (already) logged in
	$effect(() => {
        if (authState.loading || authState.user === null) {
            return;
        }

        if (authState.user.emailVerified) {
            goto(nextParam ?? '/app');
        } else {
            const next = nextParam ? `?next=${encodeURIComponent(nextParam)}` : '';
            goto(`/verify-email${next}`);
        }
    });

    // Only render login form when auth check is complete and user is not authenticated
	const showLoginForm = $derived(!authState.loading && authState.user === null);
</script>

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
    {#if showLoginForm}
        <div class="w-full max-w-sm flex flex-col gap-8 animate-fade-in-zoom">
            <Logo />
            
            <h1 class="text-2xl font-medium">Log in</h1>
            
            <!-- Login form component -->
            <LoginForm />

            <!-- Links to other auth pages -->
            <div class="flex flex-col gap-2.5 text-center">
                <a href="/signup" class="text-sm text-muted-foreground hover:underline">
                    Create an account instead
                </a>
            </div>
        </div>
    {:else}
    	<!-- Show loading spinner while checking auth state -->
		<div class="flex items-center justify-center">
			<Spinner class="size-8" />
		</div>
	{/if}
</div>
