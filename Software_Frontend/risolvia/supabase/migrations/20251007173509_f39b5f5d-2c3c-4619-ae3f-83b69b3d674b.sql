-- Drop existing SELECT policy to recreate it more explicitly
DROP POLICY IF EXISTS "Admins and service role can view submissions" ON risolvia_form_submissions;

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

-- Optional: Allow users to view their own submission using access_token
-- This is useful for "check status" features
CREATE POLICY "Users can view their own submission with token"
ON risolvia_form_submissions
FOR SELECT
TO anon, authenticated
USING (
  access_token IS NOT NULL AND 
  access_token = current_setting('request.jwt.claim.submission_token', true)
);