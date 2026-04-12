
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TerminosCondiciones = () => {
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
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Fecha de última actualización:</strong> 23 de junio de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Información General</h2>
            <p className="mb-4">
              Los presentes Términos y Condiciones regulan el uso de la plataforma digital 
              proporcionada por Risolvia, startup tecnológica especializada en conectar personas 
              con despachos de abogados mediante tecnología e inteligencia artificial en Uruguay. 
              Al acceder y utilizar nuestra plataforma, usted acepta estar sujeto a estos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Objeto del Servicio</h2>
            <p className="mb-4">
              Risolvia opera como una plataforma tecnológica que facilita la conexión entre usuarios 
              que necesitan servicios legales y despachos de abogados especializados. Nuestros servicios incluyen:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Plataforma digital de matching entre usuarios y despachos legales</li>
              <li>Sistema de búsqueda y filtrado de especialistas jurídicos</li>
              <li>Herramientas de comunicación segura entre usuarios y abogados</li>
              <li>Algoritmos de inteligencia artificial para optimizar las conexiones</li>
              <li>Gestión de consultas iniciales y coordinación de reuniones</li>
            </ul>
            <p className="mb-4">
              <strong>Importante:</strong> Risolvia NO presta servicios legales directos. Actuamos exclusivamente 
              como intermediarios tecnológicos que facilitan el contacto entre usuarios y profesionales del derecho 
              debidamente habilitados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Condiciones de Uso y Acceso</h2>
            <h3 className="text-xl font-medium mb-3">3.1 Requisitos de Acceso</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Ser mayor de edad o contar con autorización legal correspondiente</li>
              <li>Proporcionar información veraz y actualizada en su perfil</li>
              <li>Cumplir con la legislación uruguaya vigente</li>
              <li>Utilizar la plataforma de manera ética y con fines legítimos</li>
              <li>Respetar los términos y condiciones de los despachos asociados</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">3.2 Uso Prohibido</h3>
            <p className="mb-4">Queda expresamente prohibido:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Utilizar la plataforma para fines ilícitos o fraudulentos</li>
              <li>Proporcionar información falsa o engañosa sobre casos legales</li>
              <li>Interferir con el funcionamiento de la plataforma o sus algoritmos</li>
              <li>Contactar directamente a los despachos sin utilizar nuestra plataforma</li>
              <li>Reproducir o distribuir contenido de la plataforma sin autorización</li>
              <li>Violar derechos de terceros o normativas aplicables</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Responsabilidad y Limitaciones</h2>
            <h3 className="text-xl font-medium mb-3">4.1 Alcance de la Responsabilidad de Risolvia</h3>
            <p className="mb-4">
              Risolvia se compromete a mantener una plataforma funcional y segura para facilitar 
              las conexiones entre usuarios y despachos legales, utilizando las mejores prácticas 
              tecnológicas disponibles.
            </p>

            <h3 className="text-xl font-medium mb-3">4.2 Limitaciones Importantes</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>No somos un despacho de abogados ni prestamos servicios legales directos</li>
              <li>No garantizamos resultados específicos en procesos legales</li>
              <li>No controlamos la calidad de los servicios prestados por los despachos asociados</li>
              <li>Los usuarios son responsables de verificar las credenciales de los profesionales</li>
              <li>Las decisiones legales son responsabilidad exclusiva del usuario y su abogado</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.3 Exclusiones de Responsabilidad</h3>
            <p className="mb-4">
              Risolvia no será responsable por:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Errores profesionales, negligencia o mala praxis de los despachos asociados</li>
              <li>Disputas entre usuarios y abogados fuera de la plataforma</li>
              <li>Daños derivados de consejos legales proporcionados por terceros</li>
              <li>Interrupciones del servicio por causas de fuerza mayor</li>
              <li>Pérdidas resultantes de decisiones tomadas con base en información de terceros</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
            <h3 className="text-xl font-medium mb-3">5.1 Derechos de Risolvia</h3>
            <p className="mb-4">
              Todos los elementos de la plataforma, incluyendo software, algoritmos de matching, 
              bases de datos, diseños, interfaces y tecnología de inteligencia artificial están 
              protegidos por derechos de propiedad intelectual.
            </p>

            <h3 className="text-xl font-medium mb-3">5.2 Licencia de Uso</h3>
            <p className="mb-4">
              Se otorga al usuario una licencia limitada, no exclusiva y revocable para utilizar 
              la plataforma conforme a estos términos, únicamente para conectar con servicios legales.
            </p>

            <h3 className="text-xl font-medium mb-3">5.3 Contenido del Usuario</h3>
            <p className="mb-4">
              El usuario conserva los derechos sobre su información personal, otorgando a Risolvia 
              los permisos necesarios para facilitar las conexiones con despachos apropiados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Relación con Despachos Asociados</h2>
            <p className="mb-4">
              Los despachos de abogados en nuestra plataforma son profesionales independientes. 
              Risolvia no controla sus métodos de trabajo, tarifas o disponibilidad.
            </p>
            <p className="mb-4">
              Los usuarios deben establecer acuerdos directos con los despachos seleccionados 
              para la prestación de servicios legales, incluyendo honorarios y condiciones de trabajo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Política de Enlaces Externos</h2>
            <p className="mb-4">
              Nuestra plataforma puede contener enlaces a sitios web de despachos asociados o 
              recursos legales externos. Risolvia no controla ni es responsable por el contenido 
              o políticas de estos sitios externos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Modificaciones a los Términos</h2>
            <h3 className="text-xl font-medium mb-3">8.1 Derecho de Modificación</h3>
            <p className="mb-4">
              Risolvia se reserva el derecho de actualizar estos términos para reflejar cambios 
              en la plataforma, tecnología o marcos legales aplicables.
            </p>

            <h3 className="text-xl font-medium mb-3">8.2 Notificación de Cambios</h3>
            <p className="mb-4">
              Los cambios significativos serán notificados mediante:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Correo electrónico a usuarios registrados</li>
              <li>Notificaciones en la plataforma</li>
              <li>Aviso prominente en nuestro sitio web</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Vigencia y Terminación</h2>
            <p className="mb-4">
              Estos términos permanecen vigentes mientras utilice nuestra plataforma. 
              Tanto el usuario como Risolvia pueden terminar el uso del servicio en cualquier momento.
            </p>
            <p className="mb-4">
              La terminación no afecta conexiones ya establecidas con despachos ni 
              obligaciones contractuales pendientes con terceros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Jurisdicción y Ley Aplicable</h2>
            <p className="mb-4">
              Estos términos se rigen por la legislación uruguaya. Las controversias relacionadas 
              con el uso de la plataforma serán sometidas a la jurisdicción de los tribunales 
              competentes de Montevideo, Uruguay.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Datos de Contacto</h2>
            <p className="mb-4">
              Para consultas sobre la plataforma, conexiones con despachos o aspectos técnicos:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> vasyl@agentbooster.ai</p>
                <p><strong>Teléfono:</strong> (+598) 98 690 873</p>
                <p><strong>WhatsApp:</strong> (+598) 98 690 873</p>
                <p><strong>Horario de atención:</strong> Lunes a viernes, 9:00 - 18:00 (UTC-3)</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Disposiciones Finales</h2>
            <p className="mb-4">
              Al utilizar Risolvia, usted reconoce que comprende que somos una plataforma 
              tecnológica de conexión y no un proveedor directo de servicios legales.
            </p>
            <p className="mb-4">
              Si alguna disposición de estos términos resulta inválida, las demás 
              disposiciones mantendrán su plena vigencia.
            </p>
            <p className="mb-4">
              Estos términos constituyen el acuerdo completo entre las partes respecto 
              al uso de nuestra plataforma de conexión.
            </p>
          </section>
        </div>

        {/* Footer de la página */}
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>© 2025 Risolvia. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;
