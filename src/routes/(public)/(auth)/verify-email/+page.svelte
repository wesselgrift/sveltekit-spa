<script lang="ts">
	/**
	 * Verify Email Page
	 * 
	 * Handles email verification through component
	 */
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
	import { Logo } from '$lib/components/ui/logo';
	import { VerifyEmail } from '$lib/components/auth';

	const nextParam = $derived(page.url.searchParams.get('next'));
	const nextQuery = $derived(nextParam ? `?next=${encodeURIComponent(nextParam)}` : '');

	// Guard access and handle already-verified users
	$effect(() => {
		if (authState.loading) return;

		// No user: send to login, preserve intended destination if present
		if (authState.user === null) {
			goto(`/login${nextQuery}`);
			return;
		}

		// Verified users skip this page entirely
		if (authState.user.emailVerified) {
			goto(nextParam ?? '/app');
		}
	});

	const handleRequireAuth = (): void => {
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
		/>
	</div>
</div>

