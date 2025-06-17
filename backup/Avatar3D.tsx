import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  expression: 'neutral' | 'happy' | 'thinking' | 'speaking';
  isSpeaking: boolean;
  blendShapes?: Record<string, number>;
}

const Avatar: React.FC<AvatarProps> = ({
  expression,
  isSpeaking,
  blendShapes,
}) => {
  const group = useRef<THREE.Group>();
  // Update this path to match your avatar file name
  const { scene, animations } = useGLTF('/models/avatar.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Initialize animations if available
    if (actions) {
      // Map your avatar's animation names here
      const currentAction = isSpeaking ? actions['speaking'] : actions['idle'];
      if (currentAction) {
        Object.values(actions).forEach((action) => action?.stop());
        currentAction.play();
      }
    }

    // Apply morphTargets if your model has them
    if (scene.traverse) {
      scene.traverse((object: any) => {
        if (object.morphTargetDictionary && object.morphTargetInfluences) {
          // Map expressions to your model's morph targets
          switch (expression) {
            case 'happy':
              object.morphTargetInfluences[
                object.morphTargetDictionary['smile']
              ] = 1;
              break;
            case 'thinking':
              object.morphTargetInfluences[
                object.morphTargetDictionary['browRaise']
              ] = 1;
              break;
            case 'speaking':
              object.morphTargetInfluences[
                object.morphTargetDictionary['mouthOpen']
              ] = Math.sin(Date.now() * 0.01) * 0.5 + 0.5; // Animate mouth
              break;
            default:
              // Reset morphTargets
              object.morphTargetInfluences.fill(0);
          }
        }
      });
    }
  }, [expression, isSpeaking, scene, actions]);

  useFrame((state) => {
    if (group.current) {
      // Subtle floating animation
      group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;

      // Subtle head tracking towards camera
      const headBone = group.current.getObjectByName('Head');
      if (headBone) {
        const cameraPosition = new THREE.Vector3();
        state.camera.getWorldPosition(cameraPosition);
        headBone.lookAt(cameraPosition);
        // Limit head rotation
        headBone.rotation.x = THREE.MathUtils.clamp(
          headBone.rotation.x,
          -0.5,
          0.5
        );
        headBone.rotation.y = THREE.MathUtils.clamp(
          headBone.rotation.y,
          -0.5,
          0.5
        );
      }
    }
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={1.5}
        position={[0, -1.5, 0]}
        rotation={[0, Math.PI, 0]} // Make avatar face the camera
      />
    </group>
  );
};

const AvatarScene: React.FC<AvatarProps> = (props) => {
  return (
    <div className="virtual-assistant-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Avatar {...props} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default AvatarScene;
