


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."complete_onboarding"("p_favorite_drink" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."complete_onboarding"("p_favorite_drink" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_current_user"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
	if auth.uid() is null then
		raise exception 'Not authenticated';
	end if;

	delete from auth.users where id = auth.uid();
end;
$$;


ALTER FUNCTION "public"."delete_current_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."protect_onboarding_completed_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if current_user <> 'postgres'
       and NEW.onboarding_completed_at is distinct from OLD.onboarding_completed_at then
        NEW.onboarding_completed_at := OLD.onboarding_completed_at;
    end if;
    return NEW;
end;
$$;


ALTER FUNCTION "public"."protect_onboarding_completed_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "display_name" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "favorite_fruit" "text",
    "favorite_drink" "text",
    "onboarding_step" integer,
    "onboarding_completed_at" timestamp with time zone,
    CONSTRAINT "chk_display_name_length" CHECK (("char_length"("display_name") <= 255)),
    CONSTRAINT "chk_email_length" CHECK (("char_length"("email") <= 320)),
    CONSTRAINT "chk_favorite_drink_length" CHECK (("char_length"("favorite_drink") <= 255)),
    CONSTRAINT "chk_favorite_fruit_length" CHECK (("char_length"("favorite_fruit") <= 255))
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "trg_protect_onboarding_completed_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."protect_onboarding_completed_at"();



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_profiles_delete_own" ON "public"."user_profiles" FOR DELETE TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "user_profiles_insert_own" ON "public"."user_profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "user_profiles_select_own" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "user_profiles_update_own" ON "public"."user_profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































REVOKE ALL ON FUNCTION "public"."complete_onboarding"("p_favorite_drink" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."complete_onboarding"("p_favorite_drink" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."complete_onboarding"("p_favorite_drink" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."complete_onboarding"("p_favorite_drink" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."delete_current_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."delete_current_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_current_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_current_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."protect_onboarding_completed_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."protect_onboarding_completed_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."protect_onboarding_completed_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT UPDATE("email") ON TABLE "public"."user_profiles" TO "authenticated";



GRANT UPDATE("display_name") ON TABLE "public"."user_profiles" TO "authenticated";



GRANT UPDATE("favorite_fruit") ON TABLE "public"."user_profiles" TO "authenticated";



GRANT UPDATE("favorite_drink") ON TABLE "public"."user_profiles" TO "authenticated";



GRANT UPDATE("onboarding_step") ON TABLE "public"."user_profiles" TO "authenticated";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































drop extension if exists "pg_net";


