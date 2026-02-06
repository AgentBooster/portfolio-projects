(function() {
    if (window.booWidgetInitialized) {
        return;
    }
    window.booWidgetInitialized = true;

    const targetDivId = 'widget-container';

    function main() {
        const widgetContainer = document.getElementById(targetDivId);

        if (!widgetContainer) {
            // This is a safeguard; runWhenReady already ensures the element exists.
            console.error(`Error: Contenedor #${targetDivId} no encontrado.`);
            return;
        }

        // --- STYLES FOR CENTERING AND SIZING ---
        widgetContainer.style.display = 'block';
        widgetContainer.style.width = '100%';
        widgetContainer.style.maxWidth = '1000px';
        widgetContainer.style.height = 'clamp(650px, 90vh, 1000px)';
        widgetContainer.style.margin = '20px auto';
        widgetContainer.style.borderRadius = '1.25rem';
        widgetContainer.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
        widgetContainer.style.overflow = 'hidden';

        const widgetHTML = `
            <div id="main-container" class="w-full h-full max-w-6xl rounded-2xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col transition-all duration-500" style="background: radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%);">
                <header class="flex-shrink-0 relative">
                    <div class="flex justify-center">
                        <div class="bg-black/20 backdrop-blur-sm rounded-full pl-2 pr-4 py-2 flex items-center gap-3 w-fit">
                            <div class="relative flex-shrink-0">
                                <img class="w-8 h-8 rounded-full object-cover" src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756503469/Boo_Mastermind_-_vasyl_pavlyuchok_40606_httpss.mj.runDaU8K48LteU_close-up_port_3b5e9292-ef3c-4c7f-93c8-c1a99da3780e_3_skkffe.png" alt="Foto de Boo">
                                <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800 animate-pulse"></span>
                            </div>
                            <span id="banner-text" class="text-sm font-medium">Aquí puedes hablar conmigo.</span>
                        </div>
                    </div>
                    <div id="reset-chat-container" class="hidden absolute top-0 left-0 group p-1">
                        <button id="reset-chat-button" class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full p-2 text-sm transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/80"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
                        </button>
                        <span class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Reiniciar chat
                        </span>
                    </div>
                </header>
                <main id="content-area" class="mt-4 flex-1 flex flex-col items-center text-center overflow-hidden transition-all duration-500 justify-center">
                    <div id="initial-view" class="w-full space-y-6 transition-opacity duration-500">
                        <h1 class="text-4xl md:text-5xl font-bold leading-tight mt-6">
                            ¿Puedo ayudarte a evaluar qué agente se adaptaría mejor a tu empresa?
                        </h1>
                        <p class="text-md text-gray-200">
                            Puedo resolver sus dudas, darle ideas sobre agentes, agendarle una reunión... y a veces, ¡llevarle una sorpresa!
                        </p>
                        <div id="suggestion-buttons" class="flex flex-wrap justify-center gap-2 pt-4 max-w-2xl mx-auto">
                            <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Agendar una demostración</button>
                            <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Preguntar sobre los precios</button>
                            <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">¿Cómo funciona la integración?</button>
                            <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Comparar los planes</button>
                            <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Contactar a ventas</button>
                        </div>
                    </div>
                    <div id="chat-container" class="hidden w-full h-full flex-col gap-4 overflow-y-auto">
                    </div>
                </main>
                <footer class="flex-shrink-0">
                    <div class="relative max-w-2xl mx-auto w-full">
                        <div id="prompt-container" class="rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300">
                            <div id="file-preview-container"></div>
                            <div id="input-wrapper">
                                <textarea id="prompt-textarea" placeholder="Pregúntale a Boo" class="flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[240px] resize-none"></textarea>
                            </div>
                            <div id="voice-visualizer" class="hidden flex-col items-center justify-center w-full transition-all duration-300 py-3">
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span id="recording-timer" class="font-mono text-sm text-white/80">00:00</span>
                                </div>
                                <div class="w-full h-10 flex items-center justify-center gap-0.5 px-4"></div>
                            </div>
                            <div class="flex items-center justify-between gap-2 p-0 pt-2">
                                <div class="flex items-center gap-1">
                                    <button id="upload-button" class="flex h-8 w-8 text-[#9CA3AF] cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-600/30 hover:text-[#D1D5DB]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                    </button>
                                    <input id="file-input" type="file" class="hidden" accept="image/png, image/jpeg, application/pdf">
                                </div>
                                <div class="flex items-center gap-2">
                                    <button id="mic-button" class="h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 text-[#9CA3AF] bg-transparent hover:bg-gray-600/30 hover:text-[#D1D5DB]">
                                        <svg id="mic-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                                        <svg id="stop-icon" class="hidden h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                                    </button>
                                    <button id="send-button" class="hidden h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 bg-white hover:bg-white/80 text-[#1F2023]">
                                        <svg id="arrow-icon" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        `;
        const widgetCSS = `
            #main-container { font-family: 'Inter', sans-serif; height: 100% !important; }
            textarea::-webkit-scrollbar { width: 6px; } textarea::-webkit-scrollbar-track { background: transparent; } textarea::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 3px; } textarea::-webkit-scrollbar-thumb:hover { background-color: #555555; }
            .voice-visualizer-bar { animation: pulse 1s infinite ease-in-out; } @keyframes pulse { 0%, 100% { transform: scaleY(0.2); } 50% { transform: scaleY(1); } }
            #file-preview-container { display: flex; overflow-x: auto; overflow-y: hidden; flex-wrap: nowrap; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: #444444 transparent; } #file-preview-container::-webkit-scrollbar { height: 4px; } #file-preview-container::-webkit-scrollbar-track { background: transparent; } #file-preview-container::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 2px; }
            .file-preview-item { position: relative; display: flex; align-items: center; background-color: #2E3033; border-radius: 12px; padding: 8px; margin-right: 8px; margin-top: 4px; flex-shrink: 0; width: 180px; } .file-preview-item .file-icon { flex-shrink: 0; width: 32px; height: 32px; border-radius: 8px; background-color: #EF4444; display: flex; align-items: center; justify-content: center; } .file-preview-item .file-info { margin-left: 8px; display: flex; flex-direction: column; overflow: hidden; color: #E5E7EB; } .file-preview-item .file-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.875rem; line-height: 1.25rem; } .file-preview-item .file-type { font-size: 0.75rem; line-height: 1rem; color: #9CA3AF; } .file-preview-item .remove-btn { position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; border-radius: 9999px; background-color: #4B5563; display: flex; align-items: center; justify-content: center; cursor: pointer; } .file-preview-item img.preview-image { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
            #chat-container { scrollbar-width: thin; scrollbar-color: #444444 transparent; } #chat-container::-webkit-scrollbar { width: 6px; } #chat-container::-webkit-scrollbar-track { background: transparent; } #chat-container::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 3px; }
            .user-message { background-color: #373A40; align-self: flex-end; text-align: left; } .boo-message { background-color: rgba(0, 0, 0, 0.15); align-self: flex-start; text-align: left; } .boo-message ul { padding-left: 1.25rem; } .boo-message a { color: #93C5FD; text-decoration: underline; } .boo-message a:hover { color: #BFDBFE; }
            .typing-indicator-dot { animation: typing-pulse 1.4s infinite ease-in-out; display: inline-block; background-color: white; width: 8px; height: 8px; border-radius: 50%; } @keyframes typing-pulse { 0%, 100% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }
        `;
        
        function initializeBooWidget() {
            if (window.booWidgetLogicInitialized) return;
            window.booWidgetLogicInitialized = true;
            const mainContainer = document.getElementById('main-container'); const initialView = document.getElementById('initial-view'); const chatContainer = document.getElementById('chat-container'); const bannerText = document.getElementById('banner-text'); const resetChatContainer = document.getElementById('reset-chat-container'); const resetChatButton = document.getElementById('reset-chat-button'); const textarea = document.getElementById('prompt-textarea'); const micButton = document.getElementById('mic-button'); const sendButton = document.getElementById('send-button'); const micIcon = document.getElementById('mic-icon'); const stopIcon = document.getElementById('stop-icon'); const uploadButton = document.getElementById('upload-button'); const fileInput = document.getElementById('file-input'); const filePreviewContainer = document.getElementById('file-preview-container'); const inputWrapper = document.getElementById('input-wrapper'); const voiceVisualizer = document.getElementById('voice-visualizer'); const recordingTimer = document.getElementById('recording-timer'); const visualizerBarsContainer = voiceVisualizer.querySelector('.gap-0\\.5'); const suggestionButtons = document.querySelectorAll('#suggestion-buttons button');
            let isChatStarted = false; let isRecording = false; let recognition = null; let timerInterval = null; let fileStore = []; let audioCtx; let textBeforeRecording = ''; let isWaitingForResponse = false;
            const webhookUrl = 'YOUR_WEBHOOK_URL';
            let userId = localStorage.getItem('boo_user_id'); if (!userId) { userId = crypto.randomUUID(); localStorage.setItem('boo_user_id', userId); }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (SpeechRecognition) { recognition = new SpeechRecognition(); recognition.lang = 'es-ES'; recognition.interimResults = true; recognition.continuous = true; recognition.onresult = (event) => { let fullTranscript = ''; for (let i = 0; i < event.results.length; i++) { fullTranscript += event.results[i][0].transcript; } const separator = textBeforeRecording.trim().length > 0 ? ' ' : ''; textarea.value = textBeforeRecording + separator + fullTranscript; updateButtonState(); autoResize(); }; recognition.onerror = () => { if (isRecording) stopRecording(); }; recognition.onend = () => { if (isRecording) stopRecording(); }; }
            const disableInputs = () => { textarea.disabled = true; sendButton.disabled = true; uploadButton.disabled = true; micButton.disabled = true; textarea.placeholder = "Boo está escribiendo..."; sendButton.classList.add('opacity-50', 'cursor-not-allowed'); uploadButton.classList.add('opacity-50', 'cursor-not-allowed'); micButton.classList.add('opacity-50', 'cursor-not-allowed'); };
            const enableInputs = () => { textarea.disabled = false; sendButton.disabled = false; uploadButton.disabled = false; micButton.disabled = false; textarea.placeholder = "Pregúntale a Boo"; sendButton.classList.remove('opacity-50', 'cursor-not-allowed'); uploadButton.classList.remove('opacity-50', 'cursor-not-allowed'); micButton.classList.remove('opacity-50', 'cursor-not-allowed'); updateButtonState(); };
            const autoResize = () => { textarea.style.height = 'auto'; textarea.style.height = (textarea.scrollHeight) + 'px'; };
            const startChatView = () => { if (isChatStarted) return; isChatStarted = true; initialView.classList.add('opacity-0'); setTimeout(() => { initialView.classList.add('hidden'); chatContainer.classList.remove('hidden'); chatContainer.classList.add('flex'); resetChatContainer.classList.remove('hidden'); bannerText.textContent = 'Avísame si necesitas reservar una llamada'; }, 500); };
            const resetChat = () => { isChatStarted = false; chatContainer.innerHTML = ''; initialView.classList.remove('hidden', 'opacity-0'); chatContainer.classList.add('hidden'); chatContainer.classList.remove('flex'); resetChatContainer.classList.add('hidden'); bannerText.textContent = 'Aquí puedes hablar conmigo.'; textarea.value = ''; fileStore = []; filePreviewContainer.innerHTML = ''; updateButtonState(); autoResize(); };
            const markdownToHtml = (text) => { let safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;'); safeText = safeText.replace(/^(?:\*\s(.*)\n?)+/gm, (match) => `<ul class="list-disc space-y-1">${match.trim().split('\n').map(item => `<li>${item.substring(2)}</li>`).join('')}</ul>`); safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); safeText = safeText.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'); const urlRegex = /(?<!href="|href='|">)(https?:\/\/[^\s<]+)/g; safeText = safeText.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'); return safeText.replace(/\n/g, '<br>').replace(/<br><ul/g, '<ul').replace(/<\/ul><br>/g, '</ul>'); };
            const displayUserMessage = (message, file) => { startChatView(); const userMessageContainer = document.createElement('div'); userMessageContainer.className = 'w-full flex justify-end'; const messageGroup = document.createElement('div'); messageGroup.className = 'flex flex-col items-end gap-1.5'; if (file) { const fileBubble = document.createElement('div'); fileBubble.className = 'max-w-md md:max-w-lg rounded-2xl p-3 text-sm user-message'; fileBubble.textContent = `Archivo adjunto: ${file.name}`; messageGroup.appendChild(fileBubble); } if (message && message.length > 0) { const textBubble = document.createElement('div'); textBubble.className = 'max-w-md md:max-w-lg rounded-2xl p-3 text-sm user-message'; textBubble.textContent = message; messageGroup.appendChild(textBubble); } userMessageContainer.appendChild(messageGroup); chatContainer.appendChild(userMessageContainer); chatContainer.scrollTop = chatContainer.scrollHeight; };
            const typeBooMessage = (message) => { const indicator = document.getElementById('typing-indicator'); if (indicator) indicator.remove(); playNotificationSound(); const messageContainer = document.createElement('div'); messageContainer.className = `w-full flex justify-start`; const messageBubble = document.createElement('div'); messageBubble.className = `max-w-md md:max-w-lg rounded-2xl p-3 text-sm boo-message`; const messageWrapper = document.createElement('div'); messageWrapper.className = 'relative group mb-8'; messageWrapper.appendChild(messageBubble); messageContainer.appendChild(messageWrapper); chatContainer.appendChild(messageContainer); let i = 0; const speed = 1; messageBubble.innerHTML = ''; const type = () => { if (i < message.length) { messageBubble.innerHTML += message.charAt(i) === '\n' ? '<br>' : message.charAt(i); chatContainer.scrollTop = chatContainer.scrollHeight; i++; setTimeout(type, speed); } else { messageBubble.innerHTML = markdownToHtml(message); const copyButton = document.createElement('button'); copyButton.className = 'absolute left-1 top-full mt-1 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100'; copyButton.title = 'Copiar mensaje'; copyButton.innerHTML = `<svg class="copy-icon h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg class="check-icon h-3.5 w-3.5 hidden text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`; copyButton.addEventListener('click', () => { navigator.clipboard.writeText(messageBubble.innerText).then(() => { const copyIcon = copyButton.querySelector('.copy-icon'); const checkIcon = copyButton.querySelector('.check-icon'); copyIcon.classList.add('hidden'); checkIcon.classList.remove('hidden'); setTimeout(() => { copyIcon.classList.remove('hidden'); checkIcon.classList.add('hidden'); }, 2000); }); }); messageWrapper.appendChild(copyButton); isWaitingForResponse = false; enableInputs(); } }; type(); };
            const showTypingIndicator = () => { const indicatorContainer = document.createElement('div'); indicatorContainer.id = 'typing-indicator'; indicatorContainer.className = 'w-full flex justify-start'; indicatorContainer.innerHTML = `<div class="flex items-center gap-2 max-w-md md:max-w-lg rounded-2xl p-3 text-sm boo-message"><img class="w-6 h-6 rounded-full" src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756503469/Boo_Mastermind_-_vasyl_pavlyuchok_40606_httpss.mj.runDaU8K48LteU_close-up_port_3b5e9292-ef3c-4c7f-93c8-c1a99da3780e_3_skkffe.png" alt="Boo Avatar"><div class="typing-indicator-dot" style="animation-delay: 0s;"></div></div>`; chatContainer.appendChild(indicatorContainer); chatContainer.scrollTop = chatContainer.scrollHeight; };
            const fileToBase64 = (file) => { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve({ fileName: file.name, fileType: file.type, fileContent: reader.result.split(',')[1] }); reader.onerror = error => reject(error); }); };
            const updateButtonState = () => { if (isRecording) { sendButton.classList.add('hidden'); return; } const hasMessage = textarea.value.trim().length > 0; const hasFiles = fileStore.length > 0; if (hasMessage || hasFiles) { sendButton.classList.remove('hidden'); } else { sendButton.classList.add('hidden'); } };
            const playNotificationSound = () => { try { if (!audioCtx) audioCtx = new(window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); const oscillator = audioCtx.createOscillator(); const gainNode = audioCtx.createGain(); oscillator.connect(gainNode); gainNode.connect(audioCtx.destination); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4); oscillator.start(audioCtx.currentTime); oscillator.stop(audioCtx.currentTime + 0.4); } catch (e) {} };
            const handleSubmit = async () => { if (isWaitingForResponse) return; const message = textarea.value.trim(); const file = fileStore.length > 0 ? fileStore[0] : null; if (!message && !file) return; isWaitingForResponse = true; displayUserMessage(message, file); const payload = { userId, message }; if (file) { try { payload.files = [await fileToBase64(file)]; } catch (error) { typeBooMessage("Perdona, hubo un error al procesar el archivo."); return; } } textarea.value = ""; filePreviewContainer.innerHTML = ''; fileStore = []; autoResize(); disableInputs(); showTypingIndicator(); try { const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`Error HTTP: ${response.status}`); const textResponse = await response.text(); if (!textResponse || textResponse.trim() === '') { typeBooMessage("Perdona ha ocurrido un error."); return; } try { const data = JSON.parse(textResponse); let booMessage = null; if (Array.isArray(data) && data.length > 0 && data[0].output) booMessage = data[0].output; else if (data && data.output) booMessage = data.output; else if (Array.isArray(data) && data.length > 0 && data[0].text) booMessage = data[0].text; else if (data && data.text) booMessage = data.text; else if (data && data.reply) booMessage = data.reply; if (booMessage && booMessage.trim() !== '') typeBooMessage(booMessage); else typeBooMessage("Perdona ha ocurrido un error."); } catch (jsonError) { typeBooMessage(textResponse); } } catch (error) { typeBooMessage("Perdona ha ocurrido un error."); } };
            const startRecording = () => { if (!recognition) { alert("El reconocimiento de voz no es compatible con este navegador."); return; } if (isRecording) return; textBeforeRecording = textarea.value; isRecording = true; updateButtonState(); micIcon.classList.add('hidden'); stopIcon.classList.remove('hidden'); micButton.classList.add('bg-red-500/20', 'text-red-500'); inputWrapper.classList.add('hidden'); voiceVisualizer.classList.remove('hidden'); voiceVisualizer.classList.add('flex'); let seconds = 0; recordingTimer.textContent = '00:00'; timerInterval = setInterval(() => { seconds++; const min = String(Math.floor(seconds / 60)).padStart(2, '0'); const sec = String(seconds % 60).padStart(2, '0'); recordingTimer.textContent = `${min}:${sec}`; }, 1000); visualizerBarsContainer.innerHTML = Array(40).fill('<div class="w-1 bg-white/50 rounded-full voice-visualizer-bar"></div>').join(''); recognition.start(); };
            const stopRecording = () => { if (!isRecording) return; isRecording = false; micIcon.classList.remove('hidden'); stopIcon.classList.add('hidden'); micButton.classList.remove('bg-red-500/20', 'text-red-500'); inputWrapper.classList.remove('hidden'); voiceVisualizer.classList.add('hidden'); voiceVisualizer.classList.remove('flex'); clearInterval(timerInterval); recognition.stop(); updateButtonState(); };
            const handleFiles = (files) => { if (files.length === 0) return; fileStore = [files[0]]; filePreviewContainer.innerHTML = ''; const file = fileStore[0]; const reader = new FileReader(); const previewItem = document.createElement('div'); previewItem.className = 'file-preview-item'; let fileIconHtml; if (file.type.startsWith('image/')) { reader.onload = e => { const imgElement = previewItem.querySelector('.file-icon-placeholder'); if (imgElement) imgElement.innerHTML = `<img src="${e.target.result}" class="preview-image">`; }; reader.readAsDataURL(file); fileIconHtml = `<div class="file-icon file-icon-placeholder"></div>`; } else { const extension = file.name.split('.').pop().toUpperCase(); fileIconHtml = `<div class="file-icon"><span class="text-white font-bold text-xs">${extension}</span></div>`; } previewItem.innerHTML = `${fileIconHtml}<div class="file-info"><span class="file-name">${file.name}</span><span class="file-type">${file.type}</span></div><div class="remove-btn" data-index="0"><svg class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></div>`; filePreviewContainer.appendChild(previewItem); updateButtonState(); };

            textarea.addEventListener('input', () => { updateButtonState(); autoResize(); });
            textarea.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } });
            sendButton.addEventListener('click', handleSubmit);
            micButton.addEventListener('click', () => isRecording ? stopRecording() : startRecording());
            resetChatButton.addEventListener('click', resetChat);
            uploadButton.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
            filePreviewContainer.addEventListener('click', (e) => { const removeBtn = e.target.closest('.remove-btn'); if (removeBtn) { fileStore = []; filePreviewContainer.innerHTML = ''; updateButtonState(); } });
            suggestionButtons.forEach(button => { button.addEventListener('click', () => { textarea.value = button.textContent; handleSubmit(); }); });

            updateButtonState();
            autoResize();
        }

        const googleFont = document.createElement('link');
        googleFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        googleFont.rel = 'stylesheet';
        document.head.appendChild(googleFont);

        const styleTag = document.createElement('style');
        styleTag.innerHTML = widgetCSS;
        document.head.appendChild(styleTag);

        widgetContainer.innerHTML = widgetHTML;

        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        tailwindScript.onload = initializeBooWidget;
        document.head.appendChild(tailwindScript);

        setTimeout(() => {
            if (!window.booWidgetLogicInitialized) {
                initializeBooWidget();
            }
        }, 500);
    }
    
    // --- NEW "PATIENT" LOADER ---
    // Instead of using 'DOMContentLoaded', this function actively polls for the div.
    function runWhenReady() {
        if (document.getElementById(targetDivId)) {
            // The div exists, run the main script.
            main();
        } else {
            // The div does not exist yet, try again in 100ms.
            setTimeout(runWhenReady, 100);
        }
    }

    // Start the lookup process.
    runWhenReady();

})();
