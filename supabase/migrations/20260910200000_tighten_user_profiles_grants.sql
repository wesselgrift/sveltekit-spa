-- Tighten privileges on user_profiles and the app's RPC functions.
--
-- The base migration granted ALL on user_profiles to anon and authenticated.
-- Column-level UPDATE grants never narrow a table-level grant, so authenticated
-- could write created_at and onboarding_completed_at directly. This migration
-- drops the blanket grants and re-grants only what the app uses.

-- Table: RLS policies are TO authenticated only, so anon needs nothing here.
revoke all on table public.user_profiles from anon, authenticated;
grant select, insert, delete on table public.user_profiles to authenticated;

-- id must stay in the UPDATE grant: PostgREST upsert puts every payload column,
-- including the primary key, in ON CONFLICT DO UPDATE SET. RLS WITH CHECK
-- (id = auth.uid()) still prevents moving a row to another user's id.
grant update (id, email, display_name, favorite_fruit, favorite_drink, onboarding_step)
  on table public.user_profiles to authenticated;

-- RPCs: only signed-in users call these. Both already check auth.uid() is not null.
revoke execute on function public.complete_onboarding(text) from public, anon;
revoke execute on function public.delete_current_user() from public, anon;

-- Event-trigger function; nothing should call it over REST.
-- DDL runs as postgres (the owner), which keeps EXECUTE.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Pin search_path on the one function that lacked it (database linter warning).
alter function public.protect_onboarding_completed_at() set search_path = public;
