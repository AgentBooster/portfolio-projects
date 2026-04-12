
-- Crear tabla para almacenar las consultas/cotizaciones
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_consulta TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  nivel_urgencia TEXT NOT NULL,
  descripcion_situacion TEXT NOT NULL,
  origen TEXT NOT NULL, -- Para distinguir entre formularios
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar índices para mejorar el rendimiento
CREATE INDEX idx_form_submissions_email ON public.form_submissions(email);
CREATE INDEX idx_form_submissions_created_at ON public.form_submissions(created_at);
CREATE INDEX idx_form_submissions_origen ON public.form_submissions(origen);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Crear política que permite insertar datos (sin autenticación requerida para formularios públicos)
CREATE POLICY "Allow public form submissions" 
  ON public.form_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Crear política para solo permitir lectura a usuarios autenticados (para futuro panel admin)
CREATE POLICY "Only authenticated users can view submissions" 
  ON public.form_submissions 
  FOR SELECT 
  USING (auth.role() = 'authenticated');
