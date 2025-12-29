<script lang="ts">
    /**
     * Protected App Homepage
     * 
     * Main dashboard page accessible only to authenticated, verified users.
     * Protected by (protected) layout guard.
     */
    
    import { Button } from '$lib/components/ui/button';
    import { IdCardLanyard } from '@lucide/svelte';
</script>

<div class="container mx-auto p-6 max-w-2xl animate-fade-in-zoom">
	<div class="flex flex-col gap-2 mb-5">
		<h1 class="text-2xl font-semibold">Welcome to Sveltekit SPA 👋</h1>
        <p class="text-sm text-muted-foreground">Welcome in the (empty) app. Let's build something!</p>
	</div>
    <Button size="sm" variant="outline" href="account">
        <IdCardLanyard />
        Account
    </Button>
</div>