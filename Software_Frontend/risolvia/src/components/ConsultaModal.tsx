import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { consultationModalSchema, validateFormData, sanitizeInput, sanitizeEmail, sanitizePhone } from "@/utils/validation";
import { UserTracking } from "@/utils/userTracking";

interface ConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultaModal = ({ isOpen, onClose }: ConsultaModalProps) => {
  const { toast } = useToast();
  const { trackViewContent } = useMetaPixel();
  const { executeRecaptcha } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    descripcion: "",
    urgente: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with Zod
    const validation = validateFormData(consultationModalSchema, formData);
    
    if (!validation.success) {
      toast({
        title: "Datos inválidos",
        description: validation.errors?.[0]?.message || "Por favor revisa los campos del formulario",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener token de reCAPTCHA
      const recaptchaToken = await executeRecaptcha('submit_consultation');
      
      if (!recaptchaToken) {
        toast({
          title: "Error de verificación",
          description: "No se pudo verificar que eres humano. Por favor recarga la página e intenta de nuevo.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Disparar el evento ViewContent ANTES de enviar el formulario
      console.log('📝 Consulta directa enviada - disparando ViewContent');
      await trackViewContent({
        content_type: 'form_submission',
        content_name: 'Direct Consultation Form Submission',
        content_category: 'Consulta Directa',
        value: 1.00,
        currency: 'USD'
      });

      // Use validated and sanitized data
      const validData = validation.data;
      
      // Obtener IDs de tracking
      const trackingIds = UserTracking.getTrackingIds();
      
      // Preparar datos del submission
      const submissionData = {
        nombreCompleto: validData.nombre,
        email: validData.email,
        telefono: validData.telefono,
        tipoConsulta: validData.urgente ? 'Consulta Urgente' : 'Consulta General',
        ubicacion: 'No especificado',
        nivelUrgencia: validData.urgente ? 'muy-urgente' : 'urgente',
        descripcionSituacion: validData.descripcion,
        origen: 'Modal - Consulta Directa',
        userId: trackingIds.user_id,
        sessionId: trackingIds.session_id,
        recaptchaToken: recaptchaToken
      };

      // Enviar a través de Edge Function segura
      console.log('💾 Enviando consulta a través de Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('submit-quote-form', {
        body: submissionData
      });

      if (error) {
        console.error('❌ Error al enviar consulta:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo procesar tu solicitud. Por favor intenta nuevamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Consulta enviada correctamente');
      
      // Store the access token for the user
      if (data?.access_token) {
        localStorage.setItem('last_submission_token', data.access_token);
        console.log('🔑 Token de acceso guardado:', data.access_token.substring(0, 16) + '...');
      }

      toast({
        title: "¡Consulta enviada exitosamente!",
        description: "Te contactaremos pronto para evaluar tu caso. Tu token de acceso ha sido guardado de forma segura."
      });

      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        descripcion: "",
        urgente: false
      });

      onClose();
    } catch (error) {
      console.error('Error enviando consulta:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu consulta. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let sanitizedValue = value;
    if (name === 'email') {
      sanitizedValue = sanitizeEmail(value);
    } else if (name === 'telefono') {
      sanitizedValue = sanitizePhone(value);
    } else if (type !== "checkbox") {
      sanitizedValue = sanitizeInput(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : sanitizedValue
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Consulta <span className="text-orange-500">Directa</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-800 font-medium">
                  Consulta gratuita
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  Te contactaremos en menos de 2 horas para evaluar tu caso.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="+34 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe tu problema legal *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Cuéntanos los detalles de tu situación para poder ayudarte mejor..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="urgente"
                id="urgente"
                checked={formData.urgente}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="urgente" className="text-sm text-slate-600">
                Este es un caso urgente (requiere atención inmediata)
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Consulta Directa'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-4">
            Al enviar este formulario, aceptas que te contactemos para brindarte asesoría legal personalizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultaModal;
