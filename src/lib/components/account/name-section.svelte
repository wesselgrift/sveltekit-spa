<script lang="ts">
    import { authState } from '$lib/auth/state.svelte';
    import { splitDisplayName } from '$lib/helpers/name-helpers';
    import { Button } from '$lib/components/ui/button'
    import { Input } from '$lib/components/ui/input'
    import { Label } from '$lib/components/ui/label'
    import { IdCardLanyard } from '@lucide/svelte'

    let changeName = $state(false);

    let nameParts = $derived(
        authState.user?.displayName ? 
        splitDisplayName(authState.user.displayName) : { 
            firstName: '', lastName: '' 
        }
    );
</script>

<div class="flex flex-col border-b">
    <div class="flex flex-row gap-4 p-4 w-full">
        <IdCardLanyard class="shrink-0" strokeWidth={1.5} />
        <div class="flex flex-col gap-1 text-sm">
            <p class="font-medium">Name</p>
            <p class="text-muted-foreground">{nameParts.firstName} {nameParts.lastName}</p>
        </div>
        <Button onclick={() => changeName = true} variant="outline" size="sm" class="ml-auto" disabled={changeName}>Change name</Button>
    </div>

    {#if changeName}
        <div class="flex flex-col p-4 pl-14 max-w-sm gap-5">
            <div class="flex flex-col gap-2.5">
                <Label>First Name</Label>
                <Input value={nameParts.firstName}/>
            </div>
            <div class="flex flex-col gap-2.5">
                <Label>Last Name</Label>
                <Input value={nameParts.lastName}/>
            </div>
            <div class="flex flex-row gap-2 mb-4">
                <Button variant="default" size="sm">Save</Button>
                <Button onclick={() => changeName = false} variant="outline" size="sm">Cancel</Button>
            </div>
        </div>
    {/if}
</div>