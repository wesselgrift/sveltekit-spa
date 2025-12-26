<script lang="ts">
	/**
	 * Protected App Page
	 */

	import { authState } from '$lib/auth/state.svelte';
    import { sendEmail } from '$lib/helpers/clientEmail';
	import { logout } from '$lib/auth/actions';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
    
	let loggingOut = $state(false);


	// Handle logout action
	// Redirects to login page after successful logout
	async function handleLogout(): Promise<void> {
		loggingOut = true;
		try {
			await logout();
			// Redirect to login page after logout
			// The auth guard will handle this automatically, but explicit redirect is clearer
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
			// Reset logging out state on error so user can try again
			loggingOut = false;
		}
	}

	// Get user display name (prefer displayName, fallback to email)
	const userName = $derived(
		authState.user?.displayName || authState.user?.email || 'User'
	);

    // Mock email trigger
    async function handleSendTestEmail() {
		const result = await sendEmail({
			to: 'wesselgrift@gmail.com',
			subject: 'Hello',
			template: 'verifyEmail',
            variables: {
                verifyUrl: 'https://app.com/verify?token=abc'
            }
		});
		console.log(result.message); // always shows success or error
	}
</script>

<div class="container mx-auto p-6 max-w-2xl">
	<div class="flex flex-col gap-4">
		<h1 class="text-2xl font-semibold">Hello, {userName}!</h1>
		
		<div class="flex gap-2">
			<Button
				onclick={handleLogout}
				disabled={loggingOut}
				variant="outline"
			>
				{loggingOut ? 'Logging out...' : 'Logout'}
			</Button>
            <Button onclick={handleSendTestEmail}>Send test email</Button>
		</div>
	</div>
</div>