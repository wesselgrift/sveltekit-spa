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

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
	<div class="w-full max-w-sm flex flex-col gap-8 animate-fade-in-zoom">
		<Logo />
		<h1 class="text-2xl font-medium">Set new password</h1>

		<!-- Set new password form component -->
		<SetNewPasswordForm />
	</div>
</div>
