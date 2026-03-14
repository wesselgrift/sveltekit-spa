<script lang="ts">
    /**
     * Public Homepage
     * 
     * Landing page with hero section and navigation to signup/login.
     * Publicly accessible, no auth required.
     */

    import { Button } from "$lib/components/ui/button"
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

		<!-- Call-to-action buttons -->
		<div class="flex flex-col md:flex-row gap-4 mx-auto max-w-xs justify-center">
			<Button href="/signup" size="lg">
				Create account
			</Button>
			<Button href="/login" variant="outline" size="lg">
				Log in
			</Button>
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

