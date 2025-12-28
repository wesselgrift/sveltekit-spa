<script lang="ts">
    import NameSection from '$lib/components/account/name-section.svelte'
    import EmailSection from '$lib/components/account/email-section.svelte'
    import PasswordSection from '$lib/components/account/password-section.svelte'
    import LogOutSection from '$lib/components/account/logout-section.svelte'
    import DeleteAccountSection from '$lib/components/account/delete-account-section.svelte'
</script>

<div class="flex flex-col gap-3 mb-5">
    <h3 class="font-semibold">Account</h3>
    <div class="flex flex-col bg-card border rounded-md">
        <NameSection />
        <EmailSection />
        <PasswordSection />
        <LogOutSection />
    </div>
</div>

<div class="flex flex-col gap-3">
    <h3 class="font-semibold">Danger zone</h3>
    <div class="flex flex-row rounded-md bg-red-50/70 dark:bg-red-950/70 border border-red-100 dark:border-red-900">
        <DeleteAccountSection />
    </div>
</div>