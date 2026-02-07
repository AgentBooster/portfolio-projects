import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, CalendarPlus, Info, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

function WhatsAppWidget({
  isOpen,
  setIsOpen,
  isCTAInView,
  phoneNumber = '34600000000',
  message = '¡Hola! Vengo de la web de Estetia y me gustaría solicitar más información.'
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setIsChecked(false);
    }
  }, [isOpen]);

  const openChat = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const buttonVisibilityClass = isCTAInView ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100';
  const buttonClass = `bg-green-500 text-white rounded-full p-3.5 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform ${buttonVisibilityClass}`;

  const animationClass = isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up';

  // Se define la ruta base directamente en la URL del enlace
  const privacyPolicyUrl = "/estetia/politica-de-privacidad.html";

  return (
    <>
      {!isOpen && !isClosing && (
        <button onClick={openChat} className={`fixed bottom-6 right-6 z-50 ${buttonClass}`} aria-label="Abrir chat de WhatsApp">
          <FaWhatsapp size={32} />
        </button>
      )}

      {(isOpen || isClosing) && (
        <div className={`fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm font-sans z-50 ${animationClass}`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden">
            
            <header className="bg-estetia-accent text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageCircle size={24} />
                <h3 className="font-bold text-lg">Estetia Chat</h3>
              </div>
              <button onClick={closeChat} className="p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Cerrar chat">
                <X size={20} />
              </button>
            </header>

            <main className="p-5 flex flex-col gap-4 bg-slate-200">
              {/* ... Contenido del main ... */}
              <div className="bg-white p-4 rounded-xl shadow-sm self-start w-full">
                <h4 className="font-bold text-gray-800 text-md">Tu canal directo con Estetia</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Bienvenido/a. Estás a un mensaje de recibir atención personalizada. Escríbenos y te responderemos lo antes posible.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 text-sm text-gray-700">
                 <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-estetia-accent" />
                    <span>Conocer nuestros tratamientos</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CalendarPlus className="h-5 w-5 text-estetia-accent" />
                    <span>Agendar una cita de valoración</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-estetia-accent" />
                    <span>Consultar con un especialista</span>
                 </div>
              </div>
            </main>

            <footer className="p-5 border-t border-slate-300 bg-slate-200">
               <div className="flex items-start gap-3">
                 <input 
                    type="checkbox"
                    id="privacy-check"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="mt-1 h-4 w-4 rounded border-gray-400 text-estetia-accent focus:ring-estetia-accent"
                 />
                 <label htmlFor="privacy-check" className="text-xs text-gray-700">
                    Acepto la {/* AHORA ES UNA ETIQUETA <a> NORMAL */}
                    <a 
                      href={privacyPolicyUrl}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline hover:text-estetia-accent"
                    >
                      Política de Privacidad
                    </a> y el tratamiento de mis datos.
                    <span className="block mt-2 text-gray-600/90">
                      <strong className="block mb-1 text-gray-700">Información básica sobre protección de datos:</strong>
                      <strong>Responsable:</strong> Estetia.<br/>
                      <strong>Finalidad:</strong> Atender tu solicitud.<br/>
                      <strong>Base legal:</strong> Tu consentimiento.<br/>
                      <strong>Derechos:</strong> Puedes ejercer tus derechos en <a href="mailto:privacidad@estetia.com" className="underline hover:text-estetia-accent">privacidad@estetia.com</a>.
                    </span>
                 </label>
               </div>
               
               <a
                 href={whatsappUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 font-bold text-white rounded-lg transition-all duration-300 ${ 
                    isChecked 
                    ? 'bg-estetia-accent hover:brightness-95 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'bg-slate-400 cursor-not-allowed'
                 }`}
                 onClick={(e) => !isChecked && e.preventDefault()}
                 aria-disabled={!isChecked}
               >
                 Abrir WhatsApp
                 <Send size={18} />
               </a>
            </footer>

          </div>
        </div>
      )}
    </>
  );
}

export default WhatsAppWidget;
