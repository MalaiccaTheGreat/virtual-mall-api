document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chat-container');
  const chatIcon = document.getElementById('chat-icon');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatBody = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendMessageBtn = document.getElementById('send-button');
  const speechInputBtn = document.getElementById('mic-button');
  const chatPrompt = document.getElementById('chat-prompt');

  // Toggle chat window
  if (chatIcon) {
    chatIcon.addEventListener('click', function toggleChat() {
      const isHidden = chatWindow.classList.toggle('hidden');
      chatPrompt.classList.toggle('hidden', !isHidden);

      // Add welcome message if opening for the first time
      if (!isHidden && chatBody.children.length === 0) {
        setTimeout(() => {
          addAssistantMessage('How can I help you?');
        }, 500);
      }
    });
  }

  if (closeChat) {
    closeChat.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
    });
  }

  // Handle sending messages
  const handleSendMessage = () => {
    const messageText = chatInput.value.trim();
    if (messageText) {
      addUserMessage(messageText);
      chatInput.value = '';
      // Send message to the AI backend
      fetch('http://127.0.0.1:5000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.response) {
            addAssistantMessage(data.response);
          } else {
            addAssistantMessage(
              "I'm having trouble connecting to my brain right now."
            );
          }
        })
        .catch((error) => {
          console.error('Error communicating with AI:', error);
          addAssistantMessage(
            'There was an error reaching my services. Please try again later.'
          );
        });
    }
  };

  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', handleSendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
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
    // Cancel any previous speech
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: configure voice, rate, pitch here
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
      speechInputBtn.addEventListener('click', () => {
        recognition.start();
        speechInputBtn.textContent = '...'; // Indicate listening
      });
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
    console.log('Speech recognition not supported in this browser.');
    if (speechInputBtn) {
      speechInputBtn.style.display = 'none';
    }
  }
});
