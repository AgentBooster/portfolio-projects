
import { Hero } from "../components/ui/animated-hero";
import { User, Clock, Shield, Search, FileText, Phone, Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import FloatingQuoteButton from "../components/FloatingQuoteButton";
import FloatingLegalButton from "../components/FloatingLegalButton";
import { useMetaPixel } from "../hooks/useMetaPixel";
import ChatWidget from "../components/ChatWidget";

const Index = () => {
  // REFERENCIA para la segunda sección (agente)
  const segundaSeccionRef = useRef<HTMLDivElement>(null);
  const [hasTrackedViewContent, setHasTrackedViewContent] = useState(false);

  // Función para hacer scroll suave al final de la segunda sección (donde está el agente)
  const scrollToSecondSection = () => {
    if (segundaSeccionRef.current) {
      // Buscar el contenedor del agente específicamente
      const agentContainer = segundaSeccionRef.current.querySelector('#deployment-96341634-7e25-4477-94f5-0e543c770f46');
      if (agentContainer) {
        agentContainer.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } else {
        // Fallback: scroll hacia el final de la segunda sección
        segundaSeccionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }
    }
  };


  const { trackViewContent } = useMetaPixel();

  // Track page view with Meta Pixel when component mounts
  useEffect(() => {
    console.log('🏠 Index page mounted - tracking PageView');
    trackViewContent();
  }, [trackViewContent]);

  // Observador específico para trackear ViewContent cuando se ve la segunda sección
  useEffect(() => {
    const viewContentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedViewContent) {
          console.log('🎯 Segunda sección visible - disparando ViewContent');
          
          // Pequeño delay para asegurar que realmente se vio la sección
          setTimeout(() => {
            trackViewContent({
              content_type: 'ai_agent_section',
              content_name: 'Legal Agent Interaction',
              content_category: 'AI Legal Assistant Visualization',
              value: 1.00,
              currency: 'USD'
            });
            setHasTrackedViewContent(true);
          }, 500);
        }
      },
      {
        threshold: 0.3, // Se dispara cuando 30% de la sección es visible
        rootMargin: '-50px' // Margen negativo para asegurar que realmente se está viendo
      }
    );

    // Observar específicamente la segunda sección
    const secondSection = document.querySelector('section[class*="carbon-fiber-bg"]');
    if (secondSection && !hasTrackedViewContent) {
      viewContentObserver.observe(secondSection);
    }

    return () => {
      viewContentObserver.disconnect();
    };
  }, [hasTrackedViewContent, trackViewContent]);

  return (
    <div className="min-h-screen">
      {/* Botón flotante de cotización */}
      <FloatingQuoteButton />

      {/* Nuevo botón flotante legal */}
      <FloatingLegalButton />

      {/* Hero Section - Animated */}
      <Hero />

      {/* --- SECCIÓN del agente (sin robot) --- */}
      <section ref={segundaSeccionRef} className="carbon-fiber-bg relative pt-[280px] pb-[480px]">
        <div className="container mx-auto px-4">
          {/* Título mejorado para la sección del agente */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-pulse">
              Consulta con Javier
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
              <span className="text-blue-300 font-semibold">Tu asistente legal inteligente</span> está aquí 24/7 para ayudarte con tus consultas de forma rápida y profesional
            </p>
          </div>
          
          {/* Widget de chat - Pega tu código completo en src/components/ChatWidget.tsx */}
          <div className="flex justify-center w-full">
            <ChatWidget />
          </div>
        </div>
      </section>

      {/* Sección "¿Por qué elegirnos?" - Animaciones optimizadas */}
      <section className="bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-4 transition-colors duration-300">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto transition-colors duration-300">
            Simplificamos el acceso a soluciones legales conectando a personas con personal especializado y más cercano, adaptado a tu caso y garantizando un proceso personalizado y confiable.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Conexión Personalizada - Animación optimizada */}
            <div className="bg-slate-50 dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-slate-100 dark:border-gray-700 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900 dark:hover:to-blue-800 hover:border-blue-200 dark:hover:border-blue-600">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">
                <User className="w-8 h-8 text-blue-500 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">Conexión Personalizada</h3>
              <p className="text-slate-600 dark:text-gray-300 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                Te conectamos con personal especializado en el área que necesites y más próximo a tu ubicación, garantizando accesibilidad y una experiencia adecuada para tu caso único.
              </p>
            </div>
            {/* Respuesta Rápida - Animación optimizada */}
            <div className="bg-slate-50 dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-slate-100 dark:border-gray-700 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900 dark:hover:to-orange-800 hover:border-orange-200 dark:hover:border-orange-600">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 mb-6 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors duration-300">
                <Clock className="w-8 h-8 text-orange-500 dark:text-orange-300 group-hover:text-orange-600 dark:group-hover:text-orange-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">Respuesta Rápida</h3>
              <p className="text-slate-600 dark:text-gray-300 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                Dejando tus datos, analizamos tu caso y te contactamos en menos de 24 horas con orientación experta y trato humano para que recibas solución sin esperas.
              </p>
            </div>
            {/* Proceso Confiable - Animación optimizada */}
            <div className="bg-slate-50 dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-slate-100 dark:border-gray-700 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900 dark:hover:to-emerald-800 hover:border-emerald-200 dark:hover:border-emerald-600">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mb-6 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors duration-300">
                <Shield className="w-8 h-8 text-green-500 dark:text-green-300 group-hover:text-green-600 dark:group-hover:text-green-200 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">Proceso Confiable</h3>
              <p className="text-slate-600 dark:text-gray-300 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                Todos nuestros equipos han sido verificados, cuentan con experiencia comprobada y garantizan confidencialidad, profesionalismo y un acompañamiento seguro en cada paso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección de pasos - Sin cambios (ya está optimizada) */}
      <section className="bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 dark:text-white mb-4 transition-colors duration-300">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto transition-colors duration-300">Un proceso simple y transparente para obtener la solución que necesitas</p>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Paso 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-blue-600 dark:group-hover:bg-blue-500 cursor-pointer">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Search className="w-3 h-3 text-blue-500 dark:text-blue-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white transition-colors duration-300">Analizamos tu consulta</h3>
              <p className="text-slate-600 dark:text-gray-300 transition-colors duration-300">
                Cuéntanos tu situación legal de forma sencilla. Nuestro equipo analizará tu caso de inmediato.
              </p>
            </div>
            {/* Paso 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-full bg-orange-500 dark:bg-orange-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-orange-600 dark:group-hover:bg-orange-500 cursor-pointer">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <FileText className="w-3 h-3 text-orange-500 dark:text-orange-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white transition-colors duration-300">Deja tus datos y el caso</h3>
              <p className="text-slate-600 dark:text-gray-300 transition-colors duration-300">
                Completa tu nombre y número de contacto para que podamos comunicarnos contigo rápidamente.
              </p>
            </div>
            {/* Paso 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 cursor-pointer">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Phone className="w-3 h-3 text-emerald-500 dark:text-emerald-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white transition-colors duration-300">El equipo se contacta contigo</h3>
              <p className="text-slate-600 dark:text-gray-300 transition-colors duration-300">
                Nuestro equipo legal te llamará para resolver tus dudas y acompañarte en todo el proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE CTA ANIMADA Y MEJORADA --- */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white animate-fade-in animate-scale-in transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] hover:from-blue-700 hover:to-blue-900 hover:-translate-y-2 hover:bg-gradient-to-br cursor-pointer group relative overflow-hidden animated-legal-bg" style={{
        animation: "fade-in 0.7s cubic-bezier(.4,0,.2,1), scale-in 0.5s cubic-bezier(.4,0,.2,1)"
      }}>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in group-hover:scale-105 transition-transform duration-300" style={{
            animationDelay: "0.2s",
            animationFillMode: "backwards"
          }}>
              ¿Necesitas ayuda hoy?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in group-hover:opacity-100 transition-opacity duration-300" style={{
            animationDelay: "0.3s",
            animationFillMode: "backwards"
          }}>
              No dejes que un problema legal se convierta en algo mayor. Obtén la orientación profesional que necesitas ahora mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{
            animationDelay: "0.4s",
            animationFillMode: "backwards"
          }}>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group-hover:scale-110 group-hover:shadow-2xl" onClick={scrollToSecondSection}>
                <Send className="w-5 h-5" />
                <span>Consulta Javier</span>
              </button>
              <div className="flex items-center space-x-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full group-hover:animate-pulse" />
                <span>Respuesta priorizada por el equipo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
