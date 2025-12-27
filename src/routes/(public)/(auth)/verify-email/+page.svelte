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
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
    import { Mail, Check, Frown } from '@lucide/svelte';
    import { Logo } from '$lib/components/ui/logo';

	// UI state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let checkingVerification = $state(false);

	// Button feedback states
	let resendFeedback = $state<'sent' | null>(null);
	let checkFeedback = $state<'verified' | 'not-verified' | null>(null);

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
				checkFeedback = 'verified';
				setTimeout(() => {
					checkFeedback = null;
					// Redirect after feedback shows
					goto(nextParam ?? '/app');
				}, 1500);
			} else {
				checkFeedback = 'not-verified';
				setTimeout(() => {
					checkFeedback = null;
				}, 1500);
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
			await sendVerificationEmail(authState.user);
			resendFeedback = 'sent';
			setTimeout(() => {
				resendFeedback = null;
			}, 1500);
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
	<div class="w-full max-w-sm flex flex-col gap-5">
        <Logo />
		<div class="flex flex-col gap-2.5">
            {#if error}
                <Alert variant="destructive">
                    <Frown />
                    <AlertTitle>Whoops!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
			{/if}

            <Alert>
                <Mail />
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>
                    {#if userEmail}
                        We've sent a verification email to {userEmail}
                    {:else}
                        Please verify your email address to continue
                    {/if}
                </AlertDescription>
            </Alert>
		</div>

		<div class="flex flex-col gap-5">
			<div class="flex flex-col gap-2.5">
				<Button
					onclick={handleResendVerification}
					disabled={loading || !authState.user}
                    class="w-full"
				>
                    <!-- Buton icon -->
                    {#if loading}
                        <Spinner />
                    {:else if resendFeedback === 'sent'}
                        <Check />
                    {/if}

                    <!-- Button label -->
                    {#if resendFeedback === 'sent'}
                        Sent
                    {:else}
                        Resend
                    {/if}
				</Button>

				<Button
					variant="outline"
					onclick={handleCheckVerification}
					disabled={checkingVerification || !authState.user}
                    class="w-full"
				>
                    <!-- Buton icon -->
                    {#if checkingVerification}
                        <Spinner />
                    {:else if checkFeedback === 'verified'}
                        <Check />
                    {:else if checkFeedback === 'not-verified'}
                        <Frown />
                    {/if}

                    <!-- Button label -->
                    {#if checkFeedback === 'verified'}
                        Verified
                    {:else if checkFeedback === 'not-verified'}
                        Not verified yet
                    {:else}
                        I verified, refresh
                    {/if}
				</Button>
			</div>

			<!-- Sign up with different email -->
            <span role="presentation" class="text-sm text-center text-muted-foreground cursor-pointer hover:underline" onclick={handleLogout}>
                Sign up with different email
            </span>
		</div>
	</div>
</div>

