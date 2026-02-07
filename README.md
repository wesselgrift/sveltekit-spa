# SvelteKit SPA Boilerplate

A minimal, production-ready boilerplate for building Single Page Applications with SvelteKit. Pre-configured with Firebase Authentication, Firestore, and shadcn-svelte UI components.

**Perfect for quickly spinning up authenticated web apps without the complexity of SSR.**

## ✨ Features

- **SvelteKit SPA Mode** — Uses `adapter-static` with client-side routing (`200.html` fallback)
- **Svelte 5 Runes** — Modern reactive state management with `$state`, `$derived`, and `$effect`
- **Firebase Auth** — Complete authentication flow out of the box
- **Firestore Integration** — User documents with typed helpers
- **shadcn-svelte** — Beautiful, accessible UI components
- **Tailwind CSS 4** — Utility-first styling with dark mode support
- **TypeScript** — Full type safety throughout
- **Protected Routes** — Auth guards with redirect handling

## 📦 What's Included


### Route Structure

```
src/routes/
├── +layout.svelte          # Root layout
├── +layout.ts              # SPA configuration (ssr=false)
├── (public)/               # Public routes (no auth required)
│   ├── +page.svelte        # Landing page
│   └── (auth)/             # Public auth pages
│       ├── login/
│       ├── signup/
│       ├── verify-email/
│       ├── reset-password/
│       └── account-deleted/
└── (protected)/            # Auth-gated routes
    └── app/
        ├── +layout.svelte  # Auth guard wrapper
        ├── +page.svelte    # Dashboard
        └── account/        # Account settings
```

### Components

```
src/lib/components/
├── auth/                   # Auth form components
│   ├── login.svelte
│   ├── signup.svelte
│   ├── verify-email.svelte
│   └── reset-password.svelte
├── account/                # Account management
│   └── sections/           # Settings sections
└── ui/                     # shadcn-svelte primitives
    ├── alert/
    ├── button/
    ├── input/
    ├── label/
    ├── logo/
    └── spinner/
```

### Lib Modules

```
src/lib/
├── auth/
│   ├── state.svelte.ts     # Reactive auth state ($state)
│   ├── actions.ts          # Auth functions (login, signup, etc.)
│   ├── guards.ts           # Route protection helpers
│   └── errors.ts           # Firebase error message mapping
├── firebase/
│   └── config.ts           # Firebase initialization
└── firestore/
    └── users.ts            # User document CRUD
```

### Authentication

| Feature | Description |
|---------|-------------|
| Email/Password Login | Standard login with error handling |
| User Registration | Signup with email verification |
| Email Verification | Required before accessing protected routes |
| Password Reset | Complete forgot password flow |
| Account Settings | Change name, email, password |
| Account Deletion | Self-service account removal |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### 1. Clone & Install

```bash
git clone https://github.com/wesselgrift/sveltekit-spa.git my-app
cd my-app
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password provider
3. Enable **Firestore** database
4. Get your Firebase config from Project Settings → General → Your apps

### 3. Environment Variables

Create a `.env` file in the project root:

```env
# Required: Firebase Client Configuration
PUBLIC_FIREBASE_API_KEY=your_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note:** Copy `.env.example` to `.env` and fill in your values. The `PUBLIC_` prefix makes variables available to client-side code. Variables without the prefix are server-only.

### 4. Firestore Rules (important!)

Your Firestore security rules must match exactly what your application reads and writes. Rules that are too strict will block legitimate operations, while rules that are too permissive create security vulnerabilities.

Set up security rules in your Firebase Console → Firestore → Rules. The rules below match this boilerplate's user document structure (only `createdAt` field):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents - users can only access their own document
    match /users/{userId} {
      // Allow read only if the requesting user matches the document ID
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow create only for the user's own document with createdAt field
      // IMPORTANT: This rule validates that only createdAt is provided
      // If you change the document structure, update this rule accordingly
      allow create: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.keys().hasOnly(['createdAt']);
      
      // Allow delete only for the user's own document
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Key points:**
- The `allow create` rule uses `hasOnly(['createdAt'])` to ensure only the `createdAt` field is written
- If you modify the user document structure (e.g., add more fields), you must update the `hasOnly()` check
- The `allow read` and `allow delete` rules ensure users can only access their own documents
- Always test your rules in the Firebase Console Rules Playground before deploying

### 5. Run Development Server

```bash
npm run dev
```


## 🏗️ Building Upon This

### Adding New Public Routes

Create a new folder under `src/routes/(public)/`:

```svelte
<!-- src/routes/(public)/about/+page.svelte -->
<h1>About Page</h1>
<p>This page is publicly accessible.</p>
```

### Adding Protected Routes

Create routes under `src/routes/(protected)/app/` — they automatically inherit the auth guard:

```svelte
<!-- src/routes/(protected)/app/dashboard/+page.svelte -->
<script lang="ts">
    import { authState } from '$lib/auth';
</script>

<h1>Welcome, {authState.user?.displayName}!</h1>
```

### Extending Firestore

1. Add your collection types and helpers in `src/lib/firestore/`:

```typescript
// src/lib/firestore/posts.ts
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<string> {
    const postRef = doc(collection(db, 'posts'));
    await setDoc(postRef, {
        ...post,
        createdAt: serverTimestamp()
    });
    return postRef.id;
}

export async function getUserPosts(userId: string): Promise<Post[]> {
    const q = query(collection(db, 'posts'), where('authorId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}
```

2. **Update your Firestore rules** to allow access to the new collection. This is critical — your rules must match what your code reads and writes:

```javascript
match /posts/{postId} {
  // Example: Allow users to read all posts, but only create/update/delete their own
  allow read: if request.auth != null;
  allow create: if request.auth != null 
    && request.resource.data.authorId == request.auth.uid
    && request.resource.data.keys().hasAll(['title', 'content', 'authorId', 'createdAt']);
  allow update, delete: if request.auth != null 
    && resource.data.authorId == request.auth.uid;
}
```

**Remember:** Always validate that your security rules match your actual data structure and access patterns. Test rules in the Firebase Console Rules Playground before deploying.

### Adding UI Components

This project uses [shadcn-svelte](https://www.shadcn-svelte.com/). Add new components with:

```bash
npx shadcn-svelte@latest add card
npx shadcn-svelte@latest add dialog
npx shadcn-svelte@latest add dropdown-menu
```

Components are added to `src/lib/components/ui/` and can be imported from `$lib/components/ui/`.

### Customizing the Theme

Edit your CSS variables in `src/routes/layout.css`. The project uses Tailwind CSS 4 with CSS-based configuration.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Svelte type checking |
| `npm run lint` | Run ESLint and Prettier checks |
| `npm run format` | Format code with Prettier |

## 🚢 Deployment

This SPA builds to static files and can be deployed anywhere static hosting is supported:

- **Vercel** — Works out of the box
- **Netlify** — Add `_redirects` file or configure in `netlify.toml`
- **Firebase Hosting** — Perfect companion for this stack
- **Cloudflare Pages** — Works with default settings

Build output is in the `build/` directory. The `200.html` fallback handles client-side routing.

## 📚 Key Patterns

### Auth State Access

```svelte
<script lang="ts">
    import { authState } from '$lib/auth';
</script>

{#if authState.loading}
    <p>Loading...</p>
{:else if authState.user}
    <p>Hello, {authState.user.email}</p>
{:else}
    <p>Not logged in</p>
{/if}
```

### Protected Route Guard

The `(protected)` route group uses a layout that checks auth status:

```svelte
<!-- Already implemented in src/routes/(protected)/app/+layout.svelte -->
<script lang="ts">
    import { useProtectedRoute } from '$lib/auth/guards';
    const status = $derived(useProtectedRoute());
</script>

{#if status === 'authenticated'}
    {@render children()}
{:else}
    <Spinner />
{/if}
```

### Handling Auth Actions

```typescript
import { loginWithEmail, signupWithEmail, logout, getAuthErrorMessage } from '$lib/auth';

try {
    await loginWithEmail(email, password);
    // Redirect happens automatically via $effect in the page
} catch (err) {
    const message = getAuthErrorMessage(err);
    // Display message to user
}
```

