<script lang="ts">
    import { Button } from '$lib/components/ui/button'
    import { UserRoundX } from '@lucide/svelte'

    let confirmDelete = $state(false);


</script>

<div class="flex flex-row gap-4 p-4 w-full text-red-700 dark:text-red-300">
    {#if !confirmDelete}
        <UserRoundX class="shrink-0" strokeWidth={1.5} />
        <div class="flex flex-col gap-1 text-sm">
            <p class="font-medium">Delete account</p>
            <p class="opacity-80">This permanently deletes your account and all associated data.</p>
        </div>
        <Button onclick={() => confirmDelete = true} variant="outline" size="sm" class="ml-auto">Delete account</Button>
    {:else}
        <UserRoundX class="shrink-0" strokeWidth={1.5} />
        <div class="flex flex-col gap-1 text-sm">
            <p class="font-medium">Are you sure?</p>
            <p class="opacity-80">This is irreversable and will permanently delete your account and all associated data!</p>
        </div>
        <div class="flex flex-row gap-2">
            <Button onclick={() => confirmDelete = false} variant="outline" size="sm" class="ml-auto">Cancel</Button>
            <Button variant="destructive" size="sm" class="ml-auto">Confirm</Button>
        </div>
    {/if}
</div>
