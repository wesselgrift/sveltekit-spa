-- Security definer RPCs for operations that require elevated privileges.
-- Each function asserts auth.uid() and is restricted to the authenticated role.

-- Account self-deletion: removes the auth user row (profile cascades via FK).
create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
	if auth.uid() is null then
		raise exception 'Not authenticated';
	end if;

	delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_current_user() from public;
grant execute on function public.delete_current_user() to authenticated;

-- Onboarding completion: verifies prior steps, then atomically sets
-- favorite_drink, onboarding_step, and onboarding_completed_at.
create or replace function public.complete_onboarding(p_favorite_drink text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
	if auth.uid() is null then
		raise exception 'Not authenticated';
	end if;

	-- Step 1 must be completed (favorite_fruit set) before onboarding can finish.
	if not exists (
		select 1 from public.user_profiles
		where id = auth.uid() and favorite_fruit is not null
	) then
		raise exception 'Previous onboarding steps must be completed first';
	end if;

	update public.user_profiles
	set
		favorite_drink = p_favorite_drink,
		onboarding_step = 2,
		onboarding_completed_at = now()
	where id = auth.uid();
end;
$$;

revoke all on function public.complete_onboarding(text) from public;
grant execute on function public.complete_onboarding(text) to authenticated;
