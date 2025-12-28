<script lang="ts">
	/**
	 * Signup Page
	 * 
	 * Signup page accessible at /signup.
	 * Handles user registration with email and password and informs the parent
	 * of success so the page can handle navigation or other side effects.
	 */

	import { signupWithEmail, getAuthErrorMessage } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';

	const noop = () => {};

	// Allow parent pages to respond to signup success (e.g., redirect or track)
	const { onSignupSuccess = noop } = $props<{
		onSignupSuccess?: (email: string) => void;
	}>();

	// Form state
	let email = $state('');
	let password = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Submit handler stays UI-focused; navigation happens in the parent page.
	async function handleSubmit(): Promise<void> {
		try {
			loading = true;
			error = null;
			await signupWithEmail(firstName, lastName, email, password);

			onSignupSuccess(email);
		} catch (err) {
			error = getAuthErrorMessage(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-col gap-5">
    {#if error}
        <Alert variant="destructive">
            <AlertTitle>Whoops!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    {/if}

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-5">
        <div class="flex flex-row gap-3">
            <div class="flex flex-col gap-2.5 w-full">
                <Label for="firstName">First name</Label>
                <Input
                    id="firstName"
                    type="text"
                    bind:value={firstName}
                    required
                    disabled={loading}
                />
            </div>
            <div class="flex flex-col gap-2.5 w-full">
                <Label for="firstName">Last name</Label>
                <Input
                    id="lastName"
                    type="text"
                    bind:value={lastName}
                    required
                    disabled={loading}
                />
            </div>
        </div>
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
        <div class="flex flex-col gap-2.5">
            <Label for="password">Password</Label>
            <Input
                id="password"
                type="password"
                bind:value={password}
                required
                disabled={loading}
                minlength={6}
            />
            {#if password.length > 0 && password.length < 6}
                <p class="text-xs text-muted-foreground">Password must be at least 6 characters</p>
            {/if}
        </div>
        <Button type="submit" disabled={loading} class="w-full">
            {#if loading}
                <Spinner />
            {/if}
            Continue
        </Button>
    </form>
</div>