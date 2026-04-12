-- Enable Row Level Security on agent_boo_historial table
ALTER TABLE public.agent_boo_historial ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all chat history
CREATE POLICY "Admins can view all chat history"
ON public.agent_boo_historial
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Service role can insert chat history
CREATE POLICY "Service role can insert chat history"
ON public.agent_boo_historial
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can update chat history
CREATE POLICY "Only admins can update chat history"
ON public.agent_boo_historial
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete chat history
CREATE POLICY "Only admins can delete chat history"
ON public.agent_boo_historial
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Block public access
CREATE POLICY "Block public access to chat history"
ON public.agent_boo_historial
FOR SELECT
USING (false);