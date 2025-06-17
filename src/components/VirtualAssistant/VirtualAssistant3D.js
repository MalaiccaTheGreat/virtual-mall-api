import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSpring, animated } from 'react-spring';

const VirtualAssistant3D = () => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const springProps = useSpring({
    scale: active ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 40 },
  });

  const Model = () => {
    const { nodes, materials } = useGLTF('/models/virtual-assistant.glb');
    return (
      <mesh
        geometry={nodes.virtual_assistant.geometry}
        material={materials.default}
        scale={0.5}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHovered(true)}
        onPointerOut={(e) => setHovered(false)}
      >
        <animated.meshScale {...springProps} />
      </mesh>
    );
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default VirtualAssistant3D;
