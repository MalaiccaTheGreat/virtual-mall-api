import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type Expression = 'neutral' | 'happy' | 'sad' | 'thinking' | 'talking' | 'listening';

interface ModelProps {
  expression?: Expression;
  isSpeaking?: boolean;
  position?: [number, number, number];
  scale?: number;
}

export const AssistantModel = ({ 
  expression = 'neutral',
  isSpeaking = false,
  position = [0, 0, 0],
  scale = 1
}: ModelProps) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/models/assistant.glb') as any;

  // Handle expression changes
  useEffect(() => {
    // Add expression animation logic here
    if (group.current) {
      // Update model based on expression
    }
  }, [expression]);

  // Handle speaking animation
  useEffect(() => {
    // Add speaking animation logic here
    if (group.current) {
      // Update model based on speaking state
    }
  }, [isSpeaking]);

  return (
    <group ref={group} dispose={null} position={position} scale={scale}>
      <primitive object={nodes.Scene} />
    </group>
  );
};

useGLTF.preload('/models/assistant.glb');
