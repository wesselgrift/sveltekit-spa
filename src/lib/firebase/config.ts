/**
 * Firebase Configuration
 * 
 * This file initializes the Firebase app and exports the auth instance.
 * This is the single source of truth for Firebase initialization in the app.
 * 
 * All auth-related code (actions, state, guards) imports the `auth` instance
 * from this file, ensuring a singleton pattern and preventing duplicate initialization.
 * 
 * ENVIRONMENT VARIABLES:
 * - Uses PUBLIC_ prefix (SvelteKit convention for client-accessible env vars)
 * - Accesses via $env/static/public for type-safe, compile-time environment variables
 * - Required vars: PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, etc.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase app with duplicate check for dev/HMR safety
// In development, hot module reload can cause this module to re-execute.
// Checking getApps().length prevents "Firebase: Firebase App named '[DEFAULT]' already exists" errors.
let app: FirebaseApp;
if (getApps().length === 0) {
	app = initializeApp(firebaseConfig);
} else {
	// Reuse existing app instance if already initialized
	app = getApps()[0];
}

// Export singleton auth instance
// All auth operations throughout the app use this single instance,
// ensuring consistent state and preventing multiple auth listeners.
export const auth: Auth = getAuth(app);
