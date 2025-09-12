import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AssistantModel } from './AssistantModel';
import { ChatInterface, Message } from '../chat/ChatInterface';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useResponsive } from '../../hooks/useResponsive';

interface VirtualAssistantProps {
  onSpeak?: (text: string) => void;
  onExpressionChange?: (expression: Expression) => void;
  className?: string;
}

interface BlendShapes {
  eyeBlink_L?: number;
  eyeBlink_R?: number;
  eyeSquint_L?: number;
  eyeSquint_R?: number;
  browDown_L?: number;
  browDown_R?: number;
  browInnerUp?: number;
  mouthSmile_L?: number;
  mouthSmile_R?: number;
  mouthFrown_L?: number;
  mouthFrown_R?: number;
  mouthOpen?: number;
  mouthPucker?: number;
}

interface VirtualAssistantProps {
  onSpeak?: (text: string) => void;
  onExpressionChange?: (expression: Expression) => void;
  className?: string;
}

// Expression configurations with blend shapes and colors
const EXPRESSION_CONFIG = {
  happy: {
    blendShapes: {
      mouthSmile_L: 1,
      mouthSmile_R: 1,
      eyeSquint_L: 0.5,
      eyeSquint_R: 0.5,
    },
    color: '#ffcc00'
  },
  sad: {
    blendShapes: {
      mouthFrown_L: 1,
      mouthFrown_R: 1,
      browDown_L: 0.8,
      browDown_R: 0.8,
    },
    color: '#3399ff'
  },
  surprised: {
    blendShapes: {
      mouthOpen: 0.7,
      browInnerUp: 1,
      eyeWide_L: 0.9,
      eyeWide_R: 0.9
    },
    color: '#ff3366'
  },
  angry: {
    blendShapes: {
      browDown_L: 1,
      browDown_R: 1,
      mouthFrown_L: 0.8,
      mouthFrown_R: 0.8
    },
    color: '#ff3300'
  },
  thinking: {
    blendShapes: {
      browDown_L: 0.6,
      browDown_R: 0.6,
      mouthPucker: 0.7,
    },
    color: '#9c27b0'
  },
  listening: {
    blendShapes: {
      mouthOpen: 0.3,
      browInnerUp: 0.5,
    },
    color: '#4caf50'
  },
  talking: {
    blendShapes: {
      mouthOpen: 0.5,
      mouthSmile_L: 0.4,
      mouthSmile_R: 0.4
    },
    color: '#2196f3'
  },
  neutral: {
    blendShapes: {},
    color: '#ffffff'
  }
} as const;

// Default suggestions for the chat
const SUGGESTIONS = [
  "What products do you have?",
  "How does virtual try-on work?",
  "What are your return policies?",
  "Show me summer collection"
];

interface ModelProps {
  expression?: Expression;
  isSpeaking?: boolean;
  position?: [number, number, number];
  scale?: number;
}

const Model: React.FC<ModelProps> = ({ 
  expression = 'neutral',
  isSpeaking = false,
  position = [0, 0, 0],
  scale = 1
}) => {
  const group = useRef<THREE.Group>(null);
  const [currentExpression, setCurrentExpression] = useState(expression);
  
  // Load the 3D model
  const { nodes, materials } = useGLTF('/models/assistant.glb') as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };

  // Handle expression changes with smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentExpression(expression);
    }, 100);
    return () => clearTimeout(timer);
  }, [expression]);
  
  // Handle speaking animation
  useEffect(() => {
    if (!group.current) return;
    
    if (isSpeaking) {
      // Add subtle animation when speaking
      const interval = setInterval(() => {
        if (group.current) {
          group.current.rotation.y += 0.01;
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  // Speaking animation
  useFrame(({ clock }) => {
    if (!group.current) return;
    
    // Floating animation
}) => {
  // State management
  const [expression, setExpression] = useState<Expression>('neutral');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Hooks
  const { theme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const { isMobile } = useResponsive();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with a greeting
  useEffect(() => {
    const greeting = `Hello${user ? `, ${user.name}` : ''}! How can I help you today?`;
    setMessages([{
      id: 'greeting',
      text: greeting,
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, [user]);

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
        handleSendMessage(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
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

  // Toggle voice input
  const toggleListening = () => {
    if (recognitionRef.current) {
      if (expression === 'listening') {
        recognitionRef.current.stop();
        setExpression('neutral');
      } else {
        try {
          recognitionRef.current.start();
          setExpression('listening');
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          setExpression('sad');
          setTimeout(() => setExpression('neutral'), 2000);
        }
      }
    }
  };

  // Send message to backend
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setExpression('thinking');
    setIsProcessing(true);
    
    try {
      // Call backend API
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          message,
          context: {
            userId: user?.uid,
            cartItems: cart.items,
            previousMessages: messages.slice(-5),
            timestamp: new Date().toISOString()
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to get response from assistant');
      
      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if TTS is enabled
      if (onSpeak && data.shouldSpeak !== false) {
        onSpeak(data.response);
        setExpression('talking');
        setTimeout(() => setExpression('neutral'), data.response.length * 50);
      } else {
        setExpression('neutral');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setExpression('sad');
      setTimeout(() => setExpression('neutral'), 2000);
      
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle chat window
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Effect to notify when assistant is speaking
  useEffect(() => {
    if (onExpressionChange) {
      onExpressionChange(expression);
    }
  }, [expression, onExpressionChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle chat with Ctrl+Space
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsMinimized(prev => !prev);
      }
      
      // Focus input when chat is open and '/' is pressed
      if (e.key === '/' && !isMinimized) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMinimized]);

  // Responsive adjustments
  const chatWidth = isMobile ? '90vw' : '400px';
  const chatHeight = isMobile ? '60vh' : '600px';

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${className}`}
      style={{
        width: isMinimized ? '80px' : chatWidth,
        height: isMinimized ? '80px' : chatHeight,
        maxWidth: '100vw',
        maxHeight: '90vh',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
        color: theme === 'dark' ? 'white' : '#1f2937'
      }}
      role="dialog"
      aria-label="Virtual Assistant"
      aria-expanded={!isMinimized}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={toggleMinimize}
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
          borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
        }}
      >
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{
              backgroundColor: expression === 'talking' ? '#3b82f6' : 
                              expression === 'thinking' ? '#f59e0b' :
                              expression === 'listening' ? '#8b5cf6' :
                              '#6b7280'
            }}
          >
            <span className="text-white text-sm">
              {expression === 'talking' ? '🗣️' :
               expression === 'thinking' ? '🤔' :
               expression === 'listening' ? '👂' : '🤖'}
            </span>
          </div>
          {!isMinimized && <h3 className="font-medium">Virtual Assistant</h3>}
        </div>
        {!isMinimized && (
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                toggleListening();
              }}
              aria-label={expression === 'listening' ? 'Stop listening' : 'Start voice input'}
              style={{
                color: expression === 'listening' ? '#ef4444' : (theme === 'dark' ? '#9ca3af' : '#4b5563')
              }}
            >
              {expression === 'listening' ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <button 
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize();
              }}
              aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
            >
              {isMinimized ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* 3D Model View (Minimized) */}
      {isMinimized ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-16 h-16">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <AssistantModel 
                expression={expression} 
                isSpeaking={expression === 'talking'}
                scale={0.4}
                position={[0, -0.5, 0]}
              />
            </Canvas>
          </div>
        </div>
      ) : (
        <>
          <ChatInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
          
          {/* 3D Model (Maximized) */}
          <div className="absolute bottom-24 right-4 w-24 h-24 md:w-32 md:h-32 z-10">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <AssistantModel 
                expression={expression} 
                isSpeaking={expression === 'talking'}
                scale={0.25}
                position={[0, -0.5, 0]}
              />
            </Canvas>
          </div>
        </>
      )}
    </div>
  );
};
