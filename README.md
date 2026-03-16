# SvelteKit SPA Boilerplate

A production-ready boilerplate for Single Page Applications with SvelteKit, Svelte 5 runes, Supabase Auth, Postgres (RLS), and shadcn-svelte UI components.

Built for teams that want a clean auth foundation, protected routes, and account management flows without SSR complexity.

## Features

- SvelteKit SPA mode with `adapter-static` and client-side routing fallback
- Svelte 5 runes (`$state`, `$derived`, `$effect`) for modern reactive state
- Supabase Auth (email/password, signup verification, password reset)
- User profile persistence in Supabase (`user_profiles`)
- RLS-friendly data access patterns from the browser
- shadcn-svelte UI primitives and accessible form patterns
- Tailwind CSS 4 + TypeScript
- Protected route group with auth + email verification guards

## MCP Servers (Cursor)

This project uses MCP servers in Cursor to improve development workflows and keep implementation aligned with framework and data best practices.

- **Supabase MCP**
  - Use for database/auth inspection, policy checks, and schema awareness.
  - Treat as **read-only by default**.
  - Only run mutating operations (writes/deletes/schema changes) when explicitly intended and reviewed.
- **Svelte MCP**
  - Use for Svelte/SvelteKit development guidance and API-accurate docs.
  - Preferred workflow: `list-sections` -> `get-documentation` (all relevant sections) -> `svelte-autofixer` until no issues remain.

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
        └── account/+page.svelte
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
├── supabase/
│   ├── client.ts                # browser Supabase client
│   └── profiles.ts              # user_profiles helpers + account deletion RPC
└── components/
    ├── auth/
    ├── account/
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


### 4) Database setup (`user_profiles` + RLS)

Run this in Supabase SQL editor (adjust as needed):

```sql
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "user_profiles_select_own"
  on public.user_profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "user_profiles_insert_own"
  on public.user_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "user_profiles_update_own"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "user_profiles_delete_own"
  on public.user_profiles
  for delete
  to authenticated
  using (auth.uid() = id);
```

### 5) Account deletion RPC setup

This app calls `rpc('delete_current_user')` from the browser. Create a secure function:

```sql
create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_current_user() from public;
grant execute on function public.delete_current_user() to authenticated;
```

### 6) Run locally

```bash
npm run dev
```

## Security Model (Supabase equivalent of Firestore rules)

- Browser uses `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (expected and safe)
- Every data operation is constrained by Postgres **RLS policies**
- Ownership checks should rely on `auth.uid()`
- Never use the `service_role` key in frontend code

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
