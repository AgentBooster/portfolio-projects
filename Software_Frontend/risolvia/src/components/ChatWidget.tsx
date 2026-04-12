import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';

const ChatWidget = () => {
  useEffect(() => {
    const welcomeContent = document.getElementById('welcome-content');
    const bannerProfile = document.getElementById('banner-profile');
    const chatThread = document.getElementById('chat-thread');
    const historyView = document.getElementById('history-view');
    const historyList = document.getElementById('history-list');
    const historyBtn = document.getElementById('history-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const inputWrapper = document.getElementById('input-wrapper');
    
    const sendBtn = document.getElementById('send-btn');
    const attachBtn = document.getElementById('attach-btn');
    const micBtn = document.getElementById('mic-btn');
    const pdfUpload = document.getElementById('pdf-upload') as HTMLInputElement;
    const fileDisplayContainer = document.getElementById('file-display-container');
    const singleLineInput = document.getElementById('single-line-input') as HTMLInputElement;
    const mainTextArea = document.getElementById('main-text-area') as HTMLTextAreaElement;
    const textWidthTester = document.getElementById('text-width-tester');
    
    let attachedFile: File | null = null;
    let chatHasStarted = false;
    let isHistoryVisible = false;
    let currentChatId: string | null = null;
    let isSending = false; // Flag to prevent duplicate sends
    let isProcessingFileDialog = false; // Flag to prevent file dialog reopening
    let isTogglingMic = false; // Flag to prevent mic state racing
    let isAgentTyping = false; // Flag to prevent sending while agent is typing

    function getChatHistory() {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            try {
                return JSON.parse(savedHistory);
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    function saveChatHistory(history: any) {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(history));
        } catch (e) {
            console.error("Error saving history:", e);
        }
    }
    
    function prepareNewSession() {
        currentChatId = null; 
        chatHasStarted = false;
        if (chatThread) chatThread.innerHTML = '';
        resetInput();
        if (welcomeContent) {
          welcomeContent.style.display = 'flex';
          welcomeContent.classList.remove('fade-out');
        }
        if (bannerProfile) bannerProfile.classList.add('opacity-0');
        if (inputWrapper) inputWrapper.classList.remove('hidden');

        if (chatThread && welcomeContent && !chatThread.contains(welcomeContent)) {
            chatThread.appendChild(welcomeContent);
        }

        if (isHistoryVisible) {
            isHistoryVisible = false;
            toggleHistoryView();
        }
    }

    function startNewChat() {
        prepareNewSession();
    }

    function loadChat(chatId: string) {
        const history = getChatHistory();
        const conversation = history.find((c: any) => c.id === chatId);
        if (!conversation) {
            startNewChat();
            return;
        }
        
        currentChatId = chatId;
        if (chatThread) chatThread.innerHTML = ''; 
        resetInput();

        if (conversation.messages.length > 0) {
            startChatVisuals(true);
            conversation.messages.forEach((msg: any) => {
                if (msg.sender === 'user') {
                    displayUserMessage(msg.text, msg.file, false);
                } else {
                    displayAgentMessage(msg.text, false);
                }
            });
            if (chatThread) chatThread.scrollTop = chatThread.scrollHeight;
        } else {
            prepareNewSession();
        }

        if (isHistoryVisible) {
            isHistoryVisible = false;
            toggleHistoryView();
        }
    }

    function renderHistoryView() {
        if (!historyList) return;
        historyList.innerHTML = '';
        const history = getChatHistory();

         if(history.length === 0 || history.every((c: any) => c.messages.length === 0)) {
            historyList.innerHTML = `<p class="text-center text-stone-500 p-4">No hay conversaciones guardadas.</p>`;
            return;
        }

        const sortedHistory = [...history]
            .filter((c: any) => c.messages.length > 0)
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        sortedHistory.forEach((conv: any) => {
            const item = document.createElement('div');
            item.className = 'bg-white/50 p-4 rounded-lg cursor-pointer hover:bg-white transition-colors';
            item.dataset.chatId = conv.id;
            
            const date = new Date(conv.timestamp);
            const formattedDate = `${date.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()} ${date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}`;

            item.innerHTML = `
                <div class="flex justify-between items-start">
                    <p class="font-semibold text-stone-800 mb-2 pr-4 truncate">${conv.title}</p>
                    <span class="text-xs text-stone-500 whitespace-nowrap">${formattedDate}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-stone-600">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>${conv.messages.length}</span>
                    <span>View chat</span>
                </div>
            `;
            item.addEventListener('click', () => loadChat(conv.id));
            historyList.appendChild(item);
        });
    }
    
    const chatIconSVG = `<path d="M14 4.5H6.2A2.7 2.7 0 0 0 3.5 7.2v7.2c0 1.5 1.2 2.7 2.7 2.7h4l2.5 2.1v-2.1h1.3 c1.5 0 2.7-1.2 2.7-2.7V7.2c0-1.5-1.2-2.7-2.7-2.7Z" /><line x1="6.8" y1="8.8" x2="12.6" y2="8.8"/><line x1="6.8" y1="11.1" x2="14" y2="11.1"/><line x1="6.8" y1="13.4" x2="11.2" y2="13.4"/>`;
    const historyIconSVG = `<path d="M14 4.5H6.2A2.7 2.7 0 0 0 3.5 7.2v7.2c0 1.5 1.2 2.7 2.7 2.7h4l2.5 2.1v-2.1h1.3" /><line x1="6.8" y1="8.8" x2="12.5" y2="8.8"/><line x1="6.8" y1="11.1" x2="13.8" y2="11.1"/><line x1="6.8" y1="13.4" x2="11" y2="13.4"/><circle cx="17.5" cy="16.8" r="3.6"/><path d="M17.5 15.2v1.8l1.2 .7"/>`;

    const handleHistoryClick = () => { isHistoryVisible = !isHistoryVisible; if(isHistoryVisible) renderHistoryView(); toggleHistoryView(); };
    const handleNewChatClick = () => startNewChat();
    
    if (historyBtn) historyBtn.addEventListener('click', handleHistoryClick);
    if (newChatBtn) newChatBtn.addEventListener('click', handleNewChatClick);
    
    function toggleHistoryView() {
         if (isHistoryVisible) {
            if (chatThread) chatThread.classList.add('hidden');
            if (inputWrapper) inputWrapper.classList.add('hidden');
            if (historyView) { historyView.classList.remove('hidden'); historyView.classList.add('fade-in'); }
            if (historyBtn) historyBtn.innerHTML = `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${chatIconSVG}</svg>`;
         } else {
            if (historyView) historyView.classList.add('hidden');
            if (chatThread) chatThread.classList.remove('hidden');
            if (inputWrapper) inputWrapper.classList.remove('hidden');
            if (historyBtn) historyBtn.innerHTML = `<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${historyIconSVG}</svg>`;
         }
    }
    
    const userId = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', userId);
    const sessionId = crypto.randomUUID();
    const webhookUrl = 'https://n8n.agentbooster.ai/webhook/agent-risolvia-web';

    function startChatVisuals(immediate = false) {
        if (chatHasStarted && !immediate) return;
        chatHasStarted = true;
        if (bannerProfile) bannerProfile.classList.remove('opacity-0');
        if (immediate) {
            if (welcomeContent) welcomeContent.style.display = 'none';
        } else {
            if (welcomeContent) { welcomeContent.classList.add('fade-out'); welcomeContent.addEventListener('animationend', () => { welcomeContent.style.display = 'none'; }, { once: true }); }
        }
    }
    
    async function sendMessage(text?: string, file?: File | null) {
        if (isSending) return; // Prevent duplicate sends
        isSending = true;
        
        const queryText = text || (mainTextArea?.classList.contains('hidden') ? singleLineInput?.value.trim() : mainTextArea?.value.trim()) || '';
        const fileToSend = file || attachedFile;
        if (queryText === '' && !fileToSend) {
            isSending = false;
            return;
        }
        const history = getChatHistory();
        let isNewConversation = false;
        let conversation: any;
        if (currentChatId === null) {
            isNewConversation = true;
            currentChatId = crypto.randomUUID();
            conversation = { id: currentChatId, title: queryText || "Nuevo Chat", timestamp: new Date().toISOString(), messages: [] };
            history.push(conversation);
        } else {
            conversation = history.find((c: any) => c.id === currentChatId);
            if (!conversation) { currentChatId = null; return sendMessage(text, file); }
        }
        const isFirstMessageInSession = !chatHasStarted;
        startChatVisuals(); 
        if (isFirstMessageInSession) {
            const agentWelcomeMsg = "¿En qué puedo ayudarte?";
            conversation.messages.push({ sender: 'agent', text: agentWelcomeMsg });
            displayAgentMessage(agentWelcomeMsg, false);
        }
        conversation.messages.push({ sender: 'user', text: queryText, file: fileToSend ? { name: fileToSend.name, type: fileToSend.type } : null });
        displayUserMessage(queryText, fileToSend, true);
        if (isNewConversation && queryText) { conversation.title = queryText.length > 50 ? queryText.substring(0, 50) + '...' : queryText; }
        else if (isNewConversation && fileToSend) { conversation.title = fileToSend.name; }
        saveChatHistory(history);
        resetInput();
        displayTypingIndicator();
        let fileAsBase64: any = null;
        if (fileToSend) {
            fileAsBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve({ name: fileToSend.name, type: fileToSend.type, data: (event.target?.result as string).split(',')[1]});
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(fileToSend);
            });
        }
        try {
            const payload = { userId, sessionId, text: queryText, files: fileAsBase64 ? [fileAsBase64] : [], contentType: fileAsBase64 ? 'mixed' : 'text' };
            const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            removeTypingIndicator();
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseText = await response.text();
            if (responseText) {
                 const result = JSON.parse(responseText);
                 if (result && typeof result.output !== 'undefined') {
                    const agentMessage = result.output;
                    const finalHistory = getChatHistory();
                    const finalConversation = finalHistory.find((c: any) => c.id === currentChatId);
                    if (finalConversation) {
                        finalConversation.messages.push({ sender: 'agent', text: agentMessage });
                        saveChatHistory(finalHistory);
                        displayAgentMessage(agentMessage, true);
                    }
                 }
            }
        } catch (error) {
            removeTypingIndicator();
            const errorMsg = "Lo siento, hubo un error al conectar. Por favor, inténtalo más tarde.";
            const errorHistory = getChatHistory();
            const errorConversation = errorHistory.find((c: any) => c.id === currentChatId);
             if (errorConversation) { errorConversation.messages.push({ sender: 'agent', text: errorMsg }); saveChatHistory(errorHistory); displayAgentMessage(errorMsg, true); }
        } finally {
            isSending = false; // Reset flag after send completes
        }
    }
    
    function displayUserMessage(text: string, file: File | null | { name: string, type: string }, animate = true) {
        if (!chatThread) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex justify-end ${animate ? 'fade-in' : ''}`;
        let fileHtml = '';
        let textHtml = '';
        if (file) fileHtml = `<div class="bg-white rounded-lg p-2 flex items-center gap-2 text-sm border border-stone-200"><svg class="w-5 h-5 flex-shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg><span class="truncate text-stone-800">${file.name}</span></div>`;
        if (text) textHtml = `<div class="bg-white text-stone-800 p-3 rounded-2xl border border-stone-200 ${file ? 'mt-2' : ''}">${text}</div>`;
        messageDiv.innerHTML = `<div class="max-w-md">${fileHtml}${textHtml}</div>`;
        chatThread.appendChild(messageDiv);
        chatThread.scrollTop = chatThread.scrollHeight;
    }

    function displayAgentMessage(text: string, animate = true) {
        if (!chatThread) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start ${animate ? 'fade-in' : ''}`;
        // Sanitize the text first to prevent XSS attacks
        const formattedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-stone-600 font-medium hover:underline">$1</a>').replace(/^\s*\*\s*(.*)/gm, '<div class="flex items-start pl-4"><span class="mr-2 mt-1">&#8226;</span><span>$1</span></div>').replace(/\n/g, '<br>').replace(/<br>\s*(?=<div class="flex)/g, '');
        // Use DOMPurify to sanitize HTML content before rendering
        const sanitizedHTML = DOMPurify.sanitize(formattedText, {
          ALLOWED_TAGS: ['strong', 'a', 'br', 'div', 'span'],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
        });
        messageDiv.innerHTML = `<div class="flex-1"><div class="group relative inline-block"><p class="font-normal text-stone-800"></p><button class="copy-agent-msg-btn absolute left-0 top-full mt-1 text-stone-500 hover:text-stone-800 transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-md p-1"><svg class="clipboard-icon w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg><svg class="checkmark-icon w-5 h-5 hidden text-stone-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button></div></div>`;
        chatThread.appendChild(messageDiv);
        const p = messageDiv.querySelector('.font-normal') as HTMLElement;
        
        // Update UI state based on agent typing status
        const updateInputState = () => {
          if (sendBtn) {
            if (isAgentTyping) {
              sendBtn.style.opacity = '0.5';
              sendBtn.style.cursor = 'not-allowed';
              sendBtn.setAttribute('disabled', 'true');
            } else {
              sendBtn.style.opacity = '1';
              sendBtn.style.cursor = 'pointer';
              sendBtn.removeAttribute('disabled');
            }
          }
          
          // Also disable the input fields visually
          if (singleLineInput) {
            if (isAgentTyping) {
              singleLineInput.style.opacity = '0.6';
              singleLineInput.style.cursor = 'not-allowed';
            } else {
              singleLineInput.style.opacity = '1';
              singleLineInput.style.cursor = 'text';
            }
          }
          
          if (mainTextArea) {
            if (isAgentTyping) {
              mainTextArea.style.opacity = '0.6';
              mainTextArea.style.cursor = 'not-allowed';
            } else {
              mainTextArea.style.opacity = '1';
              mainTextArea.style.cursor = 'text';
            }
          }
        };
        
        if (animate && sanitizedHTML && p) {
            isAgentTyping = true;
            updateInputState();
            
            const tokens = sanitizedHTML.match(/<[^>]+>|[^<>\s]+(?:<[^>]+>)*\s*|\s+/g) || [];
            let i = 0;
            const speed = 25;
            function streamText() {
                if (i < tokens.length && p) {
                    p.innerHTML += tokens[i];
                    i++;
                    if (chatThread) chatThread.scrollTop = chatThread.scrollHeight;
                    setTimeout(streamText, speed);
                } else {
                    // Agent finished typing
                    isAgentTyping = false;
                    updateInputState();
                }
            }
            streamText();
        } else if (p) {
            p.innerHTML = sanitizedHTML;
            if (chatThread) chatThread.scrollTop = chatThread.scrollHeight;
        }
    }

    function displayTypingIndicator() {
        if (!chatThread) return;
        const indicatorDiv = document.createElement('div');
        indicatorDiv.id = 'typing-indicator';
        indicatorDiv.className = 'flex items-start fade-in';
        indicatorDiv.innerHTML = `<div class="bg-white p-3 rounded-lg rounded-tl-none flex items-center space-x-1"><div style="animation-delay: 0s" class="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div><div style="animation-delay: 0.1s" class="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div><div style="animation-delay: 0.2s" class="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div></div>`;
        chatThread.appendChild(indicatorDiv);
        chatThread.scrollTop = chatThread.scrollHeight;
    }

    function removeTypingIndicator() { const indicator = document.getElementById('typing-indicator'); if (indicator) indicator.remove(); }
    function resetInput() { if (mainTextArea && !mainTextArea.classList.contains('hidden')) switchToSingleLine(); if (singleLineInput) singleLineInput.value = ''; attachedFile = null; renderAttachedFiles(); }
    
    const handleSendClick = () => {
      console.log('Send button clicked. isAgentTyping:', isAgentTyping, 'isSending:', isSending);
      if (!isSending && !isAgentTyping) {
        sendMessage();
      } else {
        console.log('Send blocked - Agent is typing or already sending');
      }
    };
    const handleCopyClick = (e: MouseEvent) => {
        const copyBtn = (e.target as HTMLElement).closest('.copy-agent-msg-btn');
         if (copyBtn) {
            const textToCopy = copyBtn.closest('.group')?.querySelector('.font-normal')?.textContent;
            if (textToCopy) {
                 const tempInput = document.createElement('textarea');
                 tempInput.value = textToCopy;
                 document.body.appendChild(tempInput);
                 tempInput.select();
                 try {
                    document.execCommand('copy');
                    const clipboardIcon = copyBtn.querySelector('.clipboard-icon');
                    const checkmarkIcon = copyBtn.querySelector('.checkmark-icon');
                    if(clipboardIcon && checkmarkIcon) {
                       clipboardIcon.classList.add('hidden');
                       checkmarkIcon.classList.remove('hidden');
                       setTimeout(() => { clipboardIcon.classList.remove('hidden'); checkmarkIcon.classList.add('hidden'); }, 1500);
                    }
                 } catch (err) { console.error('Error al copiar:', err); }
                 document.body.removeChild(tempInput);
            }
         }
    };
    
    if (sendBtn) {
      sendBtn.removeEventListener('click', handleSendClick);
      sendBtn.addEventListener('click', handleSendClick);
    }
    document.body.removeEventListener('click', handleCopyClick);
    document.body.addEventListener('click', handleCopyClick);

    function checkInputOverflow() { if (!singleLineInput || !textWidthTester) return; textWidthTester.textContent = singleLineInput.value; if (textWidthTester.offsetWidth > singleLineInput.offsetWidth - 20) switchToMultiLine(); }
    function switchToMultiLine() { if (mainTextArea && singleLineInput && mainTextArea.classList.contains('hidden')) { mainTextArea.value = singleLineInput.value; singleLineInput.style.opacity = '0'; singleLineInput.style.pointerEvents = 'none'; mainTextArea.classList.remove('hidden'); mainTextArea.focus(); autoResizeMultiLine(); } }
    function switchToSingleLine() { if (mainTextArea && singleLineInput) { singleLineInput.value = mainTextArea.value; mainTextArea.classList.add('hidden'); mainTextArea.value = ''; singleLineInput.style.opacity = '1'; singleLineInput.style.pointerEvents = 'auto'; singleLineInput.focus(); } }
    function checkMultiLineShrink() { if (!mainTextArea || !singleLineInput || !textWidthTester) return; if (mainTextArea.value.includes('\n')) { autoResizeMultiLine(); return; } textWidthTester.textContent = mainTextArea.value; if (textWidthTester.offsetWidth < singleLineInput.offsetWidth - 20) switchToSingleLine(); else autoResizeMultiLine(); }
    function autoResizeMultiLine() { if (!mainTextArea) return; mainTextArea.style.height = 'auto'; mainTextArea.style.height = mainTextArea.scrollHeight + 'px'; }
    if (singleLineInput) singleLineInput.addEventListener('input', checkInputOverflow);
    if (mainTextArea) mainTextArea.addEventListener('input', () => { checkMultiLineShrink(); });
    if (singleLineInput) singleLineInput.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        console.log('Enter pressed. isAgentTyping:', isAgentTyping, 'isSending:', isSending);
        if (!isAgentTyping && !isSending) {
          sendMessage(); 
        } else {
          console.log('Enter blocked - Agent is typing or already sending');
        }
      } 
    });
    if (mainTextArea) mainTextArea.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        console.log('Enter pressed on textarea. isAgentTyping:', isAgentTyping, 'isSending:', isSending);
        if (!isAgentTyping && !isSending) {
          sendMessage(); 
        } else {
          console.log('Enter blocked - Agent is typing or already sending');
        }
      } 
    });

    function renderAttachedFiles() {
        if (!fileDisplayContainer) return;
        fileDisplayContainer.innerHTML = '';
        if (attachedFile) {
            fileDisplayContainer.classList.remove('hidden');
            const fileChip = document.createElement('div');
            fileChip.className = "bg-stone-200/80 rounded-full p-2 flex items-center space-x-3 fade-in max-w-full";
            fileChip.innerHTML = `<div class="bg-red-500 text-white rounded-full p-2 flex-shrink-0"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div><div class="flex-grow min-w-0"><p class="text-sm font-medium text-stone-800 truncate">${attachedFile.name}</p><p class="text-xs text-stone-500">PDF</p></div><button class="remove-file-btn flex-shrink-0 bg-stone-700 hover:bg-stone-900 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors" style="position: relative; z-index: 10;"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="pointer-events: none;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>`;
            const removeBtn = fileChip.querySelector('.remove-file-btn');
            if (removeBtn) removeBtn.addEventListener('click', (e) => { e.stopPropagation(); attachedFile = null; renderAttachedFiles(); });
            fileDisplayContainer.appendChild(fileChip);
        } else { fileDisplayContainer.classList.add('hidden'); }
    }
    
    const handleAttachClick = (e: MouseEvent) => {
      if (isProcessingFileDialog) return; // Prevent multiple dialog triggers
      isProcessingFileDialog = true;
      
      e.preventDefault();
      e.stopPropagation();
      
      if (pdfUpload) {
        pdfUpload.click();
        // Reset flag after a short delay
        setTimeout(() => { isProcessingFileDialog = false; }, 300);
      }
    };
    
    const handleFileChange = (event: Event) => { 
      const file = (event.target as HTMLInputElement).files?.[0]; 
      console.log('File selected:', file?.name, 'Size:', file?.size, 'bytes');
      
      if (file) {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        console.log('Max size:', MAX_FILE_SIZE, 'File size:', file.size, 'Exceeds?', file.size > MAX_FILE_SIZE);
        
        if (file.size > MAX_FILE_SIZE) {
          console.log('File too large - showing toast');
          toast.error('El archivo excede el límite de 10MB', {
            description: 'Por favor, selecciona un archivo más pequeño.',
            duration: 4000,
          });
          if (pdfUpload) pdfUpload.value = '';
          return;
        }
        
        if (file.type === 'application/pdf') { 
          console.log('Valid PDF - attaching file');
          attachedFile = file; 
          renderAttachedFiles(); 
        } else {
          console.log('Not a PDF file');
        }
      }
      if (pdfUpload) pdfUpload.value = ''; 
    };
    
    const handleSuggestionClick = (e: Event) => {
      if (isSending) return; // Prevent multiple sends
      
      const button = (e.target as HTMLElement).closest('.suggestion-btn');
      if (!button) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const text = button.textContent?.trim() || '';
      if (text) {
        sendMessage(text, null);
      }
    };
    
    // Remove any existing listeners before adding new ones to prevent duplicates
    if (attachBtn) {
      attachBtn.removeEventListener('click', handleAttachClick);
      attachBtn.addEventListener('click', handleAttachClick, { once: false });
    }
    if (pdfUpload) {
      pdfUpload.removeEventListener('change', handleFileChange);
      pdfUpload.addEventListener('change', handleFileChange);
    }
    
    // Use event delegation for suggestion buttons
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (suggestionsContainer) {
      suggestionsContainer.removeEventListener('click', handleSuggestionClick);
      suggestionsContainer.addEventListener('click', handleSuggestionClick);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognition: any;
    let isListening = false;
    
    const handleMicClick = () => {
      if (isTogglingMic) return; // Prevent rapid state changes
      isTogglingMic = true;
      
      if (isListening) {
        if (recognition) {
          try {
            recognition.stop();
          } catch(e) {
            console.error("Error stopping recognition:", e);
          }
        }
      } else { 
        try { 
          if (recognition) recognition.start(); 
        } catch(e) { 
          console.error("Recognition already started:", e); 
        } 
      }
      
      // Reset flag after a short delay
      setTimeout(() => { isTogglingMic = false; }, 300);
    };
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'es-ES';
        recognition.interimResults = true;
        
        if (micBtn) {
          micBtn.removeEventListener('click', handleMicClick);
          micBtn.addEventListener('click', handleMicClick);
        }
        
        recognition.onstart = () => { 
          isListening = true; 
          if (micBtn) micBtn.classList.add('mic-listening'); 
        };
        
        recognition.onend = () => { 
          isListening = false; 
          if (micBtn) micBtn.classList.remove('mic-listening'); 
        };
        
        recognition.onerror = (event: any) => { 
          console.error('Error en el reconocimiento de voz:', event.error); 
          isListening = false; 
          if (micBtn) micBtn.classList.remove('mic-listening');
        };
        
        recognition.onresult = (event: any) => {
            let interim_transcript = '';
            let final_transcript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
              } else {
                interim_transcript += event.results[i][0].transcript;
              }
            }
            
            if (final_transcript.trim().length > 0) {
                const currentInput = mainTextArea?.classList.contains('hidden') ? singleLineInput : mainTextArea;
                if (currentInput) {
                  const currentValue = currentInput.value.trim();
                  const cleanTranscript = final_transcript.trim();
                  const newValue = currentValue ? currentValue + ' ' + cleanTranscript : cleanTranscript;
                  currentInput.value = newValue;
                }
                if (currentInput === singleLineInput) checkInputOverflow();
                else autoResizeMultiLine();
            }
        };
    } else if (micBtn) { 
      micBtn.style.display = 'none'; 
    }

    prepareNewSession();
    
    // Cleanup function
    return () => {
      if (historyBtn) historyBtn.removeEventListener('click', handleHistoryClick);
      if (newChatBtn) newChatBtn.removeEventListener('click', handleNewChatClick);
      if (sendBtn) sendBtn.removeEventListener('click', handleSendClick);
      document.body.removeEventListener('click', handleCopyClick);
      if (attachBtn) attachBtn.removeEventListener('click', handleAttachClick);
      if (pdfUpload) pdfUpload.removeEventListener('change', handleFileChange);
      if (suggestionsContainer) suggestionsContainer.removeEventListener('click', handleSuggestionClick);
      if (micBtn) micBtn.removeEventListener('click', handleMicClick);
      if (recognition) {
        recognition.stop();
        recognition.onstart = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onresult = null;
      }
    };
  }, []);

  return (
    <>
      <style>{`.mic-listening svg{color:#ef4444;animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}.fade-in{animation:fadeIn .3s ease-out forwards}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fade-out{animation:fadeOut .3s ease-out forwards;pointer-events:none}@keyframes fadeOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}}#main-text-area::-webkit-scrollbar,#chat-thread::-webkit-scrollbar,#history-list::-webkit-scrollbar{width:6px}#main-text-area::-webkit-scrollbar-track,#chat-thread::-webkit-scrollbar-track,#history-list::-webkit-scrollbar-track{background:transparent}#main-text-area::-webkit-scrollbar-thumb,#chat-thread::-webkit-scrollbar-thumb,#history-list::-webkit-scrollbar-thumb{background-color:#d1d5db;border-radius:20px}`}</style>
      <div className="w-full max-w-[1000px] h-[800px] bg-[#F1EEE9] rounded-3xl shadow-lg px-6 py-8 flex flex-col text-stone-800 relative overflow-hidden">
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow min-h-0 relative overflow-hidden">
            <div className="w-full pb-4 flex items-center justify-between">
                <div id="banner-profile" className="flex items-center gap-3 opacity-0 transition-opacity duration-300">
                    <img src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1758678218/Disen%CC%83o_sin_ti%CC%81tulo_cgec41.jpg" alt="Foto de perfil de Javier" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <p className="font-semibold text-stone-900 text-base">Javier</p>
                </div>
                <div className="group relative ml-auto">
                    <button id="history-btn" className="text-stone-500 hover:text-stone-800 transition-colors">
                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 4.5H6.2A2.7 2.7 0 0 0 3.5 7.2v7.2c0 1.5 1.2 2.7 2.7 2.7h4l2.5 2.1v-2.1h1.3" />
                            <line x1="6.8" y1="8.8" x2="12.5" y2="8.8"/><line x1="6.8" y1="11.1" x2="13.8" y2="11.1"/><line x1="6.8" y1="13.4" x2="11" y2="13.4"/>
                            <circle cx="17.5" cy="16.8" r="3.6"/><path d="M17.5 15.2v1.8l1.2 .7"/>
                        </svg>
                    </button>
                    <div className="absolute top-full mt-2 -right-2 whitespace-nowrap bg-stone-800 text-white text-xs font-semibold py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">Historial de chat<div className="absolute bottom-full right-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-stone-800"></div></div>
                </div>
            </div>
            <div id="chat-thread" className="flex-grow overflow-y-auto pr-2 space-y-10 pb-6">
                <div id="welcome-content" className="flex flex-col h-full">
                    <div className="text-center pt-8">
                        <img src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1758678218/Disen%CC%83o_sin_ti%CC%81tulo_cgec41.jpg" alt="Foto de perfil de Javier" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md" />
                        <h1 className="text-4xl font-semibold text-stone-900 mb-2">Javier</h1>
                        <p className="text-stone-700 mt-2 max-w-md mx-auto text-base leading-relaxed">Soy tu asistente legal virtual. Te ayudo a entender tu caso con claridad y conectar con expertos cuando lo necesites.</p>
                    </div>
                    <div className="flex-grow flex flex-col justify-end">
                        <div className="group relative self-start mb-12">
                            <p id="prompt-text-main" className="font-normal text-stone-800 text-left">¿En qué puedo ayudarte?</p>
                            <button className="copy-agent-msg-btn absolute left-0 top-full mt-1 text-stone-500 hover:text-stone-800 transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-md p-1">
                                <svg className="clipboard-icon w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                                <svg className="checkmark-icon w-5 h-5 hidden text-stone-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </button>
                        </div>
                    </div>
                    <div><div id="suggestions-container"><div className="flex flex-col items-end space-y-2">
                                <button className="suggestion-btn text-left text-sm font-normal text-stone-700 bg-stone-50 bg-opacity-20 border border-stone-400/50 rounded-full px-4 py-2 hover:bg-white hover:text-stone-900 hover:border-stone-400 transition-all duration-200">Necesito ayuda con un problema de alquiler y evaluar mis opciones</button>
                                <button className="suggestion-btn text-left text-sm font-normal text-stone-700 bg-stone-50 bg-opacity-20 border border-stone-400/50 rounded-full px-4 py-2 hover:bg-white hover:text-stone-900 hover:border-stone-400 transition-all duration-200">Me despidieron sin indemnización, ¿qué puedo hacer?</button>
                                <button className="suggestion-btn text-left text-sm font-normal text-stone-700 bg-stone-50 bg-opacity-20 border border-stone-400/50 rounded-full px-4 py-2 hover:bg-white hover:text-stone-900 hover:border-stone-400 transition-all duration-200">He tenido un accidente y quiero conocer mis derechos</button>
                            </div></div></div>
                </div>
            </div>
            <div id="history-view" className="hidden flex-grow flex flex-col pt-8 min-h-0">
                <div className="flex items-center justify-end mb-8 px-4">
                    <button id="new-chat-btn" className="flex items-center gap-2 text-stone-800 font-semibold bg-white border border-stone-300 rounded-lg px-4 py-2 hover:bg-stone-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>Nuevo chat
                    </button>
                </div>
                <div id="history-list" className="flex-grow overflow-y-auto space-y-2 pr-2 min-h-0"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#F1EEE9] to-transparent pointer-events-none z-10"></div>
        </div>
        <div id="input-wrapper" className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-lg flex flex-col transition-all duration-200 mt-4 flex-shrink-0 z-10 border border-stone-200">
            <div id="file-display-container" className="hidden p-3"></div>
            <textarea id="main-text-area" rows={1} maxLength={2000} className="hidden w-full resize-none border-none focus:ring-0 focus:outline-none bg-transparent text-stone-800 px-4 py-3 max-h-40 overflow-y-auto text-base"></textarea>
            <div id="bottom-bar" className="flex items-center w-full px-3 h-14 relative flex-shrink-0">
                <input type="file" id="pdf-upload" className="hidden" accept=".pdf" />
                <button id="attach-btn" className="p-2 text-stone-500 hover:text-stone-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.41l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" /></svg>
                </button>
                <input type="text" id="single-line-input" maxLength={2000} placeholder="Escribe tu consulta aquí" className="w-full flex-grow border-none focus:ring-0 focus:outline-none bg-transparent text-stone-800 placeholder-stone-500 transition-opacity duration-200 ml-1 text-base" />
                <div className="flex items-center">
                    <button id="mic-btn" className="p-2 text-stone-500 hover:text-stone-800 transition-colors">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button id="send-btn" className="p-2 text-stone-500 hover:text-stone-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    </button>
                </div>
            </div>
        </div>
      </div>
      <span id="text-width-tester" className="absolute invisible whitespace-pre" style={{fontSize: '1rem'}}></span>
    </>
  );
};

export default ChatWidget;
