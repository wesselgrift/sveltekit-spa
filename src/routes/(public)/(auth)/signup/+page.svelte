<script lang="ts">
    /**
     * Signup Page
     * 
     * Redirects authenticated users (verified to /app, unverified to /verify-email).
     * Uses Signup component for registration, redirects to verify-email on success.
     */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
	import { Logo } from '$lib/components/ui/logo';
    import { Spinner } from '$lib/components/ui/spinner';
	import { Signup as SignupForm } from '$lib/components/auth';

	// Preserve intent so we can return the user to where they wanted to go
	const nextParam = $derived(page.url.searchParams.get('next'));
	const nextQuery = $derived(nextParam ? `?next=${encodeURIComponent(nextParam)}` : '');

	// Redirect authenticated users away from signup
	$effect(() => {
		if (authState.loading || authState.user === null) {
			return;
		}

		if (authState.user.emailVerified) {
			goto(nextParam ?? '/app');
		} else {
			goto(`/verify-email${nextQuery}`);
		}
	});

	function handleSignupSuccess(email: string): void {
		const params = new URLSearchParams();
		if (nextParam) {
			params.set('next', nextParam);
		}
		if (email) {
			params.set('email', email);
		}

		const query = params.toString();
		goto(query ? `/verify-email?${query}` : '/verify-email');
	}

    // Only render login form when auth check is complete and user is not authenticated
	const showSignupForm = $derived(!authState.loading && authState.user === null);
</script>

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
    {#if showSignupForm}
        <div class="w-full max-w-sm flex flex-col gap-8 animate-fade-in-zoom">
            <Logo />
            <h1 class="text-2xl font-medium">Create account</h1>

            <!-- Sign up form component -->
            <SignupForm onSignupSuccess={handleSignupSuccess} />
            
            <!-- Link to login page -->
            <div class="text-center">
                <a href="/login" class="text-sm text-muted-foreground hover:underline">
                    Log in instead
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