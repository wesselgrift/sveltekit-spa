<script>
    import { Button } from "$lib/components/ui/button";
    import { ArrowRight } from "@lucide/svelte"
</script>

<div class="p-4 space-y-2">
    <h1>Welcome to Svelte Spa, a sveltekit SPA boilerplate</h1>

    <Button href="/subpage">
        Visit subpage
        <ArrowRight />
    </Button>
</div>