<script lang="ts">
	/**
	 * Onboarding Step 2 page.
	 * Collects favorite drink, prefills from profile, and marks onboarding complete.
	 */

	import { goto } from '$app/navigation';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { OnboardingShell } from '$lib/components/onboarding';
	import { onboardingStepTwoSchema } from '$lib/components/onboarding/onboarding-schemas';
	import {
		getOnboardingStepByNumber,
		getOnboardingStepPath,
		onboardingStepCount
	} from '$lib/config/features';
	import { prefillStep, finishOnboarding } from '$lib/services/onboarding-service';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';

	const step = getOnboardingStepByNumber(2);
	if (!step) {
		throw new Error('Missing onboarding step configuration for step 2.');
	}

	let loading = $state(false);
	let prefillLoading = $state(true);
	let serverError = $state<string | null>(null);

	const form = superForm(defaults(zod4(onboardingStepTwoSchema)), {
		validators: zod4(onboardingStepTwoSchema),
		SPA: true,
		onUpdate: async ({ form: f }) => {
			if (!f.valid) {
				return;
			}

			loading = true;
			serverError = null;

			const result = await finishOnboarding(f.data.favoriteDrink);

			if (result.ok) {
				await goto('/app');
			} else {
				serverError = result.error;
			}

			loading = false;
		}
	});

	const { form: formData, enhance } = form;

	// Prefills existing answer and blocks step skipping.
	onMount(() => {
		let cancelled = false;

		void prefillStep(2, 'favorite_drink')
			.then((result) => {
				if (cancelled) {
					return;
				}

				if (!result.ok) {
					serverError = result.error;
					return;
				}

				if (result.data.prefillValue) {
					$formData.favoriteDrink = result.data.prefillValue;
				}

				if (!result.data.isCorrectStep) {
					void goto(getOnboardingStepPath(result.data.requiredStep));
				}
			})
			.finally(() => {
				if (!cancelled) {
					prefillLoading = false;
				}
			});

		return () => {
			cancelled = true;
		};
	});
</script>

<OnboardingShell
	stepNumber={step.stepNumber}
	totalSteps={onboardingStepCount}
	title={step.title}
	subtext={step.subtext}
>
	{#if serverError}
		<Alert variant="destructive">
			<AlertTitle>Whoops!</AlertTitle>
			<AlertDescription>{serverError}</AlertDescription>
		</Alert>
	{/if}

	<form method="POST" use:enhance class="flex flex-col gap-5" aria-busy={loading || prefillLoading}>
		<Form.Field {form} name="favoriteDrink">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{step.fieldLabel}</Form.Label>
					<Input
						{...props}
						bind:value={$formData.favoriteDrink}
						placeholder={step.fieldPlaceholder}
						disabled={loading || prefillLoading}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={loading || prefillLoading} class="w-full">
			{#if loading || prefillLoading}
				<Spinner />
			{/if}
			{step.submitLabel}
		</Form.Button>
	</form>
</OnboardingShell>
