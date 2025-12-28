<script lang="ts">
	/**
	 * Protected App Page
	 */

    import { AccountSettings } from '$lib/components/account'
</script>

<div class="container mx-auto p-6 max-w-2xl">
	<div class="flex flex-col gap-2 mb-5">
		<h1 class="text-2xl font-semibold">Welcome to Sveltekit SPA 👋</h1>
        <p class="text-sm text-muted-foreground">Welcome in the (empty) app. Let's build something!</p>
	</div>
    <AccountSettings />
</div>