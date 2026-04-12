-- Fix critical security issue: Remove unrestricted service role access to risolvia_form_submissions
-- The service role doesn't need direct access since form submissions use the anon key

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role full access" ON public.risolvia_form_submissions;

-- The existing policies are sufficient:
-- 1. "Allow public form submissions" - permits public INSERT operations (used by the form)
-- 2. "Admins and service role can view submissions" - allows admins to SELECT (auth.uid() check)
-- 3. "Prevent authenticated user access to submissions" - blocks regular users from SELECT
-- 4. "Prevent public access to submissions" - blocks anonymous users from SELECT

-- No additional policies needed - service role should not have blanket access to sensitive customer data