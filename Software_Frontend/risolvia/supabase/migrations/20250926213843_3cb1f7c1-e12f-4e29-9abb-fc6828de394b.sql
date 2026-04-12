-- Habilitar RLS en la tabla con datos sensibles de contacto
ALTER TABLE public."boo_contact-data_agentbooster" ENABLE ROW LEVEL SECURITY;

-- Crear políticas para proteger los datos de contacto
-- Solo usuarios autenticados pueden ver los datos
CREATE POLICY "Only authenticated users can view contact data" 
ON public."boo_contact-data_agentbooster" 
FOR SELECT 
TO authenticated 
USING (true);

-- Solo usuarios autenticados pueden insertar nuevos registros
CREATE POLICY "Only authenticated users can insert contact data" 
ON public."boo_contact-data_agentbooster" 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Comentario explicativo sobre la seguridad implementada
COMMENT ON TABLE public."boo_contact-data_agentbooster" IS 'Tabla con datos sensibles de contacto protegida por RLS. Solo accesible por usuarios autenticados.';