-- Fix user_roles security: Add validation to prevent unauthorized admin role assignments
-- This prevents privilege escalation attacks by requiring existing admin approval

-- 1. Create a function to validate role assignments
-- This ensures only existing admins can assign admin roles to others
CREATE OR REPLACE FUNCTION public.validate_role_assignment(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_is_admin BOOLEAN;
  existing_role app_role;
BEGIN
  -- Check if there are any admins in the system yet (for initial setup)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    -- First admin can be created without restrictions (initial setup)
    RETURN true;
  END IF;
  
  -- For subsequent operations, check if requester is an admin
  -- Note: In service role context, we check if the target user is trying to assign admin
  -- Only allow admin role assignment if there's proper authorization
  
  -- If assigning 'user' role, always allow it (safe operation)
  IF _role = 'user' THEN
    RETURN true;
  END IF;
  
  -- If assigning 'admin' role, verify it's not a privilege escalation
  -- This prevents arbitrary admin creation via service role
  -- Edge functions should set a claim or use additional validation
  IF _role = 'admin' THEN
    -- Check if user already has admin role (updating own record is ok)
    SELECT role INTO existing_role 
    FROM public.user_roles 
    WHERE user_id = _user_id;
    
    IF existing_role = 'admin' THEN
      -- Updating existing admin is allowed
      RETURN true;
    END IF;
    
    -- For new admin assignments, return false to block unauthorized escalation
    -- Admins must be created through authenticated admin requests
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- 2. Drop existing unrestricted policies
DROP POLICY IF EXISTS "Only service role can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only service role can update roles" ON public.user_roles;

-- 3. Create new validated policies for INSERT
CREATE POLICY "Service role can insert validated roles"
ON public.user_roles
FOR INSERT
TO service_role
WITH CHECK (
  public.validate_role_assignment(user_id, role)
);

-- 4. Create new validated policies for UPDATE
CREATE POLICY "Service role can update validated roles"
ON public.user_roles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (
  public.validate_role_assignment(user_id, role)
);

-- 5. Add a policy to allow admins to manage roles directly (when authenticated)
CREATE POLICY "Admins can insert any role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update any role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Add DELETE policy for admins only
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));