-- Hardens delete_current_user RPC with an explicit auth assertion.
-- The previous version relied on auth.uid() returning NULL to no-op the WHERE clause,
-- but an explicit check is safer as defense-in-depth for security definer functions.

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
