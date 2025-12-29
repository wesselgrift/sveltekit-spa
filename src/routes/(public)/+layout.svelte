<script lang="ts">
    /**
     * Public Route Layout
     * 
     * Simple wrapper for public routes (homepage and auth pages).
     * No auth guards or restrictions.
     */

	let { children } = $props();
</script>

{@render children()}

