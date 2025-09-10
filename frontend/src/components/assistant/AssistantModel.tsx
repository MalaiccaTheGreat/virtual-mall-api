import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Expression = 'neutral' | 'happy' | 'sad' | 'thinking' | 'talking' | 'listening';

interface AssistantModelProps {
  expression: Expression;
  isSpeaking: boolean;
  position?: [number, number, number];
  scale?: number | [number, number, number];
}

// Animation targets for different expressions
const EXPRESSION_TARGETS = {
  neutral: { mouth: 0, brows: 0, eyes: 0 },
  happy: { mouth: 1, brows: 0.5, eyes: 0.3 },
  sad: { mouth: -0.5, brows: -0.5, eyes: -0.3 },
  thinking: { mouth: 0.1, brows: 0.3, eyes: 0.2 },
  talking: { mouth: 0.5, brows: 0, eyes: 0 },
  listening: { mouth: 0.1, brows: 0.2, eyes: 0.1 }
};

export function AssistantModel({ 
  expression = 'neutral', 
  isSpeaking = false,
  position = [0, 0, 0],
  scale = 1
}: AssistantModelProps) {
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  // Create geometries
  const headGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const eyeGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), []);
  const mouthGeometry = useMemo(() => new THREE.TorusGeometry(0.3, 0.1, 16, 32), []);
  
  // Animation state
  const animationState = useRef({
    mouth: 0,
    brows: 0,
    eyes: 0,
    headRotation: new THREE.Quaternion(),
    targetRotation: new THREE.Quaternion(),
    lookAtTarget: new THREE.Vector3()
  });

  // Update animation state based on expression and speaking state
  useFrame(({ clock }) => {
    if (!group.current || !headRef.current) return;

    const state = animationState.current;
    const target = EXPRESSION_TARGETS[expression];
    const delta = clock.getDelta();
    
    // Smoothly interpolate to target expression
    state.mouth = THREE.MathUtils.lerp(state.mouth, target.mouth, delta * 5);
    state.brows = THREE.MathUtils.lerp(state.brows, target.brows, delta * 5);
    state.eyes = THREE.MathUtils.lerp(state.eyes, target.eyes, delta * 5);
    
    // Update mouth scale based on speaking state
    if (mouthRef.current) {
      let mouthScale = 1 + state.mouth;
      if (isSpeaking) {
        const time = clock.getElapsedTime();
        mouthScale += Math.sin(time * 10) * 0.1; // Add speaking animation
      }
      mouthRef.current.scale.y = mouthScale;
    }
    
    // Update eye position based on expression
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeY = 0.1 + state.eyes * 0.1;
      leftEyeRef.current.position.y = eyeY;
      rightEyeRef.current.position.y = eyeY;
    }
    
    // Add subtle head movement when speaking
    if (isSpeaking && headRef.current) {
      const time = clock.getElapsedTime();
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
      headRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
    } else if (headRef.current) {
      // Reset head rotation when not speaking
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, delta * 2);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0, delta * 2);
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Head */}
      <group ref={headRef}>
        <mesh 
          geometry={headGeometry}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color="#f0e0c0" 
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        
        {/* Eyes */}
        <group position={[0, 0.1, 0.8]}>
          <mesh 
            ref={leftEyeRef}
            position={[-0.25, 0, 0]}
            geometry={eyeGeometry}
            castShadow
          >
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh 
            ref={rightEyeRef}
            position={[0.25, 0, 0]}
            geometry={eyeGeometry}
            castShadow
          >
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
        
        {/* Mouth */}
        <mesh 
          ref={mouthRef}
          position={[0, -0.3, 0.8]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 1, 1]}
          castShadow
        >
          <primitive object={mouthGeometry} attach="geometry" />
          <meshStandardMaterial color="#c06" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, 0, 1]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshStandardMaterial color="#e0b090" />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f0e0c0" />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f0e0c0" />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial 
            color="#333" 
            side={THREE.BackSide}
            roughness={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}
