
import React from 'react';
import { ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { useParallax } from 'react-scroll-parallax';

function Hero({ openChat }) {
  const { ref } = useParallax({ speed: 10, scale: [0.8, 1] });
  const glassButton = "bg-estetia-primary/90 hover:bg-estetia-primary text-white backdrop-blur-xl shadow-lg hover:shadow-estetia-primary/40 transition-all duration-300 rounded-full px-8 py-4 font-medium flex items-center gap-2";

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
         <img
          src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop"
          alt="Mujer hermosa"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 rounded-full bg-estetia-primary/10 text-estetia-primary text-xs font-bold tracking-widest uppercase border border-estetia-primary/20">
            Medicina Estética Avanzada
          </span>
          <h1 className="text-5xl md:text-7xl font-light leading-tight text-estetia-text">
            Eleva tu <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-estetia-primary to-estetia-accent">
              belleza natural.
            </span>
          </h1>
          <p className="text-lg text-estetia-text max-w-md leading-relaxed">
            Un nuevo concepto de clínica en Madrid donde la tecnología médica y el lujo silencioso se encuentran. Resultados naturales, sin excesos.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button onClick={openChat} className={glassButton}>
            Contacta con Estetia <ArrowRight size={18} />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/women/${20+i}.jpg`} alt="Paciente" />
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <p className="font-bold text-estetia-text">500+ Pacientes</p>
                <p className="text-gray-500">Confían en Estetia</p>
              </div>
            </div>
          </div>
        </div>

        <div ref={ref} className={`hidden md:block bg-gradient-to-br from-estetia-primary/[0.5] to-purple-700/[0.5] backdrop-blur-xl border border-white/10 shadow-lg rounded-3xl p-8 max-w-sm ml-auto animate-fade-in-up relative overflow-hidden transition-all duration-500 hover:-translate-y-2`}>
           <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full opacity-50"></div>
           <div className="absolute top-0 right-0 p-4 text-white/10">
             <Shield size={100} />
           </div>
           <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3 text-white">Protocolo Estetia®</h3>
            <p className="text-sm text-white mb-6">
              Combinamos láser, inyectables y dermocosmética en una sola sesión para maximizar resultados.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-green-400"/> <span className="text-white">Diagnóstico Facial Avanzado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-green-400"/> <span className="text-white">Plan Personalizado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-green-400"/> <span className="text-white">Seguimiento Continuo y Personal</span>
              </div>
            </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
