<script lang="ts">
	/**
	 * Verify Email Page
	 * 
	 * Email verification page accessible at /verify-email.
	 * Handles email verification flow: displays user email, allows resending verification,
	 * and reports verification/auth changes so the parent page can navigate.
	 */

	import {
		authState,
		sendVerificationEmail,
		resendSignupVerification,
		getAuthErrorMessage,
		logout
	} from '$lib/auth';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { Mail, Check, Frown } from '@lucide/svelte';

	const noop = () => {};

	// Let parent pages control navigation flows (login redirect, verified redirect, sign-out).
	const {
		onRequireAuth = noop,
		onVerified = noop,
		onSignOut = noop,
		pendingEmail = null,
		allowUnauthenticated = false
	} = $props<{
		onRequireAuth?: () => void;
		onVerified?: () => void;
		onSignOut?: () => void;
		pendingEmail?: string | null;
		allowUnauthenticated?: boolean;
	}>();

	// UI state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let checkingVerification = $state(false);

	// Button feedback states
	let resendFeedback = $state<'sent' | null>(null);
	let checkFeedback = $state<'verified' | 'not-verified' | null>(null);

	// Get user email for display
	const userEmail = $derived(authState.user?.email ?? pendingEmail ?? null);

	// Poll auth status periodically so we can react when the user confirms email
	// in another tab without requiring manual refresh.
	onMount(() => {
		let disposed = false;

		const checkStatus = async (): Promise<void> => {
			if (disposed || authState.loading) {
				return;
			}

			const currentUser = authState.user;
			if (!currentUser) {
				if (allowUnauthenticated) {
					return;
				}
				onRequireAuth();
				return;
			}

			if (currentUser.emailVerified) {
				onVerified();
				return;
			}

			try {
				await currentUser.reload();
				if (currentUser.emailVerified) {
					onVerified();
				}
			} catch (err) {
				console.error('Error checking verification status:', err);
			}
		};

		void checkStatus();
		const intervalId = setInterval(() => {
			void checkStatus();
		}, 3000);

		return () => {
			disposed = true;
			clearInterval(intervalId);
		};
	});

	// Manual refresh button handler
	async function handleCheckVerification(): Promise<void> {
		const currentUser = authState.user;
		if (!currentUser) {
			return;
		}

		try {
			checkingVerification = true;
			error = null;
			// Refresh auth metadata to get latest emailVerified status.
			await currentUser.reload();

			// Check if verified after reload
			if (currentUser.emailVerified) {
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
		try {
			loading = true;
			error = null;

			if (authState.user) {
				await sendVerificationEmail(authState.user);
			} else if (pendingEmail) {
				await resendSignupVerification(pendingEmail);
			} else {
				return;
			}

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

    // "Sign up with a different email" uses this logout function
    // which allows for a new email to be used.
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
            disabled={loading || (!authState.user && !pendingEmail)}
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

		{#if authState.user}
			<Button
				variant="outline"
				onclick={handleCheckVerification}
				disabled={checkingVerification}
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
		{/if}
    </div>

    <!-- Sign up with different email -->
	{#if authState.user}
		<span
			role="presentation"
			class="text-sm text-center text-muted-foreground cursor-pointer hover:underline"
			onclick={handleLogout}
		>
			Sign up with different email
		</span>
	{/if}
</div>