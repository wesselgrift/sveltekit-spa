<script lang="ts">
    import logoLight from '$lib/assets/logo.svg';
    import logoDark from '$lib/assets/logo-dark.svg';

    // Component props for logo customization
    interface LogoProps {
        class?: string;
    }

    let {
        class: className = 'w-28'    // Tailwind classes (default: w-28, can be overridden)
    }: LogoProps = $props();

    // CSS classes for logo styling
    const classes: {
        frame: string;
        image: string;
    } = {
        // Container styling for the picture element
        frame: `
            block
            h-auto
        `,
        // Image styling to be responsive within its container
        image: `
            w-full
            h-auto
        `
    }

</script>

<!-- Responsive logo that switches between light/dark versions based on user's theme preference -->
<picture class={classes.frame + ' ' + className}>
  <!-- Dark mode logo - only loads when user prefers dark color scheme -->
  <source srcset={logoDark} media="(prefers-color-scheme: dark)" />
  <!-- Default light mode logo - fallback for all other cases -->
  <img src={logoLight} alt="logo" class={classes.image}/>
</picture>