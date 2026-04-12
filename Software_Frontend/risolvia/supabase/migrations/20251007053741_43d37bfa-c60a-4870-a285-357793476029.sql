-- Fix critical security issue: Restrict access to form submissions to service role only
-- Drop the overly permissive policy that allows all authenticated users to view submissions
DROP POLICY IF EXISTS "Only authenticated users can view submissions" 
ON public.risolvia_form_submissions;

-- Create a new policy that only allows service role to view submissions
-- This ensures only authorized backend/admin access can read sensitive customer data
CREATE POLICY "Service role can view all submissions" 
ON public.risolvia_form_submissions
FOR SELECT
TO service_role
USING (true);

-- Keep the public INSERT policy for form submissions
-- (already exists: "Allow public form submissions")

-- Prevent authenticated users from viewing submissions
CREATE POLICY "Prevent authenticated user access to submissions" 
ON public.risolvia_form_submissions
FOR SELECT
TO authenticated
USING (false);

-- Prevent public role from viewing submissions (extra security layer)
CREATE POLICY "Prevent public access to submissions" 
ON public.risolvia_form_submissions
FOR SELECT
TO anon
USING (false);