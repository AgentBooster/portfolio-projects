-- Fix security warning: Restrict service role access to only necessary operations for rate limiting
-- The 'form_submissions_rate_limit' table should only allow service role to insert and update rate limit records, not delete

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role full access to rate limit" ON public.form_submissions_rate_limit;

-- Create restricted policies for specific operations
CREATE POLICY "Service role can insert rate limit records"
ON public.form_submissions_rate_limit
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update rate limit records"
ON public.form_submissions_rate_limit
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can select rate limit records"
ON public.form_submissions_rate_limit
FOR SELECT
TO service_role
USING (true);

-- Allow admins to view rate limiting data for monitoring
CREATE POLICY "Admins can view rate limit data"
ON public.form_submissions_rate_limit
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));