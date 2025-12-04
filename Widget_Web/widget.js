(function () {
  'use strict';

  if (window.AuriaWidgetLoaded) return;
  window.AuriaWidgetLoaded = true;

  const DEFAULT_CONFIG = {
    company_name: 'Auria',
    welcome_message: 'Hola, somos Auria. ¿En qué podemos ayudarte hoy?',
    logo_url: 'https://res.cloudinary.com/dsdnpstgi/image/upload/v1761372087/ChatGPT_Image_24_oct_2025_20_41_00_td8ccy.png',
    webhook_url: 'PLACEHOLDER_WEBHOOK_URL',
    agents: {
      Ara: {
        name: 'Ara',
        avatar: 'https://res.cloudinary.com/dsdnpstgi/image/upload/v1760978463/image_kjvbyu.jpg',
      },
      Eve: {
        name: 'Eve',
        avatar: 'https://res.cloudinary.com/dsdnpstgi/image/upload/v1760978711/e661445e-0368-456b-af4e-04fe7df03f3b_qd3a8r.jpg',
      },
    },
  };

  const styles = `
    :root {
      --auria-safe-area-bottom: env(safe-area-inset-bottom);
      --auria-keyboard-offset: 0px;
    }
    @supports not (padding: env(safe-area-inset-bottom)) {
      :root {
        --auria-safe-area-bottom: 0px;
      }
    }
    #auria-widget-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483000;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(14, 116, 144, 0.75);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: white;
      cursor: pointer;
      box-shadow: 0 12px 18px rgba(15, 23, 42, 0.25);
      display: grid;
      place-items: center;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    #auria-widget-button:hover {
      transform: scale(1.08);
      background: rgba(14, 116, 144, 0.9);
    }
    #auria-widget-button svg {
      width: 24px;
      height: 24px;
      position: absolute;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    #auria-widget-button .chat-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
    #auria-widget-button .close-icon {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }
    #auria-widget-button.open .chat-icon {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }
    #auria-widget-button.open .close-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
    #auria-widget-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      z-index: 2147483001;
      width: 515px;
      max-width: calc(100vw - 32px);
      height: 675px;
      padding-bottom: calc(var(--auria-safe-area-bottom, 0px) + var(--auria-keyboard-offset, 0px));
      box-sizing: border-box;
      border-radius: 22px;
      background: rgba(7, 15, 25, 0.7);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow:
        0 25px 45px -12px rgba(15, 23, 42, 0.45),
        0 10px 20px -10px rgba(30, 64, 175, 0.3);
      display: none;
      flex-direction: column;
      overflow: hidden;
      overscroll-behavior: contain;
      touch-action: pan-y;
      animation: auriaPopIn 0.18s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    @keyframes auriaPopIn {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes auria-typing {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
      40% { transform: translateY(-4px); opacity: 1; }
    }
    @media (max-width: 768px) {
      #auria-widget-button {
        bottom: 16px;
        right: 16px;
      }
      #auria-widget-panel {
        position: fixed;
        inset: 0;
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        height: 100dvh;
        max-height: 100vh;
        max-height: 100dvh;
        min-height: 100vh;
        min-height: 100dvh;
        border-radius: 0;
        border: none;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
      }
    }
    .auria-tooltip {
      position: fixed;
      z-index: 2147483002;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #f8fafc;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      transform: translate(-50%, -140%);
      pointer-events: none;
      transition: opacity 0.2s ease;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.25);
    }
    .auria-welcome-msg {
      position: fixed;
      right: 28px;
      bottom: 86px;
      z-index: 2147482999;
      width: 280px;
      background: #f9fafc;
      border-radius: 20px;
      box-shadow: 0 28px 48px -24px rgba(15, 23, 42, 0.35);
      border: 1px solid rgba(148, 163, 184, 0.18);
      padding: 20px 24px;
      display: none;
      animation: auriaPopIn 0.2s ease-out;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .auria-welcome-msg-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: none;
      background: rgba(15, 23, 42, 0.08);
      color: #334155;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }
    .auria-welcome-msg-close:hover {
      background: rgba(14, 116, 144, 0.16);
      color: #0f172a;
      transform: scale(1.06);
    }
    .auria-welcome-msg-title {
      color: #1f2937;
      font-weight: 700;
      margin: 0 32px 8px 0;
      font-size: 17px;
    }
    .auria-welcome-msg-text {
      color: #334155;
      font-size: 14.5px;
      line-height: 1.55;
      margin: 0;
    }
    .auria-mobile-close {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      width: 72px;
      height: 20px;
      background: rgba(2, 6, 23, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      border-left: 1px solid rgba(148, 163, 184, 0.2);
      border-right: 1px solid rgba(148, 163, 184, 0.2);
      color: rgba(226, 232, 240, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 6px 12px rgba(15, 23, 42, 0.25);
      border-radius: 0 0 999px 999px;
      cursor: pointer;
      border-top: none;
    }
    .auria-mobile-close:hover {
      background: rgba(0, 0, 0, 0.72);
      color: white;
    }
    @media (min-width: 769px) {
      .auria-mobile-close {
        display: none;
      }
    }
    .auria-hidden {
      display: none !important;
    }
    .auria-agent-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.5);
      object-fit: cover;
      user-select: none;
      -webkit-user-drag: none;
    }
    #auria-chat-input::placeholder {
      color: rgba(248, 250, 252, 0.86);
    }
  `;

  const icons = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    chevronRight: '<path d="M9 18l6-6-6-6"/>',
    logo: '<defs><linearGradient id="auria-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient></defs><path d="M15 120 L60 40 L85 75 L110 55 L150 120 Z" fill="url(#auria-g)"/><path d="M60 40 L85 75 L110 55" fill="none" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round"/>',
    faq: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    articles: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    search: '<path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    'volume-off': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
    clip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    plus: '<path d="M12 5v14m-7-7h14"/>',
    file: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-5 11.9l-1 3.1h12l-1-3.1A7 7 0 0 0 12 2z"/>',
  };

  const rootElement = typeof document !== 'undefined' ? document.documentElement : null;
  const keyboardOffsetManager = { listenerAttached: false };

  function setKeyboardOffset(value) {
    if (!rootElement) return;
    const safeValue = Math.max(0, Number.isFinite(value) ? value : 0);
    rootElement.style.setProperty('--auria-keyboard-offset', `${safeValue}px`);
  }

  function updateKeyboardOffset() {
    if (typeof window === 'undefined') return;
    const vv = window.visualViewport;
    if (!vv) {
      setKeyboardOffset(0);
      return;
    }
    const overlap = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
    setKeyboardOffset(overlap);
  }

  function ensureKeyboardOffsetListeners() {
    if (keyboardOffsetManager.listenerAttached || typeof window === 'undefined') return;
    keyboardOffsetManager.listenerAttached = true;

    const handler = () => updateKeyboardOffset();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handler);
      window.visualViewport.addEventListener('scroll', handler);
    }
    window.addEventListener('orientationchange', () => {
      setTimeout(updateKeyboardOffset, 250);
    });
    window.addEventListener('resize', handler);

    handler();
  }

  function createIcon(name, className) {
    const viewBox = name === 'logo' ? '0 0 160 160' : '0 0 24 24';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    if (className) svg.setAttribute('class', className);
    svg.innerHTML = icons[name] || '';
    return svg;
  }

  function playNotificationSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(888, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.error('Error al reproducir el sonido de notificación:', e);
    }
  }

  function parseMarkdown(rawText) {
    if (!rawText) return '';
    let sanitizedText = rawText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const processInlines = (inlineText) => {
      return inlineText
        // Markdown links: [text](https://url)
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: rgb(56, 189, 248); text-decoration: underline; font-weight: 600;">$1</a>')
        // Bare URLs: https://example.com
        .replace(/(^|[\s(])((https?:\/\/[^\s)]+))/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" style="color: rgb(56, 189, 248); text-decoration: underline; font-weight: 600;">$2<\/a>')
        // Bold and italics
        .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1<\/strong>')
        .replace(/\*([^\*]+)\*/g, '<em>$1<\/em>');
    };

    const blocks = sanitizedText.split(/(\n\s*\n)+/);
    const html = blocks
      .map((block) => {
        if (!block.trim()) return block;
        if (/^(?:\*\s.*(?:\n|$))+/.test(block)) {
          const items = block.trim().split('\n');
          const listItems = items
            .map((item) => `<li>${processInlines(item.substring(2))}</li>`)
            .join('');
          return `<ul style="list-style-type: disc; list-style-position: inside; padding-left: 16px;">${listItems}</ul>`;
        }
        return processInlines(block);
      })
      .join('');

    return html;
  }

  function normalizeReply(value) {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (value == null) return '';
    if (typeof value === 'object') {
      const preferredKeys = ['text', 'message', 'content', 'value', 'output', 'output1', 'output2', 'output3', 'output4'];
      for (const key of preferredKeys) {
        if (typeof value[key] === 'string') {
          const normalized = value[key].trim();
          if (normalized) return normalized;
        }
      }
      try {
        const serialized = JSON.stringify(value);
        return typeof serialized === 'string' ? serialized.trim() : '';
      } catch {
        return '';
      }
    }
    return String(value).trim();
  }

  function cloneDefaultConfig() {
    return {
      ...DEFAULT_CONFIG,
      agents: Object.entries(DEFAULT_CONFIG.agents).reduce((acc, [key, value]) => {
        acc[key] = { ...value };
        return acc;
      }, {}),
    };
  }

  const state = {
    isOpen: false,
    activeView: 'home',
    messages: [],
    isMuted: false,
    isTyping: false,
    agent: { name: 'Auria', avatar: null },
    assignedAgent: null,
    userId: null,
    isBotReplying: false,
    isChatInitialized: false,
    showWelcomeMessage: true,
    config: cloneDefaultConfig(),
    tooltip: { visible: false, text: '', top: 0, left: 0 },
    inputValue: '',
    isRecording: false,
    recognitionRef: null,
    shouldRestartRecognition: false,
    micPermissionStatus: 'unknown',
    micPermissionRequest: null,
    fileUpload: {
      file: null,
      previewUrl: null,
      text: '',
      error: '',
      isDragging: false,
    },
  };

  function generateMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  function getUserId() {
    let id = localStorage.getItem('auria_chatwidget_user_uuid');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('auria_chatwidget_user_uuid', id);
    }
    return id;
  }

  function selectAgent(agentProfiles) {
    const agentNames = Object.keys(agentProfiles);
    if (agentNames.length === 0) return null;
    const randomName = agentNames[Math.floor(Math.random() * agentNames.length)];
    return agentProfiles[randomName];
  }

  function isMobileViewport() {
    return window.innerWidth <= 768;
  }

  function isSpeechRecognitionSupported() {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  function ensureMicrophonePermission() {
    if (state.micPermissionStatus === 'granted') return Promise.resolve(true);
    if (state.micPermissionStatus === 'denied') return Promise.resolve(false);
    if (state.micPermissionRequest) return state.micPermissionRequest;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      state.micPermissionStatus = 'granted';
      return Promise.resolve(true);
    }

    const permissionRequest = navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        state.micPermissionStatus = 'granted';
        return true;
      })
      .catch((error) => {
        console.error('No se pudo obtener acceso al micrófono:', error);
        state.micPermissionStatus = 'denied';
        return false;
      })
      .finally(() => {
        state.micPermissionRequest = null;
        renderContent();
      });

    state.micPermissionRequest = permissionRequest;
    return permissionRequest;
  }

  function showTooltip(e, text) {
    const rect = e.currentTarget.getBoundingClientRect();
    state.tooltip = {
      visible: true,
      text,
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    };
    updateTooltip();
  }

  function hideTooltip() {
    state.tooltip = { visible: false, text: '', top: 0, left: 0 };
    updateTooltip();
  }

  function updateTooltip() {
    let tooltip = document.getElementById('auria-tooltip');
    if (state.tooltip.visible) {
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'auria-tooltip';
        tooltip.className = 'auria-tooltip';
        document.body.appendChild(tooltip);
      }
      tooltip.textContent = state.tooltip.text;
      tooltip.style.top = `${state.tooltip.top}px`;
      tooltip.style.left = `${state.tooltip.left}px`;
      tooltip.style.opacity = '1';
    } else if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip && tooltip.remove(), 200);
    }
  }

  function renderHomeView() {
    const agentProfiles = state.config?.agents || {};
    const companyName = state.config?.company_name || 'Auria';
    const welcomeMessage = state.config?.welcome_message || '¿Cómo podemos ayudarte?';
    const logoUrl = state.config?.logo_url;

    const container = document.createElement('div');
    container.className = 'auria-home-view';
    container.style.cssText = 'display:flex;flex-direction:column;height:100%;position:relative;background:transparent;';

    const scrollable = document.createElement('div');
    scrollable.style.cssText = 'flex:1;position:relative;z-index:10;overflow-y:auto;padding-bottom:32px;';

    const header = document.createElement('header');
    header.style.cssText = 'padding:16px;display:flex;align-items:center;justify-content:space-between;color:#e2e8f0;';

    const headerLeft = document.createElement('div');
    headerLeft.style.cssText = 'display:flex;align-items:center;gap:12px;';

    const logoContainer = document.createElement('div');
    logoContainer.style.cssText = 'width:40px;height:40px;display:flex;align-items:center;justify-content:center;';
    if (logoUrl) {
      const logoImg = document.createElement('img');
      logoImg.src = logoUrl;
      logoImg.alt = companyName;
      logoImg.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      logoImg.draggable = false;
      logoContainer.appendChild(logoImg);
    } else {
      const logoIcon = createIcon('logo', 'auria-logo');
      logoIcon.style.width = '100%';
      logoIcon.style.height = '100%';
      logoContainer.appendChild(logoIcon);
    }

    const companySpan = document.createElement('span');
    companySpan.style.cssText = 'font-weight:700;font-size:18px;';
    companySpan.textContent = companyName;

    headerLeft.appendChild(logoContainer);
    headerLeft.appendChild(companySpan);

    const agentsWrapper = document.createElement('div');
    agentsWrapper.style.cssText = 'display:flex;align-items:center;margin-left:-8px;';

    Object.values(agentProfiles).forEach((profile) => {
      if (profile?.avatar) {
        const img = document.createElement('img');
        img.src = profile.avatar;
        img.alt = profile.name;
        img.className = 'auria-agent-avatar';
        img.style.cssText = 'width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,255,255,0.5);object-fit:cover;user-select:none;-webkit-user-drag:none;';
        img.draggable = false;
        img.oncontextmenu = (ev) => ev.preventDefault();
        agentsWrapper.appendChild(img);
      }
    });

    if (agentsWrapper.children.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.style.cssText = 'width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.12);backdrop-filter:blur(6px);';
      const placeholderIcon = createIcon('chat');
      placeholderIcon.style.width = '18px';
      placeholderIcon.style.height = '18px';
      placeholderIcon.style.strokeWidth = '1.6';
      placeholder.appendChild(placeholderIcon);
      agentsWrapper.appendChild(placeholder);
    }

    header.appendChild(headerLeft);
    header.appendChild(agentsWrapper);

    const hero = document.createElement('div');
    hero.style.cssText = 'padding:24px;padding-top:32px;color:white;text-align:left;';
    hero.innerHTML = `<h3 style="margin:0;font-size:36px;font-weight:800;">Hola 👋</h3><h4 style="margin:6px 0 0;font-size:24px;font-weight:700;opacity:0.9;">${welcomeMessage}</h4>`;

    const cards = document.createElement('div');
    cards.style.cssText = 'padding:16px;display:flex;flex-direction:column;gap:16px;box-sizing:border-box;';

    const chatCard = document.createElement('div');
    chatCard.style.cssText = 'background:rgba(255,255,255,0.18);backdrop-filter:blur(18px);border-radius:16px;box-shadow:0 20px 35px -15px rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.16);padding:16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all 0.2s ease;';
    chatCard.onmouseenter = () => (chatCard.style.transform = 'translateY(-2px)');
    chatCard.onmouseleave = () => (chatCard.style.transform = 'translateY(0)');
    chatCard.onclick = () => setActiveView('chat');

    const chatText = document.createElement('div');
    chatText.innerHTML = `<div style="color:white;font-weight:600;">Envíanos un mensaje</div><div style="color:rgba(226,232,240,0.85);font-size:12px;">Solemos responder en 3 minutos</div>`;
    chatCard.appendChild(chatText);
    const chatChevron = createIcon('chevronRight');
    chatChevron.style.width = '20px';
    chatChevron.style.height = '20px';
    chatChevron.style.color = 'rgba(226,232,240,0.85)';
    chatCard.appendChild(chatChevron);

    const searchCard = document.createElement('div');
    searchCard.style.cssText = 'background:rgba(255,255,255,0.18);backdrop-filter:blur(18px);border-radius:16px;box-shadow:0 20px 35px -15px rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.16);padding:16px;box-sizing:border-box;';

    const searchHeader = document.createElement('div');
    searchHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';

    const searchLabel = document.createElement('span');
    searchLabel.style.cssText = 'color:white;font-weight:600;';
    searchLabel.textContent = 'Busca por ayuda';

    const searchIcon = createIcon('search');
    searchIcon.style.width = '20px';
    searchIcon.style.height = '20px';
    searchIcon.style.color = 'rgba(226,232,240,0.85)';

    searchHeader.appendChild(searchLabel);
    searchHeader.appendChild(searchIcon);

    const divider = document.createElement('div');
    divider.style.cssText = 'margin-top:12px;border-top:1px solid rgba(255,255,255,0.25);margin-left:-16px;margin-right:-16px;';

    const searchOptions = document.createElement('div');
    searchOptions.style.cssText = 'margin-top:12px;display:flex;flex-direction:column;gap:8px;';

    const makeSearchOption = (label, view) => {
      const option = document.createElement('div');
      option.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:12px;cursor:pointer;color:#e2e8f0;transition:background 0.2s ease, transform 0.2s ease;';
      option.onmouseenter = () => {
        option.style.background = 'rgba(255,255,255,0.12)';
        option.style.transform = 'translateX(4px)';
      };
      option.onmouseleave = () => {
        option.style.background = 'transparent';
        option.style.transform = 'translateX(0)';
      };
      option.onclick = () => setActiveView(view);
      const labelSpan = document.createElement('span');
      labelSpan.style.cssText = 'font-weight:600;';
      labelSpan.textContent = label;
      const chevron = createIcon('chevronRight');
      chevron.style.width = '20px';
      chevron.style.height = '20px';
      chevron.style.color = 'rgba(226,232,240,0.85)';
      option.appendChild(labelSpan);
      option.appendChild(chevron);
      return option;
    };

    searchOptions.appendChild(makeSearchOption('Preguntas', 'faq'));
    searchOptions.appendChild(makeSearchOption('Artículos', 'articles'));

    searchCard.appendChild(searchHeader);
    searchCard.appendChild(divider);
    searchCard.appendChild(searchOptions);

    cards.appendChild(chatCard);
    cards.appendChild(searchCard);

    scrollable.appendChild(header);
    scrollable.appendChild(hero);
    scrollable.appendChild(cards);

    container.appendChild(scrollable);

    return container;
  }

  function renderTypingIndicator(agentName) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;width:100%;';

    const sender = document.createElement('span');
    sender.style.cssText = 'font-size:12px;color:rgba(203,213,225,0.88);margin-bottom:4px;';
    sender.textContent = agentName;
    wrapper.appendChild(sender);

    const bubble = document.createElement('div');
    bubble.style.cssText = 'max-width:85%;padding:12px 22px;border-radius:22px;background:#d7dce7;border:1px solid rgba(15,23,42,0.05);display:flex;align-items:center;gap:8px;box-shadow:0 18px 32px -18px rgba(15,23,42,0.22);';

    for (let i = 0; i < 3; i += 1) {
      const dot = document.createElement('div');
      dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:rgba(71,85,105,0.65);animation: auria-typing ${1 + i * 0.1}s infinite;`;
      bubble.appendChild(dot);
    }

    wrapper.appendChild(bubble);
    return wrapper;
  }

  function renderMessages(container, messages) {
    messages.forEach((msg, index) => {
      const previousSender = index > 0 ? messages[index - 1].sender : null;
      const isUserMessage = msg.sender === 'user';
      const shouldShowSender = !previousSender || previousSender !== msg.sender;
      const messageWrapper = document.createElement('div');
      messageWrapper.style.cssText = `display:flex;flex-direction:column;width:100%;${isUserMessage ? 'align-items:flex-end;' : 'align-items:flex-start;'}`;

      if (shouldShowSender) {
        const sender = document.createElement('span');
        sender.style.cssText = 'font-size:12px;color:rgba(203,213,225,0.88);margin-bottom:4px;';
        sender.textContent = isUserMessage ? 'Tú' : state.agent.name;
        messageWrapper.appendChild(sender);
      }

      const bubble = document.createElement('div');
      bubble.style.maxWidth = '85%';
      bubble.style.padding = '14px 22px';
      bubble.style.fontSize = '13.5px';
      bubble.style.lineHeight = '1.55';
      bubble.style.border = '1px solid rgba(15,23,42,0.05)';
      bubble.style.borderRadius = isUserMessage ? '22px 22px 12px 22px' : '22px';
      if (isUserMessage) {
        bubble.style.background = '#1f7dd6';
        bubble.style.color = '#f8fbff';
        bubble.style.boxShadow = '0 22px 34px -20px rgba(31,125,214,0.65)';
      } else {
        bubble.style.background = '#d7dce7';
        bubble.style.color = '#1f2937';
        bubble.style.boxShadow = '0 18px 32px -18px rgba(15,23,42,0.22)';
      }

      const text = document.createElement('div');
      text.style.cssText = 'word-break:break-word;white-space:pre-wrap;font-weight:500;letter-spacing:0.005em;';
      text.innerHTML = parseMarkdown(msg.text);
      bubble.appendChild(text);

      const time = document.createElement('span');
      time.style.cssText = `display:block;margin-top:10px;font-size:11px;text-align:right;${isUserMessage ? 'color:rgba(238,245,255,0.75);' : 'color:rgba(71,85,105,0.8);'}`;
      time.textContent = msg.timestamp;
      bubble.appendChild(time);

      messageWrapper.appendChild(bubble);
      container.appendChild(messageWrapper);
    });
  }

  function renderChatView() {
    const isAgentAssigned = state.agent && state.agent.name !== 'Auria';
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;height:100%;background:transparent;';

    const header = document.createElement('header');
    header.style.cssText = 'background:rgba(0,0,0,0.25);color:white;padding:16px;display:flex;align-items:center;justify-content:space-between;position:relative;';

    const headerLeft = document.createElement('div');
    headerLeft.style.cssText = 'display:flex;align-items:center;gap:12px;';

    const backBtn = document.createElement('button');
    backBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:transparent;border:none;color:white;cursor:pointer;transition:background 0.2s ease;';
    backBtn.setAttribute('aria-label', 'Volver a inicio');
    backBtn.onmouseenter = () => (backBtn.style.background = 'rgba(255,255,255,0.18)');
    backBtn.onmouseleave = () => (backBtn.style.background = 'transparent');
    backBtn.onclick = () => setActiveView('home');
    const backIcon = createIcon('chevronRight');
    backIcon.style.transform = 'rotate(180deg)';
    backBtn.appendChild(backIcon);

    const avatarWrapper = document.createElement('div');
    avatarWrapper.style.cssText = 'width:40px;height:40px;display:flex;align-items:center;justify-content:center;';
    if (state.agent?.avatar) {
      const avatar = document.createElement('img');
      avatar.src = state.agent.avatar;
      avatar.alt = state.agent.name;
      avatar.style.cssText = 'width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.45);';
      avatar.draggable = false;
      avatarWrapper.appendChild(avatar);
    } else if (state.config?.logo_url) {
      const logo = document.createElement('img');
      logo.src = state.config.logo_url;
      logo.alt = state.config?.company_name || 'Logo';
      logo.style.cssText = 'width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.45);';
      logo.draggable = false;
      avatarWrapper.appendChild(logo);
    } else {
      const fallbackLogo = createIcon('logo');
      fallbackLogo.style.width = '100%';
      fallbackLogo.style.height = '100%';
      avatarWrapper.appendChild(fallbackLogo);
    }

    const agentInfo = document.createElement('div');
    agentInfo.innerHTML = `<div style="font-weight:700">${state.agent?.name === 'Auria' ? 'Chatea con nosotros' : state.agent?.name || 'Auria'}</div><div style="font-size:12px;color:rgba(255,255,255,0.82)">Online</div>`;

    headerLeft.appendChild(backBtn);
    headerLeft.appendChild(avatarWrapper);
    headerLeft.appendChild(agentInfo);

    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;align-items:center;gap:8px;';

    const muteBtn = document.createElement('button');
    muteBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:transparent;border:none;color:white;cursor:pointer;transition:background 0.2s ease;';
    muteBtn.setAttribute('aria-label', 'Silenciar/Activar sonido');
    muteBtn.disabled = !isAgentAssigned;
    muteBtn.onmouseenter = () => !muteBtn.disabled && (muteBtn.style.background = 'rgba(255,255,255,0.18)');
    muteBtn.onmouseleave = () => (muteBtn.style.background = 'transparent');
    muteBtn.onclick = () => toggleMute();
    const muteIcon = createIcon(state.isMuted ? 'volume-off' : 'volume');
    muteBtn.appendChild(muteIcon);

    const micBtn = document.createElement('button');
    micBtn.style.cssText = `width:32px;height:32px;border-radius:50%;display:grid;place-items:center;border:none;color:white;cursor:pointer;transition:background 0.2s ease;${state.isRecording ? 'background:rgba(248,113,113,0.85);' : 'background:transparent;'}`;
    micBtn.setAttribute('aria-label', 'Iniciar/Detener grabación de voz');
    const speechSupported = isSpeechRecognitionSupported();
    const micDisabledReason = !isAgentAssigned
      ? 'Esperando a que un agente se conecte...'
      : !speechSupported
        ? 'El micrófono no está disponible en este navegador'
        : state.micPermissionStatus === 'denied'
          ? 'Permite el acceso al micrófono desde el navegador'
          : null;
    micBtn.disabled = Boolean(micDisabledReason);
    micBtn.style.opacity = micBtn.disabled ? '0.5' : '1';
    micBtn.style.cursor = micBtn.disabled ? 'not-allowed' : 'pointer';
    if (micDisabledReason) {
      micBtn.title = micDisabledReason;
    } else {
      micBtn.removeAttribute('title');
    }
    micBtn.onmouseenter = (e) => {
      if (micBtn.disabled && micDisabledReason) {
        showTooltip(e, micDisabledReason);
        return;
      }
      if (!state.isRecording) {
        micBtn.style.background = 'rgba(255,255,255,0.18)';
      }
    };
    micBtn.onmouseleave = () => {
      hideTooltip();
      if (state.isRecording) return;
      micBtn.style.background = 'transparent';
    };
    micBtn.onclick = () => {
      if (micBtn.disabled) return;
      toggleRecording();
    };
    const micIcon = createIcon('mic');
    micBtn.appendChild(micIcon);

    controls.appendChild(muteBtn);
    controls.appendChild(micBtn);

    header.appendChild(headerLeft);
    header.appendChild(controls);

    const wave = document.createElement('div');
    wave.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;overflow:hidden;line-height:0;transform:rotate(180deg);';
    wave.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style="display:block;width:100%;height:20px;color:rgba(0,0,0,0.25);"><path fill="currentColor" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path></svg>`;
    header.appendChild(wave);

    const messagesContainerWrapper = document.createElement('div');
    messagesContainerWrapper.style.cssText = 'position:relative;flex:1;background:transparent;';

    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'auria-chat-messages';
    messagesContainer.style.cssText = 'position:absolute;inset:0;overflow-y:auto;padding:16px 16px 96px;display:flex;flex-direction:column;gap:14px;';
    messagesContainer.style.setProperty('padding-bottom', 'calc(96px + var(--auria-safe-area-bottom, 0px) + var(--auria-keyboard-offset, 0px))');
    renderMessages(messagesContainer, state.messages);
    if (state.isTyping) {
      messagesContainer.appendChild(renderTypingIndicator(state.agent.name));
    }

    messagesContainerWrapper.appendChild(messagesContainer);

    const form = document.createElement('form');
    form.style.cssText = 'position:relative;background:linear-gradient(180deg, rgba(15,23,42,0.92), rgba(8,14,28,0.92));border-top:1px solid rgba(71,85,105,0.3);border-bottom:1px solid rgba(8,14,28,0.9);min-height:128px;padding:4px 18px 6px;';
    form.style.setProperty('padding-bottom', 'calc(6px + var(--auria-safe-area-bottom, 0px) + var(--auria-keyboard-offset, 0px))');
    form.onsubmit = (e) => {
      e.preventDefault();
      handleSendMessage(state.inputValue);
    };

    const textarea = document.createElement('textarea');
    textarea.id = 'auria-chat-input';
    textarea.style.cssText = 'width:calc(100% - 72px);height:100%;resize:none;background:transparent;border:none;color:#f8fbff;font-size:16px;padding:4px 18px 6px 18px;line-height:1.55;outline:none;box-shadow:none;margin-right:72px;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-weight:500;letter-spacing:0.005em;touch-action:manipulation;';
    textarea.style.minHeight = '68px';
    textarea.placeholder = isAgentAssigned ? 'Escribe un mensaje...' : 'Espera a que un agente se conecte...';
    textarea.inputMode = 'text';
    textarea.setAttribute('enterkeyhint', 'send');
    textarea.disabled = !isAgentAssigned || state.isBotReplying;
    textarea.value = state.inputValue;
    textarea.maxLength = 2000;
    const adjustTextareaHeight = () => {
      textarea.style.height = 'auto';
      const maxHeight = 140;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    };
    adjustTextareaHeight();

    textarea.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(state.inputValue);
      }
    };
    form.appendChild(textarea);

    const charCount = document.createElement('div');
    charCount.style.cssText = 'position:absolute;left:22px;font-size:11px;font-weight:600;color:#f87171;display:none;bottom:10px;';
    charCount.style.setProperty('bottom', 'calc(10px + var(--auria-safe-area-bottom, 0px) + var(--auria-keyboard-offset, 0px))');
    form.appendChild(charCount);

    const actions = document.createElement('div');
    actions.style.cssText = 'position:absolute;right:18px;display:flex;align-items:center;gap:8px;bottom:8px;';
    actions.style.setProperty('bottom', 'calc(8px + var(--auria-safe-area-bottom, 0px) + var(--auria-keyboard-offset, 0px))');

    const clipWrapper = document.createElement('div');
    clipWrapper.onmouseenter = (e) => showTooltip(e, isAgentAssigned ? 'Enviar archivo' : 'Esperando agente');
    clipWrapper.onmouseleave = hideTooltip;

    const clipBtn = document.createElement('button');
    clipBtn.type = 'button';
    clipBtn.style.cssText = 'width:36px;height:36px;border-radius:50%;border:none;background:rgba(148,163,184,0.18);color:rgba(226,232,240,0.85);display:grid;place-items:center;cursor:pointer;transition:background 0.2s ease;';
    clipBtn.disabled = !isAgentAssigned;
    clipBtn.onclick = () => {
      hideTooltip();
      setActiveView('fileUpload');
    };
    clipBtn.onmouseenter = () => {
      if (!clipBtn.disabled) clipBtn.style.background = 'rgba(148,163,184,0.28)';
    };
    clipBtn.onmouseleave = () => {
      clipBtn.style.background = clipBtn.disabled ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)';
    };
    if (clipBtn.disabled) {
      clipBtn.style.background = 'rgba(148,163,184,0.12)';
    }
    clipBtn.style.opacity = clipBtn.disabled ? '0.5' : '1';
    clipBtn.style.cursor = clipBtn.disabled ? 'not-allowed' : 'pointer';
    const clipIcon = createIcon('clip');
    clipBtn.appendChild(clipIcon);

    /* BEGIN: TEMPORARY FILE UPLOAD DISABLE BLOCK
       Descripción: Bloquea el botón de subir archivos (clip) y muestra tooltip "Bloqueado".
       Para reactivar la subida de archivos, elimina este bloque completo. */
    (function disableFileUploadTemporarily() {
      const reason = 'Bloqueado';
      // Forzar aspecto deshabilitado sin usar attribute disabled (queremos recibir eventos para mostrar tooltip)
      clipBtn.style.opacity = '0.5';
      clipBtn.style.cursor = 'not-allowed';
      clipBtn.style.background = 'rgba(148,163,184,0.12)';

      // Tooltip en hover/press
      clipWrapper.onmouseenter = (e) => showTooltip(e, reason);
      clipWrapper.onmouseleave = hideTooltip;
      clipWrapper.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showTooltip(e, reason); setTimeout(hideTooltip, 1200); };

      // Anular acciones del botón
      clipBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showTooltip({ currentTarget: clipWrapper }, reason); setTimeout(hideTooltip, 1200); };
      clipBtn.onmouseenter = () => { /* no-op */ };
      clipBtn.onmouseleave = () => { clipBtn.style.background = 'rgba(148,163,184,0.12)'; };
      clipBtn.disabled = false; // asegurar que emite eventos para tooltip
    })();
    /* END: TEMPORARY FILE UPLOAD DISABLE BLOCK */

    clipWrapper.appendChild(clipBtn);

    const sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.style.cssText = 'width:36px;height:36px;border-radius:50%;border:none;background:rgba(14,116,144,0.92);color:white;display:grid;place-items:center;cursor:pointer;transition:transform 0.2s ease, background 0.2s ease;';
    sendBtn.disabled = !isAgentAssigned || state.isBotReplying;
    sendBtn.onmouseenter = () => {
      if (!sendBtn.disabled) sendBtn.style.transform = 'scale(1.05)';
    };
    sendBtn.onmouseleave = () => {
      sendBtn.style.transform = 'scale(1)';
    };
    const sendIcon = createIcon('send');
    sendBtn.appendChild(sendIcon);

    actions.appendChild(clipWrapper);
    actions.appendChild(sendBtn);

    const updateComposerUI = () => {
      const hasContent = state.inputValue.trim().length > 0;
      clipWrapper.style.display = hasContent ? 'none' : 'block';
      sendBtn.style.display = hasContent ? 'grid' : 'none';
      sendBtn.disabled = !isAgentAssigned || state.isBotReplying || !hasContent;
      sendBtn.style.opacity = sendBtn.disabled ? '0.45' : '1';
      sendBtn.style.cursor = sendBtn.disabled ? 'not-allowed' : 'pointer';
      if (!hasContent) hideTooltip();
      if (state.inputValue.length >= 2000) {
        charCount.textContent = `${state.inputValue.length} / 2000`;
        charCount.style.display = 'block';
      } else {
        charCount.style.display = 'none';
      }
    };

    updateComposerUI();

    textarea.oninput = (e) => {
      state.inputValue = e.target.value;
      adjustTextareaHeight();
      updateComposerUI();
    };
    textarea.addEventListener('focus', () => {
      if (isMobileViewport()) {
        ensureKeyboardOffsetListeners();
        setTimeout(updateKeyboardOffset, 50);
      }
    });
    textarea.addEventListener('blur', () => {
      if (isMobileViewport()) {
        setTimeout(updateKeyboardOffset, 150);
      }
    });

    form.appendChild(actions);

    container.appendChild(header);
    container.appendChild(messagesContainerWrapper);
    container.appendChild(form);

    setTimeout(() => {
      const messagesEl = document.getElementById('auria-chat-messages');
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }, 0);

    return container;
  }

  function renderSearchView({ title, iconName, placeholder, itemType }) {
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;height:100%;background:transparent;';

    const header = document.createElement('header');
    header.style.cssText = 'background:rgba(0,0,0,0.25);color:white;padding:16px;display:flex;align-items:center;';

    const backBtn = document.createElement('button');
    backBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:transparent;border:none;color:white;cursor:pointer;transition:background 0.2s ease;';
    backBtn.setAttribute('aria-label', 'Volver a inicio');
    backBtn.onmouseenter = () => (backBtn.style.background = 'rgba(255,255,255,0.18)');
    backBtn.onmouseleave = () => (backBtn.style.background = 'transparent');
    backBtn.onclick = () => setActiveView('home');
    const backIcon = createIcon('chevronRight');
    backIcon.style.transform = 'rotate(180deg)';
    backBtn.appendChild(backIcon);

    const titleEl = document.createElement('h3');
    titleEl.style.cssText = 'margin:0 0 0 8px;font-size:18px;font-weight:700;';
    titleEl.textContent = title;

    header.appendChild(backBtn);
    header.appendChild(titleEl);

    const searchBar = document.createElement('div');
    searchBar.style.cssText = 'padding:16px;background:rgba(0,0,0,0.18);border-bottom:1px solid rgba(255,255,255,0.18);';

    const inputWrapper = document.createElement('div');
    inputWrapper.style.cssText = 'position:relative;';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = placeholder;
    searchInput.style.cssText = 'width:100%;padding:10px 14px 10px 36px;border-radius:12px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);color:white;font-size:16px;outline:none;box-sizing:border-box;';

    const searchIcon = createIcon('search');
    searchIcon.style.cssText = 'position:absolute;left:10px;top:50%;width:18px;height:18px;color:rgba(203,213,225,0.9);transform:translateY(-50%);';

    inputWrapper.appendChild(searchInput);
    inputWrapper.appendChild(searchIcon);
    searchBar.appendChild(inputWrapper);

    const emptyState = document.createElement('div');
    emptyState.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;';

    const emptyIcon = createIcon(iconName);
    emptyIcon.style.width = '64px';
    emptyIcon.style.height = '64px';
    emptyIcon.style.color = 'rgba(148,163,184,0.45)';
    emptyIcon.style.marginBottom = '16px';

    const emptyTitle = document.createElement('p');
    emptyTitle.style.cssText = 'margin:0;font-size:18px;font-weight:600;color:#e2e8f0;';
    emptyTitle.textContent = 'No hay resultados';

    const emptyText = document.createElement('p');
    emptyText.style.cssText = 'margin:8px 0 0;font-size:14px;color:rgba(203,213,225,0.85);max-width:280px;';
    emptyText.textContent = `No hay ${itemType}s disponibles en este momento.`;

    const chatBtn = document.createElement('button');
    chatBtn.style.cssText = 'margin-top:24px;padding:12px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.18);background:rgba(14,116,144,0.5);color:white;font-weight:700;cursor:pointer;transition:background 0.2s ease;';
    chatBtn.textContent = 'Chatear ahora';
    chatBtn.onclick = () => setActiveView('chat');

    emptyState.appendChild(emptyIcon);
    emptyState.appendChild(emptyTitle);
    emptyState.appendChild(emptyText);
    emptyState.appendChild(chatBtn);

    searchInput.addEventListener('input', () => {
      const term = searchInput.value.trim();
      emptyText.textContent = term
        ? `No se encontró ningún ${itemType} que coincida con "${term}".`
        : `No hay ${itemType}s disponibles en este momento.`;
    });

    container.appendChild(header);
    container.appendChild(searchBar);
    container.appendChild(emptyState);

    return container;
  }

  function renderFileUploadView() {
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-direction:column;height:100%;background:transparent;';

    const header = document.createElement('header');
    header.style.cssText = 'background:rgba(0,0,0,0.25);color:white;padding:16px;display:flex;align-items:center;';

    const backBtn = document.createElement('button');
    backBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:transparent;border:none;color:white;cursor:pointer;transition:background 0.2s ease;';
    backBtn.setAttribute('aria-label', 'Volver al chat');
    backBtn.onmouseenter = () => (backBtn.style.background = 'rgba(255,255,255,0.18)');
    backBtn.onmouseleave = () => (backBtn.style.background = 'transparent');
    backBtn.onclick = () => setActiveView('chat');
    const backIcon = createIcon('chevronRight');
    backIcon.style.transform = 'rotate(180deg)';
    backBtn.appendChild(backIcon);

    const titleEl = document.createElement('h3');
    titleEl.style.cssText = 'margin:0 0 0 8px;font-size:18px;font-weight:700;';
    titleEl.textContent = 'Enviar archivo';

    header.appendChild(backBtn);
    header.appendChild(titleEl);

    const content = document.createElement('div');
    content.style.cssText = 'flex:1;padding:16px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;box-sizing:border-box;';

    const hiddenInput = document.createElement('input');
    hiddenInput.id = 'auria-file-input';
    hiddenInput.type = 'file';
    hiddenInput.accept = '.jpg,.jpeg,.png,.pdf';
    hiddenInput.style.display = 'none';
    hiddenInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFileSelect(file);
    };

    const dropArea = document.createElement('label');
    dropArea.style.cssText = `flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;border-radius:16px;border:2px dashed ${state.fileUpload.error ? 'rgba(248,113,113,0.9)' : state.fileUpload.isDragging ? 'rgba(56,189,248,0.8)' : 'rgba(248,250,252,0.22)'};background:${state.fileUpload.isDragging ? 'rgba(56,189,248,0.12)' : 'rgba(15,23,42,0.25)'};cursor:pointer;transition:all 0.2s ease;box-sizing:border-box;`;
    dropArea.setAttribute('for', 'auria-file-input');

    dropArea.ondragover = (e) => {
      e.preventDefault();
      state.fileUpload.isDragging = true;
      renderContent();
    };
    dropArea.ondragleave = (e) => {
      e.preventDefault();
      state.fileUpload.isDragging = false;
      renderContent();
    };
    dropArea.ondrop = (e) => {
      e.preventDefault();
      state.fileUpload.isDragging = false;
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    };

    const dropIcon = createIcon('clip');
    dropIcon.style.width = '40px';
    dropIcon.style.height = '40px';
    dropIcon.style.color = 'rgba(226,232,240,0.85)';
    dropIcon.style.marginBottom = '12px';

    const dropTitle = document.createElement('p');
    dropTitle.style.cssText = 'margin:0;font-weight:600;color:white;';
    dropTitle.textContent = 'Arrastra o selecciona un archivo';

    const dropSub = document.createElement('p');
    dropSub.style.cssText = 'margin:4px 0 0;font-size:12px;color:rgba(226,232,240,0.75);';
    dropSub.textContent = 'JPG, PNG o PDF (máx. 10MB)';

    const errorText = document.createElement('p');
    errorText.style.cssText = `margin:8px 0 0;font-size:12px;font-weight:600;color:rgba(248,113,113,${state.fileUpload.error ? 1 : 0});`;
    errorText.textContent = state.fileUpload.error || '';

    dropArea.appendChild(dropIcon);
    dropArea.appendChild(dropTitle);
    dropArea.appendChild(dropSub);
    if (state.fileUpload.error) dropArea.appendChild(errorText);

    const previewWrapper = document.createElement('div');
    previewWrapper.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(15,23,42,0.3);border:1px solid rgba(248,250,252,0.16);min-height:150px;box-sizing:border-box;';

    if (state.fileUpload.file) {
      if (state.fileUpload.previewUrl) {
        const imgPreview = document.createElement('img');
        imgPreview.src = state.fileUpload.previewUrl;
        imgPreview.alt = 'Vista previa';
        imgPreview.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;border-radius:12px;';
        previewWrapper.appendChild(imgPreview);
      } else {
        const fileInfo = document.createElement('div');
        fileInfo.style.cssText = 'text-align:center;color:#e2e8f0;padding:16px;';
        const fileIcon = createIcon('file');
        fileIcon.style.width = '48px';
        fileIcon.style.height = '48px';
        fileIcon.style.marginBottom = '12px';
        const fileName = document.createElement('p');
        fileName.style.cssText = 'margin:0;font-weight:600;';
        fileName.textContent = state.fileUpload.file.name;
        fileInfo.appendChild(fileIcon);
        fileInfo.appendChild(fileName);
        previewWrapper.appendChild(fileInfo);
      }
    } else {
      previewWrapper.appendChild(dropArea);
    }

    const controlsRow = document.createElement('div');
    controlsRow.style.cssText = 'display:flex;align-items:center;gap:12px;';

    const thumbWrapper = document.createElement('div');
    thumbWrapper.style.cssText = 'width:64px;height:64px;border-radius:12px;border:2px solid rgba(56,189,248,0.75);background:rgba(15,23,42,0.35);display:flex;align-items:center;justify-content:center;padding:8px;';

    if (state.fileUpload.previewUrl) {
      const thumbImg = document.createElement('img');
      thumbImg.src = state.fileUpload.previewUrl;
      thumbImg.alt = 'Miniatura';
      thumbImg.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
      thumbWrapper.appendChild(thumbImg);
    } else {
      const thumbIcon = createIcon('file');
      thumbIcon.style.width = '28px';
      thumbIcon.style.height = '28px';
      thumbWrapper.appendChild(thumbIcon);
    }

    const addFileLabel = document.createElement('label');
    addFileLabel.setAttribute('for', 'auria-file-input');
    addFileLabel.style.cssText = 'width:64px;height:64px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;cursor:pointer;';
    const plusIcon = createIcon('plus');
    plusIcon.style.width = '28px';
    plusIcon.style.height = '28px';
    addFileLabel.appendChild(plusIcon);

    controlsRow.appendChild(thumbWrapper);
    controlsRow.appendChild(addFileLabel);

    const textAreaWrapper = document.createElement('div');
    textAreaWrapper.style.cssText = 'position:relative;';
    const textArea = document.createElement('textarea');
    textArea.style.cssText = 'width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.12);color:white;font-size:16px;padding:12px;resize:none;min-height:80px;box-sizing:border-box;';
    textArea.placeholder = 'Añade un mensaje (opcional)...';
    textArea.maxLength = 280;
    textArea.value = state.fileUpload.text;
    textArea.oninput = (e) => {
      state.fileUpload.text = e.target.value;
      renderContent();
    };

    const counter = document.createElement('div');
    counter.style.cssText = 'position:absolute;bottom:10px;right:12px;font-size:12px;color:rgba(226,232,240,0.75);';
    counter.textContent = `${state.fileUpload.text.length} / 280`;

    textAreaWrapper.appendChild(textArea);
    textAreaWrapper.appendChild(counter);

    content.appendChild(hiddenInput);
    if (state.fileUpload.file) content.appendChild(previewWrapper);
    content.appendChild(state.fileUpload.file ? controlsRow : previewWrapper);
    content.appendChild(textAreaWrapper);

    const footer = document.createElement('footer');
    footer.style.cssText = 'padding:16px;background:rgba(0,0,0,0.25);border-top:1px solid rgba(255,255,255,0.18);';
    footer.style.setProperty('padding-bottom', 'calc(16px + var(--auria-safe-area-bottom, 0px) + var(--auria-keyboard-offset, 0px))');

    const sendBtn = document.createElement('button');
    sendBtn.style.cssText = `width:100%;padding:14px;border-radius:12px;font-weight:700;border:none;cursor:${state.fileUpload.file ? 'pointer' : 'not-allowed'};transition:background 0.2s ease;color:${state.fileUpload.file ? 'white' : 'rgba(203,213,225,0.75)'};background:${state.fileUpload.file ? 'rgba(14,116,144,0.9)' : 'rgba(14,116,144,0.35)'}`;
    sendBtn.textContent = 'Enviar';
    sendBtn.disabled = !state.fileUpload.file;
    sendBtn.onclick = () => {
      if (state.fileUpload.file) {
        handleSendFile(state.fileUpload.file, state.fileUpload.text);
      }
    };

    footer.appendChild(sendBtn);

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);

    return container;
  }

  function renderFooterNav() {
    const footer = document.createElement('footer');
    footer.style.cssText = 'background:rgba(0,0,0,0.25);border-top:1px solid rgba(255,255,255,0.18);display:grid;grid-template-columns:repeat(4,1fr);font-size:12px;color:rgba(203,213,225,0.9);padding:0 0 10px;';
    footer.style.setProperty('padding-bottom', 'calc(10px + var(--auria-safe-area-bottom, 0px))');

    const items = [
      { view: 'home', icon: 'home', label: 'Inicio' },
      { view: 'chat', icon: 'chat', label: 'Conversación' },
      { view: 'faq', icon: 'faq', label: 'Preguntas' },
      { view: 'articles', icon: 'articles', label: 'Artículos' },
    ];

    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.style.cssText = `padding:12px 8px;border:none;background:transparent;display:flex;flex-direction:column;align-items:center;gap:5px;color:${state.activeView === item.view ? 'white' : 'rgba(203,213,225,0.9)'};font-weight:${state.activeView === item.view ? '700' : '500'};cursor:pointer;transition:color 0.2s ease;`;
      btn.onclick = () => setActiveView(item.view);
      const icon = createIcon(item.icon);
      icon.style.width = '20px';
      icon.style.height = '20px';
      btn.appendChild(icon);
      const span = document.createElement('span');
      span.textContent = item.label;
      btn.appendChild(span);
      footer.appendChild(btn);
    });

    return footer;
  }

  function renderContent() {
    const panel = document.getElementById('auria-widget-panel');
    if (!panel) return;
    panel.innerHTML = '';

    if (state.activeView === 'home') {
      panel.appendChild(renderHomeView());
      panel.appendChild(renderFooterNav());
    } else if (state.activeView === 'chat') {
      panel.appendChild(renderChatView());
    } else if (state.activeView === 'faq') {
      panel.appendChild(renderSearchView({
        title: 'Preguntas',
        iconName: 'faq',
        placeholder: 'Buscar en preguntas...',
        itemType: 'pregunta',
      }));
      panel.appendChild(renderFooterNav());
    } else if (state.activeView === 'articles') {
      panel.appendChild(renderSearchView({
        title: 'Artículos',
        iconName: 'articles',
        placeholder: 'Buscar en artículos...',
        itemType: 'artículo',
      }));
      panel.appendChild(renderFooterNav());
    } else if (state.activeView === 'fileUpload') {
      panel.appendChild(renderFileUploadView());
    }

    if (isMobileViewport() && state.isOpen) {
      const mobileClose = document.createElement('button');
      mobileClose.className = 'auria-mobile-close';
      mobileClose.setAttribute('aria-label', 'Cerrar chat');
      mobileClose.onclick = toggleChat;
      const closeIcon = createIcon('close');
      closeIcon.style.width = '10px';
      closeIcon.style.height = '10px';
      closeIcon.style.marginTop = '1px';
      mobileClose.appendChild(closeIcon);
      panel.appendChild(mobileClose);
    }

    updateTooltip();
  }

  function setActiveView(view) {
    hideTooltip();
    if (view !== 'chat' && state.recognitionRef) {
      state.shouldRestartRecognition = false;
      if (state.isRecording) {
        try {
          state.recognitionRef.stop();
        } catch (err) {
          console.error('Error al detener reconocimiento:', err);
        }
      }
      state.isRecording = false;
    }
    state.activeView = view;
    if (view === 'chat' && !state.isChatInitialized) {
      state.isChatInitialized = true;
      initializeChat();
    }
    renderContent();
    ensureKeyboardOffsetListeners();
    updateKeyboardOffset();
  }

  function toggleChat() {
    state.isOpen = !state.isOpen;
    if (!state.isOpen && state.recognitionRef) {
      state.shouldRestartRecognition = false;
      if (state.isRecording) {
        try {
          state.recognitionRef.stop();
        } catch (err) {
          console.error('Error al detener reconocimiento:', err);
        }
      }
      state.isRecording = false;
    }
    const panel = document.getElementById('auria-widget-panel');
    const button = document.getElementById('auria-widget-button');
    const welcomeMsg = document.getElementById('auria-welcome-msg');

    if (state.isOpen) {
      if (panel) panel.style.display = 'flex';
      if (button) button.classList.add('open');
      if (welcomeMsg) welcomeMsg.style.display = 'none';
      state.showWelcomeMessage = false;
      if (isMobileViewport()) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
      renderContent();
      if (isMobileViewport()) {
        ensureKeyboardOffsetListeners();
        setTimeout(updateKeyboardOffset, 50);
      }
    } else {
      if (panel) panel.style.display = 'none';
      if (button) button.classList.remove('open');
      if (isMobileViewport()) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        setKeyboardOffset(0);
      }
    }
  }

  function toggleMute() {
    state.isMuted = !state.isMuted;
    renderContent();
  }

  function initSpeechRecognition() {
    if (state.recognitionRef) return state.recognitionRef;
    if (!isSpeechRecognitionSupported()) {
      console.error('Web Speech API no compatible');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      state.isRecording = true;
      renderContent();
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal && result[0]) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        state.inputValue = [state.inputValue, finalTranscript.trim()].filter(Boolean).join(' ');
        renderContent();
      }
    };

    recognition.onerror = (event) => {
      console.error('Error en reconocimiento de voz:', event.error);
      const fatalErrors = ['not-allowed', 'service-not-allowed', 'audio-capture'];
      if (fatalErrors.includes(event.error)) {
        state.shouldRestartRecognition = false;
        state.isRecording = false;
        if (event.error !== 'audio-capture') {
          state.micPermissionStatus = 'denied';
        }
        renderContent();
      }
    };

    recognition.onend = () => {
      if (state.shouldRestartRecognition) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error('Error al reiniciar reconocimiento:', err);
            state.shouldRestartRecognition = false;
            state.isRecording = false;
            renderContent();
          }
        }, 250);
      } else if (state.isRecording) {
        state.isRecording = false;
        renderContent();
      } else {
        renderContent();
      }
    };

    state.recognitionRef = recognition;
    return recognition;
  }

  async function toggleRecording() {
    const recognition = initSpeechRecognition();
    if (!recognition) return;

    if (state.isRecording || state.shouldRestartRecognition) {
      state.shouldRestartRecognition = false;
      try {
        recognition.stop();
      } catch (err) {
        console.error('Error al detener reconocimiento:', err);
      }
      state.isRecording = false;
      renderContent();
      return;
    }

    const hasPermission = await ensureMicrophonePermission();
    if (!hasPermission) {
      state.shouldRestartRecognition = false;
      state.isRecording = false;
      renderContent();
      return;
    }

    state.shouldRestartRecognition = true;
    try {
      recognition.start();
      state.isRecording = true;
      renderContent();
    } catch (err) {
      if (err.name === 'InvalidStateError') {
        console.warn('Intento de iniciar reconocimiento mientras ya estaba activo.');
        state.isRecording = true;
        return;
      }
      state.shouldRestartRecognition = false;
      state.isRecording = false;
      if (err.name === 'NotAllowedError') {
        state.micPermissionStatus = 'denied';
      }
      console.error('Error al iniciar reconocimiento:', err);
      renderContent();
    }
  }

  function resetFileUploadState() {
    if (state.fileUpload.previewUrl) {
      URL.revokeObjectURL(state.fileUpload.previewUrl);
    }
    state.fileUpload = {
      file: null,
      previewUrl: null,
      text: '',
      error: '',
      isDragging: false,
    };
  }

  function handleFileSelect(file) {
    resetFileUploadState();
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      state.fileUpload.error = 'Tipo de archivo no permitido. Solo JPG, PNG o PDF.';
      renderContent();
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      state.fileUpload.error = 'El archivo es demasiado grande. El tamaño máximo es de 10MB.';
      renderContent();
      return;
    }
    state.fileUpload.file = file;
    if (file.type.startsWith('image/')) {
      state.fileUpload.previewUrl = URL.createObjectURL(file);
    }
    renderContent();
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Error al convertir archivo'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleSendFile(file, text) {
    if (!file || !state.userId) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fileMessageText = `[Archivo: ${file.name}]${text ? `\n\n${text}` : ''}`;
    state.messages.push({
      id: Date.now(),
      text: fileMessageText,
      sender: 'user',
      timestamp,
    });
    state.activeView = 'chat';
    renderContent();

    try {
      const base64Content = await fileToBase64(file);
      const payload = {
        user_id: state.userId,
        message_id: generateMessageId(),
        content_type: 'file',
        text_content: text || '',
        file_data: {
          file_name: file.name,
          file_type: file.type,
          file_base64: base64Content,
        },
      };
      await postToWebhook(payload);
    } catch (error) {
      console.error('Error al convertir archivo a Base64:', error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      state.messages.push({
        id: Date.now() + 1,
        text: 'Hubo un error al procesar tu archivo. Inténtalo de nuevo.',
        sender: 'bot',
        timestamp: errorTimestamp,
      });
      renderContent();
    } finally {
      resetFileUploadState();
    }
  }

  async function processReplyQueue(queue) {
    state.isBotReplying = true;
    renderContent();

    for (const item of queue) {
      const messageText = normalizeReply(item);
      if (!messageText) continue;
      state.isTyping = true;
      renderContent();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      state.isTyping = false;
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      state.messages.push({
        id: Date.now() + Math.random(),
        text: messageText,
        sender: 'bot',
        timestamp: botTimestamp,
      });
      if (!state.isMuted) playNotificationSound();
      renderContent();
    }

    state.isBotReplying = false;
    renderContent();
  }

  function extractRepliesFromWebhook(data) {
    const replies = [];
    const candidateKeys = [
      'messages',
      'message',
      'reply',
      'replies',
      'response',
      'responses',
      'output',
      'output1',
      'output2',
      'output3',
      'output4',
      'text',
      'content',
      'body',
      'data',
    ];
    const seen = new WeakSet();

    const collect = (value, depth = 0) => {
      if (depth > 4 || value == null) return;
      if (typeof value === 'string') {
        const normalized = normalizeReply(value);
        if (normalized) replies.push(normalized);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => collect(item, depth + 1));
        return;
      }
      if (typeof value === 'object') {
        if (seen.has(value)) return;
        seen.add(value);
        candidateKeys.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            collect(value[key], depth + 1);
          }
        });
        if (depth <= 2) {
          Object.values(value).forEach((inner) => collect(inner, depth + 1));
        }
      }
    };

    collect(data);
    return Array.from(new Set(replies));
  }

  async function postToWebhook(payload) {
    const webhookUrl = state.config?.webhook_url;
    if (!webhookUrl) {
      console.error('No hay webhook configurado');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let responseText = '';
      try {
        responseText = await response.text();
      } catch (readError) {
        console.error('No se pudo leer la respuesta del webhook:', readError);
      }

      if (!response.ok) {
        console.error(`Webhook respondió con estado: ${response.status}`);
      }

      let responseBody = null;
      if (responseText) {
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          responseBody = responseText;
        }
      }

      let replies = [];
      const appendIfValid = (value) => {
        const normalized = normalizeReply(value);
        if (normalized) replies.push(normalized);
      };

      if (Array.isArray(responseBody)) {
        responseBody.forEach(appendIfValid);
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        ['output', 'output1', 'output2', 'output3', 'output4'].forEach((key) => appendIfValid(responseBody[key]));
      } else if (typeof responseBody === 'string') {
        appendIfValid(responseBody);
      }

      if (!replies.length && responseBody != null) {
        replies = extractRepliesFromWebhook(responseBody);
      }

      if (replies.length) {
        await processReplyQueue(replies);
      }
    } catch (error) {
      console.error('Error al enviar mensaje al webhook:', error);
    }
  }

  function handleSendMessage(text) {
    const trimmedText = text.trim();
    if (!trimmedText || !state.userId) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.messages.push({
      id: Date.now(),
      text: trimmedText,
      sender: 'user',
      timestamp,
    });
    state.inputValue = '';
    renderContent();

    postToWebhook({
      user_id: state.userId,
      message_id: generateMessageId(),
      content_type: 'text',
      text_content: trimmedText,
    });
  }

  function initializeChat() {
    if (!state.assignedAgent) return;

    setTimeout(() => {
      state.agent = state.assignedAgent;
      renderContent();
    }, 1800);

    setTimeout(() => {
      if (state.messages.length === 0) {
        state.isTyping = true;
        state.isBotReplying = true;
        renderContent();
        setTimeout(() => {
          state.isTyping = false;
          const welcomeText = `¡Hola! Somos ${state.config?.company_name || 'Auria'}. Deja tu consulta y te respondemos a la brevedad.`;
          const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          state.messages.push({
            id: Date.now(),
            text: welcomeText,
            sender: 'bot',
            timestamp: botTimestamp,
          });
          state.isBotReplying = false;
          if (!state.isMuted) playNotificationSound();
          renderContent();
        }, 3800);
      }
    }, 2200);
  }

  async function loadConfig() {
    return cloneDefaultConfig();
  }

  async function init() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const widgetContainer = document.getElementById('auria-widget');
    if (!widgetContainer) {
      const autoContainer = document.createElement('div');
      autoContainer.id = 'auria-widget';
      document.body.appendChild(autoContainer);
    }

    state.config = await loadConfig();
    ensureKeyboardOffsetListeners();


    state.userId = getUserId();
    state.assignedAgent = selectAgent(state.config.agents || {});
    state.agent = { name: state.config.company_name || 'Auria', avatar: null };

    const button = document.createElement('button');
    button.id = 'auria-widget-button';
    button.setAttribute('aria-expanded', 'false');
    const chatIcon = createIcon('chat');
    chatIcon.classList.add('chat-icon');
    const closeIcon = createIcon('close');
    closeIcon.classList.add('close-icon');
    button.appendChild(chatIcon);
    button.appendChild(closeIcon);
    button.onclick = toggleChat;

    const panel = document.createElement('div');
    panel.id = 'auria-widget-panel';
    panel.style.display = 'none';

    const welcomeMsg = document.createElement('div');
    welcomeMsg.id = 'auria-welcome-msg';
    welcomeMsg.className = 'auria-welcome-msg';

    const closeWelcomeBtn = document.createElement('button');
    closeWelcomeBtn.className = 'auria-welcome-msg-close';
    closeWelcomeBtn.setAttribute('aria-label', 'Cerrar mensaje de bienvenida');
    const closeWelcomeIcon = createIcon('close');
    closeWelcomeIcon.style.width = '14px';
    closeWelcomeIcon.style.height = '14px';
    closeWelcomeBtn.appendChild(closeWelcomeIcon);
    closeWelcomeBtn.onclick = () => {
      welcomeMsg.style.display = 'none';
      state.showWelcomeMessage = false;
    };

    const welcomeContent = document.createElement('div');
    welcomeContent.innerHTML = `
      <p class="auria-welcome-msg-title">¡Hola! 👋</p>
      <p class="auria-welcome-msg-text">Aquí puedes escribirnos. ¿Hay algo en lo que podamos ayudarte?</p>
    `;

    welcomeMsg.appendChild(closeWelcomeBtn);
    welcomeMsg.appendChild(welcomeContent);

    document.body.appendChild(button);
    document.body.appendChild(panel);
    document.body.appendChild(welcomeMsg);

    if (state.showWelcomeMessage) {
      welcomeMsg.style.display = 'block';
    }

    renderContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
