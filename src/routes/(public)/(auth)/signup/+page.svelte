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

	// Form state
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
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

	// Validation
	const passwordsMatch = $derived(password === confirmPassword);
	const isValid = $derived(
		email.length > 0 &&
		password.length >= 6 &&
		passwordsMatch
	);

	async function handleSubmit(): Promise<void> {
		if (!isValid) {
			if (password.length < 6) {
				error = 'Password must be at least 6 characters';
			} else if (!passwordsMatch) {
				error = 'Passwords do not match';
			} else {
				error = 'Please fill in all fields';
			}
			return;
		}

		try {
			loading = true;
			error = null;
			await signupWithEmail(email, password);
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
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">Create account</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Enter your credentials to get started
			</p>
		</div>

		<div class="space-y-4">
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="your@email.com"
						bind:value={email}
						required
						disabled={loading}
					/>
				</div>
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						required
						disabled={loading}
						minlength={6}
					/>
					{#if password.length > 0 && password.length < 6}
						<p class="text-xs text-muted-foreground">Password must be at least 6 characters</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="confirm-password">Confirm Password</Label>
					<Input
						id="confirm-password"
						type="password"
						placeholder="••••••••"
						bind:value={confirmPassword}
						required
						disabled={loading}
					/>
					{#if confirmPassword.length > 0 && !passwordsMatch}
						<p class="text-xs text-destructive">Passwords do not match</p>
					{/if}
				</div>
				<Button type="submit" disabled={loading || !isValid} class="w-full">
					{loading ? 'Creating account...' : 'Continue'}
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

