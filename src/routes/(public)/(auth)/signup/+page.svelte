<script lang="ts">
	/**
	 * Signup Page
	 * 
	 * Signup page accessible at /signup.
	 * Handles user registration with email and password.
	 * After signup, redirects to verify-email page since email verification is required.
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState, signupWithEmail, getAuthErrorMessage } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
    import { Logo } from '$lib/components/ui/logo';

	// Form state
	let email = $state('');
	let password = $state('');
    let firstName = $state('');
    let lastName = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Get next param for redirect after verification
	const nextParam = $derived(page.url.searchParams.get('next'));

	// Redirect if already logged in
	$effect(() => {
		if (!authState.loading && authState.user !== null) {
			// If verified, redirect to app (or next param)
            if (authState.user.emailVerified) {
                goto(nextParam ?? '/app');
            } else {
                // If not verified, redirect to verify-email instead of app
                // This prevents the loop where /app redirects back to /verify-email
                goto('/verify-email');
            }
		}
	});

	async function handleSubmit(): Promise<void> {
		try {
			loading = true;
			error = null;
			await signupWithEmail(firstName, lastName, email, password);
			
            // Redirect to verify-email page after successful signup
			const next = nextParam ? `?next=${encodeURIComponent(nextParam)}` : '';
			goto(`/verify-email${next}`);
		} catch (err) {
			error = getAuthErrorMessage(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col gap-8">
        <Logo />
		<h1 class="text-2xl font-medium">Create account</h1>

		<div class="flex flex-col gap-5">
			{#if error}
                <Alert variant="destructive">
                    <AlertTitle>Whoops!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-5">
                <div class="flex flex-row gap-3">
                    <div class="flex flex-col gap-2.5 w-full">
                        <Label for="firstName">First name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            bind:value={firstName}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div class="flex flex-col gap-2.5 w-full">
                        <Label for="firstName">Last name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            bind:value={lastName}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>
				<div class="flex flex-col gap-2.5">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						required
						disabled={loading}
					/>
				</div>
				<div class="flex flex-col gap-2.5">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						required
						disabled={loading}
						minlength={6}
					/>
					{#if password.length > 0 && password.length < 6}
						<p class="text-xs text-muted-foreground">Password must be at least 6 characters</p>
					{/if}
				</div>
				<Button type="submit" disabled={loading} class="w-full">
                    {#if loading}
                        <Spinner />
                    {/if}
                    Continue
				</Button>
			</form>

			<!-- Link to login page -->
			<div class="text-center">
				<a href="/login" class="text-sm text-muted-foreground hover:underline">
                    Log in instead
                </a>
			</div>
		</div>
	</div>
</div>

