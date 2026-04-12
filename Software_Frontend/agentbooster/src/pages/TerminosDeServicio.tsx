import { useEffect } from "react";
import { Helmet } from "react-helmet";

const TerminosDeServicio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <Helmet>
        <title>Términos de Servicio | Agent Booster</title>
        <meta 
          name="description" 
          content="Términos y condiciones de uso de los servicios de consultoría y automatización de Agent Booster." 
        />
      </Helmet>

      {/* 
        CHECKLIST INTERNO:
        [ ] Actualizar fecha de "Última actualización"
        [ ] Completar [planes y condiciones comerciales] si aplica
        [ ] Verificar enlace del footer: /terminos-de-servicio
      */}

      <main className="min-h-screen bg-background py-16 px-6">
        <article className="container mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Términos de Servicio
            </h1>
            <p className="text-sm text-muted-foreground">
              Última actualización: {today}
            </p>
          </header>

          <div className="space-y-8 text-foreground">
            {/* 1. Aceptación y alcance */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceptación y alcance</h2>
              <p className="mb-3 leading-relaxed">
                Al acceder y utilizar el sitio web de <strong>Agent Booster</strong> y los servicios que ofrecemos, 
                usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, 
                no debe utilizar nuestros servicios.
              </p>
              <p className="mb-3 leading-relaxed">
                Estos términos aplican a todos los usuarios y clientes de nuestros servicios de consultoría, implementación 
                de automatizaciones, sistemas CRM y soporte técnico. El idioma aplicable es el español, y cualquier traducción 
                tiene carácter meramente informativo.
              </p>
            </section>

            {/* 2. Descripción de servicios */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Descripción de servicios</h2>
              <p className="mb-3 leading-relaxed">
                <strong>Agent Booster</strong> es una consultoría especializada en la automatización de procesos empresariales 
                para negocios high-ticket. Nuestros servicios incluyen:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                <li>Consultoría y diseño de sistemas CRM personalizados</li>
                <li>Implementación de flujos de automatización con n8n (self-hosted)</li>
                <li>Integración con herramientas como Gmail, WhatsApp API, Calendly, Stripe, Airtable, Notion, Supabase, 
                    HubSpot, Pipedrive, Zoho, Monday y otras plataformas</li>
                <li>Configuración de infraestructura en VPS recomendados (p. ej., Hostinger)</li>
                <li>Soporte técnico, mantenimiento y actualizaciones periódicas</li>
                <li>Implementación de medidas de seguridad, copias de seguridad y monitorización</li>
              </ul>
              <p className="mb-3 leading-relaxed">
                Los servicios se prestan conforme al alcance definido en cada propuesta o contrato específico. 
                No garantizamos resultados comerciales concretos, ya que estos dependen de múltiples factores fuera de nuestro control.
              </p>
            </section>

            {/* 3. Cuentas y uso permitido */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cuentas y uso permitido</h2>
              <p className="mb-3 leading-relaxed">
                Si crea una cuenta o accede a sistemas implementados por nosotros, usted es responsable de mantener 
                la confidencialidad de sus credenciales y de todas las actividades que ocurran bajo su cuenta.
              </p>
              <p className="mb-3 leading-relaxed">
                <strong>Está prohibido:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                <li>Utilizar los servicios para fines ilegales, fraudulentos o no autorizados</li>
                <li>Intentar vulnerar la seguridad de nuestros sistemas o los de terceros</li>
                <li>Enviar spam, malware o contenido dañino a través de las automatizaciones</li>
                <li>Realizar ingeniería inversa, descompilar o intentar extraer código fuente de nuestras soluciones propietarias</li>
                <li>Sobrecargar intencionalmente la infraestructura o interferir con el uso normal de otros usuarios</li>
              </ul>
              <p className="mb-3 leading-relaxed">
                Nos reservamos el derecho de suspender o cancelar el acceso a los servicios si detectamos un uso indebido.
              </p>
            </section>

            {/* 4. Integraciones y terceros */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Integraciones y terceros</h2>
              <p className="mb-3 leading-relaxed">
                Nuestros servicios pueden utilizar o conectarse con plataformas y proveedores de terceros necesarios para 
                el funcionamiento de las automatizaciones y sistemas CRM (por ejemplo, APIs de WhatsApp, Gmail, Calendly, Stripe, 
                proveedores de hosting, herramientas de almacenamiento, entre otros).
              </p>
              <p className="mb-3 leading-relaxed">
                El uso de estas integraciones está sujeto a los términos y políticas de cada proveedor. 
                <strong> Agent Booster</strong> no se hace responsable de cambios, interrupciones o políticas de terceros que 
                puedan afectar el funcionamiento de las integraciones implementadas.
              </p>
              <p className="mb-3 leading-relaxed">
                En caso de que un proveedor externo modifique sus condiciones o discontinúe un servicio, trabajaremos contigo 
                para buscar alternativas viables, pero no podemos garantizar la continuidad indefinida de servicios de terceros.
              </p>
            </section>

            {/* 5. Precios y pagos */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Precios y pagos</h2>
              <p className="mb-3 leading-relaxed">
                Los precios de nuestros servicios se acuerdan de forma individual según el alcance del proyecto y se detallan 
                en la propuesta comercial o contrato específico.
              </p>
              <p className="mb-3 leading-relaxed">
                <strong>[Planes y condiciones comerciales]</strong> — Los términos de pago, plazos de entrega, condiciones de 
                reembolso (si aplican) y tarifas de mantenimiento se especifican en cada acuerdo comercial.
              </p>
              <p className="mb-3 leading-relaxed">
                Nos reservamos el derecho de modificar nuestras tarifas para nuevos proyectos, pero respetaremos los precios 
                acordados en contratos vigentes salvo renovación o extensión de servicios.
              </p>
            </section>

            {/* 6. Propiedad intelectual */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Propiedad intelectual</h2>
              <p className="mb-3 leading-relaxed">
                Todo el contenido del sitio web de <strong>Agent Booster</strong> (textos, imágenes, logotipos, diseño, código fuente, 
                metodologías propietarias) es propiedad de Agent Booster o de sus licenciantes y está protegido por leyes de propiedad 
                intelectual.
              </p>
              <p className="mb-3 leading-relaxed">
                Se concede una licencia limitada, no exclusiva y no transferible para utilizar el sitio web con fines informativos 
                y para acceder a los servicios contratados. No se permite la reproducción, distribución o modificación del contenido 
                sin autorización expresa.
              </p>
              <p className="mb-3 leading-relaxed">
                Los datos, procesos y configuraciones específicas implementadas para cada cliente son propiedad del cliente. 
                Agent Booster conserva los derechos sobre las herramientas, plantillas y metodologías genéricas utilizadas en la implementación.
              </p>
            </section>

            {/* 7. Limitación de responsabilidad y descargos */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitación de responsabilidad y descargos</h2>
              <p className="mb-3 leading-relaxed">
                Los servicios de <strong>Agent Booster</strong> se proporcionan <strong>"tal cual"</strong> y <strong>"según disponibilidad"</strong>. 
                Nos esforzamos por garantizar la calidad, seguridad y estabilidad de las implementaciones, pero no podemos garantizar un 
                funcionamiento libre de errores en todo momento.
              </p>
              <p className="mb-3 leading-relaxed">
                <strong>Agent Booster</strong> no será responsable de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                <li>Pérdidas derivadas de interrupciones de servicios de terceros (APIs, hosting, plataformas externas)</li>
                <li>Daños indirectos, incidentales o consecuentes (pérdida de beneficios, datos o oportunidades de negocio)</li>
                <li>Uso inadecuado de las automatizaciones o violaciones de políticas de terceros por parte del cliente</li>
                <li>Fallas de seguridad derivadas de credenciales comprometidas o malas prácticas del usuario</li>
              </ul>
              <p className="mb-3 leading-relaxed">
                En cualquier caso, nuestra responsabilidad total se limita al monto pagado por el cliente en los últimos 12 meses 
                por los servicios relacionados con el reclamo, salvo que la ley aplicable establezca lo contrario.
              </p>
            </section>

            {/* 8. Soporte, cambios y disponibilidad */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Soporte, cambios y disponibilidad</h2>
              <p className="mb-3 leading-relaxed">
                Ofrecemos soporte técnico y mantenimiento según los términos acordados en cada contrato. El soporte puede incluir 
                actualizaciones de seguridad, ajustes de configuración, resolución de incidencias y mejoras periódicas.
              </p>
              <p className="mb-3 leading-relaxed">
                Nos reservamos el derecho de modificar, actualizar o descontinuar funcionalidades específicas del sitio web o de 
                nuestros servicios, siempre que ello no afecte de manera sustancial los acuerdos vigentes con clientes.
              </p>
              <p className="mb-3 leading-relaxed">
                Podemos programar mantenimientos técnicos que impliquen interrupciones temporales. En la medida de lo posible, 
                notificaremos con antelación estas ventanas de mantenimiento.
              </p>
            </section>

            {/* 9. Contacto */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
              <p className="mb-3 leading-relaxed">
                Para cualquier consulta relacionada con estos Términos de Servicio, puede contactarnos en:
              </p>
              <p className="mb-3 leading-relaxed">
                <strong>Email:</strong>{" "}
                <a 
                  href="mailto:team@agentbooster.ai" 
                  className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words"
                >
                  team@agentbooster.ai
                </a>
              </p>
              <p className="mb-3 leading-relaxed">
                Responderemos en un plazo razonable y trabajaremos para resolver cualquier duda o inconveniente.
              </p>
            </section>

            {/* Cambios en los Términos */}
            <section className="border-t pt-8 mt-8">
              <h2 className="text-2xl font-semibold mb-4">Cambios en los Términos</h2>
              <p className="mb-3 leading-relaxed">
                Podemos actualizar estos Términos de Servicio periódicamente para reflejar cambios en nuestras prácticas, servicios 
                o requisitos legales. Cuando realicemos cambios significativos, publicaremos la nueva versión en esta página con la 
                fecha de "Última actualización" modificada.
              </p>
              <p className="mb-3 leading-relaxed">
                Le recomendamos revisar esta página regularmente. El uso continuado de nuestros servicios tras la publicación de cambios 
                constituye su aceptación de los nuevos términos.
              </p>
            </section>
          </div>
        </article>
      </main>
    </>
  );
};

export default TerminosDeServicio;
