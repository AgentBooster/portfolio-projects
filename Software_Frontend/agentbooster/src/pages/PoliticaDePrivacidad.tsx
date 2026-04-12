import { useEffect } from "react";
import { Helmet } from "react-helmet";

const PoliticaDePrivacidad = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Política de Privacidad | Agent Booster</title>
        <meta
          name="description"
          content="Política de privacidad y protección de datos de Agent Booster. Consultoría e implementación de sistemas CRM automatizados con enfoque en seguridad y cumplimiento."
        />
      </Helmet>

      {/* 
        CHECKLIST DE CAMPOS A COMPLETAR:
        - [Razón social completa]
        - [Domicilio fiscal completo]
        - Verificar email de contacto (actualmente team@agentbooster.ai)
        - [Nombre del DPO o responsable de datos, si aplica]
        - Revisar lista específica de proveedores/encargados de tratamiento
        - Validar marco de transferencias internacionales aplicable
      */}

      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <header className="mb-12 border-b border-border pb-6">
            <h1 className="text-4xl font-bold text-foreground mb-4">Política de Privacidad</h1>
            <p className="text-muted-foreground">
              <strong>Última actualización:</strong>{" "}
              {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Identidad y Contacto del Responsable</h2>
              <p className="text-muted-foreground mb-3">
                El responsable del tratamiento de los datos personales recogidos a través de este sitio web es:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Denominación:</strong> Agent Booster
                </li>
                <li>
                  <strong>Nombre comercial:</strong> Agent Booster
                </li>
                <li>
                  <strong>Email de contacto:</strong>{" "}
                  <a
                    href="mailto:team@agentbooster.ai"
                    className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words"
                  >
                    team@agentbooster.ai
                  </a>
                </li>
                <li>
                  <strong>Sitio web:</strong>{" "}
                  <a
                    href="https://agentbooster.ai"
                    className="no-underline hover:underline underline-offset-2 decoration-1 text-blue-500 dark:text-blue-500 visited:text-purple-700 dark:visited:text-purple-700 break-words transition-colors"
                  >
                    https://agentbooster.ai
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Datos Personales Tratados</h2>
              <p className="text-muted-foreground mb-3">
                Dependiendo del servicio o interacción que mantengas con nosotros, podemos recoger y tratar las
                siguientes categorías de datos personales:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Datos de identificación y contacto:</strong> nombre, apellidos, correo electrónico, teléfono,
                  empresa, cargo o puesto.
                </li>
                <li>
                  <strong>Información de comunicación:</strong> contenido de formularios, chat web, mensajes de WhatsApp
                  y correos electrónicos.
                </li>
                <li>
                  <strong>Datos técnicos:</strong> dirección IP, navegador, sistema operativo, logs de errores, eventos
                  de ejecución y metadatos de sesión.
                </li>
                <li>
                  <strong>Preferencias de agenda:</strong> fecha, hora y otros detalles proporcionados al reservar
                  reuniones (p. ej., Calendar).
                </li>
                <li>
                  <strong>Datos de transacción:</strong> información necesaria para procesar pagos a través de pasarelas
                  autorizadas (p. ej., Stripe), sin almacenar directamente datos de tarjetas.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Finalidades del Tratamiento</h2>
              <p className="text-muted-foreground mb-3">
                Tratamos tus datos personales con las siguientes finalidades:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Gestión de contactos y oportunidades:</strong> identificar y responder a consultas, evaluar y
                  preparar propuestas comerciales.
                </li>
                <li>
                  <strong>Agendar reuniones:</strong> coordinar citas y demos a través de herramientas de calendario.
                </li>
                <li>
                  <strong>Prestación y mantenimiento de servicios:</strong> diseñar, implementar y operar sistemas CRM
                  automatizados con n8n (self-hosted), integrar herramientas como Airtable, Notion, Supabase, Google
                  Sheets, HubSpot, Pipedrive, Zoho, Monday, Gmail, Slack, WhatsApp API, Stripe, Calendly y APIs
                  privadas, entre otras.
                </li>
                <li>
                  <strong>Soporte técnico:</strong> resolver incidencias, proporcionar actualizaciones y realizar
                  mantenimiento periódico de los flujos implementados.
                </li>
                <li>
                  <strong>Seguridad y control:</strong> monitorizar logs, detectar anomalías, prevenir fraude, spam o
                  accesos no autorizados, y realizar copias de seguridad.
                </li>
                <li>
                  <strong>Mejora de procesos:</strong> analizar el funcionamiento técnico de las automatizaciones y
                  optimizar la experiencia de usuario.
                </li>
                <li>
                  <strong>Cumplimiento normativo:</strong> atender obligaciones legales, contables, fiscales o de
                  protección de datos.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Bases Legales del Tratamiento</h2>
              <p className="text-muted-foreground mb-3">
                El tratamiento de tus datos personales se fundamenta en las siguientes bases jurídicas:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Consentimiento:</strong> cuando te suscribes a newsletters, completas formularios de contacto
                  o aceptas expresamente el tratamiento para marketing.
                </li>
                <li>
                  <strong>Ejecución de contrato o medidas precontractuales:</strong> para gestionar propuestas, cerrar
                  acuerdos de servicio e implementar soluciones CRM automatizadas.
                </li>
                <li>
                  <strong>Interés legítimo:</strong> para garantizar la seguridad de la infraestructura, prevenir
                  fraude, mejorar la calidad del servicio y realizar analítica técnica no intrusiva.
                </li>
                <li>
                  <strong>Cumplimiento de obligaciones legales:</strong> cuando la normativa vigente exija conservar
                  registros, emitir facturas o responder a autoridades competentes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Fuentes de Datos</h2>
              <p className="text-muted-foreground mb-3">Los datos personales provienen principalmente de:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Formularios de contacto, chat widget y otros canales de comunicación habilitados en nuestro sitio web.
                </li>
                <li>Correos electrónicos enviados directamente a nuestras cuentas corporativas.</li>
                <li>Conversaciones mediante WhatsApp u otras herramientas de mensajería autorizada.</li>
                <li>Calendarios de reserva (p. ej., Calendar) cuando agendas reuniones con nuestro equipo.</li>
                <li>
                  Integraciones y plataformas autorizadas por el cliente en el marco de la prestación del servicio (CRM,
                  APIs privadas, etc.).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Compartición de Datos y Encargados del Tratamiento
              </h2>
              <p className="text-muted-foreground mb-3">
                Para prestar nuestros servicios, podemos compartir datos personales con terceros que actúan como
                encargados del tratamiento bajo contrato. Estas categorías incluyen:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Proveedores de infraestructura y hosting:</strong> VPS (p. ej., Hostinger u otros), servicios
                  de almacenamiento en la nube y gestión de servidores para alojar n8n y las automatizaciones.
                </li>
                <li>
                  <strong>Servicios de correo electrónico:</strong> Gmail, servicios de envío transaccional y
                  plataformas de gestión de comunicaciones.
                </li>
                <li>
                  <strong>Herramientas de mensajería:</strong> WhatsApp API, Slack y otras soluciones de comunicación
                  empresarial.
                </li>
                <li>
                  <strong>Plataformas CRM y bases de datos:</strong> Airtable, Notion, Supabase, Google Sheets, HubSpot,
                  Pipedrive, Zoho, Monday, según las necesidades del proyecto.
                </li>
                <li>
                  <strong>Pasarelas de pago:</strong> Stripe u otros procesadores autorizados para gestionar
                  transacciones de forma segura.
                </li>
                <li>
                  <strong>Calendarios y herramientas de agenda:</strong> Calendly u otros servicios de coordinación de
                  reuniones.
                </li>
                <li>
                  <strong>APIs privadas y servicios especializados:</strong> integraciones específicas solicitadas por
                  el cliente para cumplir con los requisitos del proyecto.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Todos los encargados del tratamiento están sujetos a contratos que garantizan la confidencialidad,
                seguridad y uso exclusivo de los datos para las finalidades autorizadas. No compartimos datos personales
                con terceros para fines publicitarios o comerciales ajenos a nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Transferencias Internacionales</h2>
              <p className="text-muted-foreground">
                Algunos de los proveedores y herramientas mencionados pueden estar ubicados fuera del Espacio Económico
                Europeo (EEE). En tales casos, garantizamos que las transferencias se realizan mediante mecanismos
                adecuados, como:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
                <li>Cláusulas contractuales tipo aprobadas por la Comisión Europea.</li>
                <li>
                  Adhesión a marcos de certificación reconocidos (p. ej., Privacy Shield o equivalentes vigentes).
                </li>
                <li>Decisiones de adecuación adoptadas por las autoridades competentes.</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Puedes solicitar más información sobre las garantías específicas aplicables a cada proveedor contactando
                a{" "}
                <a
                  href="mailto:team@agentbooster.ai"
                  className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words"
                >
                  team@agentbooster.ai
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Plazos de Conservación</h2>
              <p className="text-muted-foreground mb-3">
                Conservamos tus datos personales únicamente durante el tiempo necesario para cumplir con las finalidades
                descritas:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Relación activa:</strong> mientras dure la prestación del servicio, la gestión de consultas o
                  la ejecución del contrato.
                </li>
                <li>
                  <strong>Obligaciones legales:</strong> el periodo exigido por la normativa fiscal, contable o
                  sectorial aplicable.
                </li>
                <li>
                  <strong>Intereses legítimos:</strong> logs de seguridad y copias de seguridad se conservan con
                  ventanas de retención razonables (habitualmente entre 30 y 180 días, según criticidad).
                </li>
                <li>
                  <strong>Marketing:</strong> hasta que retires tu consentimiento o ejerzas tu derecho de oposición.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Transcurridos estos plazos, procederemos a la supresión segura o anonimización de tus datos personales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Derechos de las Personas Interesadas</h2>
              <p className="text-muted-foreground mb-3">Como titular de tus datos personales, tienes derecho a:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Acceso:</strong> obtener confirmación sobre si tratamos tus datos y acceder a una copia de los
                  mismos.
                </li>
                <li>
                  <strong>Rectificación:</strong> corregir datos inexactos o incompletos.
                </li>
                <li>
                  <strong>Supresión:</strong> solicitar la eliminación de tus datos cuando ya no sean necesarios o hayas
                  retirado tu consentimiento.
                </li>
                <li>
                  <strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo o con fines de
                  marketing directo.
                </li>
                <li>
                  <strong>Limitación:</strong> solicitar que restrinjamos el tratamiento en determinados supuestos.
                </li>
                <li>
                  <strong>Portabilidad:</strong> recibir tus datos en formato estructurado, de uso común y lectura
                  mecánica, y transmitirlos a otro responsable.
                </li>
                <li>
                  <strong>No ser objeto de decisiones automatizadas:</strong> cuando aplique, solicitar intervención
                  humana en decisiones basadas exclusivamente en tratamiento automatizado.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Para ejercer cualquiera de estos derechos, envía un correo a{" "}
                <a
                  href="mailto:team@agentbooster.ai"
                  className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words"
                >
                  team@agentbooster.ai
                </a>{" "}
                indicando tu nombre completo, el derecho que deseas ejercer y, en su caso, documentación que acredite tu
                identidad. Responderemos en un plazo máximo de un mes (prorrogable en casos complejos).
              </p>
              <p className="text-muted-foreground mt-3">
                Si consideras que el tratamiento de tus datos vulnera la normativa o que no hemos atendido correctamente
                tu solicitud, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos
                (
                <a
                  href="https://www.aepd.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:underline underline-offset-2 decoration-1 text-blue-500 dark:text-blue-500 visited:text-purple-700 dark:visited:text-purple-700 break-words transition-colors"
                >
                  www.aepd.es
                </a>
                ) u otra autoridad de control competente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Medidas de Seguridad</h2>
              <p className="text-muted-foreground mb-3">
                Aplicamos medidas técnicas y organizativas para proteger tus datos personales frente a accesos no
                autorizados, pérdida, alteración o divulgación indebida:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Control de accesos:</strong> autenticación robusta, credenciales seguras y gestión de permisos
                  por roles.
                </li>
                <li>
                  <strong>Entornos privados:</strong> despliegue de n8n en VPS dedicado con configuraciones de red
                  restringidas.
                </li>
                <li>
                  <strong>Cifrado:</strong> transmisión de datos mediante HTTPS/TLS y cifrado de información sensible en
                  reposo cuando corresponda.
                </li>
                <li>
                  <strong>Copias de seguridad:</strong> backups periódicos con procedimientos de restauración
                  documentados.
                </li>
                <li>
                  <strong>Auditoría y monitorización:</strong> revisión continua de logs, alertas de actividad anómala y
                  análisis de eventos de seguridad.
                </li>
                <li>
                  <strong>Actualizaciones y parches:</strong> mantenimiento proactivo de sistemas operativos,
                  dependencias y herramientas de automatización.
                </li>
                <li>
                  <strong>Capacitación del equipo:</strong> formación interna en buenas prácticas de privacidad y
                  seguridad de la información.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                No obstante, ningún sistema es completamente infalible. Te recomendamos que protejas tus credenciales y
                nos informes inmediatamente de cualquier sospecha de acceso no autorizado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground mb-3">
                Este sitio web puede utilizar cookies y tecnologías similares para mejorar la experiencia de navegación,
                realizar analítica técnica y recordar preferencias de usuario (p. ej., tema claro/oscuro).
              </p>
              <p className="text-muted-foreground mb-3">
                <strong>Tipos de cookies que podemos utilizar:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Cookies técnicas:</strong> esenciales para el funcionamiento del sitio (navegación, acceso a
                  áreas seguras).
                </li>
                <li>
                  <strong>Cookies de preferencias:</strong> recuerdan tus elecciones (idioma, tema, ajustes de
                  visualización).
                </li>
                <li>
                  <strong>Cookies analíticas:</strong> recopilan información agregada sobre el uso del sitio para
                  mejorar su rendimiento.
                </li>
                <li>
                  <strong>Cookies de terceros:</strong> servicios integrados (p. ej., widgets de redes sociales,
                  herramientas de calendario) que pueden establecer sus propias cookies.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Al acceder a nuestro sitio web, podrás configurar o rechazar el uso de cookies no esenciales mediante el{" "}
                <strong>banner/gestor de consentimiento</strong> que aparece en tu primera visita. Puedes modificar tu
                configuración en cualquier momento desde la opción "Configuración de Cookies" del footer o desde los
                ajustes de tu navegador.
              </p>
              <p className="text-muted-foreground mt-3">
                Para más información detallada sobre las cookies específicas que utilizamos, sus finalidades y plazos de
                conservación, consulta nuestra <strong>Política de Cookies</strong> [enlazar cuando esté disponible].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Relación con Clientes B2B y Roles de Tratamiento
              </h2>
              <p className="text-muted-foreground mb-3">
                En función del contexto de la relación comercial, podemos actuar como:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Responsable del tratamiento:</strong> cuando recogemos y tratamos datos personales a través de
                  nuestro sitio web, formularios de contacto, chat, email o WhatsApp para gestionar consultas,
                  propuestas y contratación de servicios. En estos casos, aplica íntegramente esta Política de
                  Privacidad.
                </li>
                <li>
                  <strong>Encargado del tratamiento:</strong> cuando, en el marco de la implementación y mantenimiento
                  de sistemas CRM automatizados, accedemos a datos personales gestionados por nuestros clientes (p. ej.,
                  contactos almacenados en su Airtable, Notion, HubSpot, Pipedrive, etc.). En estos supuestos, actuamos
                  bajo las instrucciones documentadas del cliente-responsable, quien determina las finalidades y medios
                  esenciales del tratamiento. La relación se formaliza mediante un{" "}
                  <strong>Acuerdo de Encargo de Tratamiento (DPA)</strong> que establece obligaciones de
                  confidencialidad, seguridad, subencargados autorizados, asistencia en el ejercicio de derechos y
                  notificación de brechas de seguridad.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Si eres cliente y tienes dudas sobre tu rol como responsable o sobre el contenido del DPA, contacta con
                nosotros en{" "}
                <a
                  href="mailto:team@agentbooster.ai"
                  className="no-underline text-blue-500 dark:text-blue-500 visited:text-blue-500 dark:visited:text-blue-500 break-words"
                >
                  team@agentbooster.ai
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Actualizaciones de esta Política</h2>
              <p className="text-muted-foreground mb-3">
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento para adaptarla a
                cambios normativos, nuevas funcionalidades del sitio web, evolución de nuestros servicios o mejores
                prácticas en materia de protección de datos.
              </p>
              <p className="text-muted-foreground mb-3">
                Cuando realicemos modificaciones sustanciales, te informaremos mediante:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Aviso destacado en la página principal de nuestro sitio web.</li>
                <li>
                  Notificación por correo electrónico, si disponemos de tu dirección y mantienes una relación activa con
                  nosotros.
                </li>
                <li>Actualización de la fecha de "Última actualización" en la cabecera de esta página.</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Te recomendamos revisar periódicamente esta Política de Privacidad para estar informado sobre cómo
                protegemos tus datos personales.
              </p>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contacto y Ejercicio de Derechos</h2>
              <p className="text-muted-foreground mb-3">
                Para cualquier consulta relacionada con esta Política de Privacidad, el tratamiento de tus datos
                personales o el ejercicio de tus derechos, puedes contactarnos en:
              </p>
              <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-2">
                <p className="text-foreground">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:team@agentbooster.ai" className="text-primary hover:underline">
                    team@agentbooster.ai
                  </a>
                </p>
                <p className="text-foreground">
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/59898690873"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    +598 98 690 873
                  </a>
                </p>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Atenderemos tu solicitud en un plazo máximo de un mes desde la recepción de la misma, pudiendo
                prorrogarse dos meses adicionales en función de la complejidad y el número de peticiones. En cualquier
                caso, te informaremos de dicha prórroga en el plazo de un mes desde la solicitud inicial.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default PoliticaDePrivacidad;
