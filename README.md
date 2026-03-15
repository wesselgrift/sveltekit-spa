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
2. In **Authentication -> URL Configuration**, add your site URL and redirect URLs.
3. Include auth callback destinations used by this app:
   - `/verify-email/`
   - `/set-new-password/`

For local development, a typical site URL is:
- `http://localhost:5173`

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

## Deployment

This project builds static assets and can be deployed to any static host:

- Vercel
- Netlify
- Cloudflare Pages
- Firebase Hosting

Ensure production redirect URLs are configured in Supabase Auth settings.
