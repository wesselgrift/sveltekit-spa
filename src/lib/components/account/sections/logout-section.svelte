<script lang="ts">
	/**
	 * Account section / log out component
	 */

	import { Button } from '$lib/components/ui/button';
	import { DoorOpen, CircleAlert } from '@lucide/svelte';
	import { performLogout } from '$lib/auth/actions';
	import { Spinner } from '$lib/components/ui/spinner';

	let loggingOut = $state(false);
	let logoutError = $state<string | null>(null);

	async function handleLogout(): Promise<void> {
		loggingOut = true;
		logoutError = null;

		const result = await performLogout();

		if (!result.ok) {
			logoutError = result.error;
			loggingOut = false;
		}
	}
</script>

<div class="flex flex-col">
	<div class="flex w-full flex-row gap-4 p-4">
		<DoorOpen class="shrink-0" strokeWidth={1.5} />
		<div class="flex flex-col gap-1 text-sm">
			<p class="font-medium">Log out</p>
			<p class="text-muted-foreground">See you later!</p>
		</div>
		<Button
			onclick={handleLogout}
			variant="outline"
			size="sm"
			class="ml-auto"
			disabled={loggingOut}
		>
			{#if loggingOut}
				<Spinner />
			{/if}
			Log out
		</Button>
	</div>
	{#if logoutError}
		<div class="px-4 pb-4">
			<div
				class="flex h-8 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-2 text-sm text-red-700 dark:border-red-600 dark:bg-red-700 dark:text-red-50"
			>
				<CircleAlert class="size-4" />
				{logoutError}
			</div>
		</div>
	{/if}
</div>
