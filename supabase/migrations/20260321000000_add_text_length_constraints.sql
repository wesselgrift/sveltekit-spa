-- Adds length constraints to all user-facing text columns.
-- Prevents abuse by storing excessively long values via direct Supabase calls.

alter table public.user_profiles
	add constraint chk_display_name_length check (char_length(display_name) <= 255),
	add constraint chk_email_length check (char_length(email) <= 320),
	add constraint chk_favorite_fruit_length check (char_length(favorite_fruit) <= 255),
	add constraint chk_favorite_drink_length check (char_length(favorite_drink) <= 255);
