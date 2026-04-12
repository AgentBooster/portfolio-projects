import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBenefitsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Si estamos en home, hacer scroll directo
      const section = document.getElementById('benefits');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegar a home con hash
      navigate('/#benefits');
    }
  };

  useEffect(() => {
    // Inicializar tema basándose en preferencia del sistema y localStorage
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Si hay tema guardado, usarlo. Si no, usar la preferencia del sistema
      const shouldUseLightMode = savedTheme === 'light' || (!savedTheme && !prefersDark);
      
      if (shouldUseLightMode) {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    };

    // Inicializar tema al montar el componente
    initializeTheme();

    // Lógica para el interruptor de tema
    const themeToggle = document.getElementById('theme-toggle');
    const thumb = document.getElementById('theme-toggle-thumb');

    if (themeToggle && thumb) {
      // Sincronizar el interruptor con el estado actual
      const syncToggle = () => {
        if (document.documentElement.classList.contains('light')) {
          themeToggle.classList.add('active');
        } else {
          themeToggle.classList.remove('active');
        }
      };

      syncToggle();

      const toggleTheme = () => {
        document.documentElement.classList.toggle('light');
        if (document.documentElement.classList.contains('light')) {
          themeToggle.classList.add('active');
          localStorage.setItem('theme', 'light');
        } else {
          themeToggle.classList.remove('active');
          localStorage.setItem('theme', 'dark');
        }
      };

      themeToggle.addEventListener('click', toggleTheme);

      return () => {
        themeToggle.removeEventListener('click', toggleTheme);
      };
    }
  }, []);

  return (
    <footer className="border-t border-gray-800 bg-black text-gray-400">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Agent Booster</h3>
            <p className="mb-6 text-gray-500 text-sm">Construimos el futuro de los negocios con agentes de IA.</p>
            {/* Theme Switcher */}
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <button id="theme-toggle" className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-gray-600">
                <span id="theme-toggle-thumb" className="pointer-events-none inline-block h-5 w-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </div>
          </div>
          {/* Col 2: Navegación */}
          <div>
            <nav className="space-y-3 text-sm">
              <a href="#benefits" onClick={handleBenefitsClick} className="block transition-colors hover:text-purple-400">Beneficios</a>
              <Link 
                to="/servicios" 
                className="block transition-colors hover:text-purple-400"
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
                className="block transition-colors hover:text-purple-400"
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
                className="block transition-colors hover:text-purple-400"
                onClick={() => {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                Casos de uso
              </Link>
              <Link 
                to="/storytelling" 
                className="block transition-colors hover:text-purple-400"
                onClick={() => {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                Storytelling
              </Link>
            </nav>
          </div>
          {/* Col 3: Contacto */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contacto</h3>
            <address className="space-y-3 text-sm not-italic">
              <p>¿Listo para empezar?</p>
              <p><a href="mailto:team@agentbooster.ai" className="transition-colors hover:text-purple-400 font-semibold">team@agentbooster.ai</a></p>
              <p><a href="https://wa.me/59898690873?text=Hola%2C%20buen%20d%C3%ADa.%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20automatizaciones.%0A%0AS%C3%A9%20que%20este%20contacto%20se%20utiliza%20solo%20para%20consultas%20urgentes%20y%20respeto%20ese%20uso%3B%20confirmo%20que%20en%20este%20caso%20mi%20consulta%20es%20urgente.%0A%0APaso%20a%20comentarte%20sobre%20nosotros%3B%20lo%20que%20buscamos%20y%20a%20qu%C3%A9%20se%20dedica%20nuestra%20empresa%3A" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-purple-400 font-semibold">Consulta Urgente (WhatsApp)</a></p>
            </address>
          </div>
          {/* Col 4: Redes Sociales */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/AgentBoosterAI" target="_blank" rel="noopener noreferrer" title="X" className="p-2 rounded-full border border-gray-700 hover:border-purple-400 hover:bg-purple-900/50 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/agentbooster.ai" target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2 rounded-full border border-gray-700 hover:border-purple-400 hover:bg-purple-900/50 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85C2.25 3.854 3.716 2.31 6.969 2.163 8.234 2.115 8.614 2.103 12 2.103zm0 1.441c-3.193 0-3.563.011-4.803.069-2.733.124-4.113 1.504-4.239 4.239-.057 1.24-.069 1.611-.069 4.803s.012 3.563.069 4.803c.125 2.734 1.505 4.114 4.239 4.239 1.24.057 1.61.069 4.803.069s3.563-.011 4.803-.069c2.734-.124 4.114-1.505 4.239-4.239.057-1.24.069-1.611.069-4.803s-.012-3.563-.069-4.803c-.125-2.734-1.505-4.114-4.239-4.239-1.24-.057-1.611-.069-4.803-.069zm0 3.482a5.13 5.13 0 100 10.26 5.13 5.13 0 000-10.26zm0 8.818a3.688 3.688 0 110-7.376 3.688 3.688 0 010 7.376zm4.814-9.352a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/agent-booster-ai/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="p-2 rounded-full border border-gray-700 hover:border-purple-400 hover:bg-purple-900/50 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93-.94 0-1.42.61-1.62 1.21-.07.21-.08.5-.08.79V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.38.99 3.38 3.5V19z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@AgentBooster-AI" target="_blank" rel="noopener noreferrer" title="YouTube" className="p-2 rounded-full border border-gray-700 hover:border-purple-400 hover:bg-purple-900/50 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M9.996,15.006V8.994l5.217,3.006L9.996,15.006z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-center md:flex-row">
          <p className="text-sm text-gray-500">&copy; 2025 Agent Booster. Todos los derechos reservados.</p>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link to="/politica-de-privacidad" className="transition-colors hover:text-purple-400">Política de Privacidad</Link>
            <Link to="/terminos-de-servicio" className="transition-colors hover:text-purple-400">Términos de Servicio</Link>
            <Link to="/configuracion-de-cookies" className="transition-colors hover:text-purple-400">Configuración de Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;