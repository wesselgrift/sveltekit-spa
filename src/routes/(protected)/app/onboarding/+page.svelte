<script lang="ts">
	/**
	 * Onboarding index page.
	 * Redirects users to their required onboarding step with loading/error states.
	 */

	import { goto } from '$app/navigation';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Spinner } from '$lib/components/ui/spinner';
	import { getOnboardingStepPath } from '$lib/config/features';
	import { getOnboardingStatus } from '$lib/services/onboarding-service';
	import { onMount } from 'svelte';

	let loading = $state(true);
	let serverError = $state<string | null>(null);

	onMount(() => {
		let cancelled = false;

		void getOnboardingStatus()
			.then((result) => {
				if (cancelled) {
					return;
				}

				if (!result.ok) {
					console.error('Failed to resolve onboarding destination:', result.error);
					serverError = result.error;
					loading = false;
					return;
				}

				void goto(getOnboardingStepPath(result.data.nextStep));
			});

		return () => {
			cancelled = true;
		};
	});
</script>

{#if loading}
	<div class="flex items-center justify-center min-h-screen">
		<Spinner class="size-6" />
	</div>
{:else if serverError}
	<div class="flex items-center justify-center min-h-screen p-4">
		<Alert variant="destructive" class="w-full max-w-md">
			<AlertTitle>Unable to continue onboarding</AlertTitle>
			<AlertDescription>{serverError}</AlertDescription>
		</Alert>
	</div>
{/if}
