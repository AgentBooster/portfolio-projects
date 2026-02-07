import React from 'react';
import { MessageCircle, HelpCircle, Calendar, ShieldCheck } from 'lucide-react';

const actionItems = [
  {
    icon: HelpCircle,
    title: 'Resolución de Dudas Frecuentes',
    description: 'Nuestro asistente IA en WhatsApp responde al instante sobre tratamientos, precios y cuidados post-procedimiento, así como información sobre todos los tratamientos disponibles en la clínica.',
  },
  {
    icon: MessageCircle,
    title: 'Asesoramiento Personalizado Experto',
    description: 'Para consultas más complejas o si buscas un plan a medida, nuestro equipo de profesionales se encargará de ofrecerte la mejor orientación y recomendaciones.',
  },
  {
    icon: Calendar,
    title: 'Gestión y Agendamiento de Citas',
    description: 'Con la ayuda de nuestra IA, podrás agendar, modificar o cancelar tus citas de forma rápida y sencilla, ajustándose a tu disponibilidad.',
  },
];

const CTA = ({ openChat }) => {
  const backgroundImageUrl = 'https://www.everwallpaper.co.uk/cdn/shop/products/wall-murals-for-living-rooms_2d215d43-6668-4a8a-bb08-d1d0ed3c6c6f.jpg?v=1739781557';

  return (
    <section 
      id="contacto" 
      className="relative py-24 sm:py-32 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-estetia-primary/70"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tu camino hacia la belleza y bienestar, ahora más fácil
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/90">
              Con nuestro canal de WhatsApp, potenciado por Inteligencia Artificial y el respaldo de profesionales, resolverás cualquier necesidad.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {actionItems.map((item) => (
              <div key={item.title} className="bg-white/50 backdrop-blur-lg shadow-2xl rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-estetia-accent/10 mb-6">
                  <item.icon className="h-7 w-7 text-estetia-accent" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold leading-7 text-estetia-dark">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-gray-600 flex-grow">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <p className="text-lg leading-8 text-white">
              En Estetia, integramos la última tecnología para ofrecerte una experiencia superior. Nuestro asistente IA en WhatsApp garantiza respuestas rápidas y eficientes para tus consultas más comunes.
            </p>
            <div className="flex items-center gap-3 text-white">
                  <ShieldCheck className="h-6 w-6 opacity-80" />
                  <span className="font-medium">Tu privacidad y seguridad están garantizadas bajo estándares europeos GDPR.</span>
            </div>
          </div>

          <div className="mt-16">
            <button
              onClick={openChat}
              className="inline-flex items-center justify-center rounded-full bg-green-500 px-10 py-4 text-base font-semibold text-white shadow-2xl transition-transform duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.4 16.88L2.06 22L7.32 20.64C8.81 21.39 10.4 21.81 12.04 21.81C17.5 21.81 21.95 17.36 21.95 11.9C21.95 9.25 20.94 6.78 19.21 4.96C17.38 3.13 14.81 2 12.04 2M12.04 3.62C16.53 3.62 20.24 7.33 20.24 11.9C20.24 16.47 16.53 20.18 12.04 20.18C10.56 20.18 9.14 19.81 7.89 19.14L7.5 18.93L4.91 19.61L5.6 17.08L5.38 16.69C4.66 15.3 4.26 13.63 4.26 11.91C4.26 7.33 7.97 3.62 12.04 3.62M16.95 14.48C16.71 14.48 15.5 13.89 15.27 13.8C15.03 13.71 14.86 13.66 14.69 13.91C14.53 14.15 14.04 14.74 13.87 14.9C13.71 15.07 13.54 15.12 13.29 15.03C13.05 14.94 12.21 14.65 11.22 13.76C10.44 13.08 9.92 12.25 9.75 12C9.58 11.75 9.75 11.61 9.89 11.47C10.02 11.33 10.18 11.12 10.33 10.95C10.48 10.78 10.53 10.65 10.44 10.5C10.36 10.35 9.98 9.36 9.81 8.94C9.65 8.52 9.48 8.58 9.35 8.58C9.22 8.58 9.05 8.58 8.88 8.58C8.71 8.58 8.46 8.62 8.24 8.87C8.03 9.11 7.54 9.59 7.54 10.7C7.54 11.81 8.27 12.89 8.39 13.06C8.52 13.23 9.97 15.55 12.23 16.46C12.87 16.73 13.33 16.9 13.68 17.03C14.24 17.22 14.73 17.18 15.09 16.82C15.49 16.41 16.2 15.54 16.37 15.29C16.54 15.04 16.69 14.95 16.84 14.95C16.99 14.95 17.18 14.95 17.35 14.95H16.95Z" />
              </svg>
              Escribe a nuestro equipo por WhatsApp
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;
