-- Fix Missing RLS on agent_boo_memory table
ALTER TABLE public.agent_boo_memory ENABLE ROW LEVEL SECURITY;

-- Create policies for agent_boo_memory
CREATE POLICY "Admins can view all chat memory"
ON public.agent_boo_memory
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert chat memory"
ON public.agent_boo_memory
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can update chat memory"
ON public.agent_boo_memory
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete chat memory"
ON public.agent_boo_memory
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block public access to chat memory"
ON public.agent_boo_memory
FOR SELECT
USING (false);

-- Fix Missing RLS on vector embedding tables
ALTER TABLE public.booagentbooster_1536 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booagentbooster_3072 ENABLE ROW LEVEL SECURITY;

-- Create policies for booagentbooster_1536
CREATE POLICY "Admins can view embeddings 1536"
ON public.booagentbooster_1536
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage embeddings 1536"
ON public.booagentbooster_1536
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for booagentbooster_3072
CREATE POLICY "Admins can view embeddings 3072"
ON public.booagentbooster_3072
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage embeddings 3072"
ON public.booagentbooster_3072
FOR ALL
USING (true)
WITH CHECK (true);