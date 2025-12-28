<script lang="ts">
	/**
	 * Reset Password Page
	 * 
	 * Handles password reset email requests with ResetPassword component
	 */

    import { Logo } from '$lib/components/ui/logo';
    import { ResetPassword } from '$lib/components/auth';

</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col gap-8">
        <Logo />
        <h1 class="text-2xl font-medium">Reset Password</h1>

        <!-- Reset Password Form component -->
		<ResetPassword />

        <!-- Link back to login -->
        <div class="text-center">
            <a href="/login" class="text-muted-foreground text-sm hover:underline">
                Back to login
            </a>
        </div>
	</div>
</div>

