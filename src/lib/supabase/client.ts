/**
 * Supabase client singleton for browser-side auth and profile operations.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabasePublishableKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
	throw new Error(
		'Missing Supabase env vars: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY'
	);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey);
