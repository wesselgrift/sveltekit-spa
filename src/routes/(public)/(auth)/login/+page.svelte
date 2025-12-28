<script lang="ts">
	/**
	 * Login Page
	 * 
	 * Login page accessible at /login.
	 * Handles redirect to /app/* with nextParam after login
	 */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authState } from '$lib/auth';
    import { Logo } from '$lib/components/ui/logo';
    import LoginForm from '$lib/components/auth/login.svelte';

	// Get next param for redirect after login
	const nextParam = $derived(page.url.searchParams.get('next'));

	// Redirect if user is (already) logged in
	$effect(() => {
		if (!authState.loading && authState.user !== null) {
			goto(nextParam ?? '/app');
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-sm flex flex-col gap-8">
        <Logo />
		
        <h1 class="text-2xl font-medium">Log in</h1>
		
        <!-- Login form component -->
        <LoginForm />

        <!-- Links to other auth pages -->
        <div class="flex flex-col gap-2.5 text-center">
            <a href="/signup" class="text-sm text-muted-foreground hover:underline">
                Create an account instead
            </a>
        </div>
	</div>
</div>
