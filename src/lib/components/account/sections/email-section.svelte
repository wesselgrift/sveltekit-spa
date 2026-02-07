<script lang="ts">

	/**
	 * Account section / email component
	 * Show email and allows for email change
	 * Requires user password to submit
	 */

	import { authState } from '$lib/auth/state.svelte';
	import { changeEmail } from '$lib/auth/actions';
	import { getAuthErrorMessage } from '$lib/auth/errors';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Mail, Check, CircleAlert } from '@lucide/svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { changeEmailSchema } from './account-schemas';

	let showForm = $state(false);
	let loading = $state(false);
	let success = $state(false);
	let serverError = $state<string | null>(null);

	// Store the email we sent verification to (for success message)
	let sentToEmail = $state('');

	const form = superForm(defaults(zod4(changeEmailSchema)), {
		validators: zod4(changeEmailSchema),
		SPA: true,
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				loading = true;
				serverError = null;
				success = false;

				try {
					await changeEmail(f.data.currentPassword, f.data.newEmail.trim());

					// Store the email for success message
					sentToEmail = f.data.newEmail.trim();
					success = true;

					// Close form after a delay to show success message
					setTimeout(() => {
						closeEditForm();
					}, 3000);
				} catch (err) {
					serverError = getAuthErrorMessage(err);
				} finally {
					loading = false;
				}
			}
		},
	});

	const { form: formData, enhance } = form;

	// Open the edit form and reset fields
	function openEditForm(): void {
		$formData.newEmail = '';
		$formData.currentPassword = '';
		success = false;
		serverError = null;
		sentToEmail = '';
		showForm = true;
	}

	// Close the edit form and reset state
	function closeEditForm(): void {
		showForm = false;
		success = false;
		serverError = null;
		sentToEmail = '';
	}
</script>

<div class="flex flex-col border-b">
	<div class="flex flex-row gap-4 p-4 w-full">
		<Mail class="shrink-0" strokeWidth={1.5} />
		<div class="flex flex-col gap-1 text-sm">
			<p class="font-medium">Email</p>
			<p class="text-muted-foreground">{authState.user?.email}</p>
		</div>
		<Button onclick={openEditForm} variant="outline" size="sm" class="ml-auto" disabled={showForm}>Change email</Button>
	</div>

	{#if showForm}
		<form method="POST" use:enhance class="flex flex-col p-4 pl-14 max-w-sm gap-5">
			<Form.Field {form} name="newEmail">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>New Email</Form.Label>
						<Input {...props} type="email" bind:value={$formData.newEmail} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="currentPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Current Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.currentPassword} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if serverError}
				<div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm border text-red-700 bg-red-50 border-red-200 dark:text-red-50 dark:bg-red-700 dark:border-red-600">
					<CircleAlert class="size-4" />
					{serverError}
				</div>
			{/if}

			<div class="flex flex-row gap-2 mb-4">
				{#if success}
					<div class="h-auto py-2 px-2 flex gap-2 items-start rounded-md text-sm border text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-200 dark:bg-emerald-700 dark:border-emerald-600">
						<Check class="size-4 mt-0.5 shrink-0" />
						Verification email sent to {sentToEmail}
					</div>
				{:else}
					<Form.Button variant="default" size="sm" disabled={loading}>
						{#if loading}
							<Spinner />
						{/if}
						Save
					</Form.Button>
					<Button type="button" onclick={closeEditForm} variant="outline" size="sm" disabled={loading}>Cancel</Button>
				{/if}
			</div>
		</form>
	{/if}
</div>