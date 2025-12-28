<script lang="ts">
    import { authState } from '$lib/auth/state.svelte';
    import { changeEmail } from '$lib/auth/actions';
    import { getAuthErrorMessage } from '$lib/auth/errors';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import { Mail, Check, CircleAlert } from '@lucide/svelte';

    let showForm = $state(false);
    let newEmail = $state('');
    let currentPassword = $state('');
    let loading = $state(false);
    let success = $state(false);
    let error = $state(false);
    let errorMessage = $state('');

    // Store the email we sent verification to (for success message)
    let sentToEmail = $state('');

    // Open the edit form and reset fields
    function openEditForm(): void {
        newEmail = '';
        currentPassword = '';
        showForm = true;
    }

    // Close the edit form and reset state
    function closeEditForm(): void {
        showForm = false;
        success = false;
        error = false;
        errorMessage = '';
        sentToEmail = '';
    }

    // Save the new email - sends verification to new address
    async function saveEmail(): Promise<void> {
        // Basic validation
        if (!newEmail.trim()) {
            error = true;
            errorMessage = 'Please enter a new email address';
            return;
        }
        if (!currentPassword) {
            error = true;
            errorMessage = 'Please enter your current password';
            return;
        }

        loading = true;
        error = false;
        success = false;

        try {
            await changeEmail(currentPassword, newEmail.trim());

            // Store the email for success message
            sentToEmail = newEmail.trim();
            success = true;

            // Close form after a delay to show success message
            setTimeout(() => {
                closeEditForm();
            }, 3000);
        } catch (err) {
            error = true;
            errorMessage = getAuthErrorMessage(err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex flex-col border-b">
    <div class="flex flex-row gap-4 p-4 w-full">
        <Mail class="shrink-0" strokeWidth={1.5} />
        <div class="flex flex-col gap-1 text-sm">
            <p class="font-medium">Email</p>
            <p class="text-muted-foreground">{authState.user?.email}</p>
        </div>
        <Button onclick={openEditForm} variant="outline" size="sm" class="ml-auto" disabled={showForm}>Change email</Button>
    </div>

    {#if showForm}
        <div class="flex flex-col p-4 pl-14 max-w-sm gap-5">
            <div class="flex flex-col gap-2.5">
                <Label>New Email</Label>
                <Input type="email" bind:value={newEmail} disabled={loading} />
            </div>
            <div class="flex flex-col gap-2.5">
                <Label>Current Password</Label>
                <Input type="password" bind:value={currentPassword} disabled={loading} />
            </div>

            {#if error}
                <div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm text-red-700 bg-red-50 border border-red-200">
                    <CircleAlert class="size-4" />
                    {errorMessage}
                </div>
            {/if}

            <div class="flex flex-row gap-2 mb-4">
                {#if success}
                    <div class="h-auto py-2 px-2 flex gap-2 items-start rounded-md text-sm text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <Check class="size-4 mt-0.5 shrink-0" />
                        Verification email sent to {sentToEmail} wesselgrift+91@gmail.com
                    </div>
                {:else}
                    <Button onclick={saveEmail} variant="default" size="sm" disabled={loading}>
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
