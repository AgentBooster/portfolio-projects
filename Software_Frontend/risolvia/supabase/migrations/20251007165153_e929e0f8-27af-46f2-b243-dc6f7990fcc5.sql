-- Fix RLS policies on risolvia_form_submissions to properly restrict access
-- Issue: Multiple RESTRICTIVE policies with false conditions block ALL access

-- Drop all existing conflicting SELECT policies
DROP POLICY IF EXISTS "Prevent authenticated user access to submissions" ON public.risolvia_form_submissions;
DROP POLICY IF EXISTS "Prevent public access to submissions" ON public.risolvia_form_submissions;
DROP POLICY IF EXISTS "Allow access via secure token function only" ON public.risolvia_form_submissions;

-- Keep only the admin access policy (it's already RESTRICTIVE which is correct)
-- The "Admins and service role can view submissions" policy already exists and is correct

-- Verify RLS is enabled (it should be, but let's ensure it)
ALTER TABLE public.risolvia_form_submissions ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owner (critical security setting)
ALTER TABLE public.risolvia_form_submissions FORCE ROW LEVEL SECURITY;

-- The remaining policies will be:
-- 1. "Allow public form submissions" (INSERT) - allows anonymous users to submit forms
-- 2. "Admins and service role can view submissions" (SELECT) - allows only admins to view data
-- 3. No other access is allowed by default (RLS denies everything not explicitly allowed)