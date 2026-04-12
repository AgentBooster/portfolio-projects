import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Storytelling = () => {
  const location = useLocation();
  const isOnStorytellingPage = location.pathname === '/storytelling';
  const swiperRef = useRef<any>(null);
  
  const cardData = [
    {}, {}, {}, {}, {}
  ];

  useEffect(() => {
    // Control autoplay based on page visibility
    if (swiperRef.current && swiperRef.current.swiper) {
      if (isOnStorytellingPage) {
        swiperRef.current.swiper.autoplay.start();
      } else {
        swiperRef.current.swiper.autoplay.stop();
      }
    }
  }, [isOnStorytellingPage]);

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-8 sm:pb-12">
        {/* Introduction card */}
        <div className="storytelling-intro-card max-w-4xl mx-auto rounded-xl p-4 mb-8">
          <p className="text-base font-semibold text-center text-white">
            Descubre la Historia de nuestros Agentes en Capítulos Próximamente
          </p>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Boo, el Fundador
          </h1>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-[50px]">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-50"></div>
            <div className="absolute inset-0 storytelling-video-bg rounded-3xl border border-purple-400/60 flex items-center justify-center">
              <svg className="h-20 w-20 text-white storytelling-play-button" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              {/* Badge "Próximamente" */}
              <div className="absolute top-4 right-4 flex items-center justify-center text-yellow-400 font-bold text-xs sm:text-sm space-x-2 bg-black/50 rounded-full px-3 py-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 15 15"></polyline>
                </svg>
                <span>PRÓXIMAMENTE</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-foreground max-w-4xl mx-auto">
            <p className="mb-4">
              Desde un mundo donde la tecnología y la vida se entrelazan, un dragón abandonado es enviado en secreto a un lugar desconocido... el portador de algo más que fuerza y fuego, lleva consigo una chispa capaz de transformar realidades.
            </p>
            <p className="mb-4 text-right">
              Aunque pequeño y vulnerable, comienza a descubrir que cada desafío despierta un poder latente, como si dentro de él se ocultara la memoria de otra civilización. Este es el inicio de una misión que ni él mismo comprende aún.
            </p>
            <p>
              Su nombre, Boo. Es la primera señal de nuestro propósito, la semilla de lo que será AgentBooster: un ser destinado a unir mundos, superar límites y abrir caminos donde otros solo ven imposibles. Este capítulo es apenas su despertar.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN CON CARRUSEL DE TARJETAS */}
      <section className="pt-10 sm:pt-16 pb-10 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <span className="storytelling-chapters-badge">
                Mientras Boo Crezca Surgirán nuevos Capítulos y Agentes
              </span>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Swiper
              ref={swiperRef}
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
              }}
              autoplay={isOnStorytellingPage ? {
                delay: 2000,
                disableOnInteraction: false,
              } : false}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="storytelling-swiper"
            >
              {cardData.map((_, index) => (
                <SwiperSlide key={index} className="storytelling-swiper-slide">
                  <div className="storytelling-loader-overlay">
                    <div className="storytelling-loader-wrapper">
                      <div className="storytelling-loader-letters">
                        {['P', 'r', 'ó', 'x', 'i', 'm', 'a', 'm', 'e', 'n', 't', 'e'].map((letter, letterIndex) => (
                          <span 
                            key={letterIndex}
                            className="storytelling-loader-letter" 
                            style={{animationDelay: `${letterIndex * 0.1}s`}}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                      <div className="storytelling-loader"></div>
                    </div>
                  </div>
                  <div className="storytelling-card-content">
                    <div className="storytelling-title-rectangle flex items-center justify-center font-bold text-sm space-x-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 15 15"></polyline>
                      </svg>
                      <span>BLOQUEADO</span>
                    </div>
                    <div className="storytelling-video-placeholder"></div>
                    <div className="storytelling-text-lines">
                      {/* Grupo de 3 líneas a la izquierda */}
                      <div className="flex flex-col items-start space-y-2 mb-4">
                        <div className="storytelling-line w-4/5"></div>
                        <div className="storytelling-line w-3/4"></div>
                        <div className="storytelling-line w-2/3"></div>
                      </div>
                      {/* Grupo de 3 líneas a la derecha */}
                      <div className="flex flex-col items-end space-y-2 mb-4">
                        <div className="storytelling-line w-4/5"></div>
                        <div className="storytelling-line w-3/4"></div>
                        <div className="storytelling-line w-2/3"></div>
                      </div>
                      {/* Grupo de 3 líneas a la izquierda */}
                      <div className="flex flex-col items-start space-y-2 mb-4">
                        <div className="storytelling-line w-4/5"></div>
                        <div className="storytelling-line w-3/4"></div>
                        <div className="storytelling-line w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="pt-12 sm:pt-16 pb-20 sm:pb-32">
        <div className="container mx-auto px-6">
          <div className="card-bg max-w-4xl mx-auto rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para potenciar tu futuro?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
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
    </div>
  );
};

export default Storytelling;