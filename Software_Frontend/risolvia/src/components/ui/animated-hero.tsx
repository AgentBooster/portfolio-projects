
import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MoveRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const titles = useMemo(() => ["situaciones legales", "consultas jurídicas", "problemas", "dudas inmobiliarias", "casos complejos"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Intersection Observer para la sección Hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Función para hacer scroll al agente específicamente
  const scrollToAgent = () => {
    const agentContainer = document.querySelector('#deployment-96341634-7e25-4477-94f5-0e543c770f46');
    if (agentContainer) {
      agentContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  // Función para navegar a soluciones
  const navigateToSoluciones = () => {
    navigate('/soluciones');
    // Hacer scroll al inicio de la página después de navegar
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Función para navegar a contactenos
  const navigateToContactenos = () => {
    navigate('/contactenos');
  };

  return <div 
    ref={heroRef}
    className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
    style={{
      backgroundImage: isHeroVisible ? `url(https://res.cloudinary.com/dcvqw00tq/image/upload/v1751594245/Disen%CC%83o_sin_ti%CC%81tulo_1_bzbwjb.jpg)` : 'none',
      backgroundColor: !isHeroVisible ? '#1f2937' : 'transparent'
    }}
  >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-8 pt-20 pb-40 sm:py-36 md:py-48 lg:py-56 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4 bg-slate-800 text-white hover:bg-slate-900" onClick={navigateToContactenos}>
              Consulta Urgente <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-6 flex-col">
            <h1 className="text-4xl md:text-6xl max-w-4xl tracking-tight text-center font-bold leading-tight">
              <span className="text-white">Transformamos tus</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => <motion.span key={index} className="absolute font-bold text-orange-500" initial={{
                opacity: 0,
                y: "-100"
              }} transition={{
                type: "spring",
                stiffness: 50
              }} animate={titleNumber === index ? {
                y: 0,
                opacity: 1
              } : {
                y: titleNumber > index ? -150 : 150,
                opacity: 0
              }}>
                    {title}
                  </motion.span>)}
              </span>
              <span className="text-white">en soluciones</span>
            </h1>

            <p className="text-xl text-white leading-relaxed max-w-3xl text-center">Conectamos personas con profesionales legales especializados para resolver tus problemas de manera rápida, confiable y accesible. Resuelve dudas con asistencia profesional y conecta con nuestro equipo gracias a nuestro Agente. </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl" onClick={scrollToAgent}>
              Consulta Gratis <Send className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 border-2 border-white text-white hover:text-orange-500 bg-transparent hover:bg-transparent transition-all duration-300" variant="outline" onClick={navigateToSoluciones}>
              Conocer más <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}

export { Hero };
