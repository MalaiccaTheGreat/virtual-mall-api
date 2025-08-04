import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Button from '../Components/Button';

export default function VirtualAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expression, setExpression] = useState('neutral');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:3000');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setLoading(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const botMessage = {
        id: Date.now(),
        text: data.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setExpression(data.expression);
      setLoading(false);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: 'Sorry, I encountered a connection error.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setLoading(false);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const playAudio = async (text) => {
    try {
      const response = await fetch('http://localhost:3001/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('Failed to fetch audio');
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    ws.current.send(JSON.stringify({ message: input }));
    setInput('');
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
                  src={`/assets/virtual-assistant-${expression}.webp`}
                  onError={(e) => { e.target.onerror = null; e.target.src='/assets/virtual-assistant.webp'; }}
                  alt="Pulse & Threads Assistant" 
                  className="w-16 h-16 rounded-full animate-pulse"
                />
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: '#002366' }}>
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

              <div className="mb-6 h-96 overflow-y-auto pr-4">
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
                        <div className="flex justify-between items-center">
                          <small className="text-xs opacity-70">
                            {message.timestamp}
                          </small>
                          {!message.isUser && (
                            <button
                              onClick={() => playAudio(message.text)}
                              className="ml-2 text-xs font-bold"
                            >
                              Speak
                            </button>
                          )}
                        </div>
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
                  disabled={loading || (ws.current && ws.current.readyState !== WebSocket.OPEN)}
                />
                <Button
                  type="submit"
                  disabled={loading || (ws.current && ws.current.readyState !== WebSocket.OPEN)}
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
