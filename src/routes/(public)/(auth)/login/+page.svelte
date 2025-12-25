<script lang="ts">
	/**
	 * Login Page
	 * 
	 * Login page accessible at /login.
	 * Handles email/password login and magic link authentication.
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { isSignInWithEmailLink } from 'firebase/auth';
	import { auth } from '$lib/firebase/config';
	import {
		authState,
		loginWithEmail,
		sendMagicLink,
		verifyMagicLink,
		getMagicLinkEmail,
		getAuthErrorMessage
	} from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	// Form state
	let email = $state('');
	let password = $state('');
	let useMagicLink = $state(false);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let magicLinkSent = $state(false);
	let verifyingMagicLink = $state(false);
	let magicLinkEmailPrompt = $state(false);

	// Get next param for redirect after login
	const nextParam = $derived(page.url.searchParams.get('next'));

	// Redirect if already logged in
	$effect(() => {
		if (!authState.loading && authState.user !== null) {
			goto(nextParam ?? '/app');
		}
	});

	// Handle magic link verification on mount
	$effect(() => {
		// Only run in browser and after auth finishes loading
		if (typeof window === 'undefined' || authState.loading) {
			return;
		}

		// Check if URL contains a magic link
		if (isSignInWithEmailLink(auth, window.location.href)) {
			verifyingMagicLink = true;
			const storedEmail = getMagicLinkEmail();

			// If email is stored (same device), verify immediately
			if (storedEmail) {
				handleMagicLinkVerification(storedEmail);
			} else {
				// Different device case - prompt for email
				magicLinkEmailPrompt = true;
			}
		}
	});

	async function handleMagicLinkVerification(emailToUse: string): Promise<void> {
		try {
			error = null;
			const next = await verifyMagicLink(emailToUse);
			// Redirect after successful verification
			goto(next ?? '/app');
		} catch (err) {
			error = getAuthErrorMessage(err);
			verifyingMagicLink = false;
			magicLinkEmailPrompt = false;
		}
	}

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

	async function handleMagicLinkSend(): Promise<void> {
		if (!email) {
			error = 'Please enter your email address';
			return;
		}

		try {
			loading = true;
			error = null;
			await sendMagicLink(email, nextParam ?? undefined);
			magicLinkSent = true;
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
				{useMagicLink ? 'Enter your email to receive a magic link' : 'Enter your credentials to continue'}
			</p>
		</div>

		{#if verifyingMagicLink}
			<div class="text-center">
				<p>Verifying magic link...</p>
			</div>
		{:else if magicLinkEmailPrompt}
			<div class="space-y-4">
				<p class="text-sm text-muted-foreground">
					Please enter the email address associated with this magic link:
				</p>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						if (email) {
							handleMagicLinkVerification(email);
						}
					}}
					class="space-y-4"
				>
					<div class="space-y-2">
						<Label for="magic-email">Email</Label>
						<Input
							id="magic-email"
							type="email"
							placeholder="your@email.com"
							bind:value={email}
							required
							disabled={loading}
						/>
					</div>
					<Button type="submit" disabled={loading || !email} class="w-full">
						{loading ? 'Verifying...' : 'Verify Magic Link'}
					</Button>
					{#if error}
						<p class="text-sm text-destructive">{error}</p>
					{/if}
				</form>
			</div>
		{:else if magicLinkSent}
			<div class="space-y-4 text-center">
				<p class="text-sm text-muted-foreground">
					Check your email for a magic link. Click the link to sign in.
				</p>
				<Button
					variant="outline"
					onclick={() => {
						magicLinkSent = false;
						email = '';
					}}
					class="w-full"
				>
					Send Another Link
				</Button>
			</div>
		{:else}
			<div class="space-y-4">
				<!-- Toggle between email/password and magic link -->
				<div class="flex gap-2">
					<Button
						variant={!useMagicLink ? 'default' : 'outline'}
						onclick={() => {
							useMagicLink = false;
							error = null;
						}}
						class="flex-1"
					>
						Email & Password
					</Button>
					<Button
						variant={useMagicLink ? 'default' : 'outline'}
						onclick={() => {
							useMagicLink = true;
							error = null;
						}}
						class="flex-1"
					>
						Magic Link
					</Button>
				</div>

				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}

				{#if useMagicLink}
					<!-- Magic Link Form -->
					<form onsubmit={(e) => { e.preventDefault(); handleMagicLinkSend(); }} class="space-y-4">
						<div class="space-y-2">
							<Label for="magic-email">Email</Label>
							<Input
								id="magic-email"
								type="email"
								placeholder="your@email.com"
								bind:value={email}
								required
								disabled={loading}
							/>
						</div>
						<Button type="submit" disabled={loading || !email} class="w-full">
							{loading ? 'Sending...' : 'Send Magic Link'}
						</Button>
					</form>
				{:else}
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
							<Label for="password">Password</Label>
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
				{/if}

				<!-- Links to other auth pages -->
				<div class="space-y-2 text-center">
					{#if !useMagicLink}
						<Button variant="link" href="/reset-password" class="text-sm">
							Forgot password?
						</Button>
					{/if}
					<div>
						<span class="text-sm text-muted-foreground">Don't have an account? </span>
						<Button variant="link" href="/signup" class="text-sm">
							Sign up
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
