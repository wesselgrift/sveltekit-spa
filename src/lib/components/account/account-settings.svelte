<script lang="ts">
    import NameSection from '$lib/components/account/name-section.svelte'
    import EmailSection from '$lib/components/account/email-section.svelte'
    import PasswordSection from '$lib/components/account/password-section.svelte'
    import LogOutSection from '$lib/components/account/logout-section.svelte'
    import DeleteAccountSection from '$lib/components/account/delete-account-section.svelte'
</script>

<div class="flex flex-col gap-3 mb-5">
    <h3 class="font-semibold">General</h3>
    <div class="flex flex-col bg-card border rounded-md overflow-hidden">
        <NameSection />
        <EmailSection />
        <PasswordSection />
        <LogOutSection />
    </div>
</div>

<div class="flex flex-col gap-3">
    <h3 class="font-semibold">Danger zone</h3>
    <DeleteAccountSection />
</div>