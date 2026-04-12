-- Create admin role system to allow authorized users to access form submissions
-- This fixes the security issue where there's no legitimate way to access submissions

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. RLS policies for user_roles table
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service role can insert roles"
ON public.user_roles
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Only service role can update roles"
ON public.user_roles
FOR UPDATE
TO service_role
USING (true);

-- 6. Update risolvia_form_submissions policies to allow admin access
-- Drop the service_role-only policy
DROP POLICY IF EXISTS "Service role can view all submissions" 
ON public.risolvia_form_submissions;

-- Create new policy that allows both admins and service_role to view submissions
CREATE POLICY "Admins and service role can view submissions"
ON public.risolvia_form_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Keep the service role access via a separate policy
CREATE POLICY "Service role full access"
ON public.risolvia_form_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Note: The following policies already exist and will remain:
-- - "Allow public form submissions" (INSERT for anon)
-- - "Prevent authenticated user access to submissions" (SELECT deny for regular authenticated)
-- - "Prevent public access to submissions" (SELECT deny for anon)