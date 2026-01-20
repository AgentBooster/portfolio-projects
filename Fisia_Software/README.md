# Fisia Software Frontend

Static frontend for a physiotherapy clinic: commercial landing, internal
software panel design, conversational widget, and agent prompt. The project is
intended as a functional demo and a product presentation.

## Overview

Fisia combines a commercial experience and an internal panel design for
physiotherapy clinics. Everything is built with HTML + Tailwind CDN, with demo
data and basic UI behavior in the browser.

## What it includes

- Commercial landing with CTA, value sections, and testimonials.
- Internal panel design with dashboard, calendar, patients, billing, reports,
  and clinical session (SOAP).
- Embeddable widget with webhook and conversational experience.
- Agent prompt and logic for bookings and support.
- Demo data and guided flows to create patient, appointment, and invoice.

## Demos

- Video demo (healthcare automation): https://youtu.be/FZiIpD6OlYc?si=eMArHdityJL3Hfsg
- Open to try the agent: https://agentbooster.github.io/BooAgent/fisia_index.html

## Quick use (local)

1. Commercial landing: open `marketing-site/index.html`.
2. Software panel: open `pages/index.html`.
3. Embeddable widget: open `widget/widget-embed-example.html`.
4. Clinical session (SOAP): open `pages/session.html`.

## Project structure

- `marketing-site/index.html`: commercial landing page with Tailwind CDN.
- `pages/index.html`: main dashboard.
- `pages/calendar.html`: daily and weekly calendar.
- `pages/patient.html`: patient profile with tabs (SOAP, plans, attachments, adherence).
- `pages/billing.html`: billing, filters, and payments.
- `pages/reports.html`: analytics, ranges, and adherence tables.
- `pages/session.html`: clinical session form (SOAP) + patient summary.
- `assets/js/app.js`: UI logic, flows (wizard), modals, and persistence in `localStorage`.
- `assets/js/mock-data.js`: seed data (patients, sessions, invoices, analytics).
- `assets/js/tailwind-config.js`: Tailwind theme and tokens.
- `assets/css/base.css`: base styles and utilities.
- `widget/widget.js`: embeddable widget with configuration (webhook).
- `widget/widget-embed-example.html`: minimal embed example.
- `langchain-n8n-agent-fisia/fisia-langchain-n8n-agent.js`: agent prompt and logic (bookings/support), used inside the LangChain node in n8n. Template flow: `Flows_JSON/n8n/Use Cases - Health Clinics.json`.

## Technologies

- HTML5 + Tailwind CDN
- Vanilla JavaScript
- LocalStorage for state and demo
- LangChain (agent prompt)
- n8n (workflow automation, included as workspace)
