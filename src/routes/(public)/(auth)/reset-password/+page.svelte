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

	// Form state
	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

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

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col gap-8">
        <h1 class="text-2xl font-medium">Reset Password</h1>

		{#if success}
			<div class="flex flex-col gap-5">
				<div class="rounded-lg border p-4">
					<h2 class="text-sm font-semibold mb-1">Check your email</h2>
					<p class="text-sm text-muted-foreground">
						We've sent password reset instructions to your email address.
						Please check your inbox and follow the link to reset your password.
					</p>
				</div>
				<Button href="/login" class="w-full">
					Back to login
				</Button>
			</div>
		{:else}
			<div class="flex flex-col gap-5">
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
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
							placeholder="your@email.com"
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

				<!-- Link back to login -->
				<div class="text-center">
                    <a href="/login" class="text-muted-foreground text-sm hover:underline">
                        Back to login
                    </a>
				</div>
			</div>
		{/if}
	</div>
</div>

