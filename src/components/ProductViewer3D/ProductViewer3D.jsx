import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { Box, Button, VStack, HStack, useDisclosure } from '@chakra-ui/react';
import { FaRedo, FaTshirt, FaPalette } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { ProductViewer3DDefaultProps, ProductViewer3DPropTypes } from './ProductViewer3D.propTypes';

// Ground plane for physics
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
  }));
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
}

// Garment component with physics
function Garment({ url, position, rotation, scale, color, isSimulating }) {
  const { scene } = useGLTF(url);
  
  // Clone the scene to avoid sharing materials between instances
  const model = useRef();
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    rotation,
    args: [1, 1, 1],
    type: isSimulating ? 'Dynamic' : 'Static',
  }));

  // Apply color to all materials in the model
  useEffect(() => {
    if (model.current) {
      model.current.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ 
            color,
            roughness: 0.7,
            metalness: 0.3,
          });
        }
      });
    }
  }, [color, isSimulating]);

  return (
    <primitive 
      ref={(node) => {
        ref(node);
        model.current = node;
      }} 
      object={scene} 
      scale={scale}
    />
  );
}

// Avatar component
function Avatar({ url, position, scale }) {
  const { scene } = useGLTF(url);
  
  return (
    <primitive 
      object={scene} 
      position={position}
      scale={scale}
    />
  );
}

// Main 3D scene component
function Scene({ 
  garmentUrl, 
  avatarUrl, 
  isSimulating, 
  garmentColor,
  onSimulationStart,
  onChangeColor,
  onReset
}) {
  const controls = useRef();
  const { camera } = useThree();
  
  // Set up initial camera position
  useEffect(() => {
    camera.position.set(0, 1.5, 3);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
        
        {/* Garment */}
        <Garment 
          url={garmentUrl}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
          color={garmentColor}
          isSimulating={isSimulating}
        />
        
        {/* Avatar - only visible when not simulating */}
        {!isSimulating && (
          <Avatar 
            url={avatarUrl}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
          />
        )}
      </Physics>
      
      <OrbitControls 
        ref={controls}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      <Environment preset="city" />
    </>
  );
}

// Main component
const ProductViewer3D = (props) => {
  const {
    garmentUrl,
    avatarUrl,
    colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
    onLoaded,
    onError,
    ...rest
  } = { ...ProductViewer3DDefaultProps, ...props };
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleTryOn = () => {
    setIsSimulating(true);
  };
  
  const handleReset = () => {
    setIsSimulating(false);
    // Reset camera position if needed
  };
  
  const handleChangeColor = () => {
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setCurrentColor(colors[nextIndex]);
  };
  
  return (
    <Box 
      position="relative" 
      w="100%" 
      h="600px"
      borderRadius="lg"
      overflow="hidden"
      bg="gray.100"
      {...rest}
    >
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene 
            garmentUrl={garmentUrl}
            avatarUrl={avatarUrl}
            isSimulating={isSimulating}
            garmentColor={currentColor}
            onSimulationStart={handleTryOn}
            onChangeColor={handleChangeColor}
            onReset={handleReset}
          />
        </Suspense>
      </Canvas>
      
      {/* Controls Overlay */}
      <Box position="absolute" bottom={4} left={0} right={0} zIndex={10}>
        <HStack spacing={4} justify="center">
          <Button 
            leftIcon={<FaTshirt />} 
            colorScheme="blue"
            onClick={handleTryOn}
            isDisabled={isSimulating}
          >
            Try It On
          </Button>
          
          <Button 
            leftIcon={<FaPalette />} 
            colorScheme="purple"
            variant="outline"
            onClick={handleChangeColor}
          >
            Change Color
          </Button>
          
          <Button 
            leftIcon={<FaRedo />} 
            colorScheme="gray"
            variant="ghost"
            onClick={handleReset}
          >
            Reset
          </Button>
        </HStack>
      </Box>
      
      {/* Loading Overlay */}
      {isLoading && (
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          bg="rgba(0,0,0,0.5)" 
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={5}
        >
          <Box textAlign="center" color="white">
            <Spinner size="xl" mb={4} />
            <Text>Loading 3D models...</Text>
          </Box>
        </Box>
      )}
      
      {/* Error Overlay */}
      {error && (
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          bg="rgba(255,0,0,0.2)" 
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={5}
          p={4}
        >
          <Box bg="white" p={4} borderRadius="md" maxW="400px">
            <Text color="red.500" fontWeight="bold" mb={2}>Error Loading 3D Model</Text>
            <Text mb={4}>{error.message || 'Failed to load 3D model. Please try again.'}</Text>
            <Button colorScheme="red" onClick={() => window.location.reload()}>Retry</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

ProductViewer3D.propTypes = ProductViewer3DPropTypes;
ProductViewer3D.defaultProps = ProductViewer3DDefaultProps;

export default ProductViewer3D;
