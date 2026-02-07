<script lang="ts">
	/**
	 * Signup Page
	 * 
	 * Signup page accessible at /signup.
	 * Handles user registration with email and password and informs the parent
	 * of success so the page can handle navigation or other side effects.
	 */

	import { signupWithEmail, getAuthErrorMessage } from '$lib/auth';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { signupSchema } from './auth-schemas';

	const noop = () => {};

	// Allow parent pages to respond to signup success (e.g., redirect or track)
	const { onSignupSuccess = noop } = $props<{
		onSignupSuccess?: (email: string) => void;
	}>();

	// Server error state (Firebase auth errors, not field validation)
	let serverError = $state<string | null>(null);
	let loading = $state(false);

	const form = superForm(defaults(zod4(signupSchema)), {
		validators: zod4(signupSchema),
		SPA: true,
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				try {
					loading = true;
					serverError = null;
					await signupWithEmail(f.data.firstName, f.data.lastName, f.data.email, f.data.password);
					onSignupSuccess(f.data.email);
				} catch (err) {
					serverError = getAuthErrorMessage(err);
				} finally {
					loading = false;
				}
			}
		},
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex flex-col gap-5">
	{#if serverError}
		<Alert variant="destructive">
			<AlertTitle>Whoops!</AlertTitle>
			<AlertDescription>{serverError}</AlertDescription>
		</Alert>
	{/if}

	<form method="POST" use:enhance class="flex flex-col gap-5">
		<div class="flex flex-row gap-3">
			<Form.Field {form} name="firstName" class="w-full">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>First name</Form.Label>
						<Input {...props} bind:value={$formData.firstName} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="lastName" class="w-full">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Last name</Form.Label>
						<Input {...props} bind:value={$formData.lastName} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} type="email" bind:value={$formData.email} disabled={loading} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} type="password" bind:value={$formData.password} disabled={loading} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={loading} class="w-full">
			{#if loading}
				<Spinner />
			{/if}
			Continue
		</Form.Button>
	</form>
</div>