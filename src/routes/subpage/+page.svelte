<script>
    import { Button } from "$lib/components/ui/button";
    import { ArrowLeft } from "@lucide/svelte"
</script>

<div class="p-4 space-y-2">
    <h1>This is a subpage</h1>

    <Button href="/">
        <ArrowLeft />
        Go Back
    </Button>
</div>