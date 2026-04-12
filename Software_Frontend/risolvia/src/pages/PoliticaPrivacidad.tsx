
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PoliticaPrivacidad = () => {
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
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Fecha de última actualización:</strong> 23 de junio de 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Información General</h2>
            <p className="mb-4">En Risolvia, nos comprometemos a proteger la privacidad y seguridad de la información personal de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información cuando utiliza nuestra plataforma tecnológica que conecta personas con despachos de abogados especializados.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
            <h3 className="text-xl font-medium mb-3">2.1 Información Personal</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Información sobre su consulta legal</li>
              <li>Área legal de interés o especialización requerida</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Información Técnica</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Dirección IP</li>
              <li>Tipo de navegador y versión</li>
              <li>Sistema operativo</li>
              <li>Páginas visitadas y tiempo de navegación</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cómo Utilizamos su Información</h2>
            <p className="mb-4">Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Conectar usuarios con despachos de abogados especializados</li>
              <li>Procesar solicitudes de conexión y consultas legales</li>
              <li>Facilitar la comunicación entre usuarios y despachos asociados</li>
              <li>Mejorar nuestro algoritmo de matching y recomendaciones</li>
              <li>Comunicarnos con usted sobre el estado de sus consultas</li>
              <li>Personalizar su experiencia en nuestra plataforma</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Analizar el uso de nuestra plataforma para mejoras</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Base Legal para el Procesamiento</h2>
            <p className="mb-4">
              Procesamos su información personal basándonos en las siguientes bases legales:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Consentimiento:</strong> Cuando usted nos proporciona su consentimiento explícito</li>
              <li><strong>Ejecución de contrato:</strong> Para facilitar la conexión con despachos de abogados</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios de conexión y comunicación</li>
              <li><strong>Cumplimiento legal:</strong> Para cumplir con obligaciones regulatorias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Compartir Información</h2>
            <p className="mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las 
              siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Con su consentimiento explícito</li>
              <li>Con despachos de abogados asociados para facilitar la conexión legal</li>
              <li>Con proveedores de servicios que nos ayudan a operar nuestra plataforma</li>
              <li>Cuando sea requerido por ley o autoridades competentes</li>
              <li>Para proteger nuestros derechos legales o la seguridad de los usuarios</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Seguridad de los Datos</h2>
            <p className="mb-4">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
              su información personal contra acceso no autorizado, alteración, divulgación o destrucción:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cifrado de datos en tránsito y en reposo</li>
              <li>Controles de acceso estrictos</li>
              <li>Monitoreo continuo de seguridad</li>
              <li>Auditorías regulares de seguridad</li>
              <li>Capacitación del personal en protección de datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Retención de Datos</h2>
            <p className="mb-4">
              Conservamos su información personal solo durante el tiempo necesario para cumplir con 
              los propósitos descritos en esta política, salvo que la ley requiera un período de 
              retención más largo. Generalmente:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Datos de contacto: Hasta 3 años después de la última interacción</li>
              <li>Datos de consultas legales: Según requerimientos legales (mínimo 5 años)</li>
              <li>Datos técnicos: Hasta 12 meses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Sus Derechos</h2>
            <p className="mb-4">Usted tiene los siguientes derechos respecto a su información personal:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Acceso:</strong> Solicitar copia de su información personal</li>
              <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de su información</li>
              <li><strong>Restricción:</strong> Limitar el procesamiento de su información</li>
              <li><strong>Portabilidad:</strong> Recibir su información en formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de su información</li>
              <li><strong>Retirar consentimiento:</strong> En cualquier momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies</h2>
            <p className="mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia de conexión. Puede 
              gestionar sus preferencias de cookies a través de nuestra página de{' '}
              <Link to="/configuracion-cookies" className="text-primary hover:underline">
                Configuración de Cookies
              </Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Transferencias Internacionales</h2>
            <p className="mb-4">
              Si transferimos su información a países fuera de Uruguay, garantizamos que dichas 
              transferencias cumplan con las leyes de protección de datos aplicables y que sus 
              datos mantengan un nivel adecuado de protección.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Cambios a esta Política</h2>
            <p className="mb-4">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos 
              sobre cambios significativos por correo electrónico o mediante un aviso en nuestro sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
            <p className="mb-4">
              Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, 
              puede contactarnos:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> vasyl@agentbooster.ai</p>
              <p><strong>Teléfono:</strong> (+598) 98 690 873</p>
              <p><strong>WhatsApp:</strong> (+598) 98 690 873</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Autoridad de Control</h2>
            <p className="mb-4">
              Tiene derecho a presentar una queja ante la autoridad de protección de datos 
              competente en Uruguay si considera que el procesamiento de su información personal 
              viola las leyes aplicables.
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

export default PoliticaPrivacidad;
