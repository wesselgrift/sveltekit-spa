<script lang="ts">
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { UserRoundX } from '@lucide/svelte';
    import { deleteAccount } from '$lib/auth/actions';
    import { getAuthErrorMessage } from '$lib/auth/errors';
    import { Spinner } from '$lib/components/ui/spinner';
    import { CircleAlert } from '@lucide/svelte';

    let confirmDelete = $state(false);
    let password = $state('');
    let deleting = $state(false);
    let error = $state(false);
    let errorMessage = $state('');

    // Handle account deletion
    async function handleDelete(): Promise<void> {
        // Basic validation
        if (!password) {
            error = true;
            errorMessage = 'Please enter your password';
            return;
        }

        deleting = true;
        error = false;

        try {
            await deleteAccount(password);
            // Redirect to account deleted page
            goto('/account-deleted');
        } catch (err) {
            error = true;
            errorMessage = getAuthErrorMessage(err);
            deleting = false;
        }
    }

    // Cancel deletion and revert UI
    function handleCancel(): void {
        confirmDelete = false;
        password = '';
        error = false;
        errorMessage = '';
    }
</script>

<div class="flex flex-row rounded-md bg-red-50/70 dark:bg-red-950/70 border border-red-100 dark:border-red-900">
    <div class="flex flex-col">
        <div class="flex flex-row gap-4 p-4 w-full text-red-700 dark:text-red-300">
            <UserRoundX class="shrink-0" strokeWidth={1.5} />
            <div class="flex flex-col gap-1 text-sm">
                <p class="font-medium">
                    {#if !confirmDelete}
                        Delete account        
                    {:else}
                        Are you sure?
                    {/if}
                </p>
                    <p class="opacity-80">This is irreversable and will permanently delete your account and all associated data.</p>
                </div>
            <Button onclick={() => confirmDelete = true} variant="destructive" size="sm" class="ml-auto" disabled={deleting || confirmDelete}>Delete account</Button>
        </div>

        {#if confirmDelete}
            <div class="flex flex-col p-4 pl-14 max-w-sm gap-5">
                <div class="flex flex-col gap-2.5">
                    <Label>Enter your password to confirm</Label>
                    <Input type="password" bind:value={password} disabled={deleting} />
                </div>
                {#if error}
                    <div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm text-red-700 bg-red-100 border-red-200 dark:text-red-50 dark:bg-red-700 dark:border-red-600">
                        <CircleAlert class="size-4" />
                        {errorMessage}
                    </div>
                {/if}
                <div class="flex flex-row gap-2 mb-4">
                    <Button onclick={handleDelete} variant="destructive" size="sm" disabled={deleting}>
                        {#if deleting}
                        <Spinner />
                        {/if}
                        Confirm
                    </Button>
                    <Button onclick={handleCancel} variant="outline" size="sm" disabled={deleting}>Cancel</Button>
                </div>
            </div>
        {/if}
    </div>
</div>