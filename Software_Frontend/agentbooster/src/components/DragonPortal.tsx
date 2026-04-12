import { useEffect, useRef } from 'react';

interface DragonPortalProps {
  containerId?: string;
}

const DragonPortal = ({ containerId = 'default' }: DragonPortalProps) => {
  const portalRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const bubbleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    class IrisVortexEffect {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      particles: any[] = [];
      animationFrameId: number | null = null;
      rotation: number = 0;
      easing = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
      }

      resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
          this.canvas.width = container.clientWidth;
          this.canvas.height = container.clientHeight;
          this.particles = [];
          // Optimización móvil: reducir partículas
          const isMobile = window.innerWidth < 768;
          const particleCount = isMobile ? 80 : 200;
          for(let i = 0; i < particleCount; i++) this.createParticle();
        }
      }
      
      createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const outerRadius = this.canvas.width / 2.1;
        const ringWidth = this.canvas.width * 0.2;
        const innerRadius = outerRadius - ringWidth;
        const maxDistance = innerRadius + Math.random() * ringWidth;
        this.particles.push({ 
          angle, 
          maxDistance, 
          life: 1, 
          decay: Math.random() * 0.01 + 0.005, 
          size: Math.random() * 2.5 + 1.5, 
          speed: (Math.random() - 0.5) * 0.03, 
          color: `hsl(${270 + Math.random() * 30}, 100%, ${65 + Math.random() * 20}%)` 
        });
      }
      
      animate(progress: number, direction: 'open' | 'close') {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        const easedProgress = this.easing(progress);
        this.rotation += 0.05;

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.life -= p.decay;
          if (p.life <= 0) {
             this.particles.splice(i, 1);
             this.createParticle();
             continue;
          }
          p.angle += p.speed;
          const effectiveAngle = p.angle + this.rotation;
          let currentDistance = (direction === 'open') ? p.maxDistance * easedProgress : p.maxDistance * (1 - easedProgress);
          if (currentDistance < 0) continue;
          
          this.ctx.beginPath();
          this.ctx.arc(center.x, center.y, currentDistance, effectiveAngle - 0.1, effectiveAngle + 0.1);
          this.ctx.strokeStyle = p.color;
          this.ctx.lineWidth = p.size;
          this.ctx.globalAlpha = p.life;
          this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1.0;
      }
      
      runAnimation(direction: 'open' | 'close', duration = 500): Promise<void> {
        return new Promise(resolve => {
          if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
          const startTime = performance.now();
          const loop = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            let progress = elapsedTime / duration;
            if (progress > 1) progress = 1;
            this.animate(progress, direction);
            if (progress < 1) {
              this.animationFrameId = requestAnimationFrame(loop);
            } else {
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              resolve();
            }
          };
          this.animationFrameId = requestAnimationFrame(loop);
        });
      }
    }
    
    // Configuración de portales y estado - usando elementos del DOM directamente
    const portals: { [key: string]: any } = {
      loopA: { 
        el: document.getElementById('portal-loop-a'), 
        effect: document.getElementById('canvas-loop-a') ? new IrisVortexEffect(document.getElementById('canvas-loop-a') as HTMLCanvasElement) : null, 
        video: document.getElementById('video-loop-a'), 
        frame: document.querySelector('#portal-loop-a .neon-frame') 
      },
      loopC: { 
        el: document.getElementById('portal-loop-c'), 
        effect: document.getElementById('canvas-loop-c') ? new IrisVortexEffect(document.getElementById('canvas-loop-c') as HTMLCanvasElement) : null, 
        video: document.getElementById('video-loop-c'), 
        frame: document.querySelector('#portal-loop-c .neon-frame') 
      },
      greeting: { 
        el: portalRefs.current['portal-greeting'], 
        effect: canvasRefs.current['canvas-greeting'] ? new IrisVortexEffect(canvasRefs.current['canvas-greeting']) : null, 
        video: videoRefs.current['video-greeting'], 
        bubble: bubbleRefs.current['message-bubble-greeting'], 
        frame: portalRefs.current['portal-greeting']?.querySelector('.neon-frame') 
      },
      agenda: { 
        el: portalRefs.current['portal-agenda'], 
        effect: canvasRefs.current['canvas-agenda'] ? new IrisVortexEffect(canvasRefs.current['canvas-agenda']) : null, 
        video: videoRefs.current['video-agenda'], 
        bubble: bubbleRefs.current['message-bubble-agenda'], 
        frame: portalRefs.current['portal-agenda']?.querySelector('.neon-frame') 
      },
    };

    const loopVideoUrls = [
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135495/PorDefecto1_ssocpr.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135493/PorDefecto3_slbonk.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135492/PorDefecto2_ujqsvq.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135491/PorDefecto4_srlre6.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135392/PorDefecto8_sopsuc.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135394/PorDefecto10_oejls9.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135393/PorDefecto9_f2hdsv.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135357/PorDefecto7_ryszuq.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135346/PorDefectoFB2_wuvbos.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135348/PorDefectoFB1_jepoad.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135354/PorDefecto6_aq3c6o.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135397/PorDefecto11_bclpmb.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135354/PorDefectoFO1_cwhmmi.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135397/PorDefectoFO4_esxzyf.webm",
      "https://res.cloudinary.com/dsdnpstgi/video/upload/v1756691724/vasyl_pavlyuchok_40606_h_imxq3a.webm"
    ];
    
    let state = {
      isTransitioning: false,
      lastLoopVideoIndex: -1,
      loopTimeouts: { loopA: null as NodeJS.Timeout | null, loopC: null as NodeJS.Timeout | null },
      visibility: { a: false, c: false },
      greetings: {
        initialFinished: false,
        agendaShown: false,
        agendaFinished: false,
      }
    };

    // Lógica de portales
    async function openPortal(key: string, bubbleDelay = 250) {
      const portal = portals[key];
      if (!portal) return;
      
      portal.video?.play().catch((e: any) => {});
      if (portal.bubble) {
        setTimeout(() => portal.bubble?.classList.add('visible'), bubbleDelay);
      }
      
      portal.frame?.classList.add('visible');
      portal.video?.classList.add('visible');
      if (portal.effect) {
        await portal.effect.runAnimation('open');
      }
    }

    async function closePortal(key: string) {
      const portal = portals[key];
      if (!portal) return;
      
      portal.bubble?.classList.remove('visible');
      portal.frame?.classList.remove('visible');
      portal.video?.classList.remove('visible');
      
      if (portal.effect) {
        await portal.effect.runAnimation('close');
      }
      
      portal.video?.pause();
    }

    // Lógica de bucles aleatorios
    function startRandomLoopSequence(loopKey: 'loopA' | 'loopC') {
      if (state.isTransitioning) return;
      if (state.loopTimeouts[loopKey]) {
        clearTimeout(state.loopTimeouts[loopKey]!);
      }

      const delay = Math.random() * 5000 + 5000;
      state.loopTimeouts[loopKey] = setTimeout(() => {
        const sectionId = loopKey.charAt(loopKey.length - 1).toLowerCase() as 'a' | 'c';
        if (state.isTransitioning) return;
        // Para loopC no verificar visibility, solo para loopA
        if (loopKey === 'loopA' && !state.visibility[sectionId]) return;
        
        state.isTransitioning = true;
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const newPosition = positions[Math.floor(Math.random() * positions.length)];
        const portalEl = portals[loopKey].el;
        if (portalEl) {
          portalEl.style.cssText = '';
          const offset = '1rem';
          // For first section (loopA), add extra top margin to avoid navigation bar
          const topOffset = loopKey === 'loopA' ? '5rem' : offset;
          
          if (newPosition === 'top-left') { portalEl.style.top = topOffset; portalEl.style.left = offset; }
          if (newPosition === 'top-right') { portalEl.style.top = topOffset; portalEl.style.right = offset; }
          if (newPosition === 'bottom-left') { portalEl.style.bottom = offset; portalEl.style.left = offset; }
          if (newPosition === 'bottom-right') { portalEl.style.bottom = offset; portalEl.style.right = offset; }
        }

        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * loopVideoUrls.length);
        } while (loopVideoUrls.length > 1 && randomIndex === state.lastLoopVideoIndex);
        state.lastLoopVideoIndex = randomIndex;
        
        if (portals[loopKey].video) {
          portals[loopKey].video.src = loopVideoUrls[randomIndex];        }
        
        const onCanPlay = async () => {
          portals[loopKey].video?.removeEventListener('canplaythrough', onCanPlay);

          const onTimeUpdate = async function(this: HTMLVideoElement) {
            if (!state.isTransitioning && this.duration > 0 && (this.duration - this.currentTime <= 1.5)) {
              this.removeEventListener('timeupdate', onTimeUpdate);
              await closePortal(loopKey);
              // Para loopC continúa siempre, para loopA verifica visibility
              if (loopKey === 'loopC' || state.visibility[sectionId]) {
                startRandomLoopSequence(loopKey);
              }
            }
          };
          portals[loopKey].video?.addEventListener('timeupdate', onTimeUpdate);
          
          await openPortal(loopKey);
          state.isTransitioning = false;
        };
        portals[loopKey].video?.addEventListener('canplaythrough', onCanPlay);
      }, delay);
    }
    
    async function stopLoopSequence(loopKey: 'loopA' | 'loopC') {
      if (state.loopTimeouts[loopKey]) {
        clearTimeout(state.loopTimeouts[loopKey]!);
        state.loopTimeouts[loopKey] = null;
      }
      if (portals[loopKey].frame?.classList.contains('visible')) {
        state.isTransitioning = true;
        await closePortal(loopKey);
        state.isTransitioning = false;
      }
    }
    
    // Intersection Observers
    const observerOptions = { threshold: 0.1 };

    const observerA = new IntersectionObserver((entries) => {
      state.visibility.a = entries[0].isIntersecting;
      if (state.visibility.a && state.greetings.initialFinished) {
        startRandomLoopSequence('loopA');
      } else {
        stopLoopSequence('loopA');
      }
    }, observerOptions);

    const heroSection = document.querySelector('.hero-bg');
    if (heroSection) {
      observerA.observe(heroSection);
    }

    const observerC = new IntersectionObserver(async (entries) => {
      state.visibility.c = entries[0].isIntersecting;
      if (state.visibility.c) {
        const hasSeenAgenda = sessionStorage.getItem('dragonPortal_agendaShown') === 'true';
        if (!state.greetings.agendaShown && !hasSeenAgenda) {
          // Delay de 2 segundos antes de iniciar la animación de agenda
          setTimeout(async () => {
            // Verificar que el video de agenda se puede cargar
            const agendaVideo = portals.agenda.video;
            if (!agendaVideo) return;

            const onAgendaVideoReady = async () => {
              agendaVideo.removeEventListener('canplaythrough', onAgendaVideoReady);
              agendaVideo.removeEventListener('loadeddata', onAgendaVideoReady);

              // Lógica anti-superposición
              if (portals.greeting.frame?.classList.contains('visible')) {
                await closePortal('greeting');
                state.greetings.initialFinished = true;
              }

              state.greetings.agendaShown = true;
              state.isTransitioning = true;
              
              // Posiciona y muestra el saludo de agenda
              const portalEl = portals.agenda.el;
              if (portalEl) {
                portalEl.style.bottom = '1rem';
                portalEl.style.left = '1rem';
                portalEl.style.right = '';
              }
              agendaVideo.currentTime = 0;
              await openPortal('agenda', 3000);
              state.isTransitioning = false;

              const onAgendaTimeUpdate = async function(this: HTMLVideoElement) {
                if (!state.isTransitioning && this.duration > 0 && (this.duration - this.currentTime <= 1)) {
                  this.removeEventListener('timeupdate', onAgendaTimeUpdate);
                  await closePortal('agenda');
                  state.greetings.agendaFinished = true;
                  // Marcar como mostrado en la sesión
                  sessionStorage.setItem('dragonPortal_agendaShown', 'true');
                  // Inicia inmediatamente el loop aleatorio sin verificar visibility
                  startRandomLoopSequence('loopC');
                }
              };
              agendaVideo.addEventListener('timeupdate', onAgendaTimeUpdate);
            };

            const onAgendaVideoError = () => {
              agendaVideo.removeEventListener('canplaythrough', onAgendaVideoReady);
              agendaVideo.removeEventListener('loadeddata', onAgendaVideoReady);
              agendaVideo.removeEventListener('error', onAgendaVideoError);
              // Si el video no carga, marcar como terminado sin mostrar animaciones
              state.greetings.agendaShown = true;
              state.greetings.agendaFinished = true;
              sessionStorage.setItem('dragonPortal_agendaShown', 'true');
            };

            // Escuchar eventos de carga del video
            agendaVideo.addEventListener('canplaythrough', onAgendaVideoReady);
            agendaVideo.addEventListener('loadeddata', onAgendaVideoReady);
            agendaVideo.addEventListener('error', onAgendaVideoError);

            // Intentar cargar el video si no está ya cargado
            if (agendaVideo.readyState >= 2) {
              onAgendaVideoReady();
            }

          }, 2000); // Delay de 2 segundos

        } else if (state.greetings.agendaFinished || hasSeenAgenda) {
          // Si ya se mostró la agenda en la sesión, marcar como terminado e iniciar loops
          state.greetings.agendaFinished = true;
          startRandomLoopSequence('loopC');
        }
      } else {
        stopLoopSequence('loopC');
      }
    }, observerOptions);

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      observerC.observe(aboutSection);
    }

    // Secuencia de inicio - Solo si es la primera vez en la sesión
    const hasSeenGreeting = sessionStorage.getItem('dragonPortal_greetingShown') === 'true';
    
    if (!hasSeenGreeting) {
      // Delay de 2 segundos antes de iniciar la animación
      setTimeout(async () => {
        // Verificar que el video se puede cargar antes de mostrar las animaciones
        const greetingVideo = portals.greeting.video;
        if (!greetingVideo) return;

        const onVideoReady = async () => {
          greetingVideo.removeEventListener('canplaythrough', onVideoReady);
          greetingVideo.removeEventListener('loadeddata', onVideoReady);

          state.isTransitioning = true;
          const portalEl = portals.greeting.el;
          if (portalEl) {
            portalEl.style.bottom = '1rem'; 
            portalEl.style.left = '1rem';
          }
          
          greetingVideo.currentTime = 0;
          await openPortal('greeting');
          state.isTransitioning = false;
          
          const onGreetingTimeUpdate = async function(this: HTMLVideoElement) {
            if (!state.isTransitioning && this.duration > 0 && (this.duration - this.currentTime <= 1)) {
              this.removeEventListener('timeupdate', onGreetingTimeUpdate);
              await closePortal('greeting');
              state.greetings.initialFinished = true;
              // Marcar como mostrado en la sesión
              sessionStorage.setItem('dragonPortal_greetingShown', 'true');
              if (state.visibility.a) {
                startRandomLoopSequence('loopA');
              }
            }
          };
          greetingVideo.addEventListener('timeupdate', onGreetingTimeUpdate);
        };

        const onVideoError = () => {
          greetingVideo.removeEventListener('canplaythrough', onVideoReady);
          greetingVideo.removeEventListener('loadeddata', onVideoReady);
          greetingVideo.removeEventListener('error', onVideoError);
          // Si el video no carga, marcar como terminado sin mostrar animaciones
          state.greetings.initialFinished = true;
          sessionStorage.setItem('dragonPortal_greetingShown', 'true');
        };

        // Escuchar eventos de carga del video
        greetingVideo.addEventListener('canplaythrough', onVideoReady);
        greetingVideo.addEventListener('loadeddata', onVideoReady);
        greetingVideo.addEventListener('error', onVideoError);

        // Intentar cargar el video si no está ya cargado
        if (greetingVideo.readyState >= 2) {
          onVideoReady();
        }

      }, 2000); // Delay de 2 segundos
    } else {
      // Si ya se mostró el saludo, marcar como terminado e iniciar loops si es necesario
      state.greetings.initialFinished = true;
      if (state.visibility.a) {
        setTimeout(() => startRandomLoopSequence('loopA'), 500);
      }
    }

    return () => {
      // Cleanup
      state.loopTimeouts.loopA && clearTimeout(state.loopTimeouts.loopA);
      state.loopTimeouts.loopC && clearTimeout(state.loopTimeouts.loopC);
      observerA.disconnect();
      observerC.disconnect();
    };
  }, [containerId]);

  return (
    <>
      {/* Portal de saludo inicial (global) */}
      <div 
        id="portal-greeting" 
        ref={el => portalRefs.current['portal-greeting'] = el}
        className="portal-container"
      >
        <div className="neon-frame">
          <video 
            id="video-greeting" 
            ref={el => videoRefs.current['video-greeting'] = el}
            src="https://res.cloudinary.com/dsdnpstgi/video/upload/v1757134948/Habla5_dxratg.webm" 
            muted 
            playsInline
          />
        </div>
        <canvas 
          id="canvas-greeting" 
          ref={el => canvasRefs.current['canvas-greeting'] = el}
          className="portal-canvas"
        />
      </div>
      <div 
        id="message-bubble-greeting" 
        ref={el => bubbleRefs.current['message-bubble-greeting'] = el}
        className="message-bubble"
      >
        <div className="message-bubble-content">¡Hola! Bienvenido a mi página web. ¿Puedo ayudarte?</div>
      </div>

      {/* Portal de saludo de agendamiento (global, activado por scroll) */}
      <div 
        id="portal-agenda" 
        ref={el => portalRefs.current['portal-agenda'] = el}
        className="portal-container"
      >
        <div className="neon-frame">
          <video 
            id="video-agenda" 
            ref={el => videoRefs.current['video-agenda'] = el}
            src="https://res.cloudinary.com/dsdnpstgi/video/upload/v1757134814/Habla2_dh0ic2.webm" 
            muted 
            playsInline
          />
        </div>
        <canvas 
          id="canvas-agenda" 
          ref={el => canvasRefs.current['canvas-agenda'] = el}
          className="portal-canvas"
        />
      </div>
      <div 
        id="message-bubble-agenda" 
        ref={el => bubbleRefs.current['message-bubble-agenda'] = el}
        className="message-bubble"
      >
        <div className="message-bubble-content">¡Te ayudo a agendar una reunión si lo necesitas!</div>
      </div>
    </>
  );
};

export default DragonPortal;