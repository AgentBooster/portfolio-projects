# Fisia Software Frontend

Frontend estatico para una clinica de fisioterapia (Fisia) con landing comercial (incluye el widget y el agente en la version publicada) y diseño de panel interno del software.

Video demo (automatizacion para el sector salud):
https://youtu.be/FZiIpD6OlYc?si=eMArHdityJL3Hfsg

## Estructura

- marketing-site/index.html: landing page comercial con Tailwind CDN.
- pages/index.html: dashboard principal.
- pages/calendar.html: agenda y agenda diaria.
- pages/patient.html: ficha de paciente, planes y notas.
- pages/billing.html: facturacion y pagos.
- pages/reports.html: analitica y metricas.
- pages/session.html: detalle de sesion.
- assets/js/app.js: logica UI, flujos, estado en localStorage.
- assets/js/mock-data.js: datos semilla para el demo.
- widget/widget.js: widget embebible con configuracion (webhook_url).
- widget/widget-embed-example.html: ejemplo minimo de embed.
- Langchain Agent Fisia/fisia-langchain-agent.js: prompt y logica del agente para reservas/soporte.

## Uso rapido

- Abrir la landing y probar el widget: https://agentbooster.github.io/BooAgent/fisia_index.html
