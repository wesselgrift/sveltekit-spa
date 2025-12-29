<script lang="ts">
    /**
     * Account setting component
     * Loads subcomponents for each section: 
     * name, email, password, logout and delete account
     */
    import {
        NameSection,
        EmailSection,
        PasswordSection,
        LogoutSection,
        DeleteAccountSection
    } from '$lib/components/account/sections';
</script>

<div class="flex flex-col gap-3 mb-5">
    <h3 class="font-semibold">General</h3>
    <div class="flex flex-col bg-card border rounded-md overflow-hidden">
        <NameSection />
        <EmailSection />
        <PasswordSection />
        <LogoutSection />
    </div>
</div>

<div class="flex flex-col gap-3">
    <h3 class="font-semibold">Danger zone</h3>
    <DeleteAccountSection />
</div>