-- Secure RPC function for account self-deletion.
-- Uses security definer so the function runs with elevated privileges,
-- but is restricted to authenticated users deleting only themselves.

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
