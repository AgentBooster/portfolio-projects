-- Remove public INSERT policy (now handled by Edge Function)
DROP POLICY IF EXISTS "Allow public form submissions" ON risolvia_form_submissions;

-- Add policy to allow only service role (Edge Function) to insert
CREATE POLICY "Service role can insert submissions"
ON risolvia_form_submissions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Ensure access_token trigger exists and is active
-- This trigger generates a secure random token for each submission
CREATE OR REPLACE FUNCTION public.set_submission_access_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_token IS NULL THEN
    NEW.access_token := public.generate_submission_token();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger if it doesn't exist
DROP TRIGGER IF EXISTS set_submission_token_trigger ON risolvia_form_submissions;
CREATE TRIGGER set_submission_token_trigger
BEFORE INSERT ON risolvia_form_submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_submission_access_token();