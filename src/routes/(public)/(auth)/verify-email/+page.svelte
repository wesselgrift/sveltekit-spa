<script lang="ts">
	/**
	 * Verify Email Page
	 * 
	 * Handles email verification through component
	 */

    import { Logo } from '$lib/components/ui/logo';
    import { VerifyEmail } from '$lib/components/auth'
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col gap-5">
        <div class="mb-2">
            <Logo />
        </div>
		
        <!-- Verify email component -->
        <VerifyEmail />
	</div>
</div>

