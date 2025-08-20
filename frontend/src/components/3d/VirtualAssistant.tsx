import { useRef, useState, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import axios from 'axios';

declare module 'three-stdlib' {
  export interface GLTF {
    nodes: { [key: string]: THREE.Mesh };
    materials: { [key: string]: THREE.Material & { color?: THREE.Color } };
  }
}

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

type Expression = 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking' | 'neutral';

interface VirtualAssistantProps {
  onSpeak?: (text: string) => void;
  onExpressionChange?: (expression: Expression) => void;
  className?: string;
}

// Expression color mapping
const EXPRESSION_COLORS: Record<Expression, string> = {
  happy: '#ffcc00',
  sad: '#3399ff',
  surprised: '#ff3366',
  angry: '#ff3300',
  thinking: '#9c27b0',
  neutral: '#ffffff'
};

// Default suggestions for the chat
const SUGGESTIONS = [
  "What products do you have?",
  "How does virtual try-on work?",
  "What are your return policies?",
  "Show me summer collection"
];

function Model({ 
  expression = 'neutral', 
  isSpeaking = false 
}: { 
  expression: Expression; 
  isSpeaking: boolean 
}) {
  const group = useRef<THREE.Group>(null);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [speakIntensity, setSpeakIntensity] = useState(0);
  
  const { nodes, materials } = useGLTF('/models/avatar.glb') as GLTF;

  // Handle expression changes with smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentExpression(expression);
    }, 300); // Small delay for smoother transition
    return () => clearTimeout(timer);
  }, [expression]);

  // Speaking animation
  useFrame(({ clock }) => {
    if (!group.current) return;
    
    // Floating animation
    group.current.position.y = Math.sin(clock.elapsedTime) * 0.1;
    
    // Speaking animation
    if (isSpeaking) {
      const intensity = Math.sin(clock.elapsedTime * 5) * 0.1 + 1;
      setSpeakIntensity(intensity);
      group.current.scale.set(intensity, intensity, intensity);
    } else {
      // Smoothly return to normal scale when not speaking
      setSpeakIntensity(prev => prev * 0.9 + 0.1); // Smoothly approach 1
      group.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Apply expression colors to materials
  useEffect(() => {
    if (!materials) return;
    
    // Find and update the main material (adjust 'body' based on your model's material name)
    const material = Object.values(materials).find(m => 'color' in m) || 
                    Object.values(materials)[0];
    
    if (material && 'color' in material) {
      if (material.color instanceof THREE.Color) {
        material.color.set(EXPRESSION_COLORS[currentExpression]);
      } else if (material.color) {
        material.color = new THREE.Color(EXPRESSION_COLORS[currentExpression]);
      }
    }
  }, [currentExpression, materials]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

export function VirtualAssistant({ 
  onSpeak, 
  onExpressionChange, 
  className = '' 
}: VirtualAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [expression, setExpression] = useState<Expression>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle expression changes
  useEffect(() => {
    if (onExpressionChange) {
      onExpressionChange(expression);
    }
  }, [expression, onExpressionChange]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: "Hello! I'm your virtual shopping assistant. How can I help you today?",
        sender: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setExpression('thinking');

    try {
      // Call the backend API
      const response = await axios.post('/api/chat', {
        message: inputValue
      });

      // Add assistant's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update expression based on response
      if (response.data.expression) {
        setExpression(response.data.expression);
      } else {
        setExpression('neutral');
      }

      // Speak the response if onSpeak is provided
      if (onSpeak) {
        onSpeak(assistantMessage.text);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
      setExpression('sad');
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, onSpeak]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      {/* 3D Model */}
      <div className={`flex-1 relative transition-all duration-300 ${isMinimized ? 'h-0' : 'h-2/3'}`}>
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <Model expression={expression} isSpeaking={isTyping} />
            <OrbitControls enableZoom={false} />
          </Suspense>
        </Canvas>
        
        {/* Minimize/Maximize button */}
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10"
          aria-label={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? '🔍' : '➖'}
        </button>
      </div>

      {/* Chat Interface */}
      <div className={`bg-white rounded-t-2xl shadow-xl overflow-hidden transition-all duration-300 ${isMinimized ? 'h-full' : 'h-1/3'}`}>
        {/* Chat Header */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-semibold">Virtual Assistant</h3>
        </div>

        {/* Messages */}
        <div className="h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-50 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-1 p-2"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="border-t p-3 bg-gray-50">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-white hover:bg-gray-100 border rounded-full px-3 py-1 text-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
