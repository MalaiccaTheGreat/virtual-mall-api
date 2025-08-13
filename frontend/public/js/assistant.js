document.addEventListener('DOMContentLoaded', () => {
  const chatPrompt = document.getElementById('chat-prompt');
  const chatIcon = document.getElementById('chat-icon');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatBody = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendMessageBtn = document.getElementById('send-button');
  const speechInputBtn = document.getElementById('mic-button');

  // Chat window toggle functionality
  if (chatPrompt) {
    chatPrompt.addEventListener('click', () => toggleChat(true));
    chatPrompt.setAttribute('tabindex', '0');
    chatPrompt.setAttribute('role', 'button');
    chatPrompt.setAttribute('aria-label', 'Open chat assistant');
    chatPrompt.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') toggleChat(true);
    });
  }

  if (chatIcon) {
    chatIcon.addEventListener('click', () => toggleChat(true));
    chatIcon.setAttribute('tabindex', '0');
    chatIcon.setAttribute('role', 'button');
    chatIcon.setAttribute('aria-label', 'Open chat assistant');
    chatIcon.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') toggleChat(true);
    });
  }

  if (closeChat) {
    closeChat.setAttribute('aria-label', 'Close chat');
    closeChat.addEventListener('click', () => toggleChat(false));
  }

  function toggleChat(open) {
    if (open) {
      chatWindow.classList.remove('hidden');
      chatWindow.setAttribute('aria-hidden', 'false');
      if (chatPrompt) chatPrompt.classList.add('hidden');
      chatInput.focus();
    } else {
      chatWindow.classList.add('hidden');
      chatWindow.setAttribute('aria-hidden', 'true');
      if (chatPrompt) chatPrompt.classList.remove('hidden');
      if (chatIcon) chatIcon.focus();
    }
  }

  // Accessibility setup
  if (chatBody) {
    chatBody.setAttribute('role', 'log');
    chatBody.setAttribute('aria-live', 'polite');
    chatBody.setAttribute('tabindex', '0');
  }

  // Loading indicator
  let loadingMsg = null;
  function showLoading() {
    loadingMsg = document.createElement('div');
    loadingMsg.className = 'message assistant loading';
    loadingMsg.innerHTML = '<div class="assistant-avatar"></div><div class="message-bubble">Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>';
    chatBody.appendChild(loadingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideLoading() {
    if (loadingMsg && loadingMsg.parentNode) {
      loadingMsg.parentNode.removeChild(loadingMsg);
      loadingMsg = null;
    }
  }

  // Enhanced message handling with new handleUserInput function
  function handleUserInput(messageText) {
    const lowerText = messageText.toLowerCase();
    
    // Check for specific commands
    if (lowerText.includes('checkout') || lowerText.includes('purchase')) {
      addAssistantMessage("🛍 You can review your cart and click 'Proceed to Checkout' when ready. Need help with anything else?");
      return true;
    } else if (lowerText.includes('help') || lowerText.includes('support')) {
      addAssistantMessage("ℹ️ I can help with product questions, checkout assistance, or general support. What do you need help with?");
      return true;
    } else if (lowerText.includes('hi') || lowerText.includes('hello')) {
      addAssistantMessage("👋 Hello there! How can I assist you today?");
      return true;
    }
    return false;
  }

  const handleSendMessage = () => {
    const messageText = chatInput.value.trim();
    if (messageText) {
      addUserMessage(messageText);
      chatInput.value = '';
      
      // First check for predefined responses
      if (!handleUserInput(messageText)) {
        // If no predefined response, use AI service
        showLoading();
        fetch('http://127.0.0.1:5000/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText }),
        })
          .then((response) => response.json())
          .then((data) => {
            hideLoading();
            if (data.response) {
              addAssistantMessage(data.response);
            } else {
              addAssistantMessage("I'm having trouble connecting to my brain right now.");
            }
          })
          .catch((error) => {
            hideLoading();
            console.error('Error communicating with AI:', error);
            addAssistantMessage('There was an error reaching my services. Please try again later.');
          });
      }
    }
  };

  if (sendMessageBtn) {
    sendMessageBtn.setAttribute('aria-label', 'Send message');
    sendMessageBtn.addEventListener('click', handleSendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
    // Styling for input
    chatInput.style.backgroundColor = 'white';
    chatInput.style.border = '2px solid #0047ab';
    chatInput.style.color = '#0047ab';
    chatInput.style.borderRadius = '25px';
    chatInput.style.padding = '12px';
    chatInput.style.fontFamily = 'Poppins, sans-serif';
    chatInput.style.fontSize = '1rem';
  }

  function addUserMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.textContent = text;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addAssistantMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message assistant';
    messageElement.innerHTML = `
      <div class="assistant-avatar"></div>
      <div class="message-bubble">${text}</div>
    `;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
    speak(text);
  }

  function speak(text) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  // Speech-to-text functionality
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (speechInputBtn) {
      speechInputBtn.setAttribute('aria-label', 'Start voice input');
      speechInputBtn.addEventListener('click', () => {
        recognition.start();
        speechInputBtn.textContent = '...';
      });
      speechInputBtn.style.backgroundColor = '#ffd700';
      speechInputBtn.style.borderRadius = '50%';
      speechInputBtn.style.padding = '8px';
    }

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      chatInput.value = speechResult;
      handleSendMessage();
    };

    recognition.onspeechend = () => {
      recognition.stop();
      speechInputBtn.textContent = '🎤';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      speechInputBtn.textContent = '🎤';
    };
  } else {
    if (speechInputBtn) {
      speechInputBtn.style.display = 'none';
    }
  }

  // Add welcome message on load
  addAssistantMessage('👋 Hi there! How can I help you today? I can assist with product questions, checkout help, and more!');
});