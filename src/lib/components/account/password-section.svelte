<script lang="ts">
    import { changePassword, logout } from '$lib/auth/actions';
    import { goto } from '$app/navigation';
    import { getAuthErrorMessage } from '$lib/auth/errors';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import { Lock, Check, CircleAlert } from '@lucide/svelte';

    let showForm = $state(false);
    let currentPassword = $state('');
    let newPassword = $state('');
    let loading = $state(false);
    let success = $state(false);
    let error = $state(false);
    let errorMessage = $state('');

    // Open the edit form and reset fields
    function openEditForm(): void {
        currentPassword = '';
        newPassword = '';
        showForm = true;
    }

    // Close the edit form and reset state
    function closeEditForm(): void {
        showForm = false;
        success = false;
        error = false;
        errorMessage = '';
    }

    // Save the new password
    async function savePassword(): Promise<void> {
        // Basic validation
        if (!currentPassword) {
            error = true;
            errorMessage = 'Please enter your current password';
            return;
        }
        if (!newPassword) {
            error = true;
            errorMessage = 'Please enter a new password';
            return;
        }

        loading = true;
        error = false;
        success = false;

        try {
            await changePassword(currentPassword, newPassword);

            success = true;

            // Close form after a delay to show success message
            setTimeout(() => {
                closeEditForm();
                handleLogout();
            }, 3000);
        } catch (err) {
            error = true;
            errorMessage = getAuthErrorMessage(err);
        } finally {
            loading = false;
        }
    }

    async function handleLogout(): Promise<void> {
		try {
			await logout();
			// Redirect to login page after logout
			// The auth guard will handle this automatically, but explicit redirect is clearer
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
			// Reset logging out state on error so user can try again
		}
	}
</script>

<div class="flex flex-col border-b">
    <div class="flex flex-row gap-4 p-4 w-full">
        <Lock class="shrink-0" strokeWidth={1.5} />
        <div class="flex flex-col gap-1 text-sm">
            <p class="font-medium">Password</p>
            <p class="text-muted-foreground">•••••••••••••</p>
        </div>
        <Button onclick={openEditForm} variant="outline" size="sm" class="ml-auto" disabled={showForm}>Change password</Button>
    </div>

    {#if showForm}
        <div class="flex flex-col p-4 pl-14 max-w-sm gap-5">
            <div class="flex flex-col gap-2.5">
                <Label>Current Password</Label>
                <Input type="password" bind:value={currentPassword} disabled={loading} />
            </div>
            <div class="flex flex-col gap-2.5">
                <Label>New Password</Label>
                <Input type="password" bind:value={newPassword} disabled={loading} />
            </div>

            {#if error}
                <div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm border text-red-700 bg-red-50 border-red-200 dark:text-red-50 dark:bg-red-700 dark:border-red-600">
                    <CircleAlert class="size-4" />
                    {errorMessage}
                </div>
            {/if}

            <div class="flex flex-row gap-2 mb-4">
                {#if success}
                    <div class="h-auto py-2 px-2 flex gap-2 items-start rounded-md text-sm border text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-200 dark:bg-emerald-700 dark:border-emerald-600">
                        <Check class="size-4 mt-0.5 shrink-0" />
                        Password changed successfully. Please log in with your new password.
                    </div>
                {:else}
                    <Button onclick={savePassword} variant="default" size="sm" disabled={loading}>
                        {#if loading}
                            <Spinner />
                        {/if}
                        Save
                    </Button>
                    <Button onclick={closeEditForm} variant="outline" size="sm" disabled={loading}>Cancel</Button>
                {/if}
            </div>
        </div>
    {/if}
</div>
