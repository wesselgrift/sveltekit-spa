<script lang="ts">
	/**
	 * Verify Email Page
	 * 
	 * Email verification page accessible at /verify-email.
	 * Handles email verification flow: displays user email, allows resending verification,
	 * and auto-redirects when email is verified.
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState, sendVerificationEmail, getAuthErrorMessage, logout } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';

	// UI state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let checkingVerification = $state(false);

	// Get next param for redirect after verification
	const nextParam = $derived(page.url.searchParams.get('next'));

	// Get user email for display
	const userEmail = $derived(authState.user?.email ?? null);

	// Redirect if not authenticated
	$effect(() => {
		if (!authState.loading && authState.user === null) {
			goto('/login');
		}
	});

	// Auto-check email verification status periodically
	// Firebase user.emailVerified won't update in-memory until reload
	$effect(() => {
		// Only run in browser and after auth finishes loading
		if (typeof window === 'undefined' || authState.loading) {
			return;
		}

		const user = authState.user;
		if (!user) {
			return;
		}

		// If already verified, redirect immediately
		if (user.emailVerified) {
			goto(nextParam ?? '/app');
			return;
		}

		// Poll for verification status every 3 seconds
		// This allows auto-redirect when user verifies email in another tab
		const intervalId = setInterval(async () => {
			if (!authState.user) {
				clearInterval(intervalId);
				return;
			}

			try {
				// Reload user to get latest emailVerified status
				await authState.user.reload();
				// Check if verified after reload
				if (authState.user.emailVerified) {
					clearInterval(intervalId);
					goto(nextParam ?? '/app');
				}
			} catch (err) {
				// Silently fail polling - user can use manual refresh button
				console.error('Error checking verification status:', err);
			}
		}, 3000);

		// Cleanup interval on component unmount or when user changes
		return () => {
			clearInterval(intervalId);
		};
	});

	// Manual refresh button handler
	async function handleCheckVerification(): Promise<void> {
		if (!authState.user) {
			return;
		}

		try {
			checkingVerification = true;
			error = null;
			// Reload user to get latest emailVerified status
			await authState.user.reload();
			
			// Check if verified after reload
			if (authState.user.emailVerified) {
				// Redirect to app or next param
				goto(nextParam ?? '/app');
			} else {
				success = 'Email not yet verified. Please check your inbox and click the verification link.';
			}
		} catch (err) {
			error = getAuthErrorMessage(err);
		} finally {
			checkingVerification = false;
		}
	}

	// Resend verification email handler
	async function handleResendVerification(): Promise<void> {
		if (!authState.user) {
			return;
		}

		try {
			loading = true;
			error = null;
			success = null;
			await sendVerificationEmail(authState.user);
			success = 'Verification email sent! Please check your inbox.';
		} catch (err) {
			error = getAuthErrorMessage(err);
		} finally {
			loading = false;
		}
	}

    async function handleLogout(): Promise<void> {
        try {
            await logout();
            goto('/signup');
        } catch (err) {
            error = getAuthErrorMessage(err);
        }
    }
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">Verify Your Email</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				{#if userEmail}
					We've sent a verification email to <strong>{userEmail}</strong>
				{:else}
					Please verify your email address to continue
				{/if}
			</p>
		</div>

		<div class="space-y-4">
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}

			{#if success}
				<p class="text-sm text-green-600">{success}</p>
			{/if}

			{#if userEmail}
				<div class="rounded-lg border p-4 text-center">
					<p class="text-sm text-muted-foreground mb-2">Email address:</p>
					<p class="font-medium">{userEmail}</p>
				</div>
			{/if}

			<div class="space-y-2">
				<Button
					onclick={handleResendVerification}
					disabled={loading || !authState.user}
					class="w-full"
				>
					{loading ? 'Sending...' : 'Resend Verification Email'}
				</Button>

				<Button
					variant="outline"
					onclick={handleCheckVerification}
					disabled={checkingVerification || !authState.user}
					class="w-full"
				>
					{checkingVerification ? 'Checking...' : 'I verified, refresh'}
				</Button>
			</div>

			<!-- Sign up with different email -->
			<div class="text-center">
				<Button variant="link" onclick={handleLogout} class="text-sm">
					Sign up with different email
				</Button>
			</div>
		</div>
	</div>
</div>

