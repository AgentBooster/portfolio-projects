import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type MessageSender = 'user' | 'bot';

interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: string;
}

interface AgentProfile {
  name: string;
  avatar: string;
}

interface TooltipState {
  visible: boolean;
  text: string;
  top: number;
  left: number;
}

const ICON_STROKE_WIDTH = 2;

const createAudioContext = () => {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error('AudioContext is not supported by this browser.');
  }

  return new AudioContextClass();
};

// Keep a single audio context alive per session to avoid creation limits on certain browsers.
let sharedAudioContext: AudioContext | null = null;

const playNotificationSound = () => {
  try {
    sharedAudioContext = sharedAudioContext ?? createAudioContext();
    const audioCtx = sharedAudioContext;

    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }

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
  } catch (err) {
    console.error('Error al reproducir el sonido de notificación:', err);
  }
};

const Icon = ({ name, className = '' }: { name: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = useMemo(
    () => ({
      home: (
        <>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      ),
      chat: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
      close: <path d="M18 6 6 18M6 6l12 12" />,
      chevronRight: <path d="M9 18 15 12 9 6" />,
      logo: (
        <>
          <defs>
            <linearGradient id="g-react" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <path d="M15 120 L60 40 L85 75 L110 55 L150 120 Z" fill="url(#g-react)" />
          <path d="M60 40 L85 75 L110 55" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        </>
      ),
      faq: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </>
      ),
      articles: (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </>
      ),
      search: <path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />,
      send: (
        <>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="m22 2-11 11" />
        </>
      ),
      mic: (
        <>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </>
      ),
      volume: (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      ),
      'volume-off': (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ),
      clip: <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
      plus: <path d="M12 5v14m-7-7h14" />,
      file: (
        <>
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </>
      ),
      lightbulb: (
        <>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-5 11.9l-1 3.1h12l-1-3.1A7 7 0 0 0 12 2z" />
        </>
      )
    }),
    []
  );

  const size = name === 'logo' ? 'w-full h-full p-0.5' : 'w-6 h-6';
  const viewBox = name === 'logo' ? '0 0 160 160' : '0 0 24 24';

  return (
    <svg
      className={`${size} ${className}`}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] ?? null}
    </svg>
  );
};

const SimpleMarkdown = ({ text }: { text: string }) => {
  const parseMarkdown = (rawText: string) => {
    if (!rawText) return '';

    let sanitizedText = rawText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const processInlines = (inlineText: string) => {
      return inlineText
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-400 underline font-semibold">$1</a>'
        )
        .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    };

    const blocks = sanitizedText.split(/(\n\s*\n)+/);

    const html = blocks
      .map((block) => {
        if (!block.trim()) return block;

        if (/^(?:\*\s.*(?:\n|$))+/.test(block)) {
          const items = block.trim().split('\n');
          const listItems = items.map((item) => `<li>${processInlines(item.substring(2))}</li>`).join('');
          return `<ul class="list-disc list-inside pl-4">${listItems}</ul>`;
        }

        return processInlines(block);
      })
      .join('');

    return html;
  };

  const htmlContent = { __html: parseMarkdown(text) };

  return <div className="leading-snug whitespace-pre-wrap break-words" dangerouslySetInnerHTML={htmlContent} />;
};

const HomeView = ({
  setActiveView,
  agentProfiles
}: {
  setActiveView: (view: string) => void;
  agentProfiles: Record<string, AgentProfile>;
}) => (
  <div className="h-full flex flex-col relative bg-transparent">
    <div className="relative z-10 h-full overflow-y-auto">
      <header className="p-4 flex items-center justify-between text-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10">
            <Icon name="logo" />
          </div>
          <span className="font-bold text-lg">Altavia</span>
        </div>
        <div className="flex items-center -space-x-2">
          {Object.values(agentProfiles).map((profile) => (
            <img
              key={profile.name}
              src={profile.avatar}
              alt={profile.name}
              className="w-8 h-8 rounded-full border-2 border-white/50 object-cover"
              draggable={false}
            />
          ))}
        </div>
      </header>
      <div className="p-6 pt-8 text-left text-white">
        <h3 className="text-4xl font-extrabold">Hola 👋</h3>
        <h4 className="text-2xl font-bold mt-1 opacity-90">¿Cómo podemos ayudarte?</h4>
      </div>
      <div className="p-4 space-y-4">
        <button
          type="button"
          onClick={() => setActiveView('chat')}
          className="w-full text-left bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-4 flex items-center justify-between cursor-pointer hover:bg-white/30 hover:-translate-y-0.5 transform transition-all duration-200"
        >
          <div>
            <div className="text-white font-semibold">Envíanos un mensaje</div>
            <div className="text-xs text-slate-200">Solemos responder en 3 minutos</div>
          </div>
          <Icon name="chevronRight" className="w-5 h-5 text-slate-200" />
        </button>
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Busca por ayuda</span>
            <Icon name="search" className="w-5 h-5 text-slate-200" />
          </div>
          <div className="mt-3 border-t border-white/20 -mx-4" />
          <div className="mt-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveView('faq')}
              className="w-full flex justify-between items-center cursor-pointer group p-2 -m-2 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-slate-100 font-medium">Preguntas</span>
              <Icon
                name="chevronRight"
                className="w-5 h-5 text-slate-200 group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveView('articles')}
              className="w-full flex justify-between items-center cursor-pointer group p-2 -m-2 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-slate-100 font-medium">Artículos</span>
              <Icon
                name="chevronRight"
                className="w-5 h-5 text-slate-200 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="h-4" />
    </div>
  </div>
);

const CommonSearchView = ({
  title,
  iconName,
  placeholder,
  itemType,
  setActiveView
}: {
  title: string;
  iconName: string;
  placeholder: string;
  itemType: string;
  setActiveView: (view: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const hasResults = false;
  const messageContent =
    searchTerm.trim() === ''
      ? `No hay ${itemType}s disponibles en este momento.`
      : `No se encontró ningún ${itemType} que coincida con los criterios de búsqueda: "${searchTerm}"`;

  return (
    <div className="h-full flex flex-col bg-transparent">
      <header className="bg-black/20 text-white p-4 flex items-center shrink-0">
        <button
          onClick={() => setActiveView('home')}
          className="rounded-full w-8 h-8 inline-flex items-center justify-center hover:bg-white/20 focus:outline-none"
          aria-label="Volver a inicio"
          type="button"
        >
          <Icon name="chevronRight" className="w-5 h-5 rotate-180" />
        </button>
        <h3 className="font-bold text-lg ml-2">{title}</h3>
      </header>
      <div className="p-4 bg-black/10 border-b border-white/10 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white/10 text-white placeholder:text-slate-300"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon name="search" className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-transparent">
        <Icon name={iconName} className="w-16 h-16 text-slate-300/50 mb-4" />
        <p className="text-lg font-semibold text-slate-100">{hasResults ? 'Resultados' : 'No hay resultados'}</p>
        <p className="text-sm text-slate-300 max-w-xs mt-1">{messageContent}</p>
        <button
          onClick={() => setActiveView('chat')}
          className="mt-6 bg-sky-600/50 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600/70 border border-white/20 transition-colors"
          type="button"
        >
          Chatear ahora
        </button>
      </div>
    </div>
  );
};

const TypingIndicator = ({ agentName }: { agentName: string }) => (
  <div className="flex flex-col w-full items-start">
    <span className="text-xs text-slate-300 mb-1">{agentName}</span>
    <div className="max-w-[85%] p-3 text-sm shadow-sm bg-white/30 text-slate-100 border border-white/20 rounded-t-2xl rounded-br-2xl flex items-center gap-2">
      <div className="w-2 h-2 bg-slate-200 rounded-full animate-[bounce_1s_infinite_0s]" />
      <div className="w-2 h-2 bg-slate-200 rounded-full animate-[bounce_1s_infinite_.2s]" />
      <div className="w-2 h-2 bg-slate-200 rounded-full animate-[bounce_1s_infinite_.4s]" />
    </div>
  </div>
);

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  setActiveView: (view: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isTyping: boolean;
  agent: AgentProfile;
  isAgentAssigned: boolean;
  isBotReplying: boolean;
  onShowTooltip: (event: React.MouseEvent, text: string) => void;
  onHideTooltip: () => void;
}

const ChatView = ({
  messages,
  onSendMessage,
  setActiveView,
  isMuted,
  toggleMute,
  isTyping,
  agent,
  isAgentAssigned,
  isBotReplying,
  onShowTooltip,
  onHideTooltip
}: ChatViewProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const MAX_CHAT_CHAR = 2000;

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API no es compatible.');
      return;
    }
    const SpeechRecognition = (window as unknown as { webkitSpeechRecognition: new () => any }).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputValue((prevVal) => [prevVal, finalTranscript.trim()].filter(Boolean).join(' '));
      }
    };
    recognition.onerror = (event: { error: string }) => {
      console.error('Error en reconocimiento de voz:', event.error);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const maxHeight = 120;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error al iniciar reconocimiento:', err);
      }
    }
  };

  const isInputDisabled = !isAgentAssigned || isBotReplying;

  return (
    <div className="h-full flex flex-col bg-transparent">
      <header className="bg-black/20 text-white p-4 flex items-center justify-between shrink-0 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="rounded-full w-8 h-8 inline-flex items-center justify-center hover:bg-white/20 focus:outline-none"
            aria-label="Volver a inicio"
            type="button"
          >
            <Icon name="chevronRight" className="w-5 h-5 rotate-180" />
          </button>
          <div className="w-10 h-10 flex items-center justify-center">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full rounded-full object-cover border-2 border-white/50" />
            ) : (
              <Icon name="logo" />
            )}
          </div>
          <div>
            <div className="font-bold leading-tight">{agent.name === 'Altavia' ? 'Chatea con nosotros' : agent.name}</div>
            <div className="text-xs text-white/90">Online</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleMute}
            disabled={!isAgentAssigned}
            className="w-8 h-8 rounded-full grid place-items-center hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Silenciar/Activar sonido"
          >
            <Icon name={isMuted ? 'volume-off' : 'volume'} className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={toggleRecording}
            disabled={!isAgentAssigned}
            className={`w-8 h-8 rounded-full grid place-items-center transition-colors ${
              isRecording ? 'bg-red-500' : 'hover:bg-white/20'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Iniciar/Detener grabación de voz"
          >
            <Icon name="mic" className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-5 text-black/10"
          >
            <path
              fill="currentColor"
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            />
          </svg>
        </div>
      </header>
      <div className="flex-1 relative bg-transparent">
        <div ref={chatMessagesRef} className="absolute inset-0 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const showSenderName = msg.sender !== 'user' && (index === 0 || messages[index - 1].sender !== 'bot');
            return (
              <div key={msg.id} className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {showSenderName && <span className="text-xs text-slate-300 mb-1">{agent.name}</span>}
                <div
                  className={`max-w-[85%] p-3 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-sky-600/90 text-white rounded-t-2xl rounded-bl-2xl'
                      : 'bg-white/30 text-slate-100 border border-white/20 rounded-t-2xl rounded-br-2xl'
                  }`}
                >
                  <SimpleMarkdown text={msg.text} />
                  <span
                    className={`text-xs mt-1 block text-right ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-slate-300'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          {isTyping && <TypingIndicator agentName={agent.name} />}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-black/20 border-t border-white/20 relative shrink-0" style={{ minHeight: '120px' }}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          maxLength={MAX_CHAT_CHAR}
          className="absolute inset-0 w-full h-full p-4 pr-16 resize-none bg-transparent text-white placeholder:text-slate-300 focus:outline-none disabled:bg-black/20 disabled:cursor-not-allowed"
          style={{ fontSize: '16px' }}
          rows={1}
          placeholder={isAgentAssigned ? 'Escribe un mensaje...' : 'Espera a que un agente se conecte...'}
          disabled={isInputDisabled}
        />
        {inputValue.length >= MAX_CHAT_CHAR && (
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-red-400">
            {inputValue.length} / {MAX_CHAT_CHAR}
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center">
          {inputValue.trim() ? (
            <button
              type="submit"
              disabled={isInputDisabled}
              className="w-9 h-9 rounded-full bg-sky-600/80 hover:bg-sky-500/80 text-white grid place-items-center shrink-0 transition-all animate-pop disabled:bg-sky-400/50 disabled:cursor-not-allowed"
            >
              <Icon name="send" className="w-5 h-5" />
            </button>
          ) : (
            <div
              className="relative"
              onMouseEnter={(e) => onShowTooltip(e, 'Desactivado')}
              onMouseLeave={onHideTooltip}
            >
              <button
                type="button"
                disabled
                className="w-9 h-9 rounded-full bg-transparent text-slate-300 grid place-items-center shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="clip" className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
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

const generateMessageId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const FileUploadView = ({
  setActiveView,
  onSendFile
}: {
  setActiveView: (view: string) => void;
  onSendFile: (file: File, text: string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_TEXT_CHAR = 280;
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (selectedFile: File | null) => {
    setError('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!selectedFile) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Tipo de archivo no permitido. Solo JPG, PNG, o PDF.');
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`El archivo es demasiado grande. El tamaño máximo es de ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (file) {
      onSendFile(file, text);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <header className="bg-black/20 text-white p-4 flex items-center shrink-0">
        <button
          onClick={() => setActiveView('chat')}
          className="rounded-full w-8 h-8 inline-flex items-center justify-center hover:bg-white/20 focus:outline-none"
          aria-label="Volver al chat"
          type="button"
        >
          <Icon name="chevronRight" className="w-5 h-5 rotate-180" />
        </button>
        <h3 className="font-bold text-lg ml-2">Enviar archivo</h3>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        <input
          id="file-upload-input"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
        />

        {!file ? (
          <label
            htmlFor="file-upload-input"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging ? 'bg-sky-500/20 border-sky-400' : 'bg-white/10'
            } ${error ? 'border-red-500' : 'border-white/20 hover:bg-white/20'}`}
          >
            <div className="text-center text-slate-300">
              <Icon name="clip" className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold text-slate-100">Arrastra o selecciona un archivo</p>
              <p className="text-xs">JPG, PNG o PDF, 1 a la vez (máx. {MAX_FILE_SIZE_MB}MB).</p>
              {error && <p className="text-xs text-red-400 mt-2 font-semibold">{error}</p>}
            </div>
          </label>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center p-2 rounded-xl bg-black/20 min-h-[150px]">
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa" className="max-w-full max-h-full object-contain rounded-md" />
              ) : (
                <div className="text-center text-slate-200 p-4">
                  <Icon name="file" className="w-16 h-16 mx-auto mb-2" />
                  <p className="font-semibold text-sm break-all">{file.name}</p>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-16 h-16 rounded-lg p-1 border-2 border-sky-400 flex items-center justify-center bg-black/20">
                {previewUrl ? (
                  <img src={previewUrl} alt="Miniatura" className="max-w-full max-h-full object-contain rounded-sm" />
                ) : (
                  <Icon name="file" className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <label
                htmlFor="file-upload-input"
                className="w-16 h-16 rounded-lg border bg-white/10 border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
              >
                <Icon name="plus" className="w-8 h-8 text-slate-300" />
              </label>
            </div>
          </>
        )}

        <div className="relative flex-shrink-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_TEXT_CHAR}
            placeholder="Añadir un mensaje (opcional)..."
            className="w-full p-3 pr-12 border border-white/20 rounded-lg text-sm bg-white/10 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none shadow-sm"
            rows={3}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-300">
            {text.length} / {MAX_TEXT_CHAR}
          </div>
        </div>
      </div>

      <footer className="p-4 bg-black/20 border-t border-white/10 shrink-0">
        <button
          onClick={handleSend}
          disabled={!file}
          className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
            file ? 'bg-sky-600/80 hover:bg-sky-500/90 text-white border border-white/20' : 'bg-sky-400/30 text-slate-300 cursor-not-allowed'
          }`}
          type="button"
        >
          Enviar
        </button>
      </footer>
    </div>
  );
};

const FAQView = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
  <CommonSearchView
    title="Preguntas"
    iconName="faq"
    placeholder="Buscar en preguntas..."
    itemType="pregunta"
    setActiveView={setActiveView}
  />
);

const ArticlesView = ({ setActiveView }: { setActiveView: (view: string) => void }) => (
  <CommonSearchView
    title="Artículos"
    iconName="articles"
    placeholder="Buscar en artículos..."
    itemType="artículo"
    setActiveView={setActiveView}
  />
);

const DEFAULT_TOOLTIP: TooltipState = {
  visible: false,
  text: '',
  top: 0,
  left: 0
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agent, setAgent] = useState<AgentProfile>({ name: 'Altavia', avatar: '' });
  const [assignedAgent, setAssignedAgent] = useState<AgentProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(DEFAULT_TOOLTIP);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const isMobile = useIsMobile();

  const WEBHOOK_URL = 'PLACEHOLDER_WEBHOOK_URL';

  const AGENT_PROFILES: Record<string, AgentProfile> = {
    Ara: {
      name: 'Ara',
      avatar: 'https://res.cloudinary.com/dsdnpstgi/image/upload/v1760978463/image_kjvbyu.jpg'
    },
    Eve: {
      name: 'Eve',
      avatar: 'https://res.cloudinary.com/dsdnpstgi/image/upload/v1760978711/e661445e-0368-456b-af4e-04fe7df03f3b_qd3a8r.jpg'
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let id = window.localStorage.getItem('chatwidget_user_uuid');
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem('chatwidget_user_uuid', id);
    }
    setUserId(id);

    let agentName = window.localStorage.getItem('chatwidget_assigned_agent');
    if (!agentName) {
      const agents = ['Ara', 'Eve'] as const;
      agentName = agents[Math.floor(Math.random() * agents.length)];
      window.localStorage.setItem('chatwidget_assigned_agent', agentName);
    }
    const selectedAgent = AGENT_PROFILES[agentName];
    setAssignedAgent(selectedAgent);

    return () => {
      if (isMobile) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (activeView === 'chat' && !isChatInitialized) {
      setIsChatInitialized(true);
    }
  }, [activeView, isChatInitialized]);

  useEffect(() => {
    if (!isChatInitialized) return;

    const timers: number[] = [];

    if (agent.name === 'Altavia' && assignedAgent) {
      const timer = window.setTimeout(() => {
        setAgent(assignedAgent);
      }, 2000);
      timers.push(timer);
    }

    if (agent.name !== 'Altavia' && messages.length === 0) {
      setIsTyping(true);
      const timer = window.setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => {
          if (prev.length === 0) {
            const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const initialMessage: ChatMessage = {
              id: generateMessageId(),
              text: '¡Hola! Somos Altavia. Deja tu consulta y te respondemos a la brevedad.',
              sender: 'bot',
              timestamp: botTimestamp
            };
            if (!isMuted) {
              playNotificationSound();
            }
            return [initialMessage];
          }
          return prev;
        });
      }, 5000);
      timers.push(timer);
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isChatInitialized, agent, assignedAgent, messages.length, isMuted]);

  const toggleChat = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (isMobile) {
        if (next) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        } else {
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }
      }
      if (next) {
        setShowWelcomeMessage(false);
      }
      return next;
    });
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleShowTooltip = (e: React.MouseEvent, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text,
      top: rect.top - 8,
      left: rect.left + rect.width / 2
    });
  };

  const handleHideTooltip = () => setTooltip(DEFAULT_TOOLTIP);

  const processReplyQueue = async (queue: string[]) => {
    setIsBotReplying(true);
    for (const messageText of queue) {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsTyping(false);

      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          text: messageText,
          sender: 'bot',
          timestamp: botTimestamp
        }
      ]);

      if (!isMuted) {
        playNotificationSound();
      }
    }
    setIsBotReplying(false);
  };

  const postToWebhook = async (payload: unknown) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`El webhook respondió con estado: ${response.status}`);
        return;
      }

      const data = await response.json();
      const messagesToQueue = [
        data.output,
        data.output1,
        data.output2,
        data.output3,
        data.output4
      ].filter((msg: unknown): msg is string => typeof msg === 'string' && msg.trim() !== '');

      if (messagesToQueue.length > 0) {
        await processReplyQueue(messagesToQueue);
      }
    } catch (error) {
      console.error('Error al enviar mensaje al webhook:', error);
    }
  };

  const handleSendMessage = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || !userId) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMessage: ChatMessage = {
      id: generateMessageId(),
      text: trimmedText,
      sender: 'user',
      timestamp
    };
    setMessages((prev) => [...prev, newUserMessage]);
    void postToWebhook({
      user_id: userId,
      message_id: generateMessageId(),
      content_type: 'text',
      text_content: trimmedText
    });
  };

  const handleSendFile = async (file: File, text: string) => {
    if (!file || !userId) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fileMessageText = `[Archivo: ${file.name}]${text ? `\n\n${text}` : ''}`;
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId(),
        text: fileMessageText,
        sender: 'user',
        timestamp
      }
    ]);
    setActiveView('chat');

    try {
      const base64Content = await fileToBase64(file);
      const payload = {
        user_id: userId,
        message_id: generateMessageId(),
        content_type: 'file',
        text_content: text || '',
        file_data: {
          file_name: file.name,
          file_type: file.type,
          file_base64: base64Content
        }
      };
      await postToWebhook(payload);
    } catch (error) {
      console.error('Error al convertir archivo a Base64:', error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          text: 'Hubo un error al procesar tu archivo. Inténtalo de nuevo.',
          sender: 'bot',
          timestamp: errorTimestamp
        }
      ]);
    }
  };

  const renderContent = () => {
    const isAgentAssigned = agent.name !== 'Altavia';
    switch (activeView) {
      case 'home':
        return <HomeView setActiveView={setActiveView} agentProfiles={AGENT_PROFILES} />;
      case 'chat':
        return (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            setActiveView={setActiveView}
            isMuted={isMuted}
            toggleMute={toggleMute}
            isTyping={isTyping}
            agent={agent}
            isAgentAssigned={isAgentAssigned}
            isBotReplying={isBotReplying}
            onShowTooltip={handleShowTooltip}
            onHideTooltip={handleHideTooltip}
          />
        );
      case 'fileUpload':
        return <FileUploadView setActiveView={setActiveView} onSendFile={handleSendFile} />;
      case 'faq':
        return <FAQView setActiveView={setActiveView} />;
      case 'articles':
        return <ArticlesView setActiveView={setActiveView} />;
      default:
        return <HomeView setActiveView={setActiveView} agentProfiles={AGENT_PROFILES} />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {tooltip.visible && (
        <div
          className="fixed bg-slate-700 text-white text-xs font-semibold rounded py-1 px-2 pointer-events-none z-[9999] transform -translate-y-full -translate-x-1/2 transition-opacity"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.text}
        </div>
      )}

      {!isOpen && showWelcomeMessage && (
        <div className="mb-4 mr-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-w-[280px] animate-pop relative">
          <button
            onClick={() => setShowWelcomeMessage(false)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Cerrar mensaje de bienvenida"
            type="button"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
          <div className="pr-4">
            <p className="text-slate-800 font-semibold text-sm mb-1">¡Hola! 👋</p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Aquí puedes escribirnos. ¿Hay algo en lo que podamos ayudarte?
            </p>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={`mb-4 overflow-hidden shadow-2xl border border-white/20 bg-black/30 backdrop-blur-2xl flex flex-col animate-pop ${
            isMobile ? 'fixed inset-0 w-full h-full rounded-none m-0' : 'md:w-[420px] w-[calc(100vw-2rem)] max-w-[460px] h-[560px] rounded-2xl'
          }`}
        >
          {isMobile && (
            <button
              onClick={toggleChat}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-16 h-5 bg-black/50 hover:bg-black/70 backdrop-blur-md border-b border-x border-white/20 text-slate-400 hover:text-slate-300 flex items-center justify-center transition-all shadow-lg rounded-b-full"
              aria-label="Cerrar chat"
              type="button"
            >
              <Icon name="close" className="w-2.5 h-2.5 mt-px" />
            </button>
          )}
          <main className="flex-1 bg-transparent overflow-hidden">{renderContent()}</main>
          {activeView !== 'chat' && activeView !== 'fileUpload' && (
            <footer className="bg-black/20 border-t border-white/10 grid grid-cols-4 text-xs text-slate-300 shrink-0">
              <button
                onClick={() => setActiveView('home')}
                className={`py-2 flex flex-col items-center gap-1 transition-colors ${
                  activeView === 'home' ? 'text-white font-semibold' : 'hover:text-sky-300'
                }`}
                type="button"
              >
                <Icon name="home" className="w-5 h-5" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => setActiveView('chat')}
                className={`py-2 flex flex-col items-center gap-1 transition-colors ${
                  activeView === 'chat' ? 'text-white font-semibold' : 'hover:text-sky-300'
                }`}
                type="button"
              >
                <Icon name="chat" className="w-5 h-5" />
                <span>Conversación</span>
              </button>
              <button
                onClick={() => setActiveView('faq')}
                className={`py-2 flex flex-col items-center gap-1 transition-colors ${
                  activeView === 'faq' ? 'text-white font-semibold' : 'hover:text-sky-300'
                }`}
                type="button"
              >
                <Icon name="faq" className="w-5 h-5" />
                <span>Preguntas</span>
              </button>
              <button
                onClick={() => setActiveView('articles')}
                className={`py-2 flex flex-col items-center gap-1 transition-colors ${
                  activeView === 'articles' ? 'text-white font-semibold' : 'hover:text-sky-300'
                }`}
                type="button"
              >
                <Icon name="articles" className="w-5 h-5" />
                <span>Artículos</span>
              </button>
            </footer>
          )}
        </div>
      )}

      {(!isMobile || !isOpen) && (
        <button
          onClick={toggleChat}
          type="button"
          className="w-14 h-14 rounded-full shadow-lg bg-sky-500/50 hover:bg-sky-500/80 backdrop-blur-md border border-white/20 text-white grid place-items-center transition-transform hover:scale-110 focus:outline-none"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Abrir chat</span>
          <div className="relative w-6 h-6">
            <Icon
              name="chat"
              className={`absolute transition-all duration-300 ${
                isOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <Icon
              name="close"
              className={`absolute transition-all duration-300 ${
                isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
              }`}
            />
          </div>
        </button>
      )}
    </div>
  );
};

const App = () => (
  <div
    className="w-full h-screen bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2670&auto=format&fit=crop')"
    }}
  >
    <ChatWidget />
  </div>
);

export default App;
