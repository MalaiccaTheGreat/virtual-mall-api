import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

type Expression = 'neutral' | 'happy' | 'sad' | 'thinking' | 'talking' | 'listening';

interface AssistantModelProps {
  expression: Expression;
  isSpeaking: boolean;
  scale?: number | [number, number, number];
  position?: [number, number, number];
}

// Expression morph targets configuration
const EXPRESSIONS: Record<Expression, Record<string, number>> = {
  neutral: { mouthSmile: 0, mouthOpen: 0, browDown: 0, browUp: 0 },
  happy: { mouthSmile: 1, mouthOpen: 0.2, browUp: 0.5, browDown: 0 },
  sad: { mouthSmile: -0.5, mouthOpen: 0.1, browDown: 1, browUp: 0 },
  thinking: { mouthSmile: 0, mouthOpen: 0.1, browDown: 0.7, browUp: 0.3 },
  talking: { mouthSmile: 0.2, mouthOpen: 0.5, browDown: 0, browUp: 0.2 },
  listening: { mouthSmile: 0, mouthOpen: 0.1, browDown: 0.2, browUp: 0.8 }
};

export const AssistantModel: React.FC<AssistantModelProps> = ({
  expression,
  isSpeaking,
  scale = 1,
  position = [0, 0, 0]
}) => {
  const group = useRef<THREE.Group>(null);
  const lastMouthOpen = useRef(0);
  const targetMorphs = useRef(EXPRESSIONS[expression]);
  const currentMorphs = useRef({ ...EXPRESSIONS.neutral });
  
  // Load the 3D model
  const { scene, nodes } = useGLTF('/models/assistant.glb');
  
  // Set up morph targets
  useEffect(() => {
    if (nodes.Head?.morphTargetDictionary) {
      // Initialize morph targets
      Object.keys(EXPRESSIONS.neutral).forEach(key => {
        if (nodes.Head.morphTargetDictionary[key] !== undefined) {
          nodes.Head.morphTargetInfluences![nodes.Head.morphTargetDictionary[key]] = 0;
        }
      });
    }
  }, [nodes]);
  
  // Update target morphs when expression changes
  useEffect(() => {
    targetMorphs.current = { ...EXPRESSIONS[expression] };
  }, [expression]);
  
  // Animation loop
  useFrame(() => {
    if (!nodes.Head?.morphTargetInfluences) return;
    
    // Smoothly interpolate morph targets
    Object.entries(targetMorphs.current).forEach(([key, targetValue]) => {
      if (nodes.Head.morphTargetDictionary?.[key] !== undefined) {
        const index = nodes.Head.morphTargetDictionary[key];
        currentMorphs.current[key] = THREE.MathUtils.lerp(
          currentMorphs.current[key] || 0,
          targetValue,
          0.1
        );
        nodes.Head.morphTargetInfluences[index] = currentMorphs.current[key];
      }
    });
    
    // Add subtle head movement when speaking
    if (isSpeaking && group.current) {
      group.current.rotation.y = Math.sin(Date.now() * 0.002) * 0.1;
      group.current.rotation.x = Math.sin(Date.now() * 0.0015) * 0.05;
      
      // Animate mouth for speaking
      const mouthOpen = Math.sin(Date.now() * 0.02) * 0.1 + 0.1;
      const mouthSmile = Math.sin(Date.now() * 0.01) * 0.1;
      
      if (nodes.Head.morphTargetDictionary?.mouthOpen !== undefined) {
        const index = nodes.Head.morphTargetDictionary.mouthOpen;
        nodes.Head.morphTargetInfluences[index] = 
          Math.max(mouthOpen, nodes.Head.morphTargetInfluences[index] || 0);
      }
      
      if (nodes.Head.morphTargetDictionary?.mouthSmile !== undefined) {
        const index = nodes.Head.morphTargetDictionary.mouthSmile;
        nodes.Head.morphTargetInfluences[index] = 
          Math.max(mouthSmile, nodes.Head.morphTargetInfluences[index] || 0);
      }
      
      lastMouthOpen.current = mouthOpen;
    } else if (group.current) {
      // Reset head rotation when not speaking
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1);
    }
  });
  
  return (
    <group ref={group} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/assistant.glb');
