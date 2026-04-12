-- Fix security vulnerability: Remove overly permissive RLS policy for sensitive customer data
-- Drop the current insecure policy that allows any authenticated user to view all records
DROP POLICY IF EXISTS "Only authenticated users can view contact data" ON public."boo_contact-data_agentbooster";

-- Create a more restrictive policy that only allows service role access
-- This ensures only authorized backend services can access sensitive customer data
CREATE POLICY "Only service role can access contact data" 
ON public."boo_contact-data_agentbooster" 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Update the table comment to reflect the new security model
COMMENT ON TABLE public."boo_contact-data_agentbooster" IS 'Tabla con datos sensibles de contacto. Acceso restringido solo a service role para máxima seguridad.';