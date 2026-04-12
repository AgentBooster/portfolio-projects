-- Drop all existing SELECT policies to recreate them properly
DROP POLICY IF EXISTS "Admins and service role can view submissions" ON risolvia_form_submissions;
DROP POLICY IF EXISTS "Block anonymous access to submissions" ON risolvia_form_submissions;
DROP POLICY IF EXISTS "Only admins can view submissions" ON risolvia_form_submissions;
DROP POLICY IF EXISTS "Users can view their own submission with token" ON risolvia_form_submissions;

-- Block anonymous/public access to submissions explicitly
CREATE POLICY "Block anonymous access to submissions"
ON risolvia_form_submissions
FOR SELECT
TO anon
USING (false);

-- Allow only authenticated admins to view submissions
CREATE POLICY "Only admins can view submissions"
ON risolvia_form_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));