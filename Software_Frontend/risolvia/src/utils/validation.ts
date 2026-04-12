import { z } from 'zod';

// Validation schema for quote form
export const quoteFormSchema = z.object({
  nombreCompleto: z.string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" })
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),
  
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
  
  telefono: z.string()
    .trim()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" })
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, { message: "Formato de teléfono inválido" }),
  
  tipoConsulta: z.enum([
    'derecho-civil',
    'derecho-laboral', 
    'derecho-penal',
    'derecho-inmobiliario',
    'derecho-familia',
    'derecho-empresarial',
    'otro'
  ], { errorMap: () => ({ message: "Seleccione un tipo de consulta válido" }) }),
  
  ubicacion: z.string()
    .trim()
    .min(2, { message: "La ubicación debe tener al menos 2 caracteres" })
    .max(100, { message: "La ubicación no puede exceder 100 caracteres" }),
  
  nivelUrgencia: z.enum([
    'muy-urgente',
    'urgente',
    'normal',
    'planificacion'
  ], { errorMap: () => ({ message: "Seleccione un nivel de urgencia válido" }) }),
  
  descripcionSituacion: z.string()
    .trim()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(2000, { message: "La descripción no puede exceder 2000 caracteres" })
});

// Validation schema for consultation modal
export const consultationModalSchema = z.object({
  nombre: z.string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" })
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),
  
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "El email no puede exceder 255 caracteres" }),
  
  telefono: z.string()
    .trim()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .max(20, { message: "El teléfono no puede exceder 20 caracteres" })
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, { message: "Formato de teléfono inválido" }),
  
  descripcion: z.string()
    .trim()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(2000, { message: "La descripción no puede exceder 2000 caracteres" }),
  
  urgente: z.boolean()
});

// Contact form schema (same as quote form)
export const contactFormSchema = quoteFormSchema;

// Input sanitization functions
export const sanitizeInput = (input: string): string => {
  return input; // Keep all characters, just return as is to allow normal typing
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
  return phone.trim().replace(/[^\+0-9\s\-\(\)]/g, '');
};

// Generic validation function
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        data: null, 
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { 
      success: false, 
      data: null, 
      errors: [{ field: 'general', message: 'Error de validación desconocido' }]
    };
  }
};

// Safe error message formatting
export const formatValidationErrors = (errors: Array<{ field: string; message: string }>) => {
  return errors.map(error => `${error.field}: ${error.message}`).join('; ');
};