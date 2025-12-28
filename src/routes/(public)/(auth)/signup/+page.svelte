<script lang="ts">
	/**
	 * Signup Page
	 * 
	 * Signup page accessible at /signup.
	 * Handles user registration with email and password.
	 * After signup, redirects to verify-email page since email verification is required.
	 */

    import { Logo } from '$lib/components/ui/logo';
    import { Signup as SignupForm } from '$lib/components/auth'

</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col gap-8">
        <Logo />
		<h1 class="text-2xl font-medium">Create account</h1>

        <!-- Sign up form component -->
		<SignupForm />
        
        <!-- Link to login page -->
        <div class="text-center">
            <a href="/login" class="text-sm text-muted-foreground hover:underline">
                Log in instead
            </a>
        </div>
	</div>
</div>

