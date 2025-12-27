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
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
    import { Logo } from '$lib/components/ui/logo';

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
	<div class="w-full max-w-sm flex flex-col gap-8">
        <Logo />
		<h1 class="text-2xl font-medium">Log in</h1>

		<div class="flex flex-col gap-5">
			{#if error}
                <Alert variant="destructive">
                    <AlertTitle>Whoops!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
			{/if}

			<!-- Email/Password Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleEmailPasswordLogin(); }} class="flex flex-col gap-5">
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
					<div class="flex flex-row justify-between">
						<Label for="password">Password</Label>
						<a href="/reset-password" class="text-sm leading-none text-muted-foreground hover:underline">
							Forgot password?
						</a>
					</div>
					<Input
						id="password"
						type="password"
						bind:value={password}
						required
						disabled={loading}
					/>
				</div>
				<Button type="submit" disabled={loading} class="w-full">
					{#if loading}
                        <Spinner />
                    {/if}
                    Log in
				</Button>
			</form>

			<!-- Links to other auth pages -->
			<div class="flex flex-col gap-2.5 text-center">
				<a href="/signup" class="text-sm text-muted-foreground hover:underline">
                    Create an account instead
                </a>
			</div>
		</div>
	</div>
</div>
