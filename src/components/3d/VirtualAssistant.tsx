import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface VirtualAssistantProps {
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
  expression?: 'happy' | 'sad' | 'surprised' | 'angry' | 'neutral';
}

function Model({
  expression = 'neutral',
  isSpeaking = false,
}: VirtualAssistantProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/models/avatar.glb');

  useFrame((state) => {
    if (group.current) {
      // Add subtle floating animation
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

export default function VirtualAssistant({
  onSpeak,
  isSpeaking,
  expression,
}: VirtualAssistantProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-[600px]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Model expression={expression} isSpeaking={isSpeaking} />
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Thought Bubble */}
      <motion.div
        className="absolute top-20 right-20 bg-white p-4 rounded-lg shadow-lg max-w-xs"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <p className="text-gray-800">How can I help you today?</p>
      </motion.div>
    </div>
  );
}
