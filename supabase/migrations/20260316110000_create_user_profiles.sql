-- Creates user_profiles table with RLS policies.
-- Each authenticated user can only access their own row.

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
