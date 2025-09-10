import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { Box, Button, VStack, HStack, Text as ChakraText, useToast, Spinner } from '@chakra-ui/react';
import { FaPlay, FaStop, FaInfoCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

// 3D Model Component for Sunglasses
function Sunglasses({ modelUrl, position, rotation, scale }) {
  const { scene } = useGLTF(modelUrl);
  return (
    <primitive 
      object={scene} 
      position={position || [0, 0, -0.5]}
      rotation={rotation || [0, 0, 0]}
      scale={scale || [0.1, 0.1, 0.1]}
    />
  );
}

// Main AR Experience Component
function ARExperience({ modelUrl, onError }) {
  const [facePosition, setFacePosition] = useState([0, 0, -0.5]);
  const [faceRotation, setFaceRotation] = useState([0, 0, 0]);
  
  // This would be replaced with actual face tracking in a real implementation
  useFrame(({ clock }) => {
    // Simulate slight movement for demo purposes
    const time = clock.getElapsedTime();
    setFacePosition([
      Math.sin(time * 0.5) * 0.1,
      Math.cos(time * 0.5) * 0.1,
      -0.5
    ]);
  });

  return (
    <XR>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sunglasses 
        modelUrl={modelUrl} 
        position={facePosition}
        rotation={faceRotation}
      />
    </XR>
  );
}

// Main Component
const WebARTryOn = ({ modelUrl, onError, ...rest }) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  // Check for WebXR support
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
          if (!supported) {
            toast({
              title: 'AR Not Supported',
              description: 'Your device or browser does not support WebXR AR.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
            onError?.(new Error('WebXR AR not supported'));
          }
        } else {
          setIsARSupported(false);
          toast({
            title: 'WebXR Not Available',
            description: 'Your browser does not support WebXR.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          onError?.(new Error('WebXR not available'));
        }
      } catch (error) {
        console.error('Error checking AR support:', error);
        setIsARSupported(false);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkARSupport();
  }, [onError, toast]);

  const handleStartSession = () => {
    setIsSessionStarted(true);
  };

  const handleStopSession = () => {
    setIsSessionStarted(false);
  };

  if (isLoading) {
    return (
      <Box 
        w="100%" 
        h="500px" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.100"
        borderRadius="md"
        {...rest}
      >
        <VStack spacing={4}>
          <Spinner size="xl" />
          <ChakraText>Checking AR capabilities...</ChakraText>
        </VStack>
      </Box>
    );
  }

  if (!isARSupported) {
    return (
      <Box 
        w="100%" 
        h="500px" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.100"
        borderRadius="md"
        p={4}
        textAlign="center"
        {...rest}
      >
        <VStack spacing={4}>
          <FaInfoCircle size={48} color="#4A5568" />
          <ChakraText fontSize="lg" fontWeight="bold">
            AR Not Supported
          </ChakraText>
          <ChakraText>
            Your device or browser does not support WebXR AR. Please try using a different device or browser.
          </ChakraText>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" h="500px" position="relative" {...rest}>
      {!isSessionStarted ? (
        <Box
          w="100%"
          h="100%"
          bg="gray.100"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          p={4}
          textAlign="center"
        >
          <VStack spacing={6}>
            <VStack spacing={2}>
              <ChakraText fontSize="xl" fontWeight="bold">
                Try On in AR
              </ChakraText>
              <ChakraText color="gray.600">
                See how these sunglasses look on you using augmented reality
              </ChakraText>
            </VStack>
            
            <Button
              leftIcon={<FaPlay />}
              colorScheme="blue"
              size="lg"
              onClick={handleStartSession}
            >
              Start AR Experience
            </Button>
            
            <Box 
              bg="blue.50" 
              p={3} 
              borderRadius="md" 
              textAlign="left"
              w="100%"
              maxW="400px"
            >
              <HStack spacing={2} mb={2}>
                <FaInfoCircle color="#3182ce" />
                <ChakraText fontSize="sm" fontWeight="medium">
                  Tips for best results:
                </ChakraText>
              </HStack>
              <ChakraText fontSize="sm" color="gray.700">
                • Find a well-lit area<br />
                • Hold your device steady<br />
                • Keep your face in frame<br />
                • Move your head slowly
              </ChakraText>
            </Box>
          </VStack>
        </Box>
      ) : (
        <>
          <Canvas
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            camera={{ position: [0, 0, 0], fov: 50 }}
          >
            <ARButton
              sessionInit={{
                requiredFeatures: ['hit-test'],
                optionalFeatures: ['dom-overlay'],
                domOverlay: { root: document.body },
              }}
            />
            <ARExperience modelUrl={modelUrl} onError={onError} />
          </Canvas>
          
          <Button
            position="absolute"
            bottom="20px"
            left="50%"
            transform="translateX(-50%)"
            leftIcon={<FaStop />}
            colorScheme="red"
            onClick={handleStopSession}
            zIndex={10}
          >
            Exit AR
          </Button>
        </>
      )}
    </Box>
  );
};

// Prop Types
WebARTryOn.propTypes = {
  /** URL to the 3D model of the sunglasses (GLB format) */
  modelUrl: PropTypes.string.isRequired,
  
  /** Callback when an error occurs */
  onError: PropTypes.func,
  
  /** Additional styles */
  style: PropTypes.object,
};

// Default Props
WebARTryOn.defaultProps = {
  onError: (error) => console.error('WebAR Error:', error),
  style: {},
};

export default WebARTryOn;
