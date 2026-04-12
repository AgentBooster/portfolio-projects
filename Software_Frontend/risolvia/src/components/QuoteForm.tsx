
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuoteForm } from "@/hooks/useQuoteForm";
interface QuoteFormProps {
  onClose: () => void;
  onFormClick: (e: React.MouseEvent) => void;
}
const QuoteForm = ({
  onClose,
  onFormClick
}: QuoteFormProps) => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useQuoteForm();
  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      onClose();
    }
  };
  return <div className="bg-white dark:bg-slate-800 shadow-2xl w-96 h-full overflow-y-auto border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-out" onClick={onFormClick}>
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Solicitar Cotización
        </h2>
        <button onClick={onClose} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Formulario */}
      <div className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Su Nombre Completo *
            </label>
            <input type="text" value={formData.nombreCompleto} onChange={e => handleInputChange('nombreCompleto', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400" placeholder="Su nombre completo" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Email *
            </label>
            <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400" placeholder="example@gmail.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Teléfono *
            </label>
            <input type="tel" value={formData.telefono} onChange={e => handleInputChange('telefono', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400" placeholder="+34 XXX XXX XXX" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Tipo de Consulta *
            </label>
            <Select value={formData.tipoConsulta} onValueChange={value => handleInputChange('tipoConsulta', value)}>
              <SelectTrigger className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white [&>span]:text-gray-900 dark:[&>span]:text-white [&_span]:text-gray-900 dark:[&_span]:text-white">
                <SelectValue placeholder="Seleccione su consulta" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-50 text-gray-900 dark:text-white">
                <SelectItem value="derecho-civil" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Derecho Civil</SelectItem>
                <SelectItem value="derecho-laboral" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Derecho Laboral</SelectItem>
                <SelectItem value="derecho-penal" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Derecho Penal</SelectItem>
                <SelectItem value="derecho-inmobiliario" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Derecho Inmobiliario</SelectItem>
                <SelectItem value="derecho-familia" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Derecho de Familia</SelectItem>
                <SelectItem value="derecho-empresarial" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Derecho Empresarial</SelectItem>
                <SelectItem value="otro" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Ubicación *
            </label>
            <input type="text" value={formData.ubicacion} onChange={e => handleInputChange('ubicacion', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400" placeholder="País, Departamento/Estado" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Nivel de Urgencia *
            </label>
            <Select value={formData.nivelUrgencia} onValueChange={value => handleInputChange('nivelUrgencia', value)}>
              <SelectTrigger className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white [&>span]:text-gray-900 dark:[&>span]:text-white [&_span]:text-gray-900 dark:[&_span]:text-white">
                <SelectValue placeholder="¿Qué tan urgente es su caso?" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-50 text-gray-900 dark:text-white">
                <SelectItem value="muy-urgente" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Muy urgente (necesito ayuda hoy)</SelectItem>
                <SelectItem value="urgente" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Urgente (esta semana)</SelectItem>
                <SelectItem value="normal" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Normal (este mes)</SelectItem>
                <SelectItem value="planificacion" className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600 [&>span]:text-gray-900 dark:[&>span]:text-white data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-slate-600 data-[highlighted]:text-gray-900 dark:data-[highlighted]:text-white">Planificación futura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Describa su situación *
            </label>
            <textarea rows={3} value={formData.descripcionSituacion} onChange={e => handleInputChange('descripcionSituacion', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400" placeholder="Explique su situación..." required />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            {isSubmitting ? 'Enviando...' : 'Enviar Ahora'}
          </button>

          {/* Descripción de privacidad */}
          <p className="text-xs text-gray-500 dark:text-slate-400 text-center mt-3 leading-relaxed">Al enviar este formulario, acepta ser contactado. Consulte nuestras políticas de privacidad.</p>
        </form>
      </div>
    </div>;
};
export default QuoteForm;
