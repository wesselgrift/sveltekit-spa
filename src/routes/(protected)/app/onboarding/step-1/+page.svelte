<script lang="ts">
	/**
	 * Onboarding Step 1 page.
	 * Collects favorite fruit, prefills from profile, and advances to step 2.
	 */

	import { goto } from '$app/navigation';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { OnboardingShell } from '$lib/components/onboarding';
	import { onboardingStepOneSchema } from '$lib/components/onboarding/onboarding-schemas';
	import {
		getOnboardingStepByNumber,
		getOnboardingStepPath,
		onboardingStepCount
	} from '$lib/config/features';
	import { prefillStep, saveStep } from '$lib/services/onboarding-service';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';

	const step = getOnboardingStepByNumber(1);
	if (!step) {
		throw new Error('Missing onboarding step configuration for step 1.');
	}

	let loading = $state(false);
	let prefillLoading = $state(true);
	let serverError = $state<string | null>(null);

	const form = superForm(defaults(zod4(onboardingStepOneSchema)), {
		validators: zod4(onboardingStepOneSchema),
		SPA: true,
		onUpdate: async ({ form: f }) => {
			if (!f.valid) {
				return;
			}

			loading = true;
			serverError = null;

			const result = await saveStep(1, 'favorite_fruit', f.data.favoriteFruit);

			if (result.ok) {
				await goto(getOnboardingStepPath(2));
			} else {
				serverError = result.error;
			}

			loading = false;
		}
	});

	const { form: formData, enhance } = form;

	// Prefills existing answer and keeps users on the required step.
	onMount(() => {
		let cancelled = false;

		void prefillStep(1, 'favorite_fruit')
			.then((result) => {
				if (cancelled) {
					return;
				}

				if (!result.ok) {
					serverError = result.error;
					return;
				}

				if (result.data.prefillValue) {
					$formData.favoriteFruit = result.data.prefillValue;
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
		<Form.Field {form} name="favoriteFruit">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{step.fieldLabel}</Form.Label>
					<Input
						{...props}
						bind:value={$formData.favoriteFruit}
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
