<script lang="ts">
	/**
	 * Public Homepage
	 *
	 * Landing page with hero section. Shows signup/login for guests and
	 * a single app entry CTA when a session already exists.
	 */

	import { authState } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
</script>

<!-- Landing page hero section -->
<div class="flex min-h-screen flex-col items-center justify-start md:justify-center px-4 py-12">
	<div class="max-w-xl space-y-8 text-center">
		<!-- Hero heading and description -->
		<div class="flex flex-col gap-5">
			<h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
				SvelteKit SPA
			</h1>
			<p class="text-lg text-muted-foreground">
				A minimal boilerplate for building SPAs with SvelteKit using adapter-static, Supabase Auth, Supabase Postgres and shadcn-svelte UI.
			</p>
		</div>

		<!-- Call-to-action: auth-aware so returning users are not nudged to sign up again -->
		<div
			class="mx-auto flex min-h-10 max-w-xs flex-col justify-center gap-4 md:flex-row md:items-center"
		>
			{#if authState.loading}
				<div class="flex justify-center" aria-busy="true">
					<Spinner class="size-6" />
					<span class="sr-only">Checking sign-in status</span>
				</div>
			{:else if authState.user}
				<Button href="/app" variant="outline" size="lg" class="w-full md:w-auto">
					Go to app
				</Button>
			{:else}
				<Button href="/signup" size="lg" class="w-full md:w-auto">
					Create account
				</Button>
				<Button href="/login" variant="outline" size="lg" class="w-full md:w-auto">
					Log in
				</Button>
			{/if}
		</div>

		<!-- GitHub repository link -->
		<div class="pt-1 md:pt-4">
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

