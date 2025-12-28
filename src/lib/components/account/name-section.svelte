<script lang="ts">
    import { authState } from '$lib/auth/state.svelte';
    import { updateProfile } from 'firebase/auth';
    import { splitDisplayName } from '$lib/helpers/name-helpers';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import { IdCardLanyard, Check, CircleAlert } from '@lucide/svelte';

    let changeName = $state(false);
    let firstName = $state('');
    let lastName = $state('');
    let loading = $state(false);
    let success = $state(false);
    let error = $state(false);
    let errorMessage = $state('');

    // Local override for the display name (set after successful save)
    let savedDisplayName = $state<string | null>(null);

    // Get current name parts - use local override if available, otherwise from user
    let nameParts = $derived(
        splitDisplayName(savedDisplayName ?? authState.user?.displayName ?? '')
    );

    // Open the edit form and populate with current values
    function openEditForm(): void {
        firstName = nameParts.firstName;
        lastName = nameParts.lastName;
        changeName = true;
    }

    // Close the edit form and reset state
    function closeEditForm(): void {
        changeName = false;
        success = false;
        error = false;
        errorMessage = '';
    }

    // Save the new name to Firebase
    async function saveName(): Promise<void> {
        if (!authState.user) return;

        loading = true;
        error = false;
        success = false;

        try {
            const newDisplayName = `${firstName.trim()} ${lastName.trim()}`;

            await updateProfile(authState.user, {
                displayName: newDisplayName
            });

            // Update local state immediately so UI reflects the change
            savedDisplayName = newDisplayName;

            success = true;
            
            // Close form after a short delay to show success message
            setTimeout(() => {
                closeEditForm();
            }, 1500);
        } catch (err) {
            error = true;
            errorMessage = err instanceof Error ? err.message : 'Failed to update name';
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex flex-col border-b">
    <div class="flex flex-row gap-4 p-4 w-full">
        <IdCardLanyard class="shrink-0" strokeWidth={1.5} />
        <div class="flex flex-col gap-1 text-sm">
            <p class="font-medium">Name</p>
            <p class="text-muted-foreground">{nameParts.firstName} {nameParts.lastName}</p>
        </div>
        <Button onclick={openEditForm} variant="outline" size="sm" class="ml-auto" disabled={changeName}>Change name</Button>
    </div>

    {#if changeName}
        <div class="flex flex-col p-4 pl-14 max-w-sm gap-5">
            <div class="flex flex-col gap-2.5">
                <Label>First Name</Label>
                <Input bind:value={firstName} disabled={loading} />
            </div>
            <div class="flex flex-col gap-2.5">
                <Label>Last Name</Label>
                <Input bind:value={lastName} disabled={loading} />
            </div>
            
            {#if error}
                <div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm text-red-700 bg-red-50 border border-red-200">
                    <CircleAlert class="size-4" />
                    {errorMessage}
                </div>
            {/if}

            <div class="flex flex-row gap-2 mb-4">
                {#if success}
                    <div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <Check class="size-4" />
                        Name updated
                    </div>
                {:else}
                    <Button onclick={saveName} variant="default" size="sm" disabled={loading}>
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