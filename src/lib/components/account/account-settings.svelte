<script>
    import { authState } from '$lib/auth/state.svelte';
</script>

First name: {authState.user?.displayName?.split(' ')[0]} <br>
Last name: {authState.user?.displayName?.split(' ')[1]} <br>
Email: {authState.user?.email} <br>
Password: •••••••••••••


