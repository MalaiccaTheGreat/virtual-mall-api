import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import AvatarScene from './Avatar3D';
import { FaceMesh } from '@mediapipe/face_mesh';

interface VirtualAssistantProps {
  containerStyle?: React.CSSProperties;
}

const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  containerStyle,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expression, setExpression] = useState<
    'neutral' | 'happy' | 'thinking' | 'speaking'
  >('neutral');
  const [blendShapes, setBlendShapes] = useState<Record<string, number>>({});

  const audioContext = useRef<AudioContext>();
  const recognition = useRef<SpeechRecognition>();

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Initialize Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript);
      };
    }

    // Initialize AudioContext
    audioContext.current = new AudioContext();

    // Initialize face tracking
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks) {
        // Convert landmarks to blendshapes
        const shapes = calculateBlendShapes(results.multiFaceLandmarks[0]);
        setBlendShapes(shapes);
      }
    });

    return () => {
      newSocket.close();
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const handleUserInput = async (input: string) => {
    if (!socket) return;

    setExpression('thinking');
    socket.emit('user-input', { message: input });
  };

  const playAudioResponse = async (base64Audio: string) => {
    if (!audioContext.current) return;

    const audioBuffer = await audioContext.current.decodeAudioData(
      Buffer.from(base64Audio, 'base64').buffer
    );

    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.current.destination);

    setIsSpeaking(true);
    setExpression('speaking');

    source.onended = () => {
      setIsSpeaking(false);
      setExpression('neutral');
    };

    source.start();
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('assistant-response', async (data) => {
      await playAudioResponse(data.audio);
    });

    socket.on('error', (error) => {
      console.error('Assistant error:', error);
      setExpression('neutral');
    });
  }, [socket]);

  const toggleListening = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
    setIsListening(!isListening);
  };

  const calculateBlendShapes = (landmarks: any) => {
    // Convert facial landmarks to blendshape values
    // This is a simplified version - you'd want to add more sophisticated mapping
    return {
      mouthOpen: landmarks[13].y - landmarks[14].y,
      browRaise: landmarks[282].y - landmarks[282].y,
      smile: (landmarks[61].x - landmarks[291].x) * 2,
    };
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '300px',
        height: '400px',
        ...containerStyle,
      }}
    >
      <AvatarScene
        expression={expression}
        isSpeaking={isSpeaking}
        blendShapes={blendShapes}
      />
      <button
        onClick={toggleListening}
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          background: isListening ? '#ff4444' : '#4444ff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default VirtualAssistant;
