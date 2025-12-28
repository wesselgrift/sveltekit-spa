<script lang="ts">
    /**
	 * Login component
	 * 
	 * Handles email/password login.
	 * Accepts optional redirect path via prop.
	 */

	import { goto } from '$app/navigation';
	import {
		loginWithEmail,
		getAuthErrorMessage
	} from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import  { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';

	// Form state
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleEmailPasswordLogin(): Promise<void> {
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		try {
			loading = true;
			error = null;
			await loginWithEmail(email, password);
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

    <!-- Email/Password Form -->
    <form onsubmit={(e) => { e.preventDefault(); handleEmailPasswordLogin(); }} class="flex flex-col gap-5">
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
            <div class="flex flex-row justify-between">
                <Label for="password">Password</Label>
                <a href="/reset-password" class="text-sm leading-none text-muted-foreground hover:underline">
                    Forgot password?
                </a>
            </div>
            <Input
                id="password"
                type="password"
                bind:value={password}
                required
                disabled={loading}
            />
        </div>
        <Button type="submit" disabled={loading} class="w-full">
            {#if loading}
                <Spinner />
            {/if}
            Log in
        </Button>
    </form>
</div>