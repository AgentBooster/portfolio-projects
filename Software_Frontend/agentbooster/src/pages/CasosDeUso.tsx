import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CasosDeUso = () => {
  const location = useLocation();
  const isOnCasosPage = location.pathname === "/casos-de-uso";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastClickedCard, setLastClickedCard] = useState<HTMLLIElement | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [fillTimeout, setFillTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentCardData, setCurrentCardData] = useState<any>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const probarAgenteBtnMobileRef = useRef<HTMLButtonElement>(null);
  const probarAgenteBtnDesktopRef = useRef<HTMLButtonElement>(null);

  // Datos de las tarjetas
  const cardsData = [
    {
      title: "E-commerce",
      description:
        "Mejora la experiencia del cliente y aumenta la conversión con soporte instantáneo. (Contraseña de la Web de Prueba: auria)",
      problema:
        "El soporte lento y las dudas sobre tallas, stock, estado del pedido, y recomendaciones generaban estrés y carritos abandonados.",
      solucion:
        "Un agente IA que responde consultas al instante sobre productos o pedidos, accede a la base de datos para verificar stock y ofrece recomendaciones de estilo personalizadas, mejorando la satisfacción y las ventas. Opcionalmente puede agregarse la capacidad de agregar al carrito.",
      productoHtml:
        '<img src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1761710866/Captura_de_pantalla_2025-10-29_a_la_s_00.56.47_khnxya.jpg" alt="Producto en Acción para E-commerce" class="rounded-lg w-full">',
      antesSrc:
        "https://res.cloudinary.com/dsdnpstgi/image/upload/v1761710866/Captura_de_pantalla_2025-10-29_a_la_s_00.55.04_z2rxdo.jpg",
      despuesSrc:
        "https://res.cloudinary.com/dsdnpstgi/image/upload/v1761711067/Disen%CC%83o_sin_ti%CC%81tulo_7_zyvf4g.jpg",
      redirectUrl: "https://auria-wear.myshopify.com/",
      isLive: true,
    },
    {
      title: "Despachos Jurídicos",
      description: "Captación y cualificación de clientes potenciales para mejorar la presencia online.",
      problema:
        "El despacho carecía de presencia online, atrayendo clientes poco cualificados con dudas recurrentes que consumían tiempo valioso.",
      solucion:
        "Implementamos un agente IA que cualifica a los visitantes, responde preguntas frecuentes 24/7 y agenda consultas solo con clientes potenciales serios, mejorando su visibilidad y eficiencia.",
      productoHtml:
        '<img src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1757130995/Captura_de_pantalla_2025-09-05_a_la_s_23.52.39_co89bn.png" alt="Producto en Acción para Despacho Jurídico" class="rounded-lg w-full">',
      antesSrc:
        "https://res.cloudinary.com/dsdnpstgi/image/upload/v1757130995/Captura_de_pantalla_2025-09-05_a_la_s_23.50.06_vpbbae.jpg",
      despuesSrc:
        "https://res.cloudinary.com/dsdnpstgi/image/upload/v1757130995/Captura_de_pantalla_2025-09-05_a_la_s_23.50.44_pakbxx.jpg",
      redirectUrl: "https://risolvia.com/",
      isLive: true,
    },
    {
      title: "Centros de Montaña",
      description: "Agiliza la compra de tickets y resuelve dudas de turistas para una mejor experiencia.",
      problema:
        "Colas demoradas y turistas con dudas sobre precios y horarios, lo que provocaba una mala experiencia general.",
      solucion:
        "Un agente IA que gestiona la compra anticipada de tickets y equipos, responde preguntas frecuentes sobre el centro y ofrece recomendaciones, eliminando las largas esperas y mejorando la experiencia del visitante.",
      productoHtml:
        `<img src="${import.meta.env.BASE_URL}images/centros-montana-producto.jpg" alt="Producto en Acción para Centro de Esquí" class="rounded-lg w-full">`,
      antesSrc: `${import.meta.env.BASE_URL}images/centros-montana-antes.jpg`,
      despuesSrc: `${import.meta.env.BASE_URL}images/centros-montana-despues.jpg`,
      redirectUrl: "https://altavia-winter-wonder.lovable.app/",
      isLive: true,
    },
    {
      title: "Clínicas de Salud",
      description: "Automatización inteligente de reservas y atención básica al paciente.",
      problema:
        "La clínica recibía muchas consultas por teléfono y WhatsApp, el equipo administrativo estaba saturado, se duplicaban reservas y había confusiones con horarios y tipos de servicio.",
      solucion:
        "Implementamos un agente IA que atiende en la web y WhatsApp, recoge motivo de consulta, tipo de servicio, modalidad y rango horario, comprueba disponibilidad en el calendario, agenda la cita dentro del horario de apertura, envía los datos al Software, CRM y responde FAQs 24/7. El equipo se libera de tareas repetitivas y puede enfocarse en la atención presencial.",
      productoHtml:
        '<img src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1763031874/Captura_de_pantalla_2025-11-13_a_la_s_08.04.18_spx79e.png" alt="Producto en Acción para Clínicas de Salud" class="rounded-lg w-full">',
      antesSrc:
        "https://res.cloudinary.com/dsdnpstgi/image/upload/v1763031561/Captura_de_pantalla_2025-11-13_a_la_s_07.58.55_cc980x.png",
      despuesSrc:
        "https://res.cloudinary.com/dsdnpstgi/image/upload/v1763031630/Captura_de_pantalla_2025-11-13_a_la_s_07.59.46_rgv7gj.png",
      redirectUrl: "https://agentbooster.github.io/BooAgent/fisia_index.html",
      isLive: true,
    },
    {
      title: "Próximamente...",
      description: "Un nuevo caso de estudio está en camino.",
      problema: "",
      solucion: "",
      productoHtml: "",
      antesSrc: "",
      despuesSrc: "",
      redirectUrl: undefined,
      isLive: false,
      isComingSoon: true,
    },
  ];

  useEffect(() => {
    if (isOnCasosPage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
      setupHoverPause();
    }
  }, [isOnCasosPage]);

  const addAnimation = () => {
    const scrollers = document.querySelectorAll(".scroller");

    scrollers.forEach((scroller, index) => {
      let cardsToDisplay;

      // Filtrar tarjetas según la fila del carrusel
      if (index === 0) {
        cardsToDisplay = cardsData.filter((card) => card.title !== "Centros de Montaña");
      } else if (index === 1) {
        cardsToDisplay = cardsData.filter((card) => card.title !== "E-commerce");
      } else if (index === 2) {
        cardsToDisplay = cardsData.filter((card) => card.title !== "Despachos Jurídicos");
      } else if (index === 3) {
        cardsToDisplay = cardsData.filter((card) => card.title !== "Clínicas de Salud");
      } else {
        cardsToDisplay = cardsData;
      }

      const ul = scroller.querySelector("ul");
      if (ul) {
        ul.innerHTML = "";

        cardsToDisplay.forEach((cardData) => {
          const li = document.createElement("li");
          li.className = cardData.isComingSoon
            ? "w-[340px] h-56 max-w-full relative rounded-2xl border border-dashed border-gray-700 dark:border-gray-700 border-gray-300 bg-card p-6 flex-shrink-0 flex flex-col justify-center items-center text-center is-disabled"
            : "caso-card w-[340px] h-56 max-w-full relative rounded-2xl border p-6 flex-shrink-0 cursor-pointer flex flex-col justify-between";

          if (cardData.isComingSoon) {
            li.innerHTML = `
              <div class="absolute top-6 right-6">
                <span class="flex items-center text-xs font-medium text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  EN PREPARACIÓN
                </span>
              </div>
              <div class="text-shimmer text-3xl font-bold">
                Próximamente...
              </div>
              <p class="text-sm text-muted-foreground mt-2">Un nuevo caso de estudio está en camino.</p>
            `;
          } else {
            li.innerHTML = `
              <div>
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-bold text-foreground">${cardData.title}</h2>
                  <span class="flex items-center text-xs font-medium text-green-400">
                    <span class="relative flex h-2 w-2 mr-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>LIVE
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mt-2">${cardData.description}</p>
              </div>
              <div class="mt-4 flex items-end justify-between">
                <div class="w-2/5">
                  <div class="caso-mini-chart rounded-md p-1.5 border text-xs">
                    <div class="flex items-center space-x-1">
                      <div class="h-3 w-3 rounded-full bg-rose-500 flex-shrink-0"></div>
                      <div class="bg-gray-700 dark:bg-gray-700 bg-gray-400 rounded h-2 w-10"></div>
                    </div>
                    <div class="flex items-center space-x-1 mt-1.5 justify-end">
                      <div class="bg-blue-600 rounded h-2 w-12"></div>
                      <div class="h-3 w-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  ${cardData.redirectUrl ? `<button class="probar-directo-btn text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors border border-blue-400 hover:border-blue-300 px-3 py-1 rounded-md" data-redirect-url="${cardData.redirectUrl}">Probar</button>` : '<span class="text-gray-500 font-semibold text-sm border border-gray-600 px-3 py-1 rounded-md cursor-not-allowed opacity-50">Probar</span>'}
                  <div class="text-right text-blue-400 font-semibold text-sm">Ver Caso →</div>
                </div>
              </div>
            `;

            li.addEventListener("click", () => openModal(li, cardData));

            // Event listener para el botón "Probar" directo
            const probarBtn = li.querySelector(".probar-directo-btn");
            if (probarBtn) {
              probarBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const url = probarBtn.getAttribute("data-redirect-url");
                if (url) {
                  window.open(url, "_blank");
                }
              });
            }
          }

          Object.assign(li.dataset, {
            title: cardData.title,
            description: cardData.description,
            problema: cardData.problema,
            solucion: cardData.solucion,
            productoHtml: cardData.productoHtml,
            antesSrc: cardData.antesSrc,
            despuesSrc: cardData.despuesSrc,
            redirectUrl: cardData.redirectUrl || "",
          });

          ul.appendChild(li);
        });

        // Duplicar las tarjetas para el efecto infinito
        const scrollerContent = Array.from(ul.children);
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true) as HTMLLIElement;
          duplicatedItem.setAttribute("aria-hidden", "true");

          if (!duplicatedItem.classList.contains("is-disabled")) {
            const cardData = cardsToDisplay.find((card) => card.title === duplicatedItem.dataset.title);
            if (cardData) {
              duplicatedItem.addEventListener("click", () => openModal(duplicatedItem, cardData));

              // Event listener para el botón "Probar" directo en tarjetas duplicadas
              const probarBtn = duplicatedItem.querySelector(".probar-directo-btn");
              if (probarBtn) {
                probarBtn.addEventListener("click", (e) => {
                  e.stopPropagation();
                  const url = probarBtn.getAttribute("data-redirect-url");
                  if (url) {
                    window.open(url, "_blank");
                  }
                });
              }
            }
          }

          ul.appendChild(duplicatedItem);
        });

        const direction = (scroller as HTMLElement).dataset.direction;
        const duration = "15s"; // Acelerado de 20s a 15s para mayor velocidad

        (scroller as HTMLElement).style.setProperty("--animation-duration", duration);
        (scroller as HTMLElement).style.setProperty(
          "--animation-direction",
          direction === "right" ? "reverse" : "forwards",
        );
      }
    });
  };

  const setAnimationPlayState = (state: "paused" | "running") => {
    if (!isOnCasosPage) return;
    const scrollers = document.querySelectorAll(".scroller");
    scrollers.forEach((scroller) => {
      const ul = scroller.querySelector("ul") as HTMLElement;
      if (ul) {
        ul.style.animationPlayState = state;
      }
    });
  };

  const setupHoverPause = () => {
    setTimeout(() => {
      document.querySelectorAll(".scroller li").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          if (!isModalOpen) setAnimationPlayState("paused");
        });
        card.addEventListener("mouseleave", () => {
          if (!isModalOpen) setAnimationPlayState("running");
        });
      });
    }, 100);
  };

  const openModal = (card: HTMLLIElement, cardData: any) => {
    document.documentElement.classList.add("modal-open");
    setLastClickedCard(card);
    setIsModalOpen(true);
    setRedirectUrl(cardData.redirectUrl || null);
    setCurrentCardData(cardData);

    if (modalRef.current && modalContentRef.current) {
      const cardRect = card.getBoundingClientRect();
      const scaleX = cardRect.width / window.innerWidth;
      const scaleY = cardRect.height / window.innerHeight;

      modalContentRef.current.style.transformOrigin = `${cardRect.left + cardRect.width / 2}px ${cardRect.top + cardRect.height / 2}px`;
      modalContentRef.current.style.transform = `scale(${scaleX}, ${scaleY})`;
      modalRef.current.classList.remove("hidden");

      requestAnimationFrame(() => {
        if (modalContentRef.current) {
          modalContentRef.current.style.transform = "scale(1)";
        }
      });
    }

    setAnimationPlayState("paused");
  };

  const closeModal = () => {
    document.documentElement.classList.remove("modal-open");
    if (!lastClickedCard || !modalRef.current || !modalContentRef.current) return;

    const cardRect = lastClickedCard.getBoundingClientRect();
    const scaleX = cardRect.width / window.innerWidth;
    const scaleY = cardRect.height / window.innerHeight;

    modalContentRef.current.style.transformOrigin = `${cardRect.left + cardRect.width / 2}px ${cardRect.top + cardRect.height / 2}px`;
    modalContentRef.current.style.transform = `scale(${scaleX}, ${scaleY})`;

    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.classList.add("hidden");
        setIsModalOpen(false);
        setAnimationPlayState("running");
      }
    }, 400);

    resetFill();
    setRedirectUrl(null);
    setCurrentCardData(null);
  };

  const startFill = () => {
    if (fillTimeout) return;

    // Aplicar efecto a ambos botones (móvil y desktop)
    if (probarAgenteBtnMobileRef.current) {
      probarAgenteBtnMobileRef.current.classList.add("filling");
    }
    if (probarAgenteBtnDesktopRef.current) {
      probarAgenteBtnDesktopRef.current.classList.add("filling");
    }

    const timeout = setTimeout(() => {
      if (redirectUrl) {
        window.open(redirectUrl, "_blank");
      } else {
        console.log("¡Acción completada! (Sin redirección configurada)");
      }
      resetFill();
    }, 3000);
    setFillTimeout(timeout);
  };

  const resetFill = () => {
    // Remover efecto de ambos botones
    if (probarAgenteBtnMobileRef.current) {
      probarAgenteBtnMobileRef.current.classList.remove("filling");
    }
    if (probarAgenteBtnDesktopRef.current) {
      probarAgenteBtnDesktopRef.current.classList.remove("filling");
    }
    if (fillTimeout) {
      clearTimeout(fillTimeout);
      setFillTimeout(null);
    }
  };

  return (
    <>
      <div className="bg-background text-foreground">
        <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">BIBLIOTECA DE PRUEBA</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Casos de Estudio</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Descubre cómo nuestros agentes de IA están transformando negocios, automatizando procesos y mejorando la
              eficiencia operativa en diferentes industrias.
            </p>
          </div>

          {/* Carrusel Infinito Bidireccional */}
          <div className="relative flex flex-col gap-2 overflow-hidden">
            <div className="scroller" data-direction="right" data-speed="normal">
              <ul className="flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap">
                {/* Las tarjetas se añadirán aquí con JavaScript */}
              </ul>
            </div>

            <div className="scroller" data-direction="left" data-speed="normal">
              <ul className="flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap">
                {/* Las tarjetas se añadirán aquí con JavaScript */}
              </ul>
            </div>

            <div className="scroller" data-direction="right" data-speed="normal">
              <ul className="flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap">
                {/* Las tarjetas se añadirán aquí con JavaScript */}
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <section id="contact" className="pt-12 sm:pt-16 pb-20 sm:pb-32">
          <div className="container mx-auto px-6">
            <div className="card-bg max-w-4xl mx-auto rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para potenciar tu futuro?</h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Cuéntanos tu desafío y diseñaremos juntos un agente de IA que transforme tu negocio.
              </p>
              <div className="flex justify-center">
                <a
                  href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-button text-white font-bold py-3 px-8 whitespace-nowrap"
                >
                  Hablemos de tu Agente
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Previsualización */}
      <div
        ref={modalRef}
        id="preview-modal"
        className="fixed top-16 bottom-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm z-40 hidden"
      >
        <div ref={modalContentRef} className="modal-content bg-background w-full h-full flex flex-col">
          {/* Cabecera Fija del Modal */}
          <div className="relative pt-4 sm:pt-8 px-4 pb-4 md:px-10 border-b border-border flex-shrink-0">
            {/* Layout móvil: elementos apilados */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground flex items-center min-w-0 flex-1 mr-4">
                  <span className="text-blue-500 cursor-pointer underline flex-shrink-0" onClick={closeModal}>
                    Casos de Uso
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-2 text-muted-foreground flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-foreground truncate">{currentCardData?.title || ""}</span>
                </div>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                <div className="p-0.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                  <button
                    ref={probarAgenteBtnMobileRef}
                    className="hold-to-fill-btn w-full bg-black px-6 py-2 rounded-[10px] text-sm"
                    onMouseDown={startFill}
                    onMouseLeave={resetFill}
                    onMouseUp={resetFill}
                    onTouchStart={startFill}
                    onTouchEnd={resetFill}
                    onTouchCancel={resetFill}
                  >
                    <span className="fill-effect bg-gradient-to-r from-purple-600 to-indigo-600"></span>
                    <span className="button-text text-white font-semibold">Probar Agente</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Layout desktop: elementos en línea */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="w-1/3">
                <div className="text-sm text-muted-foreground flex items-center whitespace-nowrap">
                  <span className="text-blue-500 cursor-pointer underline" onClick={closeModal}>
                    Casos de Uso
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-2 text-muted-foreground flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-foreground">{currentCardData?.title || ""}</span>
                </div>
              </div>
              <div className="w-1/3 flex justify-center">
                <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="w-1/3 flex justify-end">
                <div className="p-0.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                  <button
                    ref={probarAgenteBtnDesktopRef}
                    className="hold-to-fill-btn w-full bg-black px-8 py-1.5 rounded-[10px]"
                    onMouseDown={startFill}
                    onMouseLeave={resetFill}
                    onMouseUp={resetFill}
                    onTouchStart={startFill}
                    onTouchEnd={resetFill}
                    onTouchCancel={resetFill}
                  >
                    <span className="fill-effect bg-gradient-to-r from-purple-600 to-indigo-600"></span>
                    <span className="button-text text-white font-semibold">Probar Agente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cuerpo Desplazable del Modal */}
          <div className="flex-grow overflow-y-auto modal-body">
            <div className="max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-8 md:px-10">
              {currentCardData && (
                <>
                  {/* Título y Descripción */}
                  <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
                      {currentCardData.title}
                    </h2>
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
                      {currentCardData.description}
                    </p>
                  </div>

                  {/* Contenido del Caso */}
                  <div className="space-y-8 sm:space-y-12">
                    <div>
                      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
                        <div className="w-full md:w-3/5">
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                            ⚠️ Problema del Cliente
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground">{currentCardData.problema}</p>
                        </div>
                        <div className="w-full md:w-2/5">
                          {currentCardData.antesSrc && (
                            <img src={currentCardData.antesSrc} alt="Imagen del Antes" className="rounded-lg w-full" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
                        <div className="w-full md:w-3/5">
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                            ✅ Solución Implementada
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground">{currentCardData.solucion}</p>
                        </div>
                        <div className="w-full md:w-2/5">
                          {currentCardData.despuesSrc && (
                            <img
                              src={currentCardData.despuesSrc}
                              alt="Imagen del Después"
                              className="rounded-lg w-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">🤖 Producto en Acción</h3>
                      <div dangerouslySetInnerHTML={{ __html: currentCardData.productoHtml }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CasosDeUso;
