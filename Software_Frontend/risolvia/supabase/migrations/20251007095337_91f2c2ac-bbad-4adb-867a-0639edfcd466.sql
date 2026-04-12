-- Remove the dangerous policies that allow public access
DROP POLICY IF EXISTS "Service role can select chat messages" ON public.agent_risolvia_memory;
DROP POLICY IF EXISTS "Service role can insert chat messages" ON public.agent_risolvia_memory;
DROP POLICY IF EXISTS "Prevent direct user access to chat history" ON public.agent_risolvia_memory;

-- Keep only admin access policy (already exists)
-- The service role will be able to access the table anyway when authenticated with service_role key
-- This is the secure pattern: no public access, only admins can view, service role can operate through edge functions

-- Update table comment to reflect correct security model
COMMENT ON TABLE public.agent_risolvia_memory IS 'Stores AI agent conversation history. Only accessible to admins through RLS policies. Edge functions using service_role key can read/write for chatbot functionality, but public/authenticated users cannot directly query this table.';