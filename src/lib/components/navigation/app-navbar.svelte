<!--
  Simple App Navbar

  Shared navigation bar for all protected (non-onboarding) app routes.
  Displays the app logo on the left as a link to /app, with dynamic breadcrumb
  segments derived from the current URL path. On the root /app page (no breadcrumbs),
  an Account button is shown on the right.
-->

<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { CircleUserRound } from '@lucide/svelte';

	// Derive breadcrumb segments from the path after /app.
	// e.g. /app/account → [{ label: "Account" }]
	const breadcrumbs = $derived.by(() => {
		const pathname = page.url.pathname.replace(/\/+$/, '');
		const after = pathname.slice('/app'.length);
		if (!after) return [];

		return after
			.split('/')
			.filter(Boolean)
			.map((segment) => ({
				label: segment.charAt(0).toUpperCase() + segment.slice(1)
			}));
	});
</script>

<nav class="border-b bg-secondary">
	<div class="container mx-auto flex items-center justify-between px-6 h-14">
		<div class="flex items-center">
			<a href="/app" class="text-lg font-semibold tracking-tight hover:text-foreground/80">SvelteKit SPA</a>
		{#each breadcrumbs as crumb (crumb.label)}
			<span class="mx-2 text-muted-foreground/60 font-semibold">/</span>
			<span class="text-lg text-muted-foreground font-semibold">{crumb.label}</span>
		{/each}
		</div>

		<!-- Show Account button only on the root /app page -->
		{#if breadcrumbs.length === 0}
			<Button size="sm" variant="outline" href="account">
				<CircleUserRound />
				Account
			</Button>
		{/if}
	</div>
</nav>
