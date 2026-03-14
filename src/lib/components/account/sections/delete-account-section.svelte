<script lang="ts">
	
	/**
	 * Account section / delete account component
	 * Allows for account deletion
	 * Also removes profile/auth records (see deleteAccount())
	 */

	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { UserRoundX, CircleAlert } from '@lucide/svelte';
	import { deleteAccount } from '$lib/auth/actions';
	import { getAuthErrorMessage } from '$lib/auth/errors';
	import { Spinner } from '$lib/components/ui/spinner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { deleteAccountSchema } from './account-schemas';

	let confirmDelete = $state(false);
	let deleting = $state(false);
	let serverError = $state<string | null>(null);

	const form = superForm(defaults(zod4(deleteAccountSchema)), {
		validators: zod4(deleteAccountSchema),
		SPA: true,
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				deleting = true;
				serverError = null;

				try {
					await deleteAccount(f.data.password);
					// Redirect to account deleted page
					goto('/account-deleted');
				} catch (err) {
					serverError = getAuthErrorMessage(err);
					deleting = false;
				}
			}
		},
	});

	const { form: formData, enhance } = form;

	// Cancel deletion and revert UI
	function handleCancel(): void {
		confirmDelete = false;
		$formData.password = '';
		serverError = null;
	}
</script>

<div class="flex flex-row rounded-md bg-red-50/70 dark:bg-red-950/70 border border-red-100 dark:border-red-900">
	<div class="flex flex-col">
		<div class="flex flex-row gap-4 p-4 w-full text-red-700 dark:text-red-300">
			<UserRoundX class="shrink-0" strokeWidth={1.5} />
			<div class="flex flex-col gap-1 text-sm">
				<p class="font-medium">
					{#if !confirmDelete}
						Delete account        
					{:else}
						Are you sure?
					{/if}
				</p>
					<p class="opacity-80">This is irreversable and will permanently delete your account and all associated data.</p>
				</div>
			<Button onclick={() => confirmDelete = true} variant="destructive" size="sm" class="ml-auto" disabled={deleting || confirmDelete}>Delete account</Button>
		</div>

		{#if confirmDelete}
			<form method="POST" use:enhance class="flex flex-col p-4 pl-14 max-w-sm gap-5">
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Enter your password to confirm</Form.Label>
							<Input {...props} type="password" bind:value={$formData.password} disabled={deleting} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				{#if serverError}
					<div class="h-8 px-2 flex gap-2 items-center rounded-md text-sm text-red-700 bg-red-100 border-red-200 dark:text-red-50 dark:bg-red-700 dark:border-red-600">
						<CircleAlert class="size-4" />
						{serverError}
					</div>
				{/if}
				<div class="flex flex-row gap-2 mb-4">
					<Form.Button variant="destructive" size="sm" disabled={deleting}>
						{#if deleting}
							<Spinner />
						{/if}
						Confirm
					</Form.Button>
					<Button type="button" onclick={handleCancel} variant="outline" size="sm" disabled={deleting}>Cancel</Button>
				</div>
			</form>
		{/if}
	</div>
</div>