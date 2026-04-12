import { Check, X } from "lucide-react";

const Servicios = () => {
  return (
    <div className="min-h-screen pt-28">
      {/* Header for semantic structure */}
      <header className="sr-only">
        <h1>Página de Servicios y Precios</h1>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-16 sm:pt-20 pb-8 sm:pb-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold tracking-widest text-indigo-400 dark:text-indigo-400 uppercase">
              Servicios y Precios
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Planes</h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl leading-8 text-slate-400 dark:text-slate-400">
              Lanza agentes conversacionales en horas. Prueba gratis, escala con un pack listo y, cuando lo necesites,
              te brindamos consultoría o construimos agentes a medida integrados a tus flujos.
            </p>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 items-stretch">
              {/* Plan 1: Gratis */}
              <div className="relative flex flex-col h-full w-full max-w-sm overflow-hidden border border-slate-700 dark:border-slate-700 light:border-slate-800 bg-gradient-to-br from-slate-950/50 to-slate-900/80 dark:from-slate-950/50 dark:to-slate-900/80 light:from-slate-100/50 light:to-slate-200/80 p-6 rounded-lg">
                <div className="flex flex-col items-center border-b pb-6 border-slate-700 dark:border-slate-700 light:border-slate-300">
                  <span className="mb-6 inline-block text-slate-50 dark:text-slate-50 light:text-slate-900">
                    Gratis
                  </span>
                  <span className="mb-3 inline-block text-4xl font-medium text-foreground">USD 0</span>
                  <span className="bg-gradient-to-br from-slate-200 to-slate-500 dark:from-slate-200 dark:to-slate-500 light:from-slate-700 light:to-slate-400 bg-clip-text text-center text-transparent text-sm">
                    Empieza sin riesgo con 3 agentes base
                  </span>
                </div>
                <div className="space-y-4 py-9 flex-grow">
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Agentes configurados e incluidos: 3
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Número de interacciones: Ilimitadas
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Soporte por email
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Entrenamiento profesional
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Soporte dedicado
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Integraciones (Shopify, Calendly, etc.)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Entrenamiento con tus datos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Orquestación con n8n y código
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Flujos complejos + handoff humano
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Embebido multicanal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Garantía de Boo
                    </span>
                  </div>
                </div>
                <a
                  href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold h-10 px-4 py-2 dark:text-slate-50 light:text-slate-900 hover:bg-slate-400/40 dark:hover:bg-slate-700/80 dark:hover:text-slate-50 light:hover:text-slate-900"
                >
                  Probar Gratis - BLOQUEADO
                </a>
              </div>

              {/* Plan 2: Personalizado (Recomendado) */}
              <div className="relative flex flex-col h-full w-full max-w-sm border-2 border-indigo-400 bg-gradient-to-br from-slate-950/50 to-slate-900/80 dark:from-slate-950/50 dark:to-slate-900/80 light:from-slate-100/50 light:to-slate-200/80 p-6 rounded-lg">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-400 px-4 py-1 text-sm font-semibold text-slate-900">
                    Recomendado
                  </span>
                </div>
                <div className="flex flex-col items-center border-b pb-6 border-slate-700 dark:border-slate-700 light:border-slate-300">
                  <span className="mb-6 inline-block text-slate-50 dark:text-slate-50 light:text-slate-900">
                    Personalizado
                  </span>
                  <span className="mb-3 inline-block text-4xl font-medium text-foreground">A convenir</span>
                  <span className="bg-gradient-to-br from-slate-200 to-slate-500 dark:from-slate-200 dark:to-slate-500 light:from-slate-700 light:to-slate-400 bg-clip-text text-center text-transparent text-sm">
                    Agentes a medida, integrados a tu negocio
                  </span>
                </div>
                <div className="space-y-4 py-9 flex-grow">
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Agentes configurados: A medida
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Número de interacciones: A demanda
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Soporte por email
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Entrenamiento profesional
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Soporte dedicado
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Integraciones (Shopify, Calendly, etc.)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Entrenamiento con tus datos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Orquestación con n8n y código
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Flujos complejos + handoff humano
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Embebido multicanal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Garantía de Boo
                    </span>
                  </div>
                </div>
                <a
                  href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold h-10 px-4 py-2 bg-indigo-400 text-slate-900 dark:text-slate-900 light:text-black hover:bg-indigo-500 dark:hover:bg-indigo-500 light:hover:bg-indigo-300"
                >
                  Agendar Consultoría
                </a>
              </div>

              {/* Plan 3: Premium */}
              <div className="relative flex flex-col h-full w-full max-w-sm overflow-hidden border border-slate-700 dark:border-slate-700 light:border-slate-800 bg-gradient-to-br from-slate-950/50 to-slate-900/80 dark:from-slate-950/50 dark:to-slate-900/80 light:from-slate-100/50 light:to-slate-200/80 p-6 rounded-lg">
                <div className="flex flex-col items-center border-b pb-6 border-slate-700 dark:border-slate-700 light:border-slate-300">
                  <span className="mb-6 inline-block text-slate-50 dark:text-slate-50 light:text-slate-900">
                    Premium
                  </span>
                  <span className="mb-3 inline-block text-4xl font-medium text-foreground">USD 29</span>
                  <span className="bg-gradient-to-br from-slate-200 to-slate-500 dark:from-slate-200 dark:to-slate-500 light:from-slate-700 light:to-slate-400 bg-clip-text text-center text-transparent text-sm">
                    Pack listo para operar en serio
                  </span>
                </div>
                <div className="space-y-4 py-9 flex-grow">
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Agentes configurados e incluidos: 5–6
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Número de interacciones: Ilimitadas
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Soporte por email
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Entrenamiento profesional
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-indigo-400 text-sm text-slate-900">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
                      Soporte dedicado
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Integraciones (Shopify, Calendly, etc.)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Entrenamiento con tus datos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Orquestación con n8n y código
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Flujos complejos + handoff humano
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Embebido multicanal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-4 place-content-center rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      <X className="size-3" />
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                      Garantía de Boo
                    </span>
                  </div>
                </div>
                <a
                  href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold h-10 px-4 py-2 dark:text-slate-50 light:text-slate-900 hover:bg-slate-400/40 dark:hover:bg-slate-700/80 dark:hover:text-slate-50 light:hover:text-slate-900"
                >
                  Mejorar al Premium - BLOQUEADO
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">Preguntas Frecuentes</h2>
              <div className="mt-10 space-y-4">
                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Qué es un "agente de IA"?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Un asistente conversacional desarrollado que entiende instrucciones, automatiza tareas y se conecta
                    a tus sistemas o herramientas.
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Qué diferencia hay entre el Plan Gratis y el Plan Premium?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Gratis es una base para probar un agente con buena ingeniería de prompt; Premium añade un desarrollo
                    más complejo explorando la conexión MCP, más agentes listos con herramientas y soporte dedicado.
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Ofrecen consultoría?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Sí, para empresas. Nuestro servicio principal es Consultoría + Implementación, también disponibles
                    por separado.
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Cómo funciona el Plan Personalizado?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Diagnóstico y requisitos → setup único por implementación que desarrollamos en una instancia/entorno
                    para ti → mantenimiento mensual para costes y soporte dedicado según necesidad (actualizaciones,
                    errores, modificaciones).
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Cuánto demora el Plan Personalizado?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Sprints de 1–3 semanas según complejidad; precios e inclusiones se ajustan por volumen y se definen
                    en la llamada.
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Puedo cambiar de plan en cualquier momento?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Sí; cada plan es independiente del otro.
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Cómo cuentan una interacción?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Cada mensaje de usuario procesado por un agente cuenta como una interacción (o llamada a la API del
                    modelo de IA).
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Qué integraciones soportan?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Prácticamente cualquiera con código y softwares como n8n (Shopify, Calendly, Stripe, Notion, etc.).
                  </p>
                </details>

                <details className="border-b border-slate-700 dark:border-slate-700 light:border-slate-300 pb-4 group">
                  <summary className="cursor-pointer font-semibold text-lg py-2 text-white dark:text-white light:text-slate-900 list-none flex justify-between items-center">
                    ¿Qué pasa con mis datos?
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="pt-2 text-slate-400 dark:text-slate-400 light:text-slate-600">
                    Se usan solo para tu solución en tu instancia propia, con seguridad y cumplimiento legal aplicable;
                    ofrecemos respaldo técnico/legal/contratos cuando corresponda.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Servicios;
