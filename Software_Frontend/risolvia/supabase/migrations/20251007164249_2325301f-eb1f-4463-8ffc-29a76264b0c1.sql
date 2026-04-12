-- Drop the insecure session-based policy
DROP POLICY IF EXISTS "Users can view their own submissions by session" ON public.risolvia_form_submissions;

-- Add a column to store secure access tokens
ALTER TABLE public.risolvia_form_submissions 
ADD COLUMN IF NOT EXISTS access_token TEXT UNIQUE;

-- Create a function to generate cryptographically secure tokens using UUID
CREATE OR REPLACE FUNCTION public.generate_submission_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a cryptographically secure token using multiple UUIDs
  -- This creates a 128-character token that's extremely difficult to guess
  token := replace(gen_random_uuid()::text || gen_random_uuid()::text || gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  RETURN token;
END;
$$;

-- Create a trigger to automatically generate tokens on insert
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

-- Create trigger for automatic token generation
DROP TRIGGER IF EXISTS generate_access_token_on_insert ON public.risolvia_form_submissions;
CREATE TRIGGER generate_access_token_on_insert
BEFORE INSERT ON public.risolvia_form_submissions
FOR EACH ROW
EXECUTE FUNCTION public.set_submission_access_token();

-- Create a secure function to retrieve submissions by token
CREATE OR REPLACE FUNCTION public.get_submission_by_token(submission_token TEXT)
RETURNS SETOF public.risolvia_form_submissions
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT *
  FROM public.risolvia_form_submissions
  WHERE access_token = submission_token;
$$;

-- Create a secure policy that only allows token-based access through the function
CREATE POLICY "Allow access via secure token function only"
ON public.risolvia_form_submissions
FOR SELECT
USING (false); -- Direct SELECT is blocked; must use get_submission_by_token function

-- Add index for token lookups
CREATE INDEX IF NOT EXISTS idx_risolvia_submissions_access_token 
ON public.risolvia_form_submissions(access_token);

-- Grant execute permission on the function to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_submission_by_token(TEXT) TO anon, authenticated;

-- Backfill existing submissions with tokens (for any existing data)
UPDATE public.risolvia_form_submissions
SET access_token = public.generate_submission_token()
WHERE access_token IS NULL;