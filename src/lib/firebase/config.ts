/**
 * Firebase Configuration
 * 
 * This file initializes Firebase app and exports the auth instance.
 * 
 * Will contain:
 * - Firebase app initialization using environment variables with PUBLIC_ prefix
 * - Export of Firebase Auth instance
 * - Type-safe configuration from .env file
 * 
 * ENVIRONMENT VARIABLES:
 * - Use PUBLIC_FIREBASE_* prefix for all env vars (SvelteKit convention)
 * - Access via $env/static/public from SvelteKit for type-safe access
 * - Example: `import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, ... } from '$env/static/public'`
 * - This is more idiomatic than VITE_ prefix with import.meta.env.*
 * - SvelteKit provides better type safety and ergonomics with $env/static/public
 * 
 * Required env vars (all with PUBLIC_ prefix):
 * - PUBLIC_FIREBASE_API_KEY
 * - PUBLIC_FIREBASE_AUTH_DOMAIN
 * - PUBLIC_FIREBASE_PROJECT_ID
 * - PUBLIC_FIREBASE_STORAGE_BUCKET
 * - PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - PUBLIC_FIREBASE_APP_ID
 */

