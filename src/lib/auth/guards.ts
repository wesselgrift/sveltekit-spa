/**
 * Auth Guards Module
 * 
 * This file contains helper functions for route protection.
 * 
 * Will contain:
 * - `requireAuth(page: Page)` - Check if user is authenticated, redirect to /login if not
 * - `requireVerifiedEmail(page: Page)` - Check if email is verified, redirect to /verify-email if not
 * 
 * These functions will:
 * - Read from the user state rune imported from ./state.svelte.ts
 * - Use goto() from $app/navigation for client-side redirects
 * - Accept `page` parameter from `$app/stores` to access current route info
 * - Return boolean indicating if requirement is met
 * 
 * REDIRECT INTENT PRESERVATION:
 * 
 * `requireAuth(page)`:
 * - Capture original destination: `page.url.pathname + page.url.search`
 * - Redirect to `/login?next=${encodeURIComponent(destination)}`
 * - This allows login page to redirect user back to their intended destination after auth
 * - Example: User tries to access /app/dashboard?tab=settings
 *   - Redirect to: /login?next=%2Fapp%2Fdashboard%3Ftab%3Dsettings
 *   - After login, redirect to: /app/dashboard?tab=settings
 * 
 * `requireVerifiedEmail(page)`:
 * - Similarly capture original destination
 * - Redirect to `/verify-email?next=${encodeURIComponent(destination)}`
 * - After verification, redirect user back to their intended destination
 */

