-- Create table for rate limiting form submissions
CREATE TABLE IF NOT EXISTS public.form_submissions_rate_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  submission_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast IP lookups
CREATE INDEX idx_rate_limit_ip ON public.form_submissions_rate_limit(ip_address);
CREATE INDEX idx_rate_limit_last_attempt ON public.form_submissions_rate_limit(last_attempt_at);

-- Enable RLS
ALTER TABLE public.form_submissions_rate_limit ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table (used by edge functions)
CREATE POLICY "Service role full access to rate limit"
ON public.form_submissions_rate_limit
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to clean old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.form_submissions_rate_limit
  WHERE last_attempt_at < (now() - interval '24 hours');
END;
$$;