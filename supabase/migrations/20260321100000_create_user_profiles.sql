-- Creates the user_profiles table with all columns, RLS policies,
-- CHECK constraints, and column-level UPDATE grants.
-- Each authenticated user can only access their own row.

create table if not exists public.user_profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	email text,
	display_name text,
	favorite_fruit text,
	favorite_drink text,
	onboarding_step integer,
	onboarding_completed_at timestamptz,
	created_at timestamptz not null default now()
);

-- RLS: every operation is scoped to the row owner.
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

-- String length constraints to match client-side Zod max() limits.
alter table public.user_profiles
	add constraint chk_display_name_length check (char_length(display_name) <= 255),
	add constraint chk_email_length check (char_length(email) <= 320),
	add constraint chk_favorite_fruit_length check (char_length(favorite_fruit) <= 255),
	add constraint chk_favorite_drink_length check (char_length(favorite_drink) <= 255);

-- Column-level UPDATE grants: users cannot directly write onboarding_completed_at.
-- That column is only set through the complete_onboarding RPC (see next migration).
revoke update on public.user_profiles from authenticated;
grant update (email, display_name, favorite_fruit, favorite_drink, onboarding_step) on public.user_profiles to authenticated;
