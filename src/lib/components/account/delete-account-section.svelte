<script lang="ts">
    import { Button } from '$lib/components/ui/button'
    import { UserRoundX } from '@lucide/svelte'
</script>

<div class="flex flex-row gap-4 p-4 w-full text-red-700 dark:text-red-300">
    <UserRoundX class="shrink-0" strokeWidth={1.5} />
    <div class="flex flex-col gap-1 text-sm">
        <p class="font-medium">Delete account</p>
        <p class="opacity-80">This permanently deletes your account and all associated data.</p>
    </div>
    <Button variant="destructive" size="sm" class="ml-auto">Delete account</Button>
</div>
