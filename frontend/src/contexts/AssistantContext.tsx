import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

type Expression = 'neutral' | 'happy' | 'sad' | 'thinking' | 'talking' | 'listening';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AssistantContextType {
  isOpen: boolean;
  toggleOpen: () => void;
  expression: Expression;
  setExpression: (exp: Expression) => void;
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
  isListening: boolean;
  toggleListening: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState<Expression>('neutral');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sendMessage(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event);
        setExpression('sad');
        setTimeout(() => setExpression('neutral'), 2000);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setExpression('neutral');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setExpression('listening');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setExpression('sad');
        setTimeout(() => setExpression('neutral'), 2000);
      }
    }
  }, [isListening]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setExpression('thinking');
    setIsProcessing(true);
    
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text })
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setExpression('talking');
      
      // Simulate talking animation
      setTimeout(() => setExpression('neutral'), data.response.length * 50);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setExpression('sad');
      setTimeout(() => setExpression('neutral'), 2000);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <AssistantContext.Provider value={{
      isOpen,
      toggleOpen,
      expression,
      setExpression,
      messages,
      sendMessage,
      isProcessing,
      isListening,
      toggleListening
    }}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
