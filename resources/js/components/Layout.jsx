import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Layout({ children }) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: Date.now(),
        text: 'Hello! How can I help you today? I can assist you with finding products, styling advice, or any questions about Pulse & Threads Virtual Mall.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      if (data.response) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#f8fafc' }}>
      <header className="bg-white shadow-md border-b-4" style={{ borderBottomColor: '#FFD700' }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <img 
                  src="/assets/Logo.jpeg" 
                  alt="Pulse & Threads Logo" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <span className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>
                    Pulse & Threads
                  </span>
                  <p className="text-sm" style={{ color: '#FFD700' }}>Virtual Mall</p>
                </div>
              </Link>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              <Link 
                href="/virtual-try-on" 
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-blue-50"
                style={{ color: '#1e3a8a' }}
              >
                Virtual Try-On
              </Link>
              <Link 
                href="/virtual-assistant"
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-blue-50"
                style={{ color: '#1e3a8a' }}
              >
                Assistant
              </Link>
              <Link 
                href="/cart" 
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-blue-50"
                style={{ color: '#1e3a8a' }}
              >
                Cart
              </Link>
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-medium rounded-md border transition-colors"
                style={{ 
                  backgroundColor: '#FFD700',
                  borderColor: '#FFD700',
                  color: '#1e3a8a'
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Virtual Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showChat && (
          <div className="relative">
            <div 
              className="animate-pulse absolute -top-12 right-0 bg-white px-3 py-2 rounded-lg shadow-lg border-2 text-sm font-medium whitespace-nowrap"
              style={{ borderColor: '#FFD700', color: '#1e3a8a' }}
            >
              How can I help you?
              <div 
                className="absolute bottom-[-8px] right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                style={{ borderTopColor: '#FFD700' }}
              ></div>
            </div>
            <button
              onClick={toggleChat}
              className="w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce"
              style={{ backgroundColor: '#FFD700' }}
            >
              <svg 
                className="w-8 h-8 mx-auto" 
                style={{ color: '#1e3a8a' }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Chat Window */}
        {showChat && (
          <div className="bg-white rounded-lg shadow-2xl w-96 h-[32rem] flex flex-col border-2" style={{ borderColor: '#FFD700' }}>
            {/* Chat Header */}
            <div 
              className="p-4 rounded-t-lg flex items-center justify-between"
              style={{ backgroundColor: '#1e3a8a' }}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/virtual-assistant.webp" 
                  alt="Virtual Assistant" 
                  className="w-10 h-10 rounded-full animate-pulse"
                />
                <div>
                  <h3 className="text-white font-semibold">Pulse & Threads Assistant</h3>
                  <p className="text-xs" style={{ color: '#FFD700' }}>Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'text-white'
                        : 'bg-gray-100'
                    }`}
                    style={message.isUser ? { backgroundColor: '#1e3a8a' } : { color: '#1e3a8a' }}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t-2" style={{ borderTopColor: '#FFD700' }}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={startListening}
                  disabled={isListening || loading}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'animate-pulse' 
                      : 'hover:bg-yellow-400'
                  }`}
                  style={{ backgroundColor: '#FFD700', color: '#1e3a8a' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-lg transition-colors hover:bg-yellow-400 disabled:opacity-50"
                  style={{ backgroundColor: '#FFD700', color: '#1e3a8a' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
