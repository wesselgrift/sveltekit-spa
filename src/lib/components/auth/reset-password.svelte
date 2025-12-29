<script lang="ts">
	/**
	 * Reset Password Page
	 * 
	 * Password reset page accessible at /reset-password.
	 * Handles password reset email requests. User enters email and receives
	 * a password reset link via email.
	 */

    import { resetPassword, getAuthErrorMessage } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';

	// Form state
	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

    // Submit email for password reset
	async function handleSubmit(): Promise<void> {
		try {
			loading = true;
			error = null;
			await resetPassword(email);
			success = true;
			email = ''; // Clear form
		} catch (err) {
			error = getAuthErrorMessage(err);
		} finally {
			loading = false;
		}
	}
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
        {#if error}
            <Alert variant="destructive">
                <AlertTitle>Whoops!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        {/if}

        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            class="flex flex-col gap-5"
        >
            <div class="flex flex-col gap-2.5">
                <Label for="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    bind:value={email}
                    required
                    disabled={loading}
                />
            </div>
            <Button type="submit" disabled={loading} class="w-full">
                {#if loading}
                    <Spinner />
                {/if}
                Send reset link
            </Button>
        </form>

    </div>
{/if}