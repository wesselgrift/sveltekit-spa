-- Adds onboarding fields to user_profiles.
-- These columns are nullable so existing users are unaffected.

alter table public.user_profiles
	add column if not exists favorite_fruit text,
	add column if not exists favorite_drink text,
	add column if not exists onboarding_step integer,
	add column if not exists onboarding_completed_at timestamptz;
