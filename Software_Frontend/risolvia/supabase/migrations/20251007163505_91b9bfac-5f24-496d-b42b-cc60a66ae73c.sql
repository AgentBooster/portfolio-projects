-- Phase 1: Critical PII Protection
-- Create audit logging table for admin access to customer data
CREATE TABLE IF NOT EXISTS public.admin_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  accessed_table TEXT NOT NULL,
  accessed_record_id UUID,
  action_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.admin_access_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_access_audit
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
ON public.admin_access_audit
FOR INSERT
WITH CHECK (true);

-- Add session-based access policy for risolvia_form_submissions
CREATE POLICY "Users can view their own submissions by session"
ON public.risolvia_form_submissions
FOR SELECT
USING (
  session_id IS NOT NULL 
  AND session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- Phase 2: Rate Limiting System Hardening
-- Create audit logging table for rate limit changes
CREATE TABLE IF NOT EXISTS public.rate_limit_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_limit_record_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  modified_by TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate limit audit table
ALTER TABLE public.rate_limit_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit audit logs
CREATE POLICY "Admins can view rate limit audit logs"
ON public.rate_limit_audit
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert rate limit audit logs
CREATE POLICY "Service role can insert rate limit audit logs"
ON public.rate_limit_audit
FOR INSERT
WITH CHECK (true);

-- Create trigger function to log rate limit changes
CREATE OR REPLACE FUNCTION public.log_rate_limit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.rate_limit_audit (
      rate_limit_record_id,
      action_type,
      old_values,
      new_values,
      modified_by
    )
    VALUES (
      NEW.id,
      'UPDATE',
      to_jsonb(OLD),
      to_jsonb(NEW),
      current_setting('request.jwt.claims', true)::json->>'sub'
    );
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.rate_limit_audit (
      rate_limit_record_id,
      action_type,
      new_values,
      modified_by
    )
    VALUES (
      NEW.id,
      'INSERT',
      to_jsonb(NEW),
      current_setting('request.jwt.claims', true)::json->>'sub'
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for rate limit changes
CREATE TRIGGER audit_rate_limit_changes
AFTER INSERT OR UPDATE ON public.form_submissions_rate_limit
FOR EACH ROW
EXECUTE FUNCTION public.log_rate_limit_changes();

-- Add index for better audit query performance
CREATE INDEX idx_admin_access_audit_admin_user_id ON public.admin_access_audit(admin_user_id);
CREATE INDEX idx_admin_access_audit_created_at ON public.admin_access_audit(created_at DESC);
CREATE INDEX idx_rate_limit_audit_record_id ON public.rate_limit_audit(rate_limit_record_id);
CREATE INDEX idx_rate_limit_audit_created_at ON public.rate_limit_audit(created_at DESC);