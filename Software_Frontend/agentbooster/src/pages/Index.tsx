import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as THREE from 'three';
import DragonPortal from '../components/DragonPortal';
import BooWidget from '../components/BooWidget/BooWidget';

const Index = () => {
  const location = useLocation();
  const isOnIndexPage = location.pathname === '/';
  const embeddingCanvasRef = useRef<HTMLCanvasElement>(null);
  const aiCanvasRef = useRef<HTMLCanvasElement>(null);
  const booVideoRef = useRef<HTMLVideoElement>(null);
  const animationFrameIds = useRef<number[]>([]);

  useEffect(() => {
    // Manejar navegación con hash #benefits desde otras páginas
    if (location.hash === '#benefits') {
      const timer = setTimeout(() => {
        const section = document.getElementById('benefits');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    // Solo ejecutar animación de embedding si estamos en la página Index
    if (!isOnIndexPage) return;
    
    // Token Embedding Animation
    const canvas = embeddingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      let tokens: any[] = [];

      function resizeCanvas() {
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        }
      }

      class Token {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        alpha: number;
        state: string;
        embedTimer: number;
        vectorLife: number;

        constructor() {
          this.x = 0;
          this.y = 0;
          this.vx = 0;
          this.vy = 0;
          this.size = 0;
          this.alpha = 0;
          this.state = 'flowing';
          this.embedTimer = 0;
          this.vectorLife = 0;
          this.reset();
          this.y = Math.random() * canvas.height;
        }

        reset() {
          this.x = Math.random() * -canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = Math.random() * 5 + 1.75;
          this.vy = Math.random() * 0.4 - 0.2;
          this.size = Math.random() * 3 + 1;
          this.alpha = 0.1 + Math.random() * 0.4;
          this.state = 'flowing';
          this.embedTimer = 0;
          this.vectorLife = 0;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.state === 'flowing' && this.x > canvas.width * 0.4 && this.x < canvas.width * 0.6) {
            if (Math.random() < 0.01) {
              this.state = 'embedding';
              this.embedTimer = 60;
            }
          }

          if (this.state === 'embedding') {
            this.embedTimer--;
            if (this.embedTimer <= 0) {
              this.state = 'vector';
              this.vectorLife = 120;
              this.vx = Math.random() * 6 + 3;
              this.vy = Math.random() * 1 - 0.5;
            }
          }
          
          if (this.state === 'vector') {
            this.vectorLife--;
            this.alpha = (this.vectorLife / 120) * 0.8;
            if(this.vectorLife <= 0) {
              this.reset();
            }
          }

          if (this.x > canvas.width + 10) {
            this.reset();
          }
        }

        draw() {
          if (!ctx) return;
          
          ctx.globalAlpha = this.alpha;
          const isLightMode = document.documentElement.classList.contains('light');

          if (this.state === 'flowing') {
            ctx.fillStyle = isLightMode ? '#4b5563' : '#B1A6B9';
            ctx.fillRect(this.x, this.y, this.size, this.size);
          } else if (this.state === 'embedding') {
            const pulse = Math.abs(Math.sin(this.embedTimer * 0.2));
            ctx.fillStyle = `#E1886C`;
            ctx.shadowColor = '#E1886C';
            ctx.shadowBlur = 10 * pulse;
            ctx.fillRect(this.x, this.y, this.size * 2, this.size * 2);
            ctx.shadowBlur = 0;
          } else if (this.state === 'vector') {
            ctx.strokeStyle = '#a855f7';
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 10;
            ctx.lineWidth = this.size / 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - 20, this.y - (this.vy * 10));
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      function init() {
        resizeCanvas();
        // Esperar un frame para asegurar que el canvas esté completamente dimensionado
        requestAnimationFrame(() => {
          tokens = [];
          // Optimización móvil: reducir tokens significativamente
          const isMobile = window.innerWidth < 768;
          const maxTokens = isMobile ? 100 : 300;
          const divisor = isMobile ? 8 : 4;
          const tokenCount = Math.min(Math.floor(canvas.width / divisor), maxTokens);
          for (let i = 0; i < tokenCount; i++) {
            tokens.push(new Token());
          }
        });
      }

      function animate() {
        if (!ctx || !isOnIndexPage) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        tokens.forEach(t => {
          t.update();
          t.draw();
        });
        const animationId = requestAnimationFrame(animate);
        animationFrameIds.current.push(animationId);
      }

      const handleResize = () => init();
      window.addEventListener('resize', handleResize);
      
      // Inicializar después de asegurar que el canvas esté montado
      init();
      // Pequeño delay antes de comenzar la animación para evitar renderizado borroso
      setTimeout(() => {
        animate();
      }, 100);

      return () => {
        window.removeEventListener('resize', handleResize);
        // Cancelar todas las animaciones pendientes
        animationFrameIds.current.forEach(id => cancelAnimationFrame(id));
        animationFrameIds.current = [];
      };
    }
  }, [isOnIndexPage]);

  useEffect(() => {
    // Intersection Observer for fade-in animations with smoother transitions
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a small delay to prevent abrupt changes on mobile
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.05, // Reduced threshold for smoother activation
      rootMargin: '50px 0px' // Add margin to trigger earlier
    });

    sections.forEach(section => {
      observer.observe(section);
    });

    // Intersection Observer para el video de Boo
    const booVideo = booVideoRef.current;
    const aboutSection = document.getElementById('about');

    if (booVideo && aboutSection) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!booVideo.src) {
              booVideo.src = booVideo.dataset.src || '';
            }
            booVideo.play().catch(error => console.log("La reproducción automática del video fue prevenida por el navegador."));
          } else {
            booVideo.pause();
          }
        });
      }, { threshold: 0.5 });

      videoObserver.observe(aboutSection);
    }
    
    // Intersection Observer para las tarjetas de beneficios with smoother transitions
    const benefitCards = document.querySelectorAll('.reveal-card');
    if (benefitCards.length > 0) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Staggered animation for cards
            const delay = Array.from(benefitCards).indexOf(entry.target) * 150;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
            cardObserver.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.1, // Reduced threshold for smoother activation
        rootMargin: '30px 0px' // Add margin to trigger earlier
      });

      benefitCards.forEach(card => {
        cardObserver.observe(card);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Solo ejecutar animación 3D si estamos en la página Index
    if (!isOnIndexPage) return;
    
    // Boo 3D Animation
    const aiCanvas = aiCanvasRef.current;
    if (aiCanvas && typeof window !== 'undefined') {
      function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        if (context) {
          context.beginPath();
          context.arc(32, 32, 30, 0, 2 * Math.PI);
          context.fillStyle = 'white';
          context.fill();
        }
        return new THREE.CanvasTexture(canvas);
      }
      const circleTexture = createCircleTexture();

      const scene = new THREE.Scene();
      const container = aiCanvas.parentElement;
      const containerWidth = container?.offsetWidth || window.innerWidth;
      const containerHeight = container?.offsetHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
      const isMobile = window.innerWidth < 768;
      const renderer = new THREE.WebGLRenderer({
        canvas: aiCanvas,
        alpha: true,
        antialias: !isMobile // Desactivar antialiasing en móviles
      });

      // Optimización móvil: reducir pixelRatio
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(containerWidth, containerHeight);
      camera.position.z = 4;

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);
      
      // Núcleo Central con Halo
      const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      mainGroup.add(core);
      
      const haloGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({ color: 0x4169E1, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      mainGroup.add(halo);

      // Esfera de Partículas Principal - Optimización móvil
      const particleCount = isMobile ? 3000 : 10000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);
      const randomFactors = new Float32Array(particleCount);
      
      const pGeometry = new THREE.BufferGeometry();
      const color1 = new THREE.Color("#8A2BE2");
      const color2 = new THREE.Color("#4169E1");
      const radius = 3;

      for (let i = 0; i < particleCount; i++) {
        const iFloat = parseFloat(i.toString());
        const phi = Math.acos(1 - 2 * (iFloat + 0.5) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        positions[i * 3] = originalPositions[i * 3] = x;
        positions[i * 3 + 1] = originalPositions[i * 3 + 1] = y;
        positions[i * 3 + 2] = originalPositions[i * 3 + 2] = z;
        randomFactors[i] = 0.5 + Math.random() * 2.5;
        const mixedColor = Math.random() > 0.5 ? color1.clone() : color2.clone();
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
      }

      pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const pMaterial = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        map: circleTexture,
        depthWrite: false
      });
      const particleSphere = new THREE.Points(pGeometry, pMaterial);
      mainGroup.add(particleSphere);

      // Sinapsis Dinámicas - Optimización móvil
      const synapseCount = isMobile ? 30 : 75;
      const synapses: any[] = [];
      for (let i = 0; i < synapseCount; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(2 * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
          color: 0xadd8e6,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const line = new THREE.Line(geometry, material);
        line.userData.life = 0; 
        line.userData.state = 'idle';
        mainGroup.add(line);
        synapses.push(line);
      }

      // Polvo Estelar de Fondo - Optimización móvil
      const starGeometry = new THREE.BufferGeometry();
      const starCount = isMobile ? 2000 : 5000;
      const starPositions = new Float32Array(starCount * 3);
      for(let i=0; i<starCount; i++){
        starPositions[i*3] = (Math.random() - 0.5) * 20;
        starPositions[i*3+1] = (Math.random() - 0.5) * 20;
        starPositions[i*3+2] = (Math.random() - 0.5) * 20;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.5,
        map: circleTexture,
        depthWrite: false
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // Interactividad y Animación
      let mouseX = 0, mouseY = 0;
      const clock = new THREE.Clock();
      let lastFrameTime = 0;
      const targetFPS = isMobile ? 30 : 60;
      const frameInterval = 1000 / targetFPS;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 300;
        mouseY = (e.clientY - window.innerHeight / 2) / 300;
      };

      document.addEventListener('mousemove', handleMouseMove);
      
      function animateBoo3D(currentTime: number) {
        if (!isOnIndexPage) return;
        const animationId = requestAnimationFrame(animateBoo3D);
        animationFrameIds.current.push(animationId);
        
        // Limitar FPS en móviles
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < frameInterval) return;
        
        lastFrameTime = currentTime - (elapsed % frameInterval);
        const elapsedTime = clock.getElapsedTime();

        mainGroup.rotation.y += 0.0005 + (mouseX * 0.01 - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += 0.0005 + (mouseY * 0.01 - mainGroup.rotation.x) * 0.05;
        stars.rotation.y += 0.0001;

        const positionsAttribute = particleSphere.geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          const dynamicFactor = Math.sin(elapsedTime * 0.5 + i * 0.1) * 0.1 * randomFactors[i];
          positionsAttribute.setX(i, originalPositions[i * 3] * (1 + dynamicFactor));
          positionsAttribute.setY(i, originalPositions[i * 3 + 1] * (1 + dynamicFactor));
          positionsAttribute.setZ(i, originalPositions[i * 3 + 2] * (1 + dynamicFactor));
        }
        positionsAttribute.needsUpdate = true;
        
        const corePulse = 1 + 0.05 * Math.sin(elapsedTime * 2);
        core.scale.set(corePulse, corePulse, corePulse);
        halo.scale.set(corePulse * 1.1, corePulse * 1.1, corePulse * 1.1);
        
        // Animación de Sinapsis como Red Neuronal
        synapses.forEach(line => {
          if (line.userData.state === 'fading_in') {
            line.userData.life += 0.1; 
            line.material.opacity = line.userData.life;
            if (line.userData.life >= 1.0) {
              line.userData.life = 1.0;
              line.material.opacity = 1.0;
              line.userData.state = 'fading_out';
            }
          } else if (line.userData.state === 'fading_out') {
            line.userData.life -= 0.015; 
            line.material.opacity = line.userData.life;
            if (line.userData.life <= 0) {
              line.userData.life = 0;
              line.material.opacity = 0;
              line.userData.state = 'idle';
            }
          } else {
            if (Math.random() > 0.993) { 
              const startIndex = Math.floor(Math.random() * particleCount);
              const endIndex = (startIndex + Math.floor(Math.random() * (particleCount / 10)) + 10) % particleCount;
              const positions = line.geometry.attributes.position.array;
              positions[0] = positionsAttribute.getX(startIndex);
              positions[1] = positionsAttribute.getY(startIndex);
              positions[2] = positionsAttribute.getZ(startIndex);
              positions[3] = positionsAttribute.getX(endIndex);
              positions[4] = positionsAttribute.getY(endIndex);
              positions[5] = positionsAttribute.getZ(endIndex);
              line.geometry.attributes.position.needsUpdate = true;
              line.userData.state = 'fading_in';
            }
          }
        });

        renderer.render(scene, camera);
      }

      const handleResize = () => {
        const container = aiCanvas.parentElement;
        const containerWidth = container?.offsetWidth || window.innerWidth;
        const containerHeight = container?.offsetHeight || window.innerHeight;
        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight);
      };

      window.addEventListener('resize', handleResize);
      animateBoo3D(0);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        // Cancelar todas las animaciones pendientes
        animationFrameIds.current.forEach(id => cancelAnimationFrame(id));
        animationFrameIds.current = [];
      };
    }
  }, [isOnIndexPage]);

  useEffect(() => {
    // Change header background on scroll
    const header = document.getElementById('header');
    const handleScroll = () => {
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('bg-black/80');
        } else {
          header.classList.remove('bg-black/80');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Lógica para el menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu && hamburgerIcon && closeIcon) {
      const toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      };

      mobileMenuButton.addEventListener('click', toggleMenu);

      // Cerrar menú al hacer clic en un enlace
      const mobileMenuLinks = mobileMenu.querySelectorAll('a');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          hamburgerIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        });
      });
    }

  }, []);

  return (
    <div className="antialiased">
      {/* Dragon Portal System */}
      <DragonPortal />
      
      {/* SVG Filter for Liquid Glass Button */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves={1} seed={1} result="turbulence" />
            <feGaussianBlur in="turbulence" stdDeviation={2} result="blurredNoise" />
            <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale={20} xChannelSelector="R" yChannelSelector="B" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation={3} result="finalBlur" />
            <feComposite in="finalBlur" in2="finalBlur" operator="over" />
          </filter>
        </defs>
      </svg>


      <main>
        {/* Hero Section */}
        <section className="hero-bg min-h-screen flex items-center justify-center pt-28">
          <canvas id="embedding-canvas" ref={embeddingCanvasRef}></canvas>
          
          {/* Portal aleatorio para sección hero (A) - CONTENIDO EN LA SECCIÓN */}
          <div 
            id="portal-loop-a" 
            className="portal-container-section"
          >
            <div className="neon-frame">
              <video 
                id="video-loop-a" 
                src="https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135495/PorDefecto1_ssocpr.webm" 
                muted 
                playsInline
              />
            </div>
            <canvas 
              id="canvas-loop-a" 
              className="portal-canvas"
            />
          </div>
          
          <div className="hero-content container mx-auto px-6 text-center">
            {/* Botón de Anuncio (Redimensionado) */}
            <Link to="/servicios" className="group anuncio-button mx-auto flex w-fit items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 p-0.5 pl-2.5 shadow-md shadow-black/20 transition-all duration-300 hover:bg-black mb-8">
              <span className="text-[11px] text-gray-200 anuncio-text">Sobre Nuestros Planes</span>
              <span className="block h-2.5 w-px bg-zinc-600 anuncio-separator"></span>
              <div className="h-4 w-4 overflow-hidden rounded-full bg-black duration-500 group-hover:bg-zinc-900 anuncio-arrow-bg">
                <div className="flex h-4 w-8 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                  <div className="flex h-4 w-4 items-center justify-center text-gray-400 anuncio-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div className="flex h-4 w-4 items-center justify-center text-gray-400 anuncio-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 font-circular max-w-3xl mx-auto">
              No construimos chatbots... <br className="hidden md:block" />
              <span className="text-purple-400 neon-text">Creamos agentes inteligentes con alma.</span>
            </h1>
            <p className="text-lg md:text-xl text-fire-gradient font-semibold max-w-xl mx-auto mb-10">
              Diseñamos agentes de IA personalizados que aprenden, deciden y actúan por tu negocio 24/7. No solo automatizamos, escalamos tu potencial.
            </p>
            <div className="flex flex-col items-center justify-center gap-8 pb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#boo-section" className="liquid-button">
                  <div className="star-bottom"></div>
                  <div className="star-top"></div>
                  <div className="liquid-button-shadow"></div>
                  <div className="liquid-button-glass"></div>
                  <span className="liquid-button-text flex items-center gap-2">
                    Consulta al Agente Boo
                    <svg className="w-5 h-5 arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 13.586V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                </a>
                <Link 
                  to="/casos-de-uso" 
                  className="shine-button"
                  onClick={() => {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <span className="shine-text">Explorar Usos</span>
                  <div className="shine-effect"></div>
                </Link>
              </div>
              {/* Stats Section */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-16 max-w-4xl mx-auto pt-8">
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">45%</div>
                  <div className="text-white/60 text-xs sm:text-sm">Eficiencia operativa</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">90%</div>
                  <div className="text-white/60 text-xs sm:text-sm">Mejor experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                  <div className="text-white/60 text-xs sm:text-sm">Operación Autónoma</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credibilidad / Integraciones */}
        <section className="py-8 sm:py-12 fade-in-section">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:w-44 md:border-r border-gray-700 md:pr-6 md:text-right mb-6 md:mb-0">
                <p className="text-sm text-gray-400">Integraciones a las mejores herramientas</p>
              </div>
              <div className="relative w-full md:w-[calc(100%-11rem)] md:pl-6">
                <div className="text-slider-container">
                  <div className="text-slider-track">
                    {/* Nombres de Integraciones */}
                    {[
                      "OpenAI", "Anthropic", "Gemini", "Grok", "Zapier", "Make", "n8n", "Salesforce", "HubSpot", "Notion", 
                      "Slack", "LangChain", "Airtable", "Pickaxe", "VoiceFlow", "Supabase", "Lovable", "Stack", "Relevance", 
                      "Gamma", "Manus", "Meta", "Perplexity", "Shopify", "Hostinger", "Vercel", "Cursor", "Linear", 
                      "ElevenLabs", "HeyGen", "Flow", "Higgsfield", "Runway", "Midjourney", "Manychat",
                      // Duplicados para el bucle
                      "OpenAI", "Anthropic", "Gemini", "Grok", "Zapier", "Make", "n8n", "Salesforce", "HubSpot", "Notion", 
                      "Slack", "LangChain", "Airtable", "Pickaxe", "VoiceFlow", "Supabase", "Lovable", "Stack", "Relevance", 
                      "Gamma", "Manus", "Meta", "Perplexity", "Shopify", "Hostinger", "Vercel", "Cursor", "Linear", 
                      "ElevenLabs", "HeyGen", "Flow", "Higgsfield", "Runway", "Midjourney", "Manychat"
                    ].map((name, index) => (
                      <span key={index} className="slide-text text-fire-gradient">{name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nueva Sección con Boo 3D */}
        <section id="boo-section" className="relative min-h-screen flex items-center justify-center text-center px-4 py-32 section-fade">
          <canvas id="aiCanvas" ref={aiCanvasRef} className="absolute inset-0 w-full h-full transition-all duration-300 ease-out pointer-events-none" style={{ zIndex: 0 }}></canvas>
          <div className="relative flex items-center justify-center w-full h-full !bg-transparent" style={{ zIndex: 5 }}>
            <BooWidget />
          </div>
        </section>

        {/* Beneficios Section */}
        <section id="benefits" className="pt-10 sm:pt-16 pb-12 sm:pb-16 fade-in-section">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Potencia tu Negocio con Gen IA</h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">Más allá de la automatización, creamos ventajas competitivas.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Beneficio 1 */}
              <div className="card-bg p-8 rounded-2xl reveal-card">
                <div className="bg-purple-900/50 inline-flex p-4 rounded-full mb-6">
                  <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Optimización Eficiente</h3>
                <p className="text-gray-400">Reduce costes operativos y libera a tu equipo de tareas repetitivas, enfocándolos en la estrategia.</p>
              </div>
              {/* Beneficio 2 */}
              <div className="card-bg p-8 rounded-2xl reveal-card">
                <div className="bg-purple-900/50 inline-flex p-4 rounded-full mb-6">
                  <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Design Thinking</h3>
                <p className="text-gray-400">Interacciones que captan el contexto y necesidades del cliente para aumentar la conversión y satisfacción.</p>
              </div>
              {/* Beneficio 3 */}
              <div className="card-bg p-8 rounded-2xl reveal-card">
                <div className="bg-purple-900/50 inline-flex p-4 rounded-full mb-6">
                  <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.001l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Equipo Multiagente</h3>
                <p className="text-gray-400">Agentes IA que colaboran como expertos coordinados para ofrecer experiencias más completas.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Us */}
        <section id="about" className="pt-12 sm:pt-16 pb-12 sm:pb-16 fade-in-section">
          
          {/* Portal aleatorio para sección about (C) - CONTENIDO EN LA SECCIÓN */}
          <div 
            id="portal-loop-c" 
            className="portal-container-section"
          >
            <div className="neon-frame">
              <video 
                id="video-loop-c" 
                src="https://res.cloudinary.com/dsdnpstgi/video/upload/v1757135495/PorDefecto1_ssocpr.webm" 
                muted 
                playsInline
              />
            </div>
            <canvas 
              id="canvas-loop-c" 
              className="portal-canvas"
            />
          </div>
          
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Nuestra Misión: <br/><span className="text-purple-400">Humanizar la Inteligencia Artificial</span></h2>
                <p className="text-lg text-gray-300 mb-4">
                  Creemos que la IA no debe ser una barrera, sino un puente. Nuestra misión es escalar negocios con soluciones agentivas avanzadas, diseñadas con un enfoque ético y humano.
                </p>
                <p className="text-gray-400">
                  Presentamos a <span className="font-bold text-white">Boo</span>, nuestro símbolo de innovación. Boo representa la chispa de inteligencia y personalidad que infundimos en cada agente, convirtiendo el código en un valioso miembro de tu equipo.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="flex flex-col items-center gap-6">
                  {/* Video de Boo */}
                  {/* Video de Boo - Solo en desktop */}
                  <video 
                    id="boo-video" 
                    ref={booVideoRef}
                    className="hidden md:block h-80 w-80 rounded-full object-cover border-2 border-purple-500/50 drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]" 
                    loop 
                    muted 
                    playsInline
                    data-src="https://res.cloudinary.com/dsdnpstgi/video/upload/v1756874946/social_vasyl_pavlyuchok_40606_httpss.mj.runwEBrXiI-Npo_anima_esta_im_86f19ad8-2208-41f8-b011-7c3d6b1964c8_1_ncmpoy.webm"
                  ></video>
                  {/* Imagen de Boo - Solo en móvil y tablet */}
                  <img 
                    src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756503469/Boo_Mastermind_-_vasyl_pavlyuchok_40606_httpss.mj.runDaU8K48LteU_close-up_port_3b5e9292-ef3c-4c7f-93c8-c1a99da3780e_3_skkffe.png"
                    alt="Boo - Agente IA de AgentBooster"
                    className="md:hidden h-80 w-80 rounded-full object-cover border-2 border-purple-500/50 drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]"
                  />
                  {/* Botón "Conoce mi historia" */}
                  <Link 
                    to="/storytelling" 
                    className="gradient-button text-white font-bold py-3 px-8 whitespace-nowrap"
                    onClick={() => {
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    Conoce mi historia
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="contact" className="pt-12 sm:pt-16 pb-20 sm:pb-32 fade-in-section">
          <div className="container mx-auto px-6">
            <div className="card-bg max-w-4xl mx-auto rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para potenciar tu futuro?</h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">Cuéntanos tu desafío y diseñaremos juntos un agente de IA que transforme tu negocio.</p>
              <div className="flex justify-center">
                <a href="https://calendar.app.google/XaNPXi7nqEi9Lgj8A" target="_blank" rel="noopener noreferrer" className="gradient-button text-white font-bold py-3 px-8 whitespace-nowrap">
                  Hablemos de tu Agente
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>


    </div>
  );
};

export default Index;