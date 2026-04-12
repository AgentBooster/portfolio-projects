-- Fix search_path for cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.form_submissions_rate_limit
  WHERE last_attempt_at < (now() - interval '24 hours');
END;
$$;