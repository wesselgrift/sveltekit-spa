<script lang="ts">
	/**
	 * Shared onboarding shell.
	 * Keeps all onboarding steps visually consistent with a compact centered layout.
	 */

	import { Logo } from '$lib/components/ui/logo';

	let {
		stepNumber,
		totalSteps,
		title,
		subtext,
		children
	}: {
		stepNumber: number;
		totalSteps: number;
		title: string;
		subtext: string;
		children: import('svelte').Snippet;
	} = $props();
</script>

<div class="flex md:min-h-screen items-center justify-center p-4 pt-10 md:pt-4">
	<div class="w-full max-w-sm flex flex-col gap-6 animate-fade-in-zoom">
		<div class="mb-5">
            <div class="flex flex-row justify-between items-center">
                <Logo />
			    <p class="text-sm text-muted-foreground">Step {stepNumber} of {totalSteps}</p>
            </div>
		</div>

		<div class="flex flex-col gap-2">
            <h1 class="text-2xl font-semibold leading-tight">{title}</h1>
			<p class="text-sm text-muted-foreground">{subtext}</p>
		</div>

		{@render children()}
	</div>
</div>
