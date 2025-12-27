<script lang="ts">
	/**
	 * Public Homepage
     **/

    import { Button } from "$lib/components/ui/button"
</script>

<!-- Landing page hero section -->
<div class="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
	<div class="animate-fade-in-zoom mx-auto max-w-xl space-y-8 text-center">
		<!-- Hero heading and description -->
		<div class="flex flex-col gap-5">
			<h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
				SvelteKit SPA
			</h1>
			<p class="text-lg text-muted-foreground">
				A minimal boilerplate for building SPA's with SvelteKit, Firebase auth and shadcn-svelte UI.
			</p>
		</div>

		<!-- Call-to-action buttons -->
		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<Button href="/signup" size="lg">
				Create account
			</Button>
			<Button href="/login" variant="outline" size="lg">
				Log in
			</Button>
		</div>

		<!-- GitHub repository link -->
		<div class="pt-8">
			<a
				href="https://github.com/wesselgrift/sveltekit-spa"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-muted-foreground hover:text-foreground"
			>
				View on GitHub →
			</a>
		</div>
	</div>
</div>

