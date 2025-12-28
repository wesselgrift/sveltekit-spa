<script lang="ts">
    import { authState } from '$lib/auth/state.svelte';
    import { Button } from '$lib/components/ui/button'
    import { Mail } from '@lucide/svelte'
</script>

<div class="flex flex-row gap-4 p-4 w-full border-b">
    <Mail class="shrink-0" strokeWidth={1.5} />
    <div class="flex flex-col gap-1 text-sm">
        <p class="font-medium">Email</p>
        <p class="text-muted-foreground">{authState.user?.email}</p>
    </div>
    <Button variant="outline" size="sm" class="ml-auto">Change email</Button>
</div>