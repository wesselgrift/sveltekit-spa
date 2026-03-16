<script lang="ts">
    /**
     * Protected Route Layout
     * 
     * Guards authenticated routes using useProtectedRoute. Shows loading spinner
     * during auth check, redirects unauthenticated users, renders children only
     * when user is authenticated and email verified.
     */

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { useProtectedRoute, isOnboardingRoute } from '$lib/auth/guards';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { featureFlags, getOnboardingStepByPath, getOnboardingStepPath } from '$lib/config/features';
	import {
		getCurrentUserProfile,
		getNextOnboardingStep,
		isOnboardingComplete
	} from '$lib/supabase/profiles';

	let { children } = $props();
	const status = $derived(useProtectedRoute());
	const onboardingEnabled = featureFlags.enableOnboarding;
	const viewingOnboardingRoute = $derived(isOnboardingRoute(page.url.pathname));

	let onboardingStatus = $state<'idle' | 'loading' | 'complete' | 'incomplete' | 'error'>('idle');

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

		let cancelled = false;
		onboardingStatus = 'loading';

		void getCurrentUserProfile()
			.then((profile) => {
				if (cancelled) {
					return;
				}

				if (isOnboardingComplete(profile)) {
					onboardingStatus = 'complete';

					if (isOnboardingRoute(currentPath)) {
						void goto('/app');
					}
					return;
				}

				const requiredStep = getNextOnboardingStep(profile);
				const requiredStepPath = getOnboardingStepPath(requiredStep);
				const currentlyOnOnboarding = isOnboardingRoute(currentPath);
				const currentStep = getOnboardingStepByPath(currentPath);
				const alreadyOnRequiredStep = currentStep?.stepNumber === requiredStep;

				onboardingStatus = 'incomplete';

				if (!currentlyOnOnboarding || !alreadyOnRequiredStep) {
					void goto(requiredStepPath);
				}
			})
			.catch((error: unknown) => {
				if (cancelled) {
					return;
				}

				console.error('Failed to evaluate onboarding status:', error);
				onboardingStatus = 'error';
			});

		return () => {
			cancelled = true;
		};
	});
</script>

{#if status === 'loading'}
	<!-- Show loading state while auth is initializing -->
	<div class="flex items-center justify-center min-h-screen">
		<Spinner class="size-6" />
	</div>
{:else if status === 'authenticated'}
	{#if !onboardingEnabled || onboardingStatus === 'complete' || (onboardingStatus === 'incomplete' && viewingOnboardingRoute)}
		<!-- Render protected content only when onboarding is complete -->
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
{:else}
	<!-- Show redirecting state while redirect happens -->
	<div class="flex items-center justify-center min-h-screen">
		<Spinner class="size-6" />
	</div>
{/if}