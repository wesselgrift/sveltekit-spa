<script lang="ts">
	/**
	 * Verify Email Page
	 * 
	 * Email verification page accessible at /verify-email.
	 * Handles email verification flow: displays user email, allows resending verification,
	 * and reports verification/auth changes so the parent page can navigate.
	 */

	import { authState, sendVerificationEmail, getAuthErrorMessage, logout } from '$lib/auth';
	import { updateUserEmailVerified } from '$lib/firestore/users';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { Mail, Check, Frown } from '@lucide/svelte';

	const noop = () => {};

	// Let parent pages control navigation flows (login redirect, verified redirect, sign-out).
	const { onRequireAuth = noop, onVerified = noop, onSignOut = noop } = $props<{
		onRequireAuth?: () => void;
		onVerified?: () => void;
		onSignOut?: () => void;
	}>();

	// UI state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let checkingVerification = $state(false);

	// Button feedback states
	let resendFeedback = $state<'sent' | null>(null);
	let checkFeedback = $state<'verified' | 'not-verified' | null>(null);

	// Get user email for display
	const userEmail = $derived(authState.user?.email ?? null);

	// Auto-check email verification status periodically
	// Firebase user.emailVerified won't update in-memory until reload
	$effect(() => {
		// Only run in browser and after auth finishes loading
		if (typeof window === 'undefined' || authState.loading) {
			return;
		}

		const user = authState.user;
		if (!user) {
			onRequireAuth();
			return;
		}

		// If already verified, redirect immediately
		if (user.emailVerified) {
			onVerified();
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
					// Update Firestore user document with verified status
					await updateUserEmailVerified(authState.user.uid);
					onVerified();
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
				// Update Firestore user document with verified status
				await updateUserEmailVerified(authState.user.uid);
				checkFeedback = 'verified';
				setTimeout(() => {
					checkFeedback = null;
					// Let page redirect after brief feedback window
					onVerified();
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
			onSignOut();
        } catch (err) {
            error = getAuthErrorMessage(err);
        }
    }
</script>

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