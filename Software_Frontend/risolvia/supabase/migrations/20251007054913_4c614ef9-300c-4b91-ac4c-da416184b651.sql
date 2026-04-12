-- Fix critical security issue: Restrict public access to contact data
-- Remove public read access and allow only admins and service role

-- Drop existing policies that allow public access
DROP POLICY IF EXISTS "Only authenticated users can insert contact data" ON public."boo_contact-data_agentbooster";
DROP POLICY IF EXISTS "Service role can read contact data" ON public."boo_contact-data_agentbooster";
DROP POLICY IF EXISTS "Prevent service role deletes" ON public."boo_contact-data_agentbooster";
DROP POLICY IF EXISTS "Prevent service role updates" ON public."boo_contact-data_agentbooster";

-- Service role full access (for edge functions)
CREATE POLICY "Service role full access to contact data"
ON public."boo_contact-data_agentbooster"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Only admins can read contact data
CREATE POLICY "Admins can read all contact data"
ON public."boo_contact-data_agentbooster"
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Prevent regular authenticated users from accessing data
CREATE POLICY "Regular users cannot access contact data"
ON public."boo_contact-data_agentbooster"
FOR SELECT
TO authenticated
USING (false);