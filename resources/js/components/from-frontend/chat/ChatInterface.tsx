import { useState, useRef, useEffect } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isProcessing: boolean;
}

export const ChatInterface = ({ 
  onSendMessage, 
  messages, 
  isProcessing 
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (message) {
      onSendMessage(message);
      setInputValue('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isProcessing}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isProcessing}
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
};
