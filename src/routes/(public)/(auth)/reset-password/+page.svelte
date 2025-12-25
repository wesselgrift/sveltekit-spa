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

	// Form state
	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	// Validation
	const isValid = $derived(email.length > 0);

	async function handleSubmit(): Promise<void> {
		if (!isValid) {
			error = 'Please enter your email address';
			return;
		}

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
	<div class="w-full max-w-md space-y-6">
		<div class="text-center">
			<h1 class="text-2xl font-bold">Reset Password</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Enter your email address and we'll send you a link to reset your password
			</p>
		</div>

		{#if success}
			<div class="space-y-4 text-center">
				<div class="rounded-lg border p-4">
					<h2 class="text-lg font-semibold mb-2">Check your email</h2>
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
			<div class="space-y-4">
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}

				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					class="space-y-4"
				>
					<div class="space-y-2">
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
					<Button type="submit" disabled={loading || !isValid} class="w-full">
						{loading ? 'Sending...' : 'Send Reset Link'}
					</Button>
				</form>

				<!-- Link back to login -->
				<div class="text-center">
					<Button variant="link" href="/login" class="text-sm">
						Back to login
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>

