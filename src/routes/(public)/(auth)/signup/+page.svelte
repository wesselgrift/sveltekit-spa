<script lang="ts">
	/**
	 * Signup Page
	 * 
	 * Signup page accessible at /signup.
	 * Handles user registration with email and password.
	 * Redirect decisions live in this page; the form component only reports success.
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
	import { Logo } from '$lib/components/ui/logo';
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

	function handleSignupSuccess(): void {
		goto(`/verify-email${nextQuery}`);
	}

</script>

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
	<div class="w-full max-w-sm flex flex-col gap-8">
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
</div>