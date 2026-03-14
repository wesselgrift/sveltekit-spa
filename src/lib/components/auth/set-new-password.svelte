<script lang="ts">
	/**
	 * Set New Password Page
	 *
	 * Handles the second step of password recovery after the user clicks
	 * a reset link from email. Validates the new password and confirms it.
	 */

	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		confirmPasswordReset,
		completeRecoveredPasswordReset,
		getAuthErrorMessage
	} from '$lib/auth';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { setNewPasswordSchema } from './auth-schemas';

	// Server error state (provider auth errors, token errors)
	let serverError = $state(null as string | null);
	let loading = $state(false);
	let success = $state(false);
	let hasRecoveryFlag = $state(false);
	let hasHashRecovery = $state(false);
	const PASSWORD_RECOVERY_FLAG = 'auth:password-recovery';

	// Supabase reset links provide token_hash + type=recovery.
	// Keep a compatibility fallback for code-based links.
	const recoveryToken = $derived(
		page.url.searchParams.get('token_hash') ?? page.url.searchParams.get('code') ?? ''
	);
	const recoveryType = $derived(page.url.searchParams.get('type'));
	const hasValidRecoveryParams = $derived(Boolean(recoveryToken) && (!recoveryType || recoveryType === 'recovery'));
	const canCompleteRecovery = $derived(hasValidRecoveryParams || hasRecoveryFlag || hasHashRecovery);

	onMount(() => {
		hasRecoveryFlag = window.sessionStorage.getItem(PASSWORD_RECOVERY_FLAG) === '1';
		const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
		hasHashRecovery =
			hashParams.get('type') === 'recovery' && Boolean(hashParams.get('access_token'));
	});

	const form = superForm(defaults(zod4(setNewPasswordSchema)), {
		validators: zod4(setNewPasswordSchema),
		SPA: true,
		onUpdate: async ({ form: f }) => {
			if (!f.valid) {
				return;
			}

			if (!canCompleteRecovery) {
				serverError = 'This password reset link is invalid or expired. Please request a new one.';
				return;
			}

			try {
				loading = true;
				serverError = null;
				if (hasValidRecoveryParams) {
					await confirmPasswordReset(recoveryToken, f.data.newPassword);
				} else {
					await completeRecoveredPasswordReset(f.data.newPassword);
				}
				window.sessionStorage.removeItem(PASSWORD_RECOVERY_FLAG);
				success = true;
			} catch (err) {
				serverError = getAuthErrorMessage(err);
			} finally {
				loading = false;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

{#if success}
	<div class="flex flex-col gap-5">
		<Alert>
			<AlertTitle>Password updated</AlertTitle>
			<AlertDescription>
				Your password was updated successfully. You can now sign in with your new password.
			</AlertDescription>
		</Alert>
		<Button href="/login" class="w-full">
			Continue to login
		</Button>
	</div>
{:else}
	<div class="flex flex-col gap-5">
		{#if serverError}
			<Alert variant="destructive">
				<AlertTitle>Whoops!</AlertTitle>
				<AlertDescription>{serverError}</AlertDescription>
			</Alert>
		{/if}

		{#if !canCompleteRecovery}
			<Alert variant="destructive">
				<AlertTitle>Invalid link</AlertTitle>
				<AlertDescription>
					Your password reset link is missing required parameters or has expired. Request a new reset link to continue.
				</AlertDescription>
			</Alert>
			<Button href="/reset-password" variant="outline" class="w-full">
				Request new reset link
			</Button>
		{:else}
			<form method="POST" use:enhance class="flex flex-col gap-5">
				<Form.Field {form} name="newPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>New password</Form.Label>
							<Input {...props} type="password" bind:value={$formData.newPassword} disabled={loading} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="confirmNewPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Confirm new password</Form.Label>
							<Input {...props} type="password" bind:value={$formData.confirmNewPassword} disabled={loading} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button disabled={loading} class="w-full">
					{#if loading}
						<Spinner />
					{/if}
					Set new password
				</Form.Button>
			</form>
		{/if}
	</div>
{/if}
