
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCookiePreferences } from '@/hooks/useCookiePreferences';
import { useToast } from '@/hooks/use-toast';

const ConfiguracionCookies = () => {
  const { preferences, savePreferences, acceptAll, rejectOptional, isLoaded } = useCookiePreferences();
  const { toast } = useToast();

  const handleAnalyticsChange = (enabled: boolean) => {
    const newPreferences = { ...preferences, analytics: enabled };
    savePreferences(newPreferences);
    toast({
      title: "Preferencias actualizadas",
      description: `Cookies analíticas ${enabled ? 'habilitadas' : 'deshabilitadas'}`,
    });
  };

  const handlePersonalizationChange = (enabled: boolean) => {
    const newPreferences = { ...preferences, personalization: enabled };
    savePreferences(newPreferences);
    toast({
      title: "Preferencias actualizadas", 
      description: `Cookies de personalización ${enabled ? 'habilitadas' : 'deshabilitadas'}`,
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias de cookies han sido guardadas correctamente",
    });
  };

  const handleAcceptAll = () => {
    acceptAll();
    toast({
      title: "Todas las cookies aceptadas",
      description: "Has habilitado todas las funcionalidades opcionales",
    });
  };

  const handleRejectAll = () => {
    rejectOptional();
    toast({
      title: "Cookies opcionales rechazadas",
      description: "Solo se utilizarán las cookies esenciales",
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Cookie className="h-8 w-8 mx-auto mb-4 text-primary animate-pulse" />
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Botón de regreso */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="space-y-8">
          <div className="text-center">
            <Cookie className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Configuración de Cookies</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Utilizamos cookies para mejorar tu experiencia en nuestra plataforma de conexión 
              entre usuarios y despachos de abogados especializados.
            </p>
          </div>

          {/* Cookies Esenciales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cookies Esenciales
                <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                  Siempre activas
                </span>
              </CardTitle>
              <CardDescription>
                Estas cookies son necesarias para el funcionamiento básico de la plataforma, 
                incluyendo la seguridad, navegación y acceso a áreas protegidas. No se pueden desactivar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Preferencias de tema (modo oscuro/claro)</li>
                <li>Configuración de cookies del usuario</li>
                <li>Funcionamiento básico de la plataforma</li>
                <li>Seguridad y protección básica</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies Analíticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cookies Analíticas
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={handleAnalyticsChange}
                />
              </CardTitle>
              <CardDescription>
                Nos ayudan a entender cómo los usuarios utilizan la plataforma para mejorar 
                nuestros servicios de conexión y la experiencia de matching con despachos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Análisis de uso de la plataforma</li>
                <li>Métricas de efectividad del sistema de matching</li>
                <li>Estadísticas de conexiones exitosas</li>
                <li>Optimización del algoritmo de búsqueda de despachos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies de Personalización */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cookies de Personalización
                <Switch
                  checked={preferences.personalization}
                  onCheckedChange={handlePersonalizationChange}
                />
              </CardTitle>
              <CardDescription>
                Permiten personalizar la experiencia según tus preferencias y mejorar 
                las recomendaciones de despachos especializados en tu área legal de interés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Recordar preferencias de búsqueda</li>
                <li>Personalización de recomendaciones de despachos</li>
                <li>Configuración de notificaciones</li>
                <li>Historial de consultas y especialidades de interés</li>
              </ul>
            </CardContent>
          </Card>

          {/* Gestión de Preferencias */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Preferencias</CardTitle>
              <CardDescription>
                Puedes cambiar tus preferencias de cookies en cualquier momento. 
                Los cambios se aplicarán inmediatamente y se guardarán automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Aceptar Todas
                </Button>
                <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                  Rechazar Opcionales
                </Button>
                <Button onClick={handleSavePreferences} variant="secondary" className="flex-1">
                  Confirmar Preferencias
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estado actual */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Estado Actual de tus Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Cookies Esenciales:</span>
                  <span className="text-green-600 font-medium">Activas</span>
                </div>
                <div className="flex justify-between">
                  <span>Cookies Analíticas:</span>
                  <span className={preferences.analytics ? "text-green-600" : "text-red-600"}>
                    {preferences.analytics ? "Activas" : "Inactivas"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cookies de Personalización:</span>
                  <span className={preferences.personalization ? "text-green-600" : "text-red-600"}>
                    {preferences.personalization ? "Activas" : "Inactivas"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
            <div className="space-y-4 text-sm">
              <p>
                <strong>Cambio de Preferencias:</strong> Puedes modificar tus preferencias de cookies 
                en cualquier momento visitando esta página. Los cambios se aplicarán automáticamente.
              </p>
              <p>
                <strong>Navegadores:</strong> También puedes gestionar cookies desde la configuración 
                de tu navegador, aunque esto podría afectar el funcionamiento de la plataforma.
              </p>
              <p>
                <strong>Datos Personales:</strong> Para más información sobre cómo procesamos tus datos, 
                consulta nuestra{' '}
                <Link to="/politica-privacidad" className="text-primary hover:underline">
                  Política de Privacidad
                </Link>.
              </p>
            </div>
          </div>

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>¿Necesitas Ayuda?</CardTitle>
              <CardDescription>
                Si tienes preguntas sobre nuestras cookies o la plataforma de conexión, 
                puedes contactarnos:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> vasyl@agentbooster.ai</p>
                <p><strong>Teléfono:</strong> (+598) 98 690 873</p>
                <p><strong>WhatsApp:</strong> (+598) 98 690 873</p>
                <p><strong>Horario:</strong> Lunes a viernes, 9:00 - 18:00 (UTC-3)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer de la página */}
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© 2025 Risolvia. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCookies;
