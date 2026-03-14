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

    // Server error state (provider auth errors, not field validation)
	let serverError = $state<string | null>(null);
	let loading = $state(false);

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
                    serverError = getAuthErrorMessage(err);
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