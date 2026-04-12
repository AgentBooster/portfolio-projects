import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const Agentes = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 300;
      navRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const categories = [
    { key: 'all', label: 'Todos los Agentes' },
    { key: 'Servicio al Cliente', label: 'Servicio al Cliente' },
    { key: 'Operaciones', label: 'Operaciones' },
    { key: 'Recursos Humanos', label: 'Recursos Humanos' },
    { key: 'Legal', label: 'Legal' },
    { key: 'Ventas', label: 'Ventas' },
    { key: 'Marketing', label: 'Marketing' },
    { key: 'Finanzas', label: 'Finanzas' },
    { key: 'Tecnología de la Información', label: 'Tecnología de la Información' },
    { key: 'Servicios Públicos', label: 'Servicios Públicos' },
    { key: 'Obtención', label: 'Obtención' },
    { key: 'Facturación', label: 'Facturación' },
  ];

  const agents = [
    {
      category: 'Servicio al Cliente',
      title: 'Soporte Personalizado',
      description: 'Responde consultas sobre productos, pedidos y más, accediendo a bases de datos para mejorar la satisfacción del cliente.',
    },
    {
      category: 'Operaciones',
      title: 'Programación de Reuniones',
      description: 'Automatiza la programación de reuniones, coordina calendarios y reduce conflictos para optimizar el flujo operativo.',
    },
    {
      category: 'Legal',
      title: 'Generación de Leads',
      description: 'Resuelve dudas legales, califica leads potenciales y genera oportunidades de negocio para el sector jurídico.',
    },
    {
      category: '?',
      title: 'Próximamente',
      description: '...',
    },
  ];

  const filteredAgents = activeFilter === 'all' 
    ? agents 
    : agents.filter(agent => agent.category === activeFilter || agent.category === '?');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Hero Section */}
        <section className="text-center pt-24 sm:pt-32 pb-12">
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">
            tienda de agentes
          </p>
        </section>

        {/* Category Navigation Bar */}
        <div className="relative w-full">
          <div className="border-y border-border flex items-center">
            {/* Left Scroll Button */}
            <button 
              onClick={() => scrollNav('left')}
              className="p-2 absolute left-0 bg-gradient-to-r from-background to-transparent z-10 h-full"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>

            {/* Scrollable Navigation */}
            <nav 
              ref={navRef}
              className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto whitespace-nowrap scroll-smooth px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveFilter(category.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFilter === category.key
                      ? 'text-foreground border-foreground'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </nav>

            {/* Right Scroll Button */}
            <button 
              onClick={() => scrollNav('right')}
              className="p-2 absolute right-0 bg-gradient-to-l from-background to-transparent z-10 h-full"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16 sm:pb-24">
          {/* Title and Description */}
          <div className="text-left max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Agentes GenAI Multicanal en Agent Booster
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              Nuestra tienda de agentes se irá desbloqueando a medida que Boo avanza en su historia: cada capítulo libera un nuevo "dragón-agente" especializado para distintos sectores y casos de uso.
            </p>
            <p className="text-muted-foreground text-lg">
              Operan en cualquier canal (web, chat, voz, redes sociales) y también en procesos internos. Nuestros agentes automatizan tareas, mejoran la experiencia del cliente y aumentan la eficiencia operativa en distintas industrias.
            </p>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent, index) => (
              <div
                key={index}
                className="agent-card group relative text-center border rounded-xl p-6 transition-colors duration-300"
              >
                {/* Preparation Label */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 text-yellow-400 dark:text-yellow-400 light:text-yellow-600 text-xs font-semibold uppercase">
                  <Clock className="h-4 w-4" />
                  <span>En preparación</span>
                </div>

                {/* Icon Decorator */}
                <div 
                  aria-hidden="true" 
                  className="relative mx-auto w-40 h-40 mt-8"
                  style={{ maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)' }}
                >
                  <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
                  <div className="absolute inset-0 m-auto flex w-14 h-14 items-center justify-center border-t border-l border-gray-700 dark:border-gray-700 light:border-gray-400 overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1757091648/Gemini_Generated_Image_lvfakxlvfakxlvfa_dr1lxo.jpg" 
                      alt="Icono de Agente AI" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Card Content */}
                <p className="text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600">
                  {agent.category}
                </p>
                <h3 className="mt-4 font-bold text-white dark:text-white light:text-gray-900 text-lg">
                  {agent.title}
                </h3>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm mt-2">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <section className="pt-12 sm:pt-16 pb-20 sm:pb-32">
          <div className="container mx-auto px-6">
            <div className="card-bg max-w-4xl mx-auto rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Listo para potenciar tu futuro?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Cuéntanos tu desafío y diseñaremos juntos un agente de IA que transforme tu negocio.
              </p>
              <div className="flex justify-center">
                <a href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A" target="_blank" rel="noopener noreferrer" className="gradient-button text-white font-bold py-3 px-8 whitespace-nowrap">
                  Hablemos de tu Agente
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Agentes;