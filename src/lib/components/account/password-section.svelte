<script lang="ts">
    import { Button } from '$lib/components/ui/button'
    import { DoorOpen } from '@lucide/svelte'
</script>

<div class="flex flex-row gap-4 p-4 w-full border-b">
    <DoorOpen class="shrink-0" strokeWidth={1.5} />
    <div class="flex flex-col gap-1 text-sm">
        <p class="font-medium">Password</p>
        <p class="text-muted-foreground">•••••••••••••</p>
    </div>
    <Button variant="outline" size="sm" class="ml-auto">Change password</Button>
</div>