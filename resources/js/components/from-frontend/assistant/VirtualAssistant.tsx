import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AssistantModel } from './AssistantModel';
import { useAssistant } from '../../contexts/AssistantContext';
import { MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Message type is imported from the context

const SUGGESTIONS = [
  'What products do you have?',
  'How can I track my order?',
  'What are your opening hours?',
  'Can you help me find something?'
];

export function VirtualAssistant() {
  const {
    isOpen,
    toggleOpen,
    expression,
    messages,
    sendMessage,
    isProcessing,
    isListening,
    toggleListening
  } = useAssistant();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };
  
  // Handle using a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };
  
  // Format message timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Toggle between minimized and expanded states
  const toggleMinimize = () => {
    toggleOpen();
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle chat with Ctrl+Space
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        toggleOpen();
      }
      
      // Focus input when chat is open and '/' is pressed
      if (e.key === '/' && isOpen) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMinimize}
          className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open virtual assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-500 text-xl">🤖</span>
            </div>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col z-50"
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
            <span className="text-blue-500 text-xl">🤖</span>
          </div>
          <h3 className="font-semibold text-lg">Virtual Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'} transition-colors`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <XMarkIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleMinimize}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Minimize"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* 3D Model */}
      <div className="h-48 bg-gray-50 dark:bg-gray-700 relative">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AssistantModel 
            expression={expression}
            isSpeaking={expression === 'talking'}
            position={[0, -0.5, 0]}
            scale={0.8}
          />
        </Canvas>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>How can I help you today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.text}</div>
                <div className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex items-center space-x-2 p-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isProcessing}
              aria-label="Type your message"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
