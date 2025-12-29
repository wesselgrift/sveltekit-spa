<script lang="ts">
    /**
     * Account Deleted Page
     * 
     * Confirmation page shown after account deletion.
     * Publicly accessible, provides link back to homepage.
     */
    
    import { Shredder } from '@lucide/svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col items-center gap-3">
        <Shredder class="size-10" strokeWidth={1.5}/>
        <p class="text-base font-medium">Your account was deleted</p>
        <a href="/" class="text-sm text-muted-foreground hover:underline">Visit homepage</a>
    </div>
</div>