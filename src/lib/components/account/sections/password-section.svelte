<script lang="ts">

	/**
	 * Account section / password component
	 * Allows for changing password
	 * Requires current password for submit
	 */

	import { changePassword, logout } from '$lib/auth/actions';
	import { goto } from '$app/navigation';
	import { getAuthErrorMessage } from '$lib/auth/errors';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Lock, Check, CircleAlert } from '@lucide/svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { changePasswordSchema } from './account-schemas';

	let showForm = $state(false);
	let loading = $state(false);
	let success = $state(false);
	let serverError = $state<string | null>(null);

	const form = superForm(defaults(zod4(changePasswordSchema)), {
		validators: zod4(changePasswordSchema),
		SPA: true,
		// Keep submitted values visible until our delayed close runs.
		resetForm: false,
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				loading = true;
				serverError = null;
				success = false;

				try {
					await changePassword(f.data.currentPassword, f.data.newPassword);

					success = true;

					// Close form after a delay to show success message
					setTimeout(() => {
						closeEditForm();
						handleLogout();
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
		$formData.currentPassword = '';
		$formData.newPassword = '';
		success = false;
		serverError = null;
		showForm = true;
	}

	// Close the edit form and reset state
	function closeEditForm(): void {
		showForm = false;
		success = false;
		serverError = null;
	}

	async function handleLogout(): Promise<void> {
		try {
			await logout();
			// Redirect to login page after logout
			// The auth guard will handle this automatically, but explicit redirect is clearer
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
			// Reset logging out state on error so user can try again
		}
	}
</script>

<div class="flex flex-col border-b">
	<div class="flex flex-row gap-4 p-4 w-full">
		<Lock class="shrink-0" strokeWidth={1.5} />
		<div class="flex flex-col gap-1 text-sm">
			<p class="font-medium">Password</p>
			<p class="text-muted-foreground">•••••••••••••</p>
		</div>
		<Button onclick={openEditForm} variant="outline" size="sm" class="ml-auto" disabled={showForm}>Change password</Button>
	</div>

	{#if showForm}
		<form method="POST" use:enhance class="flex flex-col p-4 pl-14 max-w-sm gap-5">
			<Form.Field {form} name="currentPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Current Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.currentPassword} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="newPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>New Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.newPassword} disabled={loading} />
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
						Password changed successfully. Please log in with your new password.
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