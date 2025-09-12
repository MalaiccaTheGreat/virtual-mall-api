'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAssistant } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
  expression?: string;
}

export default function VirtualAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { lastMessage, sendMessage } = useWebSocket('ws://localhost:6001/chat');

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage);
      if (data.type === 'typing') {
        setIsTyping(data.isTyping);
      } else if (data.type === 'message') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: data.message,
            sender: 'assistant',
            timestamp: new Date(),
            audioUrl: data.audioUrl,
            expression: data.expression,
          },
        ]);
      }
    }
  }, [lastMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    sendMessage(JSON.stringify({ type: 'typing', isTyping: true }));

    try {
      const response = await chatWithAssistant(input);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(
        () => {
          sendMessage(JSON.stringify({ type: 'typing', isTyping: false }));

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.message,
            sender: 'assistant',
            timestamp: new Date(),
            audioUrl: response.audio_url,
            expression: response.expression,
          };

          setMessages((prev) => [...prev, assistantMessage]);

          if (response.audio_url && audioRef.current) {
            audioRef.current.src = response.audio_url;
            audioRef.current.play();
          }
        },
        1000 + Math.random() * 2000
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="bg-[#1B3C73] text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Virtual Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-[#1B3C73] text-white'
                    : 'bg-[#FFD700] text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#FFD700] rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#1B3C73] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#1B3C73] rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-[#1B3C73] rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B3C73]"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-lg ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[#1B3C73] hover:bg-[#2B4C83]'
            } text-white focus:outline-none focus:ring-2 focus:ring-[#1B3C73]`}
            disabled={isLoading}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#1B3C73] text-white px-4 py-2 rounded-lg hover:bg-[#2B4C83] focus:outline-none focus:ring-2 focus:ring-[#1B3C73] disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
