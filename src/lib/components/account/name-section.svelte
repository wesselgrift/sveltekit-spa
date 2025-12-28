<script lang="ts">
    import { authState } from '$lib/auth/state.svelte';
    import { splitDisplayName } from '$lib/helpers/name-helpers';
    import { Button } from '$lib/components/ui/button'
    import { IdCardLanyard } from '@lucide/svelte'

    let nameParts = $derived(
        authState.user?.displayName ? 
        splitDisplayName(authState.user.displayName) : { 
            firstName: '', lastName: '' 
        }
    );
</script>

<div class="flex flex-row gap-4 p-4 w-full border-b">
    <IdCardLanyard class="shrink-0" strokeWidth={1.5} />
    <div class="flex flex-col gap-1 text-sm">
        <p class="font-medium">Name</p>
        <p class="text-muted-foreground">{nameParts.firstName} {nameParts.lastName}</p>
    </div>
    <Button variant="outline" size="sm" class="ml-auto">Change name</Button>
</div>