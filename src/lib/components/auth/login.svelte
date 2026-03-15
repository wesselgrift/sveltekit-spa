<script lang="ts">
    /**
	 * Login component
	 * 
	 * Handles email/password login.
	 */

	import { loginWithEmail, getAuthErrorMessage } from '$lib/auth';
    import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input';
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { zod4 } from 'sveltekit-superforms/adapters';
    import { loginSchema } from './auth-schemas';

	const noop = () => {};

	// Parent can handle unverified-login flows (e.g., redirect to verify-email).
	const { onRequireVerification = noop } = $props<{
		onRequireVerification?: (email: string) => void;
	}>();

    // Server error state (provider auth errors, not field validation)
	let serverError = $state<string | null>(null);
	let loading = $state(false);

	// Supabase recommends identifying auth failures by structured error codes.
	// `email_not_confirmed` indicates valid credentials for an unverified account.
	function isEmailNotConfirmedError(error: unknown): boolean {
		if (!error || typeof error !== 'object') {
			return false;
		}

		const codeValue = (error as { code?: unknown }).code;
		const code = typeof codeValue === 'string' ? codeValue.toLowerCase() : '';
		return code === 'email_not_confirmed';
	}

    const form = superForm(defaults(zod4(loginSchema)), {
        validators: zod4(loginSchema),
        SPA: true,
        onUpdate: async ({ form: f}) => {
            if (f.valid) {
                try {
                    loading = true;
                    serverError = null;
                    await loginWithEmail(f.data.email, f.data.password);
                } catch (err) {
					if (isEmailNotConfirmedError(err)) {
						onRequireVerification(f.data.email);
					} else {
						serverError = getAuthErrorMessage(err);
					}
                } finally {
                    loading = false;
                }
            }
        }
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

	<!-- Email/Password Form -->
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
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-row justify-between">
						<Form.Label>Password</Form.Label>
						<a href="/reset-password" class="text-sm leading-none text-muted-foreground hover:underline">
							Forgot password?
						</a>
					</div>
					<Input {...props} type="password" bind:value={$formData.password} disabled={loading} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={loading} class="w-full">
			{#if loading}
				<Spinner />
			{/if}
			Log in
		</Form.Button>
	</form>
</div>