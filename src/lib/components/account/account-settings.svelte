<script lang="ts">
    import { authState } from '$lib/auth/state.svelte';
    import { splitDisplayName } from '$lib/helpers/name-helpers';
    import { Button } from '$lib/components/ui/button'
    import { IdCardLanyard, Mail, DoorOpen, UserRoundX } from '@lucide/svelte'

    import LogOutSection from '$lib/components/account/logout-section.svelte'

    let nameParts = $derived(
        authState.user?.displayName ? 
        splitDisplayName(authState.user.displayName) : { 
            firstName: '', lastName: '' 
        }
    );
</script>

<div class="flex flex-col gap-3 mb-5">
    <h3 class="font-semibold">Account</h3>
    <div class="flex flex-col border rounded-md">
        <div class="flex flex-row gap-4 p-4 w-full border-b">
            <IdCardLanyard class="shrink-0" strokeWidth={1.5} />
            <div class="flex flex-col gap-1 text-sm">
                <p class="font-medium">Name</p>
                <p class="text-muted-foreground">{nameParts.firstName} {nameParts.lastName}</p>
            </div>
            <Button variant="outline" size="sm" class="ml-auto">Change name</Button>
        </div>
        
        <div class="flex flex-row gap-4 p-4 w-full border-b">
            <Mail class="shrink-0" strokeWidth={1.5} />
            <div class="flex flex-col gap-1 text-sm">
                <p class="font-medium">Email</p>
                <p class="text-muted-foreground">{authState.user?.email}</p>
            </div>
            <Button variant="outline" size="sm" class="ml-auto">Change email</Button>
        </div>
        
        <div class="flex flex-row gap-4 p-4 w-full border-b">
            <DoorOpen class="shrink-0" strokeWidth={1.5} />
            <div class="flex flex-col gap-1 text-sm">
                <p class="font-medium">Password</p>
                <p class="text-muted-foreground">•••••••••••••</p>
            </div>
            <Button variant="outline" size="sm" class="ml-auto">Change password</Button>
        </div>

        <LogOutSection />
    </div>
</div>

<div class="flex flex-col gap-3">
    <h3 class="font-semibold">Danger zone</h3>
    <div class="flex flex-row rounded-md bg-red-50/70 dark:bg-red-950/70 border border-red-100 dark:border-red-900">
        <div class="flex flex-row gap-4 p-4 w-full text-red-700 dark:text-red-300">
            <UserRoundX class="shrink-0" strokeWidth={1.5} />
            <div class="flex flex-col gap-1 text-sm">
                <p class="font-medium">Delete account</p>
                <p class="opacity-80">This permanently deletes your account and all associated data.</p>
            </div>
            <Button variant="destructive" size="sm" class="ml-auto">Delete account</Button>
        </div>
    </div>
</div>