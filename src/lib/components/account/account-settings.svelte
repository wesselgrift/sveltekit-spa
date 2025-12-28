<script>
    import { authState } from '$lib/auth/state.svelte';
    import { splitDisplayName } from '$lib/helpers/name-helpers';

    $: nameParts = authState.user?.displayName ? splitDisplayName(authState.user.displayName) : { firstName: '', lastName: '' };
</script>

First name: {nameParts.firstName} <br>
Last name: {nameParts.lastName} <br>
Email: {authState.user?.email} <br>
Password: •••••••••••••


