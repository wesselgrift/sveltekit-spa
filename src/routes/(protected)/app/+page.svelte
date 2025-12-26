<script lang="ts">
	/**
	 * Protected App Page
	 */

	import { authState } from '$lib/auth/state.svelte';
    import { getAuth } from 'firebase/auth';
	import { logout } from '$lib/auth/actions';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
    
	let loggingOut = $state(false);
	const auth = getAuth();

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
    async function sendEmail(): Promise<void> {

        const user = auth.currentUser;
        if (!user) return
        const token = await user.getIdToken();

        await fetch('/api/send-email', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                to: 'wesselgrift@gmail.com',
                subject: 'Hello',
                text: 'This is a mock email'
            })
        })
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
            <Button onclick={sendEmail}>Send test email</Button>
		</div>
	</div>
</div>