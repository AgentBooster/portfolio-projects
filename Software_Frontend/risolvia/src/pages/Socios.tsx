
import { Building2, Users, TrendingUp, Award, CheckCircle, Star, Shield, Users2, MapPin, Briefcase, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FloatingLegalButton from "../components/FloatingLegalButton";

const Socios = () => {
  const navigate = useNavigate();

  const estadisticas = [
    {
      numero: "50+",
      descripcion: "Empresas Asociadas",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      numero: "5+",
      descripcion: "Años de Colaboración Promedio",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      numero: "1,200+",
      descripcion: "Casos Resueltos en Conjunto",
      color: "text-green-600 dark:text-green-400"
    },
    {
      numero: "95%",
      descripcion: "Tasa de Satisfacción Empresarial",
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  const empresaSocia = {
    nombre: "EGG",
    nombreCompleto: "EGG - Despacho Jurídico",
    sector: "Servicios Jurídicos Especializados",
    descripcion: "Despacho jurídico especializado en brindar soluciones legales integrales para empresas y particulares, con un enfoque profesional y personalizado para cada cliente.",
    ubicacion: "Uruguay",
    rating: "4.9",
    casosResueltos: "800+"
  };

  const estandares = [
    {
      icono: <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      titulo: "Experiencia Comprobada",
      descripcion: "Mínimo 5 años de experiencia empresarial en su área de especialización"
    },
    {
      icono: <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
      titulo: "Excelencia Reconocida",
      descripcion: "Calificación mínima de 4.5 estrellas basada en evaluaciones de clientes"
    },
    {
      icono: <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />,
      titulo: "Certificaciones Vigentes",
      descripcion: "Colegiación activa y formación continua en su área de práctica"
    },
    {
      icono: <Users2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      titulo: "Compromiso Ético",
      descripcion: "Adherencia estricta a códigos de ética profesional y transparencia"
    }
  ];

  const handleContactClick = () => {
    navigate('/contactenos');
    setTimeout(() => {
      // Buscar el formulario específicamente y hacer scroll hacia él
      const formulario = document.querySelector('.rounded-xl.shadow-lg.p-8.border.border-gray-200');
      if (formulario) {
        formulario.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback: scroll a una posición aproximada donde debería estar el formulario
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Botón flotante legal */}
      <FloatingLegalButton />
      
      <div className="container mx-auto px-4 py-16">
        {/* Título y descripción sin cambios */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">
            Nuestros <span className="text-orange-500">Socios</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Empresas con amplia experiencia en el sector que colaboran con nosotros para brindarte el mejor servicio.
          </p>
        </div>

        {/* Estadísticas con banda animada */}
        <div className="relative mb-20 overflow-hidden">
          {/* Banda animada de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-orange-50 to-blue-100 dark:bg-gradient-to-r dark:from-blue-900/20 dark:via-orange-900/10 dark:to-blue-900/20 animate-pulse transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-300/10 to-transparent opacity-50 transition-colors duration-300" 
               style={{
                 animation: 'slide-right 3s ease-in-out infinite'
               }}>
          </div>
          
          {/* Contenido de estadísticas */}
          <div className="relative z-10 py-12 px-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 transition-colors duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {estadisticas.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2 animate-bounce transition-colors duration-300`} style={{
                    animationDelay: `${index * 0.2}s`,
                    animationDuration: '2s'
                  }}>
                    {stat.numero}
                  </div>
                  <div className="text-sm md:text-base text-slate-600 dark:text-gray-300 transition-colors duration-300">
                    {stat.descripcion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Título de sección actualizado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-300">
            Nuestro Mejor Socio
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-300 transition-colors duration-300">
            Organización comprometida con la excelencia y tu éxito empresarial
          </p>
        </div>

        {/* Empresa Socia Única - Tarjeta Mejorada con Borde Dorado - FORZAR MODO CLARO */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-3 border-yellow-400 hover:border-yellow-500 bg-gradient-to-br from-white to-yellow-50/10 dark:bg-gradient-to-br dark:from-gray-800 dark:to-yellow-900/10 transform hover:-translate-y-3 hover:scale-[1.02] !bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 dark:!border-yellow-400 transition-colors duration-300">
            <CardContent className="p-10 !bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 transition-colors duration-300">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Logo Section - Imagen real */}
                <div className="flex-shrink-0 relative">
                  <div className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/dcvqw00tq/image/upload/v1751596092/Disen%CC%83o_sin_ti%CC%81tulo_3_sindb8.jpg" 
                      alt="EGG Logo" 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                    {empresaSocia.nombreCompleto}
                  </h3>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                    <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold flex items-center gap-2 !bg-blue-100 dark:!bg-blue-900/30 !text-blue-700 dark:!text-blue-300 transition-colors duration-300">
                      <Scale className="w-4 h-4" />
                      {empresaSocia.sector}
                    </span>
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold flex items-center gap-2 !bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-300 transition-colors duration-300">
                      <MapPin className="w-4 h-4" />
                      {empresaSocia.ubicacion}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed mb-6 !text-slate-600 dark:!text-gray-300 transition-colors duration-300">
                    {empresaSocia.descripcion}
                  </p>
                  
                  {/* Estadísticas mejoradas */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg !bg-yellow-50 dark:!bg-yellow-900/20 transition-colors duration-300">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-yellow-600 dark:text-yellow-400 !text-yellow-600 dark:!text-yellow-400 transition-colors duration-300">{empresaSocia.rating}</span>
                      <span className="text-slate-500 dark:text-gray-400 text-sm !text-slate-500 dark:!text-gray-400 transition-colors duration-300">Calificación</span>
                    </div>
                    
                    {/* Casos Resueltos */}
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg !bg-green-50 dark:!bg-green-900/20 transition-colors duration-300">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-bold text-green-600 dark:text-green-400 !text-green-600 dark:!text-green-400 transition-colors duration-300">{empresaSocia.casosResueltos}</span>
                      <span className="text-slate-500 dark:text-gray-400 text-sm !text-slate-500 dark:!text-gray-400 transition-colors duration-300">Casos Resueltos</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estándares de Calidad con animaciones mejoradas */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-300">
              Nuestros Estándares de Calidad
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-300 transition-colors duration-300">
              Todas nuestras empresas socias deben cumplir con rigurosos criterios de selección
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {estandares.map((estandar, index) => (
              <div 
                key={index} 
                className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg group-hover:shadow-xl transition-colors duration-300">
                    {estandar.icono}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  {estandar.titulo}
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-sm transition-colors duration-300">
                  {estandar.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Llamada a la Acción con animación mejorada */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:bg-gradient-to-r dark:from-orange-600 dark:to-orange-700 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto text-white relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
                ¿Eres Empresa y Quieres Unirte?
              </h2>
              <p className="text-xl mb-8 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                Si cumples con nuestros estándares de calidad y quieres formar parte de nuestra red de profesionales, 
                nos gustaría conocerte.
              </p>
              <button 
                onClick={handleContactClick}
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-lg transform hover:scale-105 hover:-translate-y-1 active:scale-95"
              >
                Solicitar Información
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-right {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `
      }} />
    </div>
  );
};

export default Socios;
