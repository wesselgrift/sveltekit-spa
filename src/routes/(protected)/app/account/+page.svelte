<script lang="ts">
    /**
     * Account Settings Page
     * 
     * User account management page with settings sections.
     * Protected by (protected) layout guard.
     */

    import { AccountSettings } from '$lib/components/account'
</script>

<div class="container mx-auto p-6 max-w-2xl animate-fade-in-zoom">
	<div class="flex flex-col gap-2 mb-5">
		<h1 class="text-2xl font-semibold">Account</h1>
        <p class="text-sm text-muted-foreground">This is a simple account component which you can use anywhere in your app.</p>
	</div>
    <AccountSettings />
</div>