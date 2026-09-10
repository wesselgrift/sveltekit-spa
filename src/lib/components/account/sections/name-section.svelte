<script lang="ts">
	/**
	 * Account section / name component
	 * Show display name, split by first name and fill remainder into last name
	 * Allows for name change
	 */

	import { authState } from '$lib/auth/state.svelte';
	import { updateDisplayName } from '$lib/auth/actions';
	import { getAuthErrorMessage } from '$lib/auth/errors';
	import { splitDisplayName } from '$lib/helpers/name-helpers';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { IdCardLanyard, Check, CircleAlert } from '@lucide/svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { nameSchema } from './account-schemas';

	let changeName = $state(false);
	let loading = $state(false);
	let success = $state(false);
	let serverError = $state<string | null>(null);

	// Local override for the display name (set after successful save)
	let savedDisplayName = $state<string | null>(null);

	// Get current name parts - use local override if available, otherwise from user
	let nameParts = $derived(splitDisplayName(savedDisplayName ?? authState.user?.displayName ?? ''));

	const form = superForm(defaults(zod4(nameSchema)), {
		validators: zod4(nameSchema),
		SPA: true,
		// Keep submitted values visible until our delayed close runs.
		resetForm: false,
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				if (!authState.user) return;

				loading = true;
				serverError = null;
				success = false;

				try {
					const newDisplayName = `${f.data.firstName.trim()} ${f.data.lastName.trim()}`;

					await updateDisplayName(newDisplayName);
					await authState.user.reload();

					// Update local state immediately so UI reflects the change
					savedDisplayName = newDisplayName;

					success = true;

					// Close form after a short delay to show success message
					setTimeout(() => {
						closeEditForm();
					}, 1500);
				} catch (err) {
					serverError = getAuthErrorMessage(err);
				} finally {
					loading = false;
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	// Open the edit form and populate with current values
	function openEditForm(): void {
		$formData.firstName = nameParts.firstName;
		$formData.lastName = nameParts.lastName;
		success = false;
		serverError = null;
		changeName = true;
	}

	// Close the edit form and reset state
	function closeEditForm(): void {
		changeName = false;
		success = false;
		serverError = null;
	}
</script>

<div class="flex flex-col border-b">
	<div class="flex w-full flex-row gap-4 p-4">
		<IdCardLanyard class="shrink-0" strokeWidth={1.5} />
		<div class="flex flex-col gap-1 text-sm">
			<p class="font-medium">Name</p>
			<p class="text-muted-foreground">{nameParts.firstName} {nameParts.lastName}</p>
		</div>
		<Button onclick={openEditForm} variant="outline" size="sm" class="ml-auto" disabled={changeName}
			>Change name</Button
		>
	</div>

	{#if changeName}
		<form method="POST" use:enhance class="flex max-w-sm flex-col gap-5 p-4 pl-14">
			<Form.Field {form} name="firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>First Name</Form.Label>
						<Input {...props} bind:value={$formData.firstName} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="lastName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Last Name</Form.Label>
						<Input {...props} bind:value={$formData.lastName} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if serverError}
				<div
					class="flex h-8 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-2 text-sm text-red-700 dark:border-red-600 dark:bg-red-700 dark:text-red-50"
				>
					<CircleAlert class="size-4" />
					{serverError}
				</div>
			{/if}

			<div class="mb-4 flex flex-row gap-2">
				{#if success}
					<div
						class="flex h-8 items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-2 text-sm text-emerald-700 dark:border-emerald-600 dark:bg-emerald-700 dark:text-emerald-200"
					>
						<Check class="size-4" />
						Name updated
					</div>
				{:else}
					<Form.Button variant="default" size="sm" disabled={loading}>
						{#if loading}
							<Spinner />
						{/if}
						Save
					</Form.Button>
					<Button
						type="button"
						onclick={closeEditForm}
						variant="outline"
						size="sm"
						disabled={loading}>Cancel</Button
					>
				{/if}
			</div>
		</form>
	{/if}
</div>
