import { useState, useRef, useEffect } from 'react';
import { Message } from './VirtualAssistant';
import { useTheme } from '../../contexts/ThemeContext';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  suggestions?: string[];
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  suggestions = [],
  inputRef
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };
  
  // Handle using a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef?.current?.focus();
  };
  
  // Format message timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{message.text}</div>
              <div 
                className={`text-xs mt-1 text-right ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
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
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
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
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div 
            ref={inputContainerRef}
            className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
          >
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
};
