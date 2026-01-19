# Fisia Software Frontend

Frontend estatico para una clinica de fisioterapia: landing comercial, diseno de panel interno del software, widget conversacional y prompt de agente. El proyecto esta pensado como demo funcional y presentacion de producto.

## Vision general

Fisia combina una experiencia comercial y un diseno de panel interno para clinicas de fisioterapia. Todo esta resuelto en HTML + Tailwind CDN, con datos de demostracion y comportamiento UI basico en el navegador.

## Lo que incluye

- Landing comercial con CTA, secciones de valor y testimonios.
- Diseno de panel interno con dashboard, agenda, pacientes, facturacion, reportes y sesion clinica (SOAP).
- Widget embebible con webhook y experiencia conversacional.
- Prompt y logica de agente para reservas y soporte.
- Datos de demo y flujos guiados para crear paciente, cita y factura.

## Demos

- Video demo (automatizacion para el sector salud): https://youtu.be/FZiIpD6OlYc?si=eMArHdityJL3Hfsg
- Abrir para probar el agente: https://agentbooster.github.io/BooAgent/fisia_index.html

## Uso rapido (local)

1. Landing comercial: abrir `marketing-site/index.html`.
2. Panel del software: abrir `pages/index.html`.
3. Widget embebible: abrir `widget/widget-embed-example.html`.
4. Sesion clinica (SOAP): abrir `pages/session.html`.

## Estructura del proyecto

- `marketing-site/index.html`: landing page comercial con Tailwind CDN.
- `pages/index.html`: dashboard principal.
- `pages/calendar.html`: agenda diaria y semanal.
- `pages/patient.html`: perfil de paciente con tabs (SOAP, planes, adjuntos, adherencia).
- `pages/billing.html`: facturacion, filtros y pagos.
- `pages/reports.html`: analitica, rangos y tablas de adherencia.
- `pages/session.html`: formulario de sesion clinica (SOAP) + resumen de paciente.
- `assets/js/app.js`: logica UI, flujos (wizard), modales y persistencia en `localStorage`.
- `assets/js/mock-data.js`: datos semilla (pacientes, sesiones, facturas, analitica).
- `assets/js/tailwind-config.js`: tema y tokens de Tailwind.
- `assets/css/base.css`: estilos base y utilidades.
- `widget/widget.js`: widget embebible con configuracion (webhook).
- `widget/widget-embed-example.html`: ejemplo minimo de embed.
- `Langchain Agent Fisia/fisia-langchain-agent.js`: prompt y logica del agente (reservas/soporte).
- `Langchain Agent Fisia/n8n/`: workspace de n8n para automatizaciones (ver README interno).

## Tecnologias

- HTML5 + Tailwind CDN
- JavaScript vanilla
- LocalStorage para estado y demo
- LangChain (prompt del agente)
- n8n (workflow automation, incluido como workspace)
