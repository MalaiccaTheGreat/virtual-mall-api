import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei/native';
import { Group, Vector3 } from 'three';
import { ProcessedPose } from '../../utils/poseUtils';

interface GarmentModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelUrl: string;
  pose?: ProcessedPose | null;
}

export const GarmentModel: React.FC<GarmentModelProps> = ({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelUrl,
  pose,
}) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);
  
  // Update position and rotation based on pose data
  useEffect(() => {
    if (!pose || !groupRef.current) return;

    try {
      // Apply position from pose data
      groupRef.current.position.set(
        pose.position[0] * 2 - 1, // Convert to NDC [-1, 1]
        -pose.position[1] * 2 + 1, // Invert Y axis
        -2 // Fixed depth for now
      );

      // Apply rotation from pose data
      groupRef.current.rotation.set(
        rotation[0] + (pose.rotation[0] || 0),
        rotation[1] + (pose.rotation[1] || 0),
        rotation[2] + (pose.rotation[2] || 0)
      );

      // Apply scale from pose data
      const baseShoulderWidth = 0.6; // Base width in 3D units
      const scaleFactor = pose.scale / baseShoulderWidth;
      groupRef.current.scale.set(scale, scale, scale).multiplyScalar(scaleFactor);
    } catch (error) {
      console.error('Error updating garment position:', error);
    }
  }, [pose, position, rotation, scale]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
};

// Preload the GLTF model
useGLTF.preload('/models/tshirt.glb');
