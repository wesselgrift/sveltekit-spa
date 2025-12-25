/**
 * Auth State Module
 * 
 * This file manages the reactive auth state using Svelte 5 runes.
 * 
 * Will contain:
 * - `user` state rune: $state<User | null>(null) - current authenticated user
 * - `loading` state rune: $state<boolean>(true) - loading state during auth initialization
 * - `initAuth()` function: Sets up Firebase onAuthStateChanged listener
 * - Auto-initialization in browser context
 * - All imports share the same reactive state (singleton pattern)
 * 
 * IMPORTANT: Prevent duplicate listeners in dev/HMR mode
 * - Use a module-level flag (e.g., `let listenerRegistered = false`) to track if listener is already registered
 * - Check flag before calling `onAuthStateChanged` to prevent multiple registrations
 * - Set flag to true after registering listener
 * - This prevents repeated updates and weird redirects during hot module reload
 * - Example pattern:
 *   ```
 *   let listenerRegistered = false;
 *   export function initAuth() {
 *     if (listenerRegistered) return;
 *     listenerRegistered = true;
 *     onAuthStateChanged(auth, (user) => { ... });
 *   }
 *   ```
 */

