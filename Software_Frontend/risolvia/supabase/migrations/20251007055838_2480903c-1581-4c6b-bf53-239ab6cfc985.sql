-- Fix critical security issue: Restrict service role access to only INSERT operations
-- The 'boo_contact-data_agentbooster' table should only allow service role to insert data, not read or modify existing data

-- Drop any existing policies for service role
DROP POLICY IF EXISTS "Service role full access to contact data" ON public."boo_contact-data_agentbooster";
DROP POLICY IF EXISTS "Service role can insert contact data" ON public."boo_contact-data_agentbooster";
DROP POLICY IF EXISTS "Service role can read contact data" ON public."boo_contact-data_agentbooster";

-- Create restricted policy: Service role can only INSERT new contact data
CREATE POLICY "Service role can insert contact data only"
ON public."boo_contact-data_agentbooster"
FOR INSERT
TO service_role
WITH CHECK (true);

-- Admins retain full read access (already exists: "Admins can read all contact data")
-- Regular users remain blocked (already exists: "Regular users cannot access contact data")