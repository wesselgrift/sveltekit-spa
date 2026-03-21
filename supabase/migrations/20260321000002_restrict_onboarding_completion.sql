-- Restricts direct client updates to onboarding_completed_at.
-- Only the complete_onboarding RPC can set the completion timestamp,
-- preventing users from bypassing the onboarding flow via direct queries.

-- Revoke blanket UPDATE and re-grant on allowed columns only.
revoke update on public.user_profiles from authenticated;
grant update (email, display_name, favorite_fruit, favorite_drink, onboarding_step) on public.user_profiles to authenticated;

-- RPC that atomically completes onboarding after verifying prior steps.
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
