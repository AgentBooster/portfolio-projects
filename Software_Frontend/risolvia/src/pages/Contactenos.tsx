import { Phone, Mail, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { contactFormSchema, validateFormData, sanitizeInput, sanitizeEmail, sanitizePhone } from "@/utils/validation";
import { UserTracking } from "@/utils/userTracking";

const Contactenos = () => {
  const { toast } = useToast();
  const { trackViewContent } = useMetaPixel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod
    const validation = validateFormData(contactFormSchema, formData);
    
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
      // Disparar el evento ViewContent ANTES de enviar el formulario
      console.log('📋 Formulario de contacto enviado - disparando ViewContent');
      await trackViewContent({
        content_type: 'form_submission',
        content_name: 'Contact Form Submission',
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
        nombre_completo: validData.nombreCompleto,
        email: validData.email,
        telefono: validData.telefono,
        tipo_consulta: validData.tipoConsulta,
        ubicacion: validData.ubicacion,
        nivel_urgencia: validData.nivelUrgencia,
        descripcion_situacion: validData.descripcionSituacion,
        origen: 'Formulario de Consulta Gratuita',
        user_id: trackingIds.user_id,
        session_id: trackingIds.session_id
      };

      // Guardar directamente en Supabase
      console.log('💾 Guardando en Supabase (Contacto)...');
      const { error } = await supabase
        .from('risolvia_form_submissions')
        .insert(submissionData);

      if (error) {
        console.error('❌ Error al guardar en Supabase (Contacto):', error);
        toast({
          title: "Error",
          description: "No se pudo guardar la información. Por favor intente nuevamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Datos guardados correctamente en Supabase (Contacto)');

      toast({
        title: "¡Consulta enviada exitosamente!",
        description: "Nos pondremos en contacto contigo pronto."
      });

      // Limpiar el formulario
      setFormData({
        nombreCompleto: '',
        email: '',
        telefono: '',
        tipoConsulta: '',
        ubicacion: '',
        nivelUrgencia: '',
        descripcionSituacion: ''
      });
    } catch (error) {
      console.error('Error enviando formulario:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu consulta. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header azul con diseño animado */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white py-16 relative overflow-hidden animated-legal-bg transition-colors duration-300">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contáctanos
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Describe tu situación y nos pondremos en contacto contigo con la solución adecuada.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Información de contacto */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Email - movido a la izquierda */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Email</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-1 transition-colors duration-300">team@risolvia.com</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Respuesta en menos de 24 horas</p>
            </div>

            {/* Horarios - permanece a la derecha */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Horarios</h3>
              <p className="text-gray-900 dark:text-white font-medium mb-1 transition-colors duration-300">Lun - Vie: 9:00 - 20:00</p>
              <p className="text-orange-600 dark:text-orange-400 font-medium text-sm transition-colors duration-300">Soporte 24/7</p>
            </div>
          </div>

          {/* Formulario de consulta gratuita con animaciones */}
          <div className="rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-slate-100 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">Consulta directa</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">Si ya tienes clara tu consulta, completa el formulario y te conectaremos con el especialista adecuado para tu caso.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primera fila: Nombre completo y Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Su Nombre Completo *
                  </label>
                  <input 
                    type="text" 
                    value={formData.nombreCompleto} 
                    onChange={(e) => handleInputChange('nombreCompleto', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    placeholder="Su nombre completo" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    placeholder="example@gmail.com" 
                    required 
                  />
                </div>
              </div>

              {/* Segunda fila: Teléfono y Tipo de consulta */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Teléfono *
                  </label>
                  <input 
                    type="tel" 
                    value={formData.telefono} 
                    onChange={(e) => handleInputChange('telefono', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    placeholder="+598 XX XXX XXX" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Tipo de Consulta *
                  </label>
                  <Select value={formData.tipoConsulta} onValueChange={(value) => handleInputChange('tipoConsulta', value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white [&>span]:!text-gray-900 dark:[&>span]:!text-white [&_span]:!text-gray-900 dark:[&_span]:!text-white">
                      <SelectValue placeholder="Seleccione su consulta" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white dark:!bg-gray-700 !border-gray-200 dark:!border-gray-600 rounded-lg shadow-lg z-50 !text-gray-900 dark:!text-white">
                      <SelectItem value="derecho-civil" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Derecho Civil</SelectItem>
                      <SelectItem value="derecho-laboral" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Derecho Laboral</SelectItem>
                      <SelectItem value="derecho-penal" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Derecho Penal</SelectItem>
                      <SelectItem value="derecho-inmobiliario" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Derecho Inmobiliario</SelectItem>
                      <SelectItem value="derecho-familia" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Derecho de Familia</SelectItem>
                      <SelectItem value="derecho-empresarial" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Derecho Empresarial</SelectItem>
                      <SelectItem value="otro" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tercera fila: Ubicación y Nivel de urgencia */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Ubicación *
                  </label>
                  <input 
                    type="text" 
                    value={formData.ubicacion} 
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    placeholder="País, Departamento/Estado" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    Nivel de Urgencia *
                  </label>
                  <Select value={formData.nivelUrgencia} onValueChange={(value) => handleInputChange('nivelUrgencia', value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white [&>span]:!text-gray-900 dark:[&>span]:!text-white [&_span]:!text-gray-900 dark:[&_span]:!text-white">
                      <SelectValue placeholder="¿Qué tan urgente es su caso?" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white dark:!bg-gray-700 !border-gray-200 dark:!border-gray-600 rounded-lg shadow-lg z-50 !text-gray-900 dark:!text-white">
                      <SelectItem value="muy-urgente" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Muy urgente (necesito ayuda hoy)</SelectItem>
                      <SelectItem value="urgente" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Urgente (esta semana)</SelectItem>
                      <SelectItem value="normal" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Normal (este mes)</SelectItem>
                      <SelectItem value="planificacion" className="!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-600 [&>span]:!text-gray-900 dark:[&>span]:!text-white data-[highlighted]:!bg-gray-100 dark:data-[highlighted]:!bg-gray-600 data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-white">Planificación futura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Describe tu situación - ancho completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Describa su situación *
                </label>
                <textarea 
                  rows={4} 
                  value={formData.descripcionSituacion} 
                  onChange={(e) => handleInputChange('descripcionSituacion', e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                  placeholder="Explique su situación con el mayor detalle posible. Esto nos ayudará a conectarte con el especialista más adecuado." 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-orange-500 dark:bg-orange-600 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
              </button>
            </form>
          </div>

          {/* Garantía de Privacidad - Debajo del formulario */}
          <div className="mt-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800 text-center transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">🔒 Garantía de Privacidad</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                Toda la información que compartas con nosotros está protegida por nuestro compromiso de confidencialidad y nuestras políticas de privacidad. Tu consulta inicial es completamente confidencial. Por favor, evita compartir datos sensibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactenos;
