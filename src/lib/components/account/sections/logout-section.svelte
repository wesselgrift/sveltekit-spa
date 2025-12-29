<script lang="ts">

    /*
     * Account section / log out component
     */

    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { DoorOpen } from '@lucide/svelte';
    import { logout } from '$lib/auth/actions';
    import { Spinner } from "$lib/components/ui/spinner";

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
</script>

<div class="flex flex-row gap-4 p-4 w-full">
    <DoorOpen class="shrink-0" strokeWidth={1.5} />
    <div class="flex flex-col gap-1 text-sm">
        <p class="font-medium">Log out</p>
        <p class="text-muted-foreground">See you later!</p>
    </div>
    <Button onclick={handleLogout} variant="outline" size="sm" class="ml-auto">
        {#if loggingOut}
            <Spinner />
        {/if}
        Log out
    </Button>
</div>