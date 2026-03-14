<script lang="ts">
    /**
     * Verify Email Page
     * 
     * Redirects unauthenticated users to login and verified users to their destination.
     * Uses VerifyEmail component for email verification with callback-based navigation.
     */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
	import { Logo } from '$lib/components/ui/logo';
	import { VerifyEmail } from '$lib/components/auth';

	const nextParam = $derived(page.url.searchParams.get('next'));
	const pendingEmail = $derived(page.url.searchParams.get('email'));
	const nextQuery = $derived(nextParam ? `?next=${encodeURIComponent(nextParam)}` : '');
	const allowUnauthenticated = $derived(Boolean(pendingEmail));

	// Guard access and handle already-verified users
	$effect(() => {
		if (authState.loading) return;

		// Allow unauthenticated access when arriving from signup with email param.
		if (authState.user === null) {
			if (allowUnauthenticated) {
				return;
			}
			goto(`/login${nextQuery}`);
			return;
		}

		// Verified users skip this page entirely
		if (authState.user.emailVerified) {
			goto(nextParam ?? '/app');
		}
	});

	const handleRequireAuth = (): void => {
		if (allowUnauthenticated) {
			return;
		}
		goto(`/login${nextQuery}`);
	};

	const handleVerified = (): void => {
		goto(nextParam ?? '/app');
	};

	const handleSignOut = (): void => {
		goto('/signup');
	};
</script>

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
	<div class="w-full max-w-sm flex flex-col gap-5 animate-fade-in-zoom">
        <div class="mb-2">
            <Logo />
        </div>
		
        <!-- Verify email component -->
        <VerifyEmail
			onRequireAuth={handleRequireAuth}
			onVerified={handleVerified}
			onSignOut={handleSignOut}
			pendingEmail={pendingEmail}
			allowUnauthenticated={allowUnauthenticated}
		/>
	</div>
</div>

