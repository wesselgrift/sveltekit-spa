<script lang="ts">
	/**
	 * Set New Password Page
	 *
	 * Renders the reset-password completion form after users open their
	 * recovery link from email.
	 */

	import { Logo } from '$lib/components/ui/logo';
	import { SetNewPassword as SetNewPasswordForm } from '$lib/components/auth';
</script>

<div class="flex items-center justify-center p-4 pt-10 md:min-h-screen md:pt-4">
	<div class="animate-fade-in-zoom flex w-full max-w-sm flex-col gap-8">
		<Logo />
		<h1 class="text-2xl font-medium">Set new password</h1>

		<!-- Set new password form component -->
		<SetNewPasswordForm />
	</div>
</div>
