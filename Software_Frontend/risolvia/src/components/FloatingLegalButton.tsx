
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const FloatingLegalButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const legalPhrases = [
    "Problema con un contrato?",
    "Duda sobre alquiler o venta?", 
    "Consulta por trabajo o despido?",
    "Necesitas asesoría ya?",
    "Herencias o sucesiones?",
    "Accidentes o temas familiares?",
    "Notificación del juzgado?"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);
  const [showWithDelay, setShowWithDelay] = useState(false);

  // Función para redirigir al agente específicamente
  const scrollToAgent = () => {
    // Si no estamos en la página de inicio, navegar primero
    if (location.pathname !== '/') {
      navigate('/');
      // Usar un timeout más largo para asegurar que la página se cargue
      setTimeout(() => {
        const agentContainer = document.querySelector('#deployment-96341634-7e25-4477-94f5-0e543c770f46');
        if (agentContainer) {
          agentContainer.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        } else {
          // Fallback: buscar en la segunda sección
          const segundaSeccion = document.querySelector('.carbon-fiber-bg');
          if (segundaSeccion) {
            segundaSeccion.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }
        }
      }, 500);
      return;
    }
    
    // Si ya estamos en la página de inicio, buscar el agente inmediatamente
    setTimeout(() => {
      const agentContainer = document.querySelector('#deployment-96341634-7e25-4477-94f5-0e543c770f46');
      if (agentContainer) {
        agentContainer.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } else {
        // Fallback: buscar en la segunda sección
        const segundaSeccion = document.querySelector('.carbon-fiber-bg');
        if (segundaSeccion) {
          segundaSeccion.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }
    }, 100);
  };

  // Detectar si estamos en la página de contacto
  useEffect(() => {
    if (location.pathname === '/contactenos') {
      setShouldShow(false);
    } else {
      setShouldShow(true);
    }
  }, [location.pathname]);

  // Manejar delay de 3 segundos solo en la página de inicio
  useEffect(() => {
    if (location.pathname === '/') {
      // Siempre empezar oculto en la página de inicio
      setShowWithDelay(false);
      const timer = setTimeout(() => {
        setShowWithDelay(true);
      }, 3000); // 3 segundos de delay
      return () => clearTimeout(timer);
    } else {
      // En otras páginas, mostrar inmediatamente
      setShowWithDelay(true);
    }
  }, [location.pathname]);

  // Detectar scroll para ocultar en footer y secciones específicas
  useEffect(() => {
    if (location.pathname === '/contactenos') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Detección mejorada del footer - más agresiva, especialmente para móvil
      const footerThreshold = window.innerWidth <= 768 ? 500 : 400; // Más threshold en móvil
      const isInFooter = scrollPosition + windowHeight >= documentHeight - footerThreshold;
      
      let isInHiddenSection = false;
      
      // Detectar específicamente el footer en todas las páginas
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        const isNearFooter = footerRect.top <= windowHeight + 100; // Ocultar 100px antes del footer
        isInHiddenSection = isInHiddenSection || isNearFooter;
      }
      
      // Solo en la página de inicio, ocultar en secciones específicas
      if (location.pathname === '/') {
        // Detectar la segunda sección (robot + agente) y secciones posteriores
        const segundaSeccion = document.querySelector('.carbon-fiber-bg');
        if (segundaSeccion) {
          const rect = segundaSeccion.getBoundingClientRect();
          const isInSegundaSeccion = rect.top <= windowHeight && rect.bottom >= 0;
          
          // También ocultar en todas las secciones después de la primera
          const firstSectionHeight = window.innerHeight; // Asumiendo que la primera sección es viewport height
          const isAfterFirstSection = scrollPosition > firstSectionHeight * 0.8;
          
          isInHiddenSection = isInHiddenSection || isInSegundaSeccion || isAfterFirstSection;
        }
      }
      
      setShouldShow(!isInFooter && !isInHiddenSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar una vez al montar

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const currentPhrase = legalPhrases[currentPhraseIndex];
    
    if (isTyping) {
      if (charIndex < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 50); // Más fluido
        return () => clearTimeout(timeout);
      } else {
        // Pausa después de escribir completamente
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 30); // Borrado más rápido y fluido
        return () => clearTimeout(timeout);
      } else {
        // Cambiar a la siguiente frase
        const timeout = setTimeout(() => {
          setCurrentPhraseIndex((prevIndex) => 
            prevIndex === legalPhrases.length - 1 ? 0 : prevIndex + 1
          );
          setIsTyping(true);
        }, 300);
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, isTyping, currentPhraseIndex, legalPhrases]);

  const shouldDisplay = showWithDelay && shouldShow;

  return (
    <button
      onClick={scrollToAgent}
      className={`fixed bottom-20 sm:bottom-16 left-1/2 z-40 
                 bg-gray-900 hover:bg-gray-800 text-white 
                 px-4 py-3 rounded-full shadow-xl hover:shadow-2xl 
                 flex items-center gap-3 
                 hover:scale-105
                 w-72 sm:w-96
                 font-normal text-sm
                 border border-gray-700
                 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                 transition-[opacity,transform,filter,shadow]
                 ${shouldDisplay 
                   ? 'pointer-events-auto translate-y-0 scale-100 opacity-100 blur-none shadow-xl' 
                   : 'pointer-events-none translate-y-20 rotate-12 scale-75 opacity-0 blur-sm shadow-none'
                 }`}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transform: 'translateX(-50%)',
        transformOrigin: 'center bottom',
      }}
    >
      <span className="flex-1 text-left h-5 flex items-center overflow-hidden">
        <span className="whitespace-nowrap">
          {displayText}
          <span className="animate-pulse text-gray-400">|</span>
        </span>
      </span>
      <div className="w-7 h-7 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0">
        <ArrowUp className="w-4 h-4 text-gray-900" />
      </div>
    </button>
  );
};

export default FloatingLegalButton;
