<script lang="ts">
	/**
	 * Login Page
	 * 
	 * Login page accessible at /login.
	 * Handles email/password login.
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		authState,
		loginWithEmail,
		getAuthErrorMessage
	} from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	// Form state
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Get next param for redirect after login
	const nextParam = $derived(page.url.searchParams.get('next'));

	// Redirect if already logged in
	$effect(() => {
		if (!authState.loading && authState.user !== null) {
			goto(nextParam ?? '/app');
		}
	});

	async function handleEmailPasswordLogin(): Promise<void> {
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		try {
			loading = true;
			error = null;
			await loginWithEmail(email, password);
			// Redirect after successful login
			goto(nextParam ?? '/app');
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
			<h1 class="text-2xl font-bold">Sign In</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Enter your credentials to continue
			</p>
		</div>

		<div class="space-y-4">
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}

			<!-- Email/Password Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleEmailPasswordLogin(); }} class="space-y-4">
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
					<div class="flex flex-row justify-between">
						<Label for="password">Password</Label>
						<a href="/reset-password" class="text-sm text-muted-foreground hover:underline">
							Forgot password?
						</a>
					</div>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						required
						disabled={loading}
					/>
				</div>
				<Button type="submit" disabled={loading || !email || !password} class="w-full">
					{loading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>

			<!-- Links to other auth pages -->
			<div class="space-y-2 text-center">
				<span class="text-sm text-muted-foreground">Don't have an account? </span>
				<Button variant="link" href="/signup" class="text-sm">
					Sign up
				</Button>
			</div>
		</div>
	</div>
</div>
