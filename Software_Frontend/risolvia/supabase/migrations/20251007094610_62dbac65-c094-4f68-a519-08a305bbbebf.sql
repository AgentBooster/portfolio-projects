-- Enable RLS on agent_risolvia_memory table
ALTER TABLE public.agent_risolvia_memory ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admins can view all chat history
CREATE POLICY "Admins can view all chat history"
ON public.agent_risolvia_memory
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy 2: Service role can select chat messages (needed for AI agent to retrieve conversation history)
CREATE POLICY "Service role can select chat messages"
ON public.agent_risolvia_memory
FOR SELECT
USING (true);

-- Policy 3: Service role can insert chat messages (needed for AI agent to save new messages)
CREATE POLICY "Service role can insert chat messages"
ON public.agent_risolvia_memory
FOR INSERT
WITH CHECK (true);

-- Policy 4: Prevent public/authenticated user direct access to chat history
CREATE POLICY "Prevent direct user access to chat history"
ON public.agent_risolvia_memory
FOR SELECT
USING (false);

-- Add comment explaining the security model
COMMENT ON TABLE public.agent_risolvia_memory IS 'Stores AI agent conversation history. Access restricted to service role (for edge functions) and admins only. End users cannot directly query this table.';