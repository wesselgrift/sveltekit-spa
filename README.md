# SvelteKit SPA Boilerplate

Everything you don't want to spend time on when prototyping or building an MVP — already done.

- Complete auth flows (signup, login, email verification, password reset, account management) with Supabase
- shadcn-svelte UI components with accessible form patterns
- Optional multi-step onboarding flow
- Protected routes, RLS policies, and profile persistence out of the box

## Features

- SvelteKit SPA mode with `adapter-static` and client-side routing fallback
- Svelte 5 runes (`$state`, `$derived`, `$effect`) for modern reactive state
- Supabase Auth (email/password, signup verification, password reset)
- User profile persistence in Supabase (`user_profiles`)
- RLS-friendly data access patterns from the browser
- shadcn-svelte UI primitives and accessible form patterns
- Tailwind CSS 4 + TypeScript
- Protected route group with auth + email verification guards
- Optional multi-step onboarding flow (feature-flagged, config-driven)

## Cursor Configuration

This project includes Cursor rules, skills, and MCP server integrations that keep AI-assisted development aligned with the project's conventions and security requirements.

### Rules (`.cursor/rules/`)

- **`sveltekit-spa.mdc`** — Primary project rules covering SvelteKit conventions, runes, TypeScript, Supabase auth/database patterns, shadcn-svelte usage, form handling, onboarding flow, accessibility, error handling, and code style. Always applied.
- **`engineering-patterns.mdc`** — Classic engineering patterns (Factory, Repository, Service Layer, Singleton, Strategy, Observer, Adapter) adapted for a SvelteKit SPA with Supabase. Applied on demand when structuring new features.

### Skills (`.cursor/skills/`)

- **`security-review`** — Security review and hardening guidance for the SvelteKit SPA + Supabase stack. Covers RLS policies, auth flows, XSS prevention, input validation, open redirect prevention, session management, and a deployment checklist. Invoke with `/security-review` to scan for vulnerabilities.

### MCP Servers

- **Supabase MCP** — Database/auth inspection, policy checks, and schema awareness. Treat as **read-only by default**. Only run mutating operations when explicitly intended and reviewed.
- **Svelte MCP** — Svelte/SvelteKit development guidance and API-accurate docs. Preferred workflow: `list-sections` -> `get-documentation` (all relevant sections) -> `svelte-autofixer` until no issues remain.

## Route Structure

```text
src/routes/
├── +layout.svelte
├── +layout.ts                   # SPA config (ssr = false)
├── (public)/
│   ├── +page.svelte
│   └── (auth)/
│       ├── login/+page.svelte
│       ├── signup/+page.svelte
│       ├── verify-email/+page.svelte
│       ├── reset-password/+page.svelte
│       ├── set-new-password/+page.svelte
│       └── account-deleted/+page.svelte
└── (protected)/
    └── app/
        ├── +page.svelte
        ├── account/+page.svelte
        └── onboarding/           # optional (feature-flagged)
            ├── +page.svelte
            ├── step-1/+page.svelte
            └── step-2/+page.svelte
```

## Key Modules

```text
src/lib/
├── auth/
│   ├── state.svelte.ts          # reactive auth state + Supabase listener
│   ├── actions.ts               # login/signup/reset/account actions
│   ├── guards.ts                # protected route guard helpers
│   ├── errors.ts                # auth error message mapping
│   └── types.ts
├── config/
│   └── features.ts              # feature flags + onboarding step config
├── helpers/
│   ├── name-helpers.ts          # display name formatting
│   └── redirect-helpers.ts      # safe redirect validation (open redirect prevention)
├── services/
│   └── onboarding-service.ts    # onboarding business logic (Result-based)
├── supabase/
│   ├── client.ts                # browser Supabase client
│   └── profiles.ts              # user_profiles helpers + RPCs
└── components/
    ├── auth/
    ├── account/
    ├── onboarding/              # optional (feature-flagged)
    │   ├── onboarding-shell.svelte
    │   └── onboarding-schemas.ts
    └── ui/
```

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project

### 1) Install

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_anon_key
```

Notes:
- The `PUBLIC_` prefix intentionally exposes these values to browser code.
- Security comes from Supabase Auth + RLS policies, not from hiding the publishable key.

### 3) Supabase Auth setup

In Supabase dashboard:

1. Go to **Authentication -> Providers** and enable **Email**.
2. In **Authentication -> URL Configuration**, set the site URL and allow redirect URLs for both development and production.
3. This app builds redirect links from `window.location.origin`, so both local and production origins must be allowlisted.
4. For production email deliverability, configure **Authentication -> Email (SMTP)** with your provider of choice (for example Resend, Postmark, SendGrid, etc.). This app calls Supabase Auth endpoints only, so provider credentials stay inside Supabase.

Recommended configuration:

- **Site URL**: `https://your-domain.dev`
- **Redirect URLs**:
  - `http://localhost:5173/verify-email/`
  - `http://localhost:5173/set-new-password/`
  - `http://localhost:5173/reset-password/`
  - `https://your-domain.dev/verify-email/`
  - `https://your-domain.dev/set-new-password/`
  - `https://your-domain.dev/reset-password/`
  - `https://www.your-domain.dev/verify-email/`
  - `https://www.your-domain.dev/set-new-password/`
  - `https://www.your-domain.dev/reset-password/`


### 4) Database setup

Apply the migration in `supabase/migrations/` via the Supabase SQL editor or the CLI:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

The single migration sets up the `user_profiles` table with RLS policies, CHECK constraints, `delete_current_user` and `complete_onboarding` security definer RPCs, and a trigger protecting `onboarding_completed_at` from direct writes.

### 5) Run locally

```bash
npm run dev
```

## Optional: Onboarding Flow

This boilerplate includes an optional multi-step onboarding flow that guides new users through profile setup before they can access the app. It is controlled by a single feature flag.

### How it works

1. **Feature flag** — Toggle onboarding on/off in `src/lib/config/features.ts` via `featureFlags.enableOnboarding`. When disabled, users go straight to the app after login.
2. **Config-driven steps** — Onboarding steps are defined as data in `onboardingSteps` (same file). Add, remove, or reorder steps without touching route files.
3. **Protected layout enforcement** — When enabled, the protected layout (`src/routes/(protected)/app/+layout.svelte`) redirects users who haven't completed onboarding to the correct step. No per-page guard logic needed.
4. **Progress persistence** — Step progress and completion are saved to `user_profiles` via helpers in `src/lib/supabase/profiles.ts`. Users can resume where they left off.
5. **Skip prevention** — Users cannot jump ahead; the layout redirects them to their current required step.

### Enabling onboarding

1. Set `enableOnboarding: true` in `src/lib/config/features.ts` (this is the default).
2. The onboarding columns and RPCs are included in the base migrations — no extra setup needed.

### Disabling onboarding

1. Set `enableOnboarding: false` in `src/lib/config/features.ts`.
2. The onboarding routes and database columns can be left in place — they are inert when the flag is off.

### Customizing steps

Edit the `onboardingSteps` array in `src/lib/config/features.ts` to change questions, labels, or field keys. For each field you add or change, update:
- The `OnboardingFieldKey` type (same file)
- The Zod schema in `src/lib/components/onboarding/onboarding-schemas.ts`
- The `user_profiles` columns in the onboarding migration

## Security Model

The browser is untrusted. Supabase (Postgres RLS + Auth) is the only enforcement point. Client-side checks (auth guards, Zod schemas, route gating) improve UX but provide zero security.

- `PUBLIC_SUPABASE_PUBLISHABLE_KEY` is safe to expose — it can only do what RLS allows
- RLS policies scope every query to `auth.uid()`
- `security definer` RPCs assert `auth.uid() IS NOT NULL` and are restricted to the `authenticated` role
- A `BEFORE UPDATE` trigger protects `onboarding_completed_at` from direct writes — only the `complete_onboarding` RPC (security definer) can set it
- `CHECK` constraints enforce string length limits at the database level, matching client-side Zod `max()` limits
- Auth error messages are mapped to generic text — raw Supabase errors are never exposed to users
- Redirect targets (`next=` query parameter) are validated with `getSafeRedirect()` to prevent open redirects
- Destructive actions (password change, email change, account deletion) require current password re-authentication
- The `service_role` key is never used in frontend code

Use `/security-review` in Cursor to scan for vulnerabilities against the full checklist.

Useful policy audit query:

```sql
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Development Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Svelte + TypeScript checks |
| `npm run lint` | ESLint + Prettier checks |
| `npm run format` | Format code |

## Deployment (GitHub Pages + Custom Domain)

This repository includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml` that:

1. Builds the app with `npm run build`
2. Uploads the `build` directory as a Pages artifact
3. Deploys with `actions/deploy-pages`

### GitHub setup

1. Go to **Repository -> Settings -> Pages**
2. Set **Source** to **GitHub Actions**
3. Do not use the suggested Jekyll or Static HTML templates

### Repository secrets

Add these in **Repository -> Settings -> Secrets and variables -> Actions**:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`

These are injected during CI build in the Pages workflow.

### Custom domain (`your-domain.dev`)

In **Repository -> Settings -> Pages**:

1. Set custom domain to `your-domain.dev`
2. Wait for DNS/certificate validation
3. Enable **Enforce HTTPS** when available

DNS records should include:
- Apex `A` records to GitHub Pages IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`)
- Apex `AAAA` records to GitHub Pages IPv6 endpoints
- `www` `CNAME` to `YOUR-GITHUB-USERNAME.github.io`
