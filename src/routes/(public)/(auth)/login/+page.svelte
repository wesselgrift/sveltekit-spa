<script lang="ts">
	/**
     * Login Page
     * 
     * Redirects authenticated users (verified to /app, unverified to /verify-email).
     * Uses Login component for authentication with next param preservation.
     */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
    import { Logo } from '$lib/components/ui/logo';
    import { Spinner } from '$lib/components/ui/spinner';
    import { Login as LoginForm } from '$lib/components/auth';

	// Get next param for redirect after login
	const nextParam = $derived(page.url.searchParams.get('next'));
	const nextQuery = $derived(nextParam ? `?next=${encodeURIComponent(nextParam)}` : '');

	// Redirect if user is (already) logged in
	$effect(() => {
        if (authState.loading || authState.user === null) {
            return;
        }

        if (authState.user.emailVerified) {
            void goto(nextParam ?? '/app');
        } else {
            void goto(`/verify-email${nextQuery}`);
        }
    });

    // Only render login form when auth check is complete and user is not authenticated
	const showLoginForm = $derived(!authState.loading && authState.user === null);

	// Sends unverified users to verify-email with context needed to resend and preserve intent.
	const handleRequireVerification = (email: string): void => {
		const params = new URLSearchParams();
		params.set('email', email);
		if (nextParam) {
			params.set('next', nextParam);
		}
		const redirectTarget = `/verify-email?${params.toString()}`;

		// Mirror the signup routing pattern: hard navigation avoids occasional swallowed route changes
		// when redirects are triggered from superform callback lifecycles.
		window.location.assign(redirectTarget);
	};
</script>

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
    {#if showLoginForm}
        <div class="w-full max-w-sm flex flex-col gap-8 animate-fade-in-zoom">
            <Logo />
            
            <h1 class="text-2xl font-medium">Log in</h1>
            
            <!-- Login form component -->
            <LoginForm onRequireVerification={handleRequireVerification} />

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
			<Spinner class="size-6" />
		</div>
	{/if}
</div>
