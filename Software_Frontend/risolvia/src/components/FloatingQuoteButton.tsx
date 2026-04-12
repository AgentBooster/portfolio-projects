
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FloatingButton from "./FloatingButton";
import QuoteForm from "./QuoteForm";

const FloatingQuoteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const location = useLocation();

  // Comunicar el estado del formulario al body para ocultar la navbar
  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-form-open', 'true');
    } else {
      document.body.removeAttribute('data-form-open');
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.body.removeAttribute('data-form-open');
    };
  }, [isOpen]);

  // Detectar rutas donde el botón debe aparecer y lógica de scroll
  useEffect(() => {
    const allowedRoutes = ['/', '/soluciones'];
    const isAllowedRoute = allowedRoutes.includes(location.pathname);
    
    if (!isAllowedRoute) {
      setShouldShow(false);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Detección mejorada del footer - más agresiva, especialmente para móvil
      const footerThreshold = window.innerWidth <= 768 ? 500 : 400; // Más threshold en móvil
      const isNearFooter = scrollPosition + windowHeight >= documentHeight - footerThreshold;
      
      let shouldHide = isNearFooter;
      
      // Lógica específica para cada página
      if (location.pathname === '/') {
        // En la página de inicio, ocultar en la segunda sección (robot + agente)
        const segundaSeccion = document.querySelector('.carbon-fiber-bg');
        if (segundaSeccion) {
          const rect = segundaSeccion.getBoundingClientRect();
          const isInSegundaSeccion = rect.top <= windowHeight && rect.bottom >= 0;
          shouldHide = shouldHide || isInSegundaSeccion;
        }
        
        // También detectar específicamente la sección de Contáctenos en el footer
        const contactSection = document.querySelector('footer');
        if (contactSection) {
          const contactRect = contactSection.getBoundingClientRect();
          const isNearContact = contactRect.top <= windowHeight + 100; // Ocultar 100px antes
          shouldHide = shouldHide || isNearContact;
        }
      } else if (location.pathname === '/soluciones') {
        // En la página de soluciones, buscar la sección "¿No encuentras tu caso específico?"
        const h2Elements = Array.from(document.querySelectorAll('h2'));
        const consultaSection = h2Elements.find(h2 => 
          h2.textContent?.includes('¿No encuentras tu caso específico?')
        );
        
        if (consultaSection) {
          const sectionContainer = consultaSection.closest('div');
          if (sectionContainer) {
            const containerRect = sectionContainer.getBoundingClientRect();
            const isInConsultaSection = containerRect.top <= windowHeight && containerRect.bottom >= 0;
            shouldHide = shouldHide || isInConsultaSection;
          }
        }
      }
      
      setShouldShow(!shouldHide);
    };

    // Ejecutar inmediatamente para rutas permitidas
    setShouldShow(true);
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleOverlayClick = () => {
    console.log('Overlay clicked - closing form');
    setIsOpen(false);
  };

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Botón flotante - se oculta cuando el formulario está abierto o cuando shouldShow es false */}
      {!isOpen && shouldShow && (
        <div className="transition-opacity duration-300 ease-in-out">
          <FloatingButton onClick={() => setIsOpen(true)} />
        </div>
      )}

      {/* Formulario lateral */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex"
          onClick={handleOverlayClick}
        >
          <QuoteForm 
            onClose={() => setIsOpen(false)}
            onFormClick={handleFormClick}
          />
        </div>
      )}
    </>
  );
};

export default FloatingQuoteButton;
