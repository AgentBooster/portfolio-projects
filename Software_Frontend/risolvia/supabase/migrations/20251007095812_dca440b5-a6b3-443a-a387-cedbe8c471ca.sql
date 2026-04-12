-- Add comprehensive RLS policies for INSERT, UPDATE, DELETE on agent_risolvia_memory

-- Policy 1: Only admins can insert chat messages (service role bypasses RLS automatically)
CREATE POLICY "Only admins can insert chat messages"
ON public.agent_risolvia_memory
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy 2: Only admins can update chat messages
CREATE POLICY "Only admins can update chat messages"
ON public.agent_risolvia_memory
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy 3: Only admins can delete chat messages
CREATE POLICY "Only admins can delete chat messages"
ON public.agent_risolvia_memory
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy 4: Block public/authenticated users from inserting
CREATE POLICY "Block public insert on chat messages"
ON public.agent_risolvia_memory
FOR INSERT
WITH CHECK (false);

-- Policy 5: Block public/authenticated users from updating
CREATE POLICY "Block public update on chat messages"
ON public.agent_risolvia_memory
FOR UPDATE
USING (false);

-- Policy 6: Block public/authenticated users from deleting
CREATE POLICY "Block public delete on chat messages"
ON public.agent_risolvia_memory
FOR DELETE
USING (false);

-- Update comment
COMMENT ON TABLE public.agent_risolvia_memory IS 'Stores AI agent conversation history. All operations (SELECT, INSERT, UPDATE, DELETE) are restricted to admins only through RLS. Edge functions using service_role key can perform all operations as they bypass RLS. Public and authenticated users have no direct access.';