
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { quoteFormSchema, validateFormData, sanitizeInput, sanitizeEmail, sanitizePhone } from "@/utils/validation";
import { UserTracking } from "@/utils/userTracking";

interface FormData {
  nombreCompleto: string;
  email: string;
  telefono: string;
  tipoConsulta: string;
  ubicacion: string;
  nivelUrgencia: string;
  descripcionSituacion: string;
}

export const useQuoteForm = () => {
  const { toast } = useToast();
  const { trackViewContent } = useMetaPixel();
  const { executeRecaptcha } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: '',
    email: '',
    telefono: '',
    tipoConsulta: '',
    ubicacion: '',
    nivelUrgencia: '',
    descripcionSituacion: ''
  });

  const handleInputChange = (field: string, value: string) => {
    let sanitizedValue = value;
    
    // Apply field-specific sanitization
    if (field === 'email') {
      sanitizedValue = sanitizeEmail(value);
    } else if (field === 'telefono') {
      sanitizedValue = sanitizePhone(value);
    } else if (typeof value === 'string') {
      sanitizedValue = sanitizeInput(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const resetForm = () => {
    setFormData({
      nombreCompleto: '',
      email: '',
      telefono: '',
      tipoConsulta: '',
      ubicacion: '',
      nivelUrgencia: '',
      descripcionSituacion: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod
    const validation = validateFormData(quoteFormSchema, formData);
    
    if (!validation.success) {
      toast({
        title: "Datos inválidos",
        description: validation.errors?.[0]?.message || "Por favor revisa los campos del formulario",
        variant: "destructive"
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      // Obtener token de reCAPTCHA
      const recaptchaToken = await executeRecaptcha('submit_quote_form');
      
      if (!recaptchaToken) {
        toast({
          title: "Error de verificación",
          description: "No se pudo verificar que eres humano. Por favor recarga la página e intenta de nuevo.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return false;
      }

      // Disparar el evento ViewContent ANTES de enviar el formulario
      console.log('📋 Formulario de cotización enviado - disparando ViewContent');
      await trackViewContent({
        content_type: 'form_submission',
        content_name: 'Quote Form Submission',
        content_category: formData.tipoConsulta,
        value: 1.00,
        currency: 'USD'
      });

      // Use validated and sanitized data
      const validData = validation.data;
      
      // Obtener IDs de tracking
      const trackingIds = UserTracking.getTrackingIds();
      
      // Preparar datos del submission
      const submissionData = {
        nombreCompleto: validData.nombreCompleto,
        email: validData.email,
        telefono: validData.telefono,
        tipoConsulta: validData.tipoConsulta,
        ubicacion: validData.ubicacion,
        nivelUrgencia: validData.nivelUrgencia,
        descripcionSituacion: validData.descripcionSituacion,
        origen: 'Botón Flotante - Solicitar Cotización',
        userId: trackingIds.user_id,
        sessionId: trackingIds.session_id,
        recaptchaToken: recaptchaToken
      };

      // Enviar a través de Edge Function segura
      console.log('💾 Enviando formulario a través de Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('submit-quote-form', {
        body: submissionData
      });

      if (error) {
        console.error('❌ Error al enviar formulario:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo procesar tu solicitud. Por favor intenta nuevamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return false;
      }

      console.log('✅ Formulario enviado correctamente');
      
      // Store the access token for the user
      if (data?.access_token) {
        localStorage.setItem('last_submission_token', data.access_token);
        console.log('🔑 Token de acceso guardado:', data.access_token.substring(0, 16) + '...');
      }
      
      toast({
        title: "¡Solicitud enviada exitosamente!",
        description: "Nos pondremos en contacto contigo pronto. Guarda el token de acceso que aparece en la consola si deseas consultar tu solicitud más tarde."
      });

      resetForm();
      return true;
    } catch (error) {
      console.error('Error procesando formulario:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
