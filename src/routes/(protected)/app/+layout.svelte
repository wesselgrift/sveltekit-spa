<script lang="ts">
    /**
     * Protected Route Layout
     * 
     * Guards authenticated routes using useProtectedRoute (pure derivation) and
     * reacts to non-authenticated statuses via $effect for redirects.
     * Shows loading spinner during auth check, redirects unauthenticated users,
     * renders children only when user is authenticated and email verified.
     */

	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { useProtectedRoute, isOnboardingRoute } from '$lib/auth/guards';
	import { AppNavbar } from '$lib/components/navigation';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { featureFlags, getOnboardingStepByPath, getOnboardingStepPath } from '$lib/config/features';
	import { getOnboardingStatus } from '$lib/services/onboarding-service';

	let { children } = $props();
	const status = $derived(useProtectedRoute());
	const onboardingEnabled = featureFlags.enableOnboarding;
	const viewingOnboardingRoute = $derived(isOnboardingRoute(page.url.pathname));

	const redirecting = $derived(status === 'needs-auth' || status === 'needs-verification');
	let onboardingStatus = $state<'idle' | 'loading' | 'complete' | 'incomplete' | 'error'>('idle');

	// Redirects unauthenticated or unverified users to the appropriate auth page.
	// Only performs the goto() side effect — the redirecting flag is a pure derivation above.
	$effect(() => {
		if (status === 'needs-auth') {
			const destination = page.url.pathname + page.url.search;
			void goto(`/login?next=${encodeURIComponent(destination)}`);
			return;
		}

		if (status === 'needs-verification') {
			const destination = page.url.pathname + page.url.search;
			void goto(`/verify-email?next=${encodeURIComponent(destination)}`);
		}
	});

	// Enforces onboarding completion before protected content is accessible.
	// Reading pathname synchronously so the effect re-runs on client-side navigation.
	$effect(() => {
		const currentPath = page.url.pathname;

		if (!onboardingEnabled) {
			onboardingStatus = 'complete';
			return;
		}

		if (status !== 'authenticated') {
			onboardingStatus = 'idle';
			return;
		}

		// Once onboarding is confirmed complete, skip re-fetching on subsequent navigations.
		// Use untrack to read onboardingStatus without making it a dependency of this effect.
		const alreadyComplete = untrack(() => onboardingStatus === 'complete');
		if (alreadyComplete) {
			if (isOnboardingRoute(currentPath)) {
				void goto('/app');
			}
			return;
		}

		let cancelled = false;
		onboardingStatus = 'loading';

		void getOnboardingStatus()
			.then((result) => {
				if (cancelled) {
					return;
				}

				if (!result.ok) {
					console.error('Failed to evaluate onboarding status:', result.error);
					onboardingStatus = 'error';
					return;
				}

				if (result.data.complete) {
					onboardingStatus = 'complete';

					if (isOnboardingRoute(currentPath)) {
						void goto('/app');
					}
					return;
				}

				const requiredStepPath = getOnboardingStepPath(result.data.nextStep);
				const currentlyOnOnboarding = isOnboardingRoute(currentPath);
				const currentStep = getOnboardingStepByPath(currentPath);
				const alreadyOnRequiredStep = currentStep?.stepNumber === result.data.nextStep;

				onboardingStatus = 'incomplete';

				if (!currentlyOnOnboarding || !alreadyOnRequiredStep) {
					void goto(requiredStepPath);
				}
			});

		return () => {
			cancelled = true;
		};
	});
</script>

{#if status === 'loading' || redirecting}
	<div class="flex items-center justify-center min-h-screen">
		<Spinner class="size-6" />
	</div>
{:else if status === 'authenticated'}
	{#if !onboardingEnabled || onboardingStatus === 'complete' || (onboardingStatus === 'incomplete' && viewingOnboardingRoute)}
        {#if !viewingOnboardingRoute}
			<AppNavbar />
		{/if}
        {@render children()}
    {:else if onboardingStatus === 'error'}
		<div class="flex items-center justify-center min-h-screen p-4">
			<Alert variant="destructive" class="w-full max-w-md">
				<AlertTitle>Unable to continue onboarding</AlertTitle>
				<AlertDescription>
					We could not load your onboarding status. Refresh the page and try again.
				</AlertDescription>
			</Alert>
		</div>
	{:else}
		<div class="flex items-center justify-center min-h-screen">
			<Spinner class="size-6" />
		</div>
	{/if}
{/if}