import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Change header background on scroll
    const header = document.getElementById('header');
    const handleScroll = () => {
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('bg-black/80');
        } else {
          header.classList.remove('bg-black/80');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Lógica para el logo según el tema
    const logoImg = document.getElementById('logo-img') as HTMLImageElement;

    function updateLogo(theme: string) {
      if (logoImg) {
        if (theme === 'light') {
          logoImg.src = logoImg.dataset.lightLogo || '';
        } else {
          logoImg.src = logoImg.dataset.darkLogo || '';
        }
      }
    }

    // Sincronizar el logo con el estado actual al cargar
    if (document.documentElement.classList.contains('light')) {
      updateLogo('light');
    } else {
      updateLogo('dark');
    }

    // Observar cambios de tema para actualizar el logo
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('light')) {
        updateLogo('light');
      } else {
        updateLogo('dark');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        <div className="flex-1 flex justify-start">
          <a href="/" id="logo-link" className="flex items-center">
            <img 
              id="logo-img" 
              src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756500256/agent_booster_edit1-07_de7upz.png" 
              data-dark-logo="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756500256/agent_booster_edit1-07_de7upz.png"
              data-light-logo="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756500143/agent_booster_edit1-06_oawoaj.png"
              alt="Logo de Agent Booster" 
              className="h-10"
            />
          </a>
        </div>
        
        {/* Navegación de Escritorio Centrada */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-white transition px-3 py-2 rounded-md hover:bg-zinc-800"
            onClick={() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Home
          </Link>
          <Link 
            to="/servicios" 
            className="text-gray-300 hover:text-white transition px-3 py-2 rounded-md hover:bg-zinc-800"
            onClick={() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Servicios
          </Link>
          <Link 
            to="/agentes" 
            className="text-gray-300 hover:text-white transition px-3 py-2 rounded-md hover:bg-zinc-800"
            onClick={() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Agentes
          </Link>
          <Link 
            to="/casos-de-uso" 
            className="text-gray-300 hover:text-white transition px-3 py-2 rounded-md hover:bg-zinc-800"
            onClick={() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Casos de Uso
          </Link>
          <Link 
            to="/storytelling" 
            className="text-gray-300 hover:text-white transition px-3 py-2 rounded-md hover:bg-zinc-800"
            onClick={() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Storytelling
          </Link>
       </nav>

        <div className="flex-1 flex justify-end items-center">
          {/* Botón de CTA para escritorio */}
          <a 
            href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-button hidden md:inline-flex items-center justify-center font-semibold text-white py-2 px-5 text-sm"
          >
            Hablemos
          </a>

          {/* Botón de Menú Móvil (Hamburguesa) */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-2"
              aria-label="Toggle mobile menu"
            >
              {!isMobileMenuOpen ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Menú Móvil Desplegable */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50`}>
        <nav className="flex flex-col items-center space-y-6 p-6">
          <Link 
            to="/" 
            className="text-foreground/70 hover:text-foreground transition block w-full text-center"
            onClick={() => {
              closeMobileMenu();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Home
          </Link>
          <Link 
            to="/servicios" 
            className="text-foreground/70 hover:text-foreground transition block w-full text-center"
            onClick={() => {
              closeMobileMenu();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Servicios
          </Link>
          <Link 
            to="/agentes" 
            className="text-foreground/70 hover:text-foreground transition block w-full text-center"
            onClick={() => {
              closeMobileMenu();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Agentes
          </Link>
          <Link 
            to="/casos-de-uso" 
            className="text-foreground/70 hover:text-foreground transition block w-full text-center"
            onClick={() => {
              closeMobileMenu();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Casos de Uso
          </Link>
          <Link 
            to="/storytelling" 
            className="text-foreground/70 hover:text-foreground transition block w-full text-center"
            onClick={() => {
              closeMobileMenu();
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            Storytelling
          </Link>
          <a 
            href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-button inline-flex items-center justify-center font-semibold text-white py-3 px-6 text-base mt-4"
            onClick={closeMobileMenu}
          >
            Hablemos
          </a>
       </nav>
      </div>
    </header>
  );
};

export default Header;