<script lang="ts">
	/**
	 * Reset Password Page
	 *
	 * Handles password reset email requests using ResetPassword component.
	 * Publicly accessible, no auth required.
	 */

	import { Logo } from '$lib/components/ui/logo';
	import { ResetPassword as ResetPasswordForm } from '$lib/components/auth';
</script>

<div class="flex items-center justify-center p-4 pt-10 md:min-h-screen md:pt-4">
	<div class="animate-fade-in-zoom flex w-full max-w-sm flex-col gap-8">
		<Logo />
		<h1 class="text-2xl font-medium">Reset password</h1>

		<!-- Reset Password Form component -->
		<ResetPasswordForm />

		<!-- Link back to login -->
		<div class="text-center">
			<a href="/login" class="text-sm text-muted-foreground hover:underline"> Back to login </a>
		</div>
	</div>
</div>
