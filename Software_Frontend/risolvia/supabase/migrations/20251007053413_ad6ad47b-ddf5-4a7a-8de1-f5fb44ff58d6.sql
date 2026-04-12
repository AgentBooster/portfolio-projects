-- Add user_id column to risolvia_form_submissions for tracking
ALTER TABLE public.risolvia_form_submissions 
ADD COLUMN user_id TEXT;

-- Add index on user_id for query performance
CREATE INDEX idx_risolvia_form_submissions_user_id 
ON public.risolvia_form_submissions(user_id);

-- Add index on session_id for query performance
CREATE INDEX idx_risolvia_form_submissions_session_id 
ON public.risolvia_form_submissions(session_id);

-- Restrict service role access to boo_contact-data_agentbooster
-- Remove overly permissive "all" policy
DROP POLICY IF EXISTS "Only service role can access contact data" 
ON public."boo_contact-data_agentbooster";

-- Create more restrictive policies
CREATE POLICY "Service role can read contact data" 
ON public."boo_contact-data_agentbooster"
FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can insert contact data" 
ON public."boo_contact-data_agentbooster"
FOR INSERT
TO service_role
WITH CHECK (true);

-- Prevent UPDATE and DELETE from service role for data integrity
CREATE POLICY "Prevent service role updates" 
ON public."boo_contact-data_agentbooster"
FOR UPDATE
TO service_role
USING (false);

CREATE POLICY "Prevent service role deletes" 
ON public."boo_contact-data_agentbooster"
FOR DELETE
TO service_role
USING (false);