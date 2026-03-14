<script lang="ts">
	/**
	 * Reset Password Page
	 * 
	 * Password reset page accessible at /reset-password.
	 * Handles password reset email requests. User enters email and receives
	 * a password reset link via email.
	 */

    import { resetPassword, getAuthErrorMessage } from '$lib/auth';
    import * as Form from '$lib/components/ui/form'
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { zod4 } from 'sveltekit-superforms/adapters';
    import { resetPasswordSchema } from './auth-schemas';

	// Server error state (provider auth errors, not field validation)
	let serverError = $state<string | null>(null);
	let loading = $state(false);
	let success = $state(false);

    // Submit email for password reset
	const form = superForm(defaults(zod4(resetPasswordSchema)), {
        validators: zod4(resetPasswordSchema),
        SPA: true,
        onUpdate: async ({form: f}) => {
            if (f.valid) {
                try {
                    loading = true;
                    serverError = null;
                    await resetPassword(f.data.email);
                    success = true;
                } catch (err) {
                    serverError = getAuthErrorMessage(err);
                } finally {
                    loading = false;
                }
            }
        }
    });

    const { form: formData, enhance } = form;
</script>

{#if success}
	<div class="flex flex-col gap-5">
		<Alert>
			<AlertTitle>Check your email</AlertTitle>
			<AlertDescription>
				We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
			</AlertDescription>
		</Alert>
		<Button href="/login" class="w-full">
			Back to login
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

		<form method="POST" use:enhance class="flex flex-col gap-5">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} type="email" bind:value={$formData.email} disabled={loading} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button disabled={loading} class="w-full">
				{#if loading}
					<Spinner />
				{/if}
				Send reset link
			</Form.Button>
		</form>
	</div>
{/if}