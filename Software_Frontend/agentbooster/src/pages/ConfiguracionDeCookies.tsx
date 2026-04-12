import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const ConfiguracionDeCookies = () => {
  const today = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  // Scroll al inicio al montar el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar preferencias guardadas al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({
          necessary: true, // Siempre activas
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false
        });
      } catch (e) {
        console.error('Error al cargar preferencias de cookies:', e);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    toast.success("Preferencias de cookies guardadas correctamente");
  };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  return (
    <>
      <Helmet>
        <title>Configuración de Cookies | Agent Booster</title>
        <meta 
          name="description" 
          content="Gestiona tus preferencias de cookies y consulta nuestra política de cookies de Agent Booster." 
        />
      </Helmet>

      {/* 
        CHECKLIST INTERNO:
        [ ] Actualizar fecha de "Última actualización"
        [ ] Completar [Lista de terceros/categorías] en la política
        [ ] Completar [Tabla de cookies pendiente de completar] si es necesaria
        [ ] Verificar enlace del footer: /configuracion-de-cookies
      */}

      <main className="min-h-screen bg-background py-16 px-6">
        <article className="container mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Configuración de Cookies
            </h1>
            <p className="text-sm text-muted-foreground">
              Última actualización: {today}
            </p>
          </header>

          <div className="space-y-8 text-foreground">
            {/* Introducción */}
            <section>
              <p className="mb-4 leading-relaxed">
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para mejorar 
                tu experiencia de navegación. En <strong>Agent Booster</strong>, utilizamos cookies y tecnologías similares 
                para garantizar el funcionamiento del sitio, analizar su rendimiento y, si aplica, personalizar contenidos.
              </p>
              <p className="mb-4 leading-relaxed">
                A continuación puedes gestionar tus preferencias de cookies y consultar nuestra política completa. 
                También puedes revisar nuestra{" "}
                <Link to="/politica-de-privacidad" className="text-primary hover:underline font-semibold">
                  Política de Privacidad
                </Link>.
              </p>
            </section>

            {/* Centro de consentimiento */}
            <section className="border rounded-lg p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-6">Centro de Consentimiento</h2>
              
              {/* Botones principales */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button onClick={handleAcceptAll} className="flex-1 min-w-[150px]">
                  Aceptar todas
                </Button>
                <Button onClick={handleRejectAll} variant="outline" className="flex-1 min-w-[150px]">
                  Rechazar todas
                </Button>
                <Button onClick={handleSavePreferences} variant="secondary" className="flex-1 min-w-[150px]">
                  Guardar preferencias
                </Button>
              </div>

              {/* Controles por categoría */}
              <div className="space-y-6">
                {/* Cookies Necesarias */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Cookies Necesarias</h3>
                    <p className="text-sm text-muted-foreground">
                      Estas cookies son esenciales para el funcionamiento básico del sitio web. 
                      No se pueden desactivar y no almacenan información personal identificable.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Switch checked={true} disabled className="cursor-not-allowed opacity-60" />
                    <span className="ml-2 text-sm text-muted-foreground">Siempre activas</span>
                  </div>
                </div>

                {/* Cookies Analítica */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Cookies de Analítica</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos ayudan a entender cómo los visitantes interactúan con el sitio, recopilando 
                      información de forma anónima para mejorar el rendimiento y la experiencia de usuario.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.analytics} 
                    onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                  />
                </div>

                {/* Cookies Marketing */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Cookies de Marketing</h3>
                    <p className="text-sm text-muted-foreground">
                      Se utilizan para mostrar anuncios relevantes y medir la eficacia de nuestras campañas publicitarias. 
                      Pueden rastrear tu navegación en otros sitios web.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.marketing} 
                    onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                  />
                </div>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Tus preferencias se guardarán en tu dispositivo. Puedes volver a esta página en cualquier momento 
                para modificarlas.
              </p>
            </section>

            {/* POLÍTICA DE COOKIES */}
            <section className="mt-12 pt-8 border-t">
              <h2 className="text-3xl font-bold mb-6">Política de Cookies</h2>

              {/* Responsable y contacto */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Responsable y contacto</h3>
                <p className="leading-relaxed mb-2">
                  <strong>Responsable:</strong> Agent Booster
                </p>
                <p className="leading-relaxed">
                  <strong>Email de contacto:</strong>{" "}
                  <a 
                    href="mailto:team@agentbooster.ai" 
                    className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words"
                  >
                    team@agentbooster.ai
                  </a>
                </p>
              </div>

              {/* Qué datos se recogen */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Qué datos se recogen vía cookies</h3>
                <p className="leading-relaxed mb-3">
                  Las cookies pueden almacenar información como identificadores únicos de sesión, eventos de navegación 
                  (páginas visitadas, clics, tiempo de permanencia), configuraciones de idioma o tema, y datos agregados 
                  de rendimiento del sitio.
                </p>
                <p className="leading-relaxed">
                  Dependiendo de la categoría de cookie, la información puede ser anónima (no te identifica personalmente) 
                  o estar vinculada a tu dispositivo o navegador mediante un identificador.
                </p>
              </div>

              {/* Finalidades por categoría */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Finalidades por categoría</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cookies Necesarias</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Permitir la navegación básica y el acceso a áreas seguras del sitio</li>
                      <li>Recordar preferencias técnicas (idioma, configuración de privacidad)</li>
                      <li>Proteger contra ataques de seguridad y fraude</li>
                      <li>Balanceo de carga y gestión de sesiones técnicas</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Cookies de Analítica</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Recopilar estadísticas sobre el uso del sitio (páginas más visitadas, flujos de navegación)</li>
                      <li>Medir el rendimiento técnico (tiempos de carga, errores)</li>
                      <li>Identificar patrones de uso para optimizar la experiencia de usuario</li>
                      <li>Realizar pruebas A/B y análisis de conversiones</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Cookies de Marketing (si aplica)</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Mostrar anuncios relevantes basados en tus intereses</li>
                      <li>Medir la eficacia de campañas publicitarias (alcance, conversiones, atribución)</li>
                      <li>Personalizar contenidos promocionales según tu comportamiento de navegación</li>
                      <li>Sincronización con redes sociales y plataformas de publicidad</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Base legal */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Base legal</h3>
                <p className="leading-relaxed mb-2">
                  <strong>Cookies Necesarias:</strong> se basan en nuestro interés legítimo de garantizar la seguridad, 
                  estabilidad y funcionamiento del sitio. No requieren consentimiento previo.
                </p>
                <p className="leading-relaxed">
                  <strong>Cookies de Analítica y Marketing:</strong> requieren tu consentimiento explícito, que puedes 
                  otorgar o retirar en cualquier momento utilizando los controles de esta página.
                </p>
              </div>

              {/* Terceros */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Terceros</h3>
                <p className="leading-relaxed mb-3">
                  Podemos utilizar servicios de terceros para analítica web, gestión de etiquetas, publicidad y optimización 
                  de conversiones. Estos proveedores pueden establecer sus propias cookies en tu dispositivo.
                </p>
                <p className="leading-relaxed mb-2">
                  <strong>[Lista de terceros/categorías]</strong> — Proveedores típicos incluyen:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Plataformas de analítica web (Google Analytics, Plausible, etc.)</li>
                  <li>Sistemas de gestión de etiquetas (Google Tag Manager, Segment, etc.)</li>
                  <li>Herramientas de testing A/B y optimización (Optimizely, VWO, etc.)</li>
                  <li>Redes publicitarias y plataformas de remarketing (Meta Pixel, LinkedIn Insights, Google Ads, etc.)</li>
                  <li>Pasarelas de pago y procesadores de transacciones (Stripe, PayPal, etc.)</li>
                </ul>
              </div>

              {/* Plazos de conservación */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Plazos de conservación</h3>
                <p className="leading-relaxed mb-3">
                  El plazo de conservación de las cookies varía según su finalidad:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Cookies de sesión:</strong> se eliminan cuando cierras el navegador.
                  </li>
                  <li>
                    <strong>Cookies persistentes necesarias:</strong> pueden durar hasta 1 año, renovándose automáticamente 
                    si sigues utilizando el sitio.
                  </li>
                  <li>
                    <strong>Cookies de analítica:</strong> típicamente entre 1 mes y 2 años, dependiendo del proveedor.
                  </li>
                  <li>
                    <strong>Cookies de marketing:</strong> pueden persistir hasta 1-2 años para el seguimiento de campañas 
                    y atribución de conversiones.
                  </li>
                </ul>
                <p className="leading-relaxed mt-3">
                  Al expirar, las cookies se eliminan automáticamente o se renuevan si el usuario continúa interactuando con el sitio.
                </p>
              </div>

              {/* Cómo cambiar o retirar el consentimiento */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Cómo cambiar o retirar el consentimiento</h3>
                <p className="leading-relaxed mb-3">
                  Puedes modificar tus preferencias de cookies en cualquier momento utilizando el <strong>Centro de Consentimiento</strong> 
                  en la parte superior de esta página. Los cambios se aplicarán inmediatamente una vez guardes tus preferencias.
                </p>
                <p className="leading-relaxed">
                  Si retiras tu consentimiento para cookies de analítica o marketing, dejaremos de recopilar nueva información 
                  a través de esas categorías, pero las cookies ya establecidas pueden permanecer en tu dispositivo hasta que expiren 
                  o las elimines manualmente.
                </p>
              </div>

              {/* Guía para el navegador */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Gestión desde tu navegador</h3>
                <p className="leading-relaxed mb-3">
                  Además de nuestro Centro de Consentimiento, puedes gestionar o eliminar cookies directamente desde la configuración 
                  de tu navegador. Ten en cuenta que bloquear todas las cookies puede afectar la funcionalidad del sitio.
                </p>
                <p className="leading-relaxed mb-2">
                  Enlaces útiles para gestionar cookies:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>
                    <a 
                      href="https://support.google.com/chrome/answer/95647" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="no-underline hover:underline underline-offset-2 decoration-1 text-blue-500 dark:text-blue-500 visited:text-purple-700 dark:visited:text-purple-700 break-words transition-colors"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="no-underline hover:underline underline-offset-2 decoration-1 text-blue-500 dark:text-blue-500 visited:text-purple-700 dark:visited:text-purple-700 break-words transition-colors"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="no-underline hover:underline underline-offset-2 decoration-1 text-blue-500 dark:text-blue-500 visited:text-purple-700 dark:visited:text-purple-700 break-words transition-colors"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="no-underline hover:underline underline-offset-2 decoration-1 text-blue-500 dark:text-blue-500 visited:text-purple-700 dark:visited:text-purple-700 break-words transition-colors"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tabla de cookies (opcional) */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Tabla de cookies</h3>
                <p className="leading-relaxed mb-4">
                  <strong>[Tabla de cookies pendiente de completar]</strong>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-4 py-2 text-left font-semibold">Nombre</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Proveedor</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Categoría</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Finalidad</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Duración</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-2">cookiePreferences</td>
                        <td className="border border-border px-4 py-2">Agent Booster</td>
                        <td className="border border-border px-4 py-2">Necesaria</td>
                        <td className="border border-border px-4 py-2">Almacenar preferencias de cookies del usuario</td>
                        <td className="border border-border px-4 py-2">1 año</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border px-4 py-2" colSpan={5}>
                          <em className="text-muted-foreground">
                            Completar con el inventario real de cookies utilizadas en el sitio
                          </em>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contacto */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Contacto</h3>
                <p className="leading-relaxed">
                  Si tienes dudas sobre esta Política de Cookies o deseas ejercer tus derechos de protección de datos, 
                  puedes contactarnos en:{" "}
                  <a 
                    href="mailto:team@agentbooster.ai" 
                    className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words font-semibold"
                  >
                    team@agentbooster.ai
                  </a>
                </p>
              </div>

              {/* Actualizaciones */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">Actualizaciones de esta política</h3>
                <p className="leading-relaxed">
                  Podemos actualizar esta Política de Cookies para reflejar cambios en nuestras prácticas o requisitos legales. 
                  Cuando realicemos cambios significativos, actualizaremos la fecha de "Última actualización" en la parte superior 
                  de esta página. Te recomendamos revisar esta política periódicamente.
                </p>
              </div>
            </section>
          </div>
        </article>
      </main>
    </>
  );
};

export default ConfiguracionDeCookies;
