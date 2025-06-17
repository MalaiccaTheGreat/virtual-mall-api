import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Button from '../Components/Button';

export default function VirtualAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    setMessages((prev) => [...prev, userMessage]);
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

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Head title="Virtual Assistant" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="/assets/virtual-assistant.webp" 
                  alt="Pulse & Threads Assistant" 
                  className="w-16 h-16 rounded-full animate-pulse"
                />
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>
                    Pulse & Threads Assistant
                  </h1>
                  <p style={{ color: '#FFD700' }} className="text-lg font-medium">
                    Your Personal Shopping Companion
                  </p>
                </div>
              </div>
              
              <div className="mb-8 p-4 rounded-lg border-l-4" style={{ backgroundColor: '#f0f7ff', borderLeftColor: '#FFD700' }}>
                <p style={{ color: '#1e3a8a' }}>
                  Welcome to Pulse & Threads Virtual Mall! I'm here to help you discover amazing fashion, 
                  provide styling advice, help with virtual try-ons, and assist with your shopping journey. 
                  Feel free to ask me anything!
                </p>
              </div>

              <div className="mb-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? 'text-white'
                            : 'bg-gray-100'
                        }`}
                        style={message.isUser ? { backgroundColor: '#1e3a8a' } : { color: '#1e3a8a' }}
                      >
                        <p className="mb-1">{message.text}</p>
                        <small className="text-xs opacity-70">
                          {message.timestamp}
                        </small>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="transition-colors hover:bg-yellow-400"
                  style={{ backgroundColor: '#FFD700', color: '#1e3a8a' }}
                >
                  {loading ? 'Thinking...' : 'Send'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
