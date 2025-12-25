# Context: Signup Page Implementation

## Project Overview
This is a SvelteKit SPA (Single Page App) with Firebase Authentication. The project uses:
- **SvelteKit** (latest) with Svelte 5 runes
- **TypeScript** (strict mode)
- **Firebase Auth** (email/password + magic links)
- **shadcn-svelte** components (Button, Input, Label)
- **Tailwind CSS** for styling

## Auth System Architecture

### Auth Module Structure (`src/lib/auth/`)
All auth functionality is centralized in `src/lib/auth/` with a barrel export:

- **`state.svelte.ts`** - Reactive auth state using Svelte 5 runes
  - `authState.user` - Current authenticated user (User | null)
  - `authState.loading` - Loading state during auth initialization (boolean)
  - Auto-initializes Firebase auth listener on import
  - Uses `$state` and `$derived` for reactivity

- **`actions.ts`** - All auth action functions
  - `signupWithEmail(email, password)` - Creates account + sends verification email
  - `loginWithEmail(email, password)` - Email/password login
  - `sendMagicLink(email, next?)` - Passwordless sign-in
  - `verifyMagicLink(email?)` - Completes magic link sign-in
  - `resetPassword(email)` - Sends password reset email
  - `verifyPasswordResetCode(code)` - Verifies reset code, returns email
  - `confirmPasswordReset(code, newPassword)` - Confirms password reset with new password
  - `sendVerificationEmail(user)` - Resend verification
  - `logout()` - Sign out

- **`errors.ts`** - Error handling
  - `getAuthErrorMessage(error)` - Maps Firebase errors to user-friendly messages

- **`guards.ts`** - Route protection
  - `requireAuth(page)` - Redirects to login if not authenticated
  - `requireVerifiedEmail(page)` - Redirects to verify-email if email not verified

- **`storage.ts`** - localStorage utilities for magic links
  - `getMagicLinkEmail()`, `setMagicLinkEmail()`, `clearMagicLinkEmail()`

- **`index.ts`** - Barrel export for clean imports
  - Import everything from `$lib/auth` instead of individual files

### Import Pattern
```typescript
import { authState, signupWithEmail, getAuthErrorMessage } from '$lib/auth';
```

## Login Page Reference (Pattern to Follow)

The login page (`src/routes/(public)/(auth)/login/+page.svelte`) demonstrates the patterns to follow:

### Key Patterns:

1. **State Management** - Uses Svelte 5 runes (`$state`, `$derived`, `$effect`)
   ```typescript
   let email = $state('');
   let password = $state('');
   let loading = $state(false);
   let error = $state<string | null>(null);
   ```

2. **Redirect Logic** - Uses `$effect` to watch auth state
   ```typescript
   import { page } from '$app/state'; // NOT $app/stores (deprecated)
   const nextParam = $derived(page.url.searchParams.get('next'));
   
   $effect(() => {
     if (!authState.loading && authState.user !== null) {
       goto(nextParam ?? '/app');
     }
   });
   ```

3. **Error Handling** - Catches errors and displays user-friendly messages
   ```typescript
   try {
     await signupWithEmail(email, password);
     // Success handling
   } catch (err) {
     error = getAuthErrorMessage(err);
   }
   ```

4. **Form Submission** - Disables form during loading
   ```typescript
   async function handleSubmit() {
     try {
       loading = true;
       error = null;
       await signupWithEmail(email, password);
       // Redirect on success
     } catch (err) {
       error = getAuthErrorMessage(err);
     } finally {
       loading = false;
     }
   }
   ```

5. **UI Components** - Uses shadcn-svelte components
   ```typescript
   import { Button } from '$lib/components/ui/button';
   import { Input } from '$lib/components/ui/input';
   import { Label } from '$lib/components/ui/label';
   ```

## Available UI Components

Located in `src/lib/components/ui/`:
- **Button** - `<Button>` with variants (default, destructive, outline, secondary, ghost)
- **Input** - `<Input>` for text inputs
- **Label** - `<Label>` for form labels (must pair with Input)

## Signup Page Requirements

### File Location
`src/routes/(public)/(auth)/signup/+page.svelte`

### Required Features:

1. **Form Fields**
   - Email input (with Label)
   - Password input (with Label)
   - Confirm password input (with Label)

2. **Client-Side Validation**
   - Password match validation (password === confirmPassword)
   - Password minimum length (6 characters - Firebase requirement)
   - Email format validation (optional, Firebase will validate)

3. **Auth Flow**
   - Call `signupWithEmail(email, password)` on submit
   - On success: Redirect to `/verify-email?next=...` (preserve next param)
   - On error: Display error using `getAuthErrorMessage()`

4. **Redirect Logic**
   - If already logged in (`authState.user !== null`): Redirect to `/app` or `next` param
   - After signup: Redirect to `/verify-email` (not `/app`) since email needs verification
   - Preserve `next` query param through the flow

5. **UX Requirements**
   - Show loading state during signup (disable form, show spinner)
   - Display error messages clearly
   - Link to login page ("Already have an account? Login")
   - Disable submit button while loading

### Implementation Notes:

- **Use `authState` directly** (not `user`/`loading` exports) - matches login page pattern
- **Use `page` from `$app/state`** (not `$app/stores`) - modern SvelteKit API
- **Use `$effect` for redirects** - reactive and cleanup-safe
- **Use `$derived` for computed values** - like `nextParam`
- **Follow login page structure** - similar form layout and error handling

### Example Structure:
```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { authState, signupWithEmail, getAuthErrorMessage } from '$lib/auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  // Form state
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);

  // Get next param
  const nextParam = $derived(page.url.searchParams.get('next'));

  // Redirect if already logged in
  $effect(() => {
    if (!authState.loading && authState.user !== null) {
      goto(nextParam ?? '/app');
    }
  });

  // Validation
  const passwordsMatch = $derived(password === confirmPassword);
  const isValid = $derived(
    email.length > 0 &&
    password.length >= 6 &&
    passwordsMatch
  );

  async function handleSubmit() {
    // Implementation here
  }
</script>

<!-- Form markup -->
```

## Important Conventions

1. **Never use `$app/stores`** - Use `$app/state` instead (deprecated API)
2. **Always use `authState`** - Direct access to reactive state object
3. **Error handling** - Always use `getAuthErrorMessage()` for user-friendly errors
4. **Loading states** - Always disable form and show loading indicator
5. **Redirect intent** - Always preserve `next` query param through auth flow
6. **Email verification** - After signup, redirect to `/verify-email` (not `/app`)

## Reset Password Flow (Two-Step Process)

Firebase password reset requires **two pages**:

### Step 1: Request Password Reset
**File Location:** `src/routes/(public)/(auth)/reset-password/+page.svelte`

**Required Features:**

1. **Form Fields**
   - Email input (with Label)
   - Single field form (simpler than signup)

2. **Auth Flow**
   - Call `resetPassword(email)` on submit
   - On success: Show success message (don't redirect immediately)
   - On error: Display error using `getAuthErrorMessage()`

3. **Success State**
   - After successful email send, show success message
   - Message should indicate: "Check your email for password reset instructions"
   - Hide form and show success message
   - Provide link back to login page

4. **No Redirect Logic Needed**
   - This page is accessible to unauthenticated users
   - No need to check `authState.user` or redirect
   - User can be logged in or not (password reset works for both)

5. **UX Requirements**
   - Show loading state during request (disable form, show spinner)
   - Display error messages clearly
   - Display success message after email is sent
   - Link back to login page ("Back to login")
   - Disable submit button while loading
   - Clear form after successful submission (or hide form)

### Step 2: Confirm Password Reset (MISSING - Needs Implementation)

**File Location:** `src/routes/(public)/(auth)/reset-password/confirm/+page.svelte` (or handle on same page)

**Required Features:**

1. **Action Code Handling**
   - Detect password reset action code in URL (similar to magic link handling)
   - Verify the action code is valid
   - Handle expired/invalid codes with error messages

2. **Form Fields**
   - New password input (with Label)
   - Confirm password input (with Label)
   - Show form only after verifying action code

3. **Auth Flow**
   - Verify action code from URL
   - On submit: Confirm password reset with new password
   - On success: Redirect to login page
   - On error: Display error using `getAuthErrorMessage()`

4. **Auth Actions** (Already available in `actions.ts`):
   ```typescript
   // Verify password reset action code from URL
   verifyPasswordResetCode(code: string): Promise<string> // Returns email
   
   // Confirm password reset with new password
   confirmPasswordReset(code: string, newPassword: string): Promise<void>
   ```

5. **Implementation Pattern** (Similar to magic link):
   - Check URL for action code on mount (extract from query params: `?oobCode=...&mode=resetPassword`)
   - Verify code using `verifyPasswordResetCode(code)` - returns email
   - Show password form with email displayed (read-only)
   - Handle form submission with `confirmPasswordReset(code, newPassword)`
   - Redirect to login on success

6. **Action Code Extraction**:
   ```typescript
   // Extract action code from URL query params
   const urlParams = new URLSearchParams(window.location.search);
   const actionCode = urlParams.get('oobCode');
   const mode = urlParams.get('mode'); // Should be 'resetPassword'
   
   // Verify code and get email
   if (actionCode && mode === 'resetPassword') {
     const email = await verifyPasswordResetCode(actionCode);
     // Show password form
   }
   ```

**Note:** Firebase sends the reset link to a URL. You need to configure this in Firebase Console:
- Go to Authentication → Templates → Password reset
- Set action URL to: `https://yourdomain.com/reset-password/confirm` (or handle on same page)
- The URL will contain query params: `?oobCode=...&mode=resetPassword&apiKey=...`

### Implementation Notes:

- **Simpler than signup** - Only needs email field, no password fields
- **Success state is important** - User needs feedback that email was sent
- **No redirect needed** - User stays on page to see success message
- **Error handling** - Use `getAuthErrorMessage()` for user-friendly errors
- **Follow login page patterns** - Similar form structure and error handling

### Example Structure:
```svelte
<script lang="ts">
  import { resetPassword, getAuthErrorMessage } from '$lib/auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  // Form state
  let email = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let success = $state(false);

  // Validation
  const isValid = $derived(email.length > 0);

  async function handleSubmit() {
    if (!isValid) {
      error = 'Please enter your email address';
      return;
    }

    try {
      loading = true;
      error = null;
      await resetPassword(email);
      success = true;
      email = ''; // Clear form
    } catch (err) {
      error = getAuthErrorMessage(err);
    } finally {
      loading = false;
    }
  }
</script>

{#if success}
  <!-- Success message -->
  <div>
    <h2>Check your email</h2>
    <p>We've sent password reset instructions to your email address.</p>
    <Button href="/login">Back to login</Button>
  </div>
{:else}
  <!-- Reset password form -->
  <form onsubmit={handleSubmit}>
    <!-- Email input, submit button, error display -->
  </form>
{/if}
```

### Key Differences from Signup:

- **No redirect** - User stays on page to see success message
- **No auth check** - Page is accessible to anyone (authenticated or not)
- **Success state** - Important to show success message, not just redirect
- **Single field** - Only email input needed
- **No next param** - Not needed for password reset flow

## File Structure Reference

```
src/
├── lib/
│   ├── auth/
│   │   ├── actions.ts          # signupWithEmail, loginWithEmail, resetPassword, etc.
│   │   ├── state.svelte.ts     # authState (user, loading)
│   │   ├── errors.ts           # getAuthErrorMessage
│   │   └── index.ts            # Barrel export
│   ├── components/
│   │   └── ui/
│   │       ├── button/         # Button component
│   │       ├── input/          # Input component
│   │       └── label/          # Label component
│   └── firebase/
│       └── config.ts           # Firebase auth instance
└── routes/
    └── (public)/
        └── (auth)/
            ├── login/          # ✅ Implemented (reference)
            ├── signup/         # ⏳ To implement
            └── reset-password/ # ⏳ To implement
```

## Testing Checklist

### Signup Page:
- [ ] Form validation works (password match, min length)
- [ ] Signup creates account and sends verification email
- [ ] Redirects to `/verify-email` after signup (with next param)
- [ ] Redirects to `/app` if already logged in
- [ ] Error messages display correctly
- [ ] Loading state works (form disabled, button shows loading)
- [ ] Link to login page works

### Reset Password - Request Page:
- [ ] Email validation works
- [ ] Password reset email is sent successfully
- [ ] Success message displays after email is sent
- [ ] Form is hidden after success
- [ ] Error messages display correctly (invalid email, user not found, etc.)
- [ ] Loading state works (form disabled, button shows loading)
- [ ] Link back to login works
- [ ] Works for both authenticated and unauthenticated users

### Reset Password - Confirm Page (TODO):
- [ ] Action code detection from URL works
- [ ] Action code verification works
- [ ] Password form shows after code verification
- [ ] Password validation works (min length, match confirmation)
- [ ] Password reset confirmation works
- [ ] Redirects to login after successful reset
- [ ] Error handling for expired/invalid codes
- [ ] Loading states work correctly

