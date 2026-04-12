import { Scale, Home, Users, FileText, Briefcase, Shield, Building2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingQuoteButton from "../components/FloatingQuoteButton";
import FloatingLegalButton from "../components/FloatingLegalButton";
const Soluciones = () => {
  const navigate = useNavigate();
  const handleConsultaPersonalizadaClick = () => {
    navigate('/');
    // Hacer scroll a la segunda sección donde está el agente
    setTimeout(() => {
      const segundaSeccion = document.querySelector('.carbon-fiber-bg');
      if (segundaSeccion) {
        // Scroll al final de la sección donde está el agente
        const agentContainer = segundaSeccion.querySelector('#deployment-96341634-7e25-4477-94f5-0e543c770f46');
        if (agentContainer) {
          agentContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          // Fallback: scroll hacia el final de la segunda sección
          segundaSeccion.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }
      }
    }, 100);
  };
  const servicios = [{
    icon: Scale,
    titulo: "Derecho Civil",
    descripcion: "Contratos, disputas patrimoniales, responsabilidad civil y más.",
    especialidades: ["Contratos", "Propiedad", "Daños y perjuicios", "Sucesiones"],
    color: "from-blue-500 to-blue-600",
    hoverColor: "from-blue-600 to-blue-700",
    bgGradient: "from-blue-50 to-blue-100",
    darkBgGradient: "dark:from-blue-900/20 dark:to-blue-800/20",
    borderColor: "border-blue-200 dark:border-blue-700"
  }, {
    icon: Briefcase,
    titulo: "Derecho Laboral",
    descripcion: "Despidos, acoso laboral, reclamaciones salariales y derechos del trabajador.",
    especialidades: ["Despidos", "Acoso laboral", "Reclamaciones", "Contratos laborales"],
    color: "from-emerald-500 to-emerald-600",
    hoverColor: "from-emerald-600 to-emerald-700",
    bgGradient: "from-emerald-50 to-emerald-100",
    darkBgGradient: "dark:from-emerald-900/20 dark:to-emerald-800/20",
    borderColor: "border-emerald-200 dark:border-emerald-700"
  }, {
    icon: Shield,
    titulo: "Derecho Penal",
    descripcion: "Defensa en procesos penales, denuncias y asesoramiento legal.",
    especialidades: ["Defensa penal", "Medidas cautelares", "Denuncias", "Recursos"],
    color: "from-purple-500 to-purple-600",
    hoverColor: "from-purple-600 to-purple-700",
    bgGradient: "from-purple-50 to-purple-100",
    darkBgGradient: "dark:from-purple-900/20 dark:to-purple-800/20",
    borderColor: "border-purple-200 dark:border-purple-700"
  }, {
    icon: Home,
    titulo: "Derecho Inmobiliario",
    descripcion: "Compraventa, arrendamientos, hipotecas y problemas con propiedades.",
    especialidades: ["Compraventa", "Hipotecas", "Arrendamientos", "Comunidades"],
    color: "from-orange-500 to-orange-600",
    hoverColor: "from-orange-600 to-orange-700",
    bgGradient: "from-orange-50 to-orange-100",
    darkBgGradient: "dark:from-orange-900/20 dark:to-orange-800/20",
    borderColor: "border-orange-200 dark:border-orange-700"
  }, {
    icon: Heart,
    titulo: "Derecho de Familia",
    descripcion: "Divorcios, custodia, pensiones alimenticias y adopciones.",
    especialidades: ["Divorcios", "Pensiones", "Custodia", "Adopciones"],
    color: "from-red-500 to-red-600",
    hoverColor: "from-red-600 to-red-700",
    bgGradient: "from-red-50 to-red-100",
    darkBgGradient: "dark:from-red-900/20 dark:to-red-800/20",
    borderColor: "border-red-200 dark:border-red-700"
  }, {
    icon: Building2,
    titulo: "Derecho Empresarial",
    descripcion: "Constitución de empresas, contratos comerciales y asesoramiento corporativo.",
    especialidades: ["Constitución", "Fusiones", "Contratos", "Compliance"],
    color: "from-indigo-500 to-indigo-600",
    hoverColor: "from-indigo-600 to-indigo-700",
    bgGradient: "from-indigo-50 to-indigo-100",
    darkBgGradient: "dark:from-indigo-900/20 dark:to-indigo-800/20",
    borderColor: "border-indigo-200 dark:border-indigo-700"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Ambos botones flotantes */}
      <FloatingQuoteButton />
      <FloatingLegalButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">
            Nuestras <span className="text-orange-500">Soluciones</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Ofrecemos asistencia especializada para resolver tus problemas con la experiencia y confianza que mereces, conectándote con profesionales altamente calificados: abogados, notarios, peritos, asesores fiscales, agentes inmobiliarios y mediadores, entre otros expertos según tu necesidad.
          </p>
        </div>

        {/* Sección rediseñada de servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {servicios.map((servicio, index) => {
          const IconComponent = servicio.icon;
          return <div key={index} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-0 border-2 ${servicio.borderColor} group overflow-hidden transform hover:scale-105 hover:-translate-y-2`}>
                {/* Fondo gradient animado */}
                <div className={`absolute inset-0 bg-gradient-to-br ${servicio.bgGradient} ${servicio.darkBgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Contenido principal */}
                <div className="relative z-10 p-8">
                  {/* Header con icono */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${servicio.color} group-hover:${servicio.hoverColor} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-pulse" />
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-slate-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {servicio.titulo}
                  </h3>
                  
                  {/* Descripción */}
                  <p className="text-slate-600 dark:text-gray-300 group-hover:text-slate-700 dark:group-hover:text-gray-200 leading-relaxed mb-6 transition-colors duration-300">
                    {servicio.descripcion}
                  </p>
                  
                  {/* Áreas de especialización */}
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 group-hover:text-slate-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                      Áreas de especialización:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {servicio.especialidades.map((especialidad, idx) => <div key={idx} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${servicio.color} group-hover:animate-pulse`} />
                          <span className="text-xs text-slate-600 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                            {especialidad}
                          </span>
                        </div>)}
                    </div>
                  </div>
                </div>
                
                {/* Efecto de brillo animado */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white dark:via-gray-300 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
              </div>;
        })}
        </div>

        {/* Sección de caso específico */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl p-8 max-w-2xl mx-auto border border-slate-200 dark:border-gray-700 group transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <div className="relative">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-slate-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                ¿No encuentras tu caso específico?
              </h2>
              <p className="text-slate-600 dark:text-gray-300 mb-6 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                Contamos con un equipo diverso de especialistas. Describe tu situación y te conectaremos 
                con el profesional adecuado.
              </p>
              <button onClick={handleConsultaPersonalizadaClick} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-110 group-hover:shadow-2xl">Consulta Javier Personalizada</button>
              
              {/* Indicador de disponibilidad */}
              <div className="flex items-center justify-center space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-600 dark:text-gray-400">Especialistas disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Soluciones;