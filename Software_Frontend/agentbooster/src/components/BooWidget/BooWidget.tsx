import React, { useState, useRef, useEffect } from 'react';
import './BooWidget.css';

interface FileData {
  name: string;
  type: string;
  file: File;
}

interface Message {
  type: 'user' | 'boo';
  content: string;
  file?: FileData;
}

const BooWidget: React.FC = () => {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [fileStore, setFileStore] = useState<FileData[]>([]);
  const [bannerText, setBannerText] = useState('Aquí puedes hablar conmigo.');
  const [isTyping, setIsTyping] = useState(false);
  const [charLimitError, setCharLimitError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const webhookUrl = 'https://n8n.agentbooster.ai/webhook/agent-boo-web-982925e5232096r01r012r126327te73';
  const userIdRef = useRef<string>(
    localStorage.getItem('boo_user_id') || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem('boo_user_id', id);
      return id;
    })()
  );


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  const playNotificationSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtxRef.current.currentTime + 0.4);
      oscillator.start(audioCtxRef.current.currentTime);
      oscillator.stop(audioCtxRef.current.currentTime + 0.4);
    } catch (e) {
      console.error("Error al reproducir el sonido de notificación:", e);
    }
  };

  const markdownToHtml = (text: string) => {
    let safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    safeText = safeText.replace(/^(?:\*\s(.*)\n?)+/gm, (match) => {
      const items = match.trim().split('\n').map(item => `<li>${item.substring(2)}</li>`).join('');
      return `<ul class="list-disc space-y-1">${items}</ul>`;
    });
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    safeText = safeText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    safeText = safeText.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    const urlRegex = /(?<!href="|href='|">)(https?:\/\/[^\s<]+)/g;
    safeText = safeText.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    safeText = safeText.replace(/\n/g, '<br>');
    safeText = safeText.replace(/<br><ul/g, '<ul').replace(/<\/ul><br>/g, '</ul>');
    return safeText;
  };

  const fileToBase64 = (file: File): Promise<{ fileName: string; fileType: string; fileContent: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          fileName: file.name,
          fileType: file.type,
          fileContent: base64String
        });
      };
      reader.onerror = error => reject(error);
    });
  };

  const typeBooMessage = (message: string) => {
    // Remove typing indicator
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
    
    setIsTyping(false);
    
    if (!chatContainerRef.current) return;
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'w-full flex justify-start';
    messageContainer.id = 'typing-message-temp';
    
    const messageGroup = document.createElement('div');
    messageGroup.className = 'flex flex-col items-start gap-1.5';
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'relative group mb-8';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'max-w-md md:max-w-lg rounded-2xl p-3 text-sm boo-message';
    messageBubble.innerHTML = '';
    
    messageWrapper.appendChild(messageBubble);
    messageGroup.appendChild(messageWrapper);
    messageContainer.appendChild(messageGroup);
    chatContainerRef.current.appendChild(messageContainer);
    
    // Typing animation
    let i = 0;
    const speed = 1;
    
    const type = () => {
      if (i < message.length) {
        const char = message.charAt(i);
        messageBubble.innerHTML += char === '\n' ? '<br>' : char;
        i++;
        setTimeout(type, speed);
      } else {
        // Finished typing
        messageBubble.innerHTML = markdownToHtml(message);
        
        // Play notification sound when finished typing
        playNotificationSound();
        
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'absolute left-1 top-full mt-1 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100';
        copyButton.title = 'Copiar mensaje';
        copyButton.innerHTML = `
          <svg class="copy-icon h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
          <svg class="check-icon h-3.5 w-3.5 hidden text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;
        copyButton.addEventListener('click', () => {
          const textToCopy = messageBubble.innerText;
          const tempTextArea = document.createElement('textarea');
          tempTextArea.style.position = 'absolute';
          tempTextArea.style.left = '-9999px';
          tempTextArea.value = textToCopy;
          document.body.appendChild(tempTextArea);
          tempTextArea.select();
          try {
            document.execCommand('copy');
            const copyIcon = copyButton.querySelector('.copy-icon');
            const checkIcon = copyButton.querySelector('.check-icon');
            if (copyIcon && checkIcon) {
              copyIcon.classList.add('hidden');
              checkIcon.classList.remove('hidden');
              setTimeout(() => {
                copyIcon.classList.remove('hidden');
                checkIcon.classList.add('hidden');
              }, 2000);
            }
          } catch (err) {
            console.error('No se pudo copiar el texto:', err);
          }
          document.body.removeChild(tempTextArea);
        });
        messageWrapper.appendChild(copyButton);
        
        // Add to React state and clean up
        const booMessageObj: Message = {
          type: 'boo',
          content: message
        };
        setMessages(prev => [...prev, booMessageObj]);
        
        // Remove temporary element
        if (messageContainer.parentNode) {
          messageContainer.remove();
        }
        
        // Unlock inputs
        setIsWaitingForResponse(false);
      }
    };
    
    type();
  };

  const handleSubmit = async () => {
    if (isWaitingForResponse) return;

    const message = inputValue.trim();
    const file = fileStore.length > 0 ? fileStore[0] : null;

    if (!message && !file) return;

    setIsWaitingForResponse(true);

    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: message,
      file: file || undefined
    };
    setMessages(prev => [...prev, userMessage]);

    if (!isChatStarted) {
      setIsChatStarted(true);
      setBannerText('Avísame si necesitas reservar una llamada');
    }

    const payload: any = { userId: userIdRef.current, message };

    if (file) {
      try {
        const fileData = await fileToBase64(file.file);
        payload.files = [fileData];
      } catch (error) {
        console.error("Error al convertir archivo a Base64:", error);
        typeBooMessage("Perdona, hubo un error al procesar el archivo.");
        return;
      }
    }

    setInputValue('');
    setFileStore([]);
    setIsTyping(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const textResponse = await response.text();

      if (!textResponse || textResponse.trim() === '') {
        throw new Error('Empty response');
      }

      let booMessage = textResponse;
      try {
        const data = JSON.parse(textResponse);
        if (Array.isArray(data) && data.length > 0 && data[0].output) booMessage = data[0].output;
        else if (data && data.output) booMessage = data.output;
        else if (Array.isArray(data) && data.length > 0 && data[0].text) booMessage = data[0].text;
        else if (data && data.text) booMessage = data.text;
        else if (data && data.reply) booMessage = data.reply;
      } catch (jsonError) {
        // Use textResponse as-is
      }

      typeBooMessage(booMessage);

    } catch (error) {
      console.error('Error al comunicar con el Webhook:', error);
      setIsTyping(false);
      typeBooMessage("Perdona ha ocurrido un error.");
    }
  };


  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Límite de 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      setFileSizeError(`El archivo excede el límite de 10MB (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      setTimeout(() => setFileSizeError(null), 5000);
      return;
    }
    
    setFileSizeError(null);
    setFileStore([{
      name: file.name,
      type: file.type,
      file: file
    }]);
  };

  const removeFile = () => {
    setFileStore([]);
  };

  const resetChat = () => {
    setIsChatStarted(false);
    setMessages([]);
    setBannerText('Aquí puedes hablar conmigo.');
    setInputValue('');
    setFileStore([]);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isWaitingForResponse) return;

    setIsWaitingForResponse(true);

    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: suggestion
    };
    setMessages(prev => [...prev, userMessage]);

    if (!isChatStarted) {
      setIsChatStarted(true);
      setBannerText('Avísame si necesitas reservar una llamada');
    }

    const payload: any = { userId: userIdRef.current, message: suggestion };

    setIsTyping(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const textResponse = await response.text();

      if (!textResponse || textResponse.trim() === '') {
        throw new Error('Empty response');
      }

      let booMessage = textResponse;
      try {
        const data = JSON.parse(textResponse);
        if (Array.isArray(data) && data.length > 0 && data[0].output) booMessage = data[0].output;
        else if (data && data.output) booMessage = data.output;
        else if (Array.isArray(data) && data.length > 0 && data[0].text) booMessage = data[0].text;
        else if (data && data.text) booMessage = data.text;
        else if (data && data.reply) booMessage = data.reply;
      } catch (jsonError) {
        // Use textResponse as-is
      }

      typeBooMessage(booMessage);

    } catch (error) {
      console.error('Error al comunicar con el Webhook:', error);
      setIsTyping(false);
      typeBooMessage("Perdona ha ocurrido un error.");
    }
  };


  return (
    <div 
      id="main-container"
      className="w-full max-w-6xl rounded-2xl shadow-2xl p-6 md:p-8 !text-white relative overflow-hidden flex flex-col transition-all duration-500 [color-scheme:dark] h-screen md:h-screen" 
      style={{
        background: 'radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%)',
        colorScheme: 'dark'
      }}
    >
      {/* Header */}
      <header className="flex-shrink-0 relative">
        <div className="flex justify-center">
          <div className="boo-banner bg-black/20 backdrop-blur-sm rounded-full pl-2 pr-4 py-2 flex items-center gap-3 w-fit">
            <div className="relative flex-shrink-0">
              <img 
                className="boo-banner-avatar w-8 h-8 rounded-full object-cover" 
                src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756503469/Boo_Mastermind_-_vasyl_pavlyuchok_40606_httpss.mj.runDaU8K48LteU_close-up_port_3b5e9292-ef3c-4c7f-93c8-c1a99da3780e_3_skkffe.png" 
                alt="Foto de Boo"
              />
              <span className="boo-banner-status absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800 animate-pulse"></span>
            </div>
            <span className="boo-banner-text text-sm font-medium">{bannerText}</span>
          </div>
        </div>
        
        {/* Reset button */}
        {isChatStarted && (
          <div className="boo-reset-container absolute top-0 left-0 group p-1">
            <button 
              onClick={resetChat}
              disabled={isWaitingForResponse}
              className="boo-reset-btn bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full p-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="boo-reset-icon text-white/80">
                <path d="M3 2v6h6"/>
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8"/>
                <path d="M21 22v-6h-6"/>
                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/>
              </svg>
            </button>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max !bg-gray-800 !text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Reiniciar chat
            </span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mt-4 flex-1 flex flex-col items-center text-center overflow-hidden transition-all duration-500 justify-center">
        {!isChatStarted ? (
          // Initial View
          <div className="w-full space-y-6 transition-opacity duration-500">
            <h1 className="boo-title text-4xl md:text-5xl font-bold leading-tight mt-6">
              ¿Puedo ayudarte a evaluar qué agente se adaptaría mejor a tu empresa?
            </h1>
            <p className="boo-description text-md !text-gray-200">
              Puedo resolver sus dudas, darle ideas sobre agentes, agendarle una reunión... y a veces, ¡llevarle una sorpresa!
            </p>
            {/* Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 pt-4 max-w-2xl mx-auto">
              {[
                'Agendar una demostración',
                'Preguntar sobre los precios',
                '¿Cómo funciona la integración?',
                'Comparar los planes',
                'Contactar a ventas'
              ].map((suggestion, index) => (
                <button 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="boo-suggestion-btn bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat Container
          <div 
            ref={chatContainerRef}
            id="chat-container" 
            className="w-full h-full flex flex-col gap-4 overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`w-full flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} gap-1.5`}>
                  {msg.file && (
                    <div className="max-w-md md:max-w-lg rounded-2xl p-3 text-sm user-message">
                      Archivo adjunto: {msg.file.name}
                    </div>
                  )}
                  {msg.content && (
                    <div className="relative group mb-8">
                      <div 
                        className={`max-w-md md:max-w-lg rounded-2xl p-3 text-sm ${msg.type === 'user' ? 'user-message' : 'boo-message'}`}
                        dangerouslySetInnerHTML={{ __html: msg.type === 'boo' ? markdownToHtml(msg.content) : msg.content }}
                      />
                      {msg.type === 'boo' && (
                        <button
                          onClick={(e) => {
                            const textToCopy = msg.content;
                            const tempTextArea = document.createElement('textarea');
                            tempTextArea.style.position = 'absolute';
                            tempTextArea.style.left = '-9999px';
                            tempTextArea.value = textToCopy;
                            document.body.appendChild(tempTextArea);
                            tempTextArea.select();
                            try {
                              document.execCommand('copy');
                              const copyIcon = (e.currentTarget as HTMLButtonElement).querySelector('.copy-icon');
                              const checkIcon = (e.currentTarget as HTMLButtonElement).querySelector('.check-icon');
                              if (copyIcon && checkIcon) {
                                copyIcon.classList.add('hidden');
                                checkIcon.classList.remove('hidden');
                                setTimeout(() => {
                                  copyIcon.classList.remove('hidden');
                                  checkIcon.classList.add('hidden');
                                }, 2000);
                              }
                            } catch (err) {
                              console.error('No se pudo copiar el texto:', err);
                            }
                            document.body.removeChild(tempTextArea);
                          }}
                          title="Copiar mensaje"
                          className="absolute left-1 top-full mt-1 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <svg className="copy-icon h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                          </svg>
                          <svg className="check-icon h-3.5 w-3.5 hidden text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="w-full flex justify-start">
                <div className="flex items-center gap-2 max-w-md md:max-w-lg rounded-2xl p-3 text-sm boo-message">
                  <img 
                    className="w-6 h-6 rounded-full" 
                    src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756503469/Boo_Mastermind_-_vasyl_pavlyuchok_40606_httpss.mj.runDaU8K48LteU_close-up_port_3b5e9292-ef3c-4c7f-93c8-c1a99da3780e_3_skkffe.png" 
                    alt="Boo Avatar"
                  />
                  <div className="typing-indicator-dot" style={{ animationDelay: '0s' }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer - Input Area */}
      <footer className="flex-shrink-0 !bg-transparent">
        <div className="relative max-w-2xl mx-auto w-full !bg-transparent">
          <div className="rounded-3xl border border-[#444444] !bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300">
            {/* File Preview */}
            {fileStore.length > 0 && (
              <div id="file-preview-container" className="mb-2">
                {fileStore.map((file, index) => (
                  <div key={index} className="file-preview-item">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file.file)} 
                        className="preview-image" 
                        alt={file.name}
                      />
                    ) : (
                      <div className="file-icon">
                        <span className="text-white font-bold text-xs">
                          {file.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-type">{file.type}</span>
                    </div>
                    <div className="remove-btn" onClick={removeFile}>
                      <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <textarea
              ref={textareaRef}
              id="prompt-textarea"
              placeholder={isWaitingForResponse ? "Boo está escribiendo..." : "Pregúntale a Boo"}
              className="flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base !text-gray-100 placeholder:!text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[240px] resize-none"
              value={inputValue}
              maxLength={2000}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length >= 2000) {
                  setCharLimitError(true);
                  setTimeout(() => setCharLimitError(false), 3000);
                } else {
                  setCharLimitError(false);
                }
                setInputValue(newValue);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isWaitingForResponse}
            />
            {/* Character counter and warnings */}
            <div className="flex items-center justify-between px-3 pb-1">
              {fileSizeError && (
                <span className="text-xs text-red-400 font-medium">{fileSizeError}</span>
              )}
              {!fileSizeError && charLimitError && (
                <span className="text-xs text-red-400 font-medium">Límite de 2000 caracteres alcanzado</span>
              )}
              {!fileSizeError && !charLimitError && inputValue.length > 1800 && (
                <span className={`text-xs ${inputValue.length >= 2000 ? 'text-red-400' : 'text-yellow-400'} font-medium`}>
                  {inputValue.length}/2000 caracteres
                </span>
              )}
              {(!fileSizeError && !charLimitError && inputValue.length <= 1800) && <span></span>}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2 p-0 pt-2">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isWaitingForResponse}
                  className="flex h-8 w-8 !text-[#9CA3AF] cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-600/30 hover:!text-[#D1D5DB] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
              <div className="flex items-center gap-2">
                {(inputValue.trim() || fileStore.length > 0) && (
                  <button 
                    onClick={handleSubmit}
                    disabled={isWaitingForResponse}
                    className="h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 !bg-white hover:!bg-white/80 !text-[#1F2023] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BooWidget;
