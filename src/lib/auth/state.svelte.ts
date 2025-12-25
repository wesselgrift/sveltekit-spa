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
 */

