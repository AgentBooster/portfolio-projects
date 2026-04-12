"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Facebook, Instagram, Linkedin, Moon, Sun, Twitter, Youtube } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { setCookie, getCookie } from "@/utils/cookieUtils";
import { getAutoTheme, createSystemThemeListener } from "@/utils/themeUtils";

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const navigate = useNavigate();

  // Cargar tema desde cookies al inicializar
  React.useEffect(() => {
    const savedTheme = getCookie('theme_preference');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Primera visita - usar detección automática
      const autoTheme = getAutoTheme(true); // Priorizar preferencia del sistema
      setIsDarkMode(autoTheme === 'dark');
      if (autoTheme === 'dark') {
        document.documentElement.classList.add("dark");
      }
      setCookie('theme_preference', autoTheme);
    }
  }, []);

  // Listener para cambios automáticos basados en preferencias del sistema
  React.useEffect(() => {
    const savedTheme = getCookie('theme_preference');

    // Solo aplicar detección automática si no hay preferencia manual guardada
    if (!savedTheme || savedTheme !== 'dark' && savedTheme !== 'light') {
      const cleanupSystemListener = createSystemThemeListener(newTheme => {
        setIsDarkMode(newTheme === 'dark');
        if (newTheme === 'dark') {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      });

      // Timer para revisar cambios basados en hora cada hora
      const hourlyCheck = setInterval(() => {
        const autoTheme = getAutoTheme(true);
        if (autoTheme === 'dark' !== isDarkMode) {
          setIsDarkMode(autoTheme === 'dark');
          if (autoTheme === 'dark') {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }, 60 * 60 * 1000); // Cada hora

      return () => {
        cleanupSystemListener();
        clearInterval(hourlyCheck);
      };
    }
  }, [isDarkMode]);

  // Actualizar tema y guardar en cookies cuando el usuario cambia manualmente
  const handleThemeToggle = (newValue: boolean) => {
    setIsDarkMode(newValue);
    if (newValue) {
      document.documentElement.classList.add("dark");
      setCookie('theme_preference', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      setCookie('theme_preference', 'light');
    }
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };
  const handleLegalPageNavigation = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };
  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300 pb-16 sm:pb-0">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Contáctanos</h2>
            <p className="mb-6 text-muted-foreground">¿Quieres hablar con nosotros?
Haz clic en la vía de contacto que más se adapte a ti.</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold"></h3>
            <nav className="space-y-2 text-sm">
              <button onClick={() => handleNavigation("/")} className="block transition-colors hover:text-primary text-left">
                Inicio
              </button>
              <button onClick={() => handleNavigation("/soluciones")} className="block transition-colors hover:text-primary text-left">
                Soluciones
              </button>
              <button onClick={() => handleNavigation("/socios")} className="block transition-colors hover:text-primary text-left">
                Socios
              </button>
              <button onClick={() => handleNavigation("/contactenos")} className="block transition-colors hover:text-primary text-left">
                Contáctenos
              </button>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <address className="space-y-2 text-sm not-italic">
              {/*<p>Número: <a href="tel:+393757463107" className="transition-colors hover:text-primary">(+39) 375 746 3107</a></p>*/}
              <p>Email: team@risolvia.com</p>
              {/*<p>WhatsApp: <a href="https://wa.me/393757463107" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">(+39) 375 746 3107</a></p>*/}
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Síguenos</h3>
            <div className="mb-6 flex space-x-4">
              {/*<TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.facebook.com/profile.php?id=61577358765994" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Facebook</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Síguenos en Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>*/}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://x.com/Risolvia_es" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">X (Twitter)</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Síguenos en X</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.instagram.com/risolvia_es/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Síguenos en Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.linkedin.com/company/risolvia/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Síguenos en LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://www.youtube.com/@risolvia" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Youtube className="h-4 w-4" />
                        <span className="sr-only">YouTube</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Síguenos en YouTube</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleThemeToggle} />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-sm text-muted-foreground">© 2025 Risolvia. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/70">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
          <nav className="flex gap-4 text-sm">
            <button onClick={() => handleLegalPageNavigation("/politica-privacidad")} className="transition-colors hover:text-primary">
              Privacy Policy
            </button>
            <button onClick={() => handleLegalPageNavigation("/terminos-condiciones")} className="transition-colors hover:text-primary">
              Terms of Service
            </button>
            <button onClick={() => handleLegalPageNavigation("/configuracion-cookies")} className="transition-colors hover:text-primary">
              Cookie Settings
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footerdemo };
