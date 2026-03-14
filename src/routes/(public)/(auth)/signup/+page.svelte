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

	// Set after successful signup to trigger navigation via the unified $effect below.
	// Avoids a race between goto in a superform callback and the reactive auth-state redirect.
	let signupEmail = $state<string | null>(null);
	// Prevent duplicate hard redirects during reactive churn.
	let signupRedirectTriggered = false;

	// Unified navigation: handles both already-authenticated redirect and post-signup redirect.
	// We use hard navigation for the post-signup case because this callback-driven superform flow
	// can resolve goto() without committing the route transition.
	$effect(() => {
		if (authState.loading) return;

		// Post-signup takes priority: navigate with the email param
		if (signupEmail !== null) {
			const params = new URLSearchParams();
			if (nextParam) params.set('next', nextParam);
			params.set('email', signupEmail);
			const redirectTarget = `/verify-email/?${params.toString()}`;

			if (signupRedirectTriggered) return;
			signupRedirectTriggered = true;

			// In this signup + superforms flow, goto() can resolve without committing a route change.
			// Use a hard navigation here so post-signup redirect to verify-email is always reliable.
			// A tiny delay gives the loading UI one paint cycle so the spinner visibly animates.
			setTimeout(() => {
				window.location.assign(redirectTarget);
			}, 300);
			return;
		}

		// Existing-session can use client-side routing.
		if (authState.user === null) return;
		if (authState.user.emailVerified) {
			void goto(nextParam ?? '/app');
		} else {
			void goto(`/verify-email/${nextQuery}`);
		}
	});

	function handleSignupSuccess(email: string): void {
		signupEmail = email;
	}

	// Hide the form once auth resolves with a user OR after successful signup
	const showSignupForm = $derived(!authState.loading && authState.user === null && signupEmail === null);
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