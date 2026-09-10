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

<div class="mb-5 flex flex-col gap-3">
	<h3 class="font-semibold">General</h3>
	<div class="flex flex-col overflow-hidden rounded-md border bg-card">
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
