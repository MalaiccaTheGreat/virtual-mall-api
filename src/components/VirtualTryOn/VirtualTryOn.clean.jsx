import React, { useState, useRef, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { processBodyScan } from './api';
import { 
  Box, 
  Button, 
  VStack, 
  Text, 
  useToast, 
  HStack, 
  SimpleGrid, 
  Spinner,
  useBreakpointValue,
  useMergeRefs
} from '@chakra-ui/react';
import { FaRedo, FaUpload, FaInfoCircle, FaCamera } from 'react-icons/fa';
import ErrorBoundary from './ErrorBoundary';
import { VirtualTryOnPropTypes, VirtualTryOnDefaultProps } from './VirtualTryOn.propTypes';
import './styles.css';

// 3D Model Viewer Component
const ModelViewer = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const { camera } = useThree();
  const modelRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up model materials and lighting
    scene.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Improve material quality
        if (child.material) {
          child.material.roughness = 0.8;
          child.material.metalness = 0.2;
          child.material.envMapIntensity = 1;
        }
      }
    });
    
    // Handle model loading errors
    const handleError = (event) => {
      console.error('Error loading 3D model:', event);
      setError('Failed to load 3D model. Please try again.');
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [scene]);

  // Center and scale the model
  useFrame(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Position the model at the center
      modelRef.current.position.x = -center.x;
      modelRef.current.position.y = -center.y - (size.y * 0.1); // Slight vertical adjustment
      
      // Adjust camera position based on model size
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.z = maxDim * 2;
      camera.lookAt(0, size.y * 0.2, 0); // Look slightly above the base
    }
  });

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return <primitive ref={modelRef} object={scene} scale={1} />;
};

// Main Component
const VirtualTryOn = (props) => {
  // Merge default props with provided props
  const {
    apiKey,
    apiUrl,
    onSuccess,
    onError,
    onReset: onResetProp,
    containerProps,
    initialFrontImage,
    initialSideImage,
    strings,
  } = { ...VirtualTryOnDefaultProps, ...props };
  
  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [frontImage, setFrontImage] = useState(initialFrontImage || null);
  const [sideImage, setSideImage] = useState(initialSideImage || null);
  const [error, setError] = useState(null);
  
  // Refs
  const fileInputFront = useRef(null);
  const fileInputSide = useRef(null);
  
  // Hooks
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Memoize strings to prevent unnecessary re-renders
  const {
    title,
    subtitle,
    frontViewLabel,
    sideViewLabel,
    uploadInstructions,
    frontViewPlaceholder,
    sideViewPlaceholder,
    createButton,
    resetButton,
    startOverButton,
    tryOnButton,
    loadingText,
    errorMessages,
    measurements: measurementsTexts,
    tips: tipsTexts,
  } = strings;

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|png|webp)')) {
      setError(errorMessages.fileType);
      onError(new Error(errorMessages.fileType));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(errorMessages.fileSize);
      onError(new Error(errorMessages.fileSize));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Validate image dimensions
        if (img.width < 500 || img.height < 500) {
          setError(errorMessages.dimensions);
          onError(new Error(errorMessages.dimensions));
          return;
        }
        
        if (type === 'front') {
          setFrontImage(reader.result);
        } else {
          setSideImage(reader.result);
        }
        setError(null);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!frontImage || !sideImage) {
      const errorMessage = errorMessages.missingImages;
      setError(errorMessage);
      onError(new Error(errorMessage));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processBodyScan({
        frontImage,
        sideImage,
        apiKey,
        apiUrl
      });
      
      setModelUrl(result.model_url);
      setMeasurements(result.measurements);
      
      // Call success callback
      onSuccess({
        modelUrl: result.model_url,
        measurements: result.measurements,
        frontImage,
        sideImage
      });
      
      toast({
        title: 'Success',
        description: 'Your 3D avatar has been created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error processing images:', err);
      const errorMessage = errorMessages.modelGeneration;
      setError(errorMessage);
      onError(err);
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    const newState = {
      modelUrl: null,
      measurements: null,
      frontImage: null,
      sideImage: null,
      error: null,
      isProcessing: false,
      isModelLoading: false
    };
    
    setModelUrl(null);
    setMeasurements(null);
    setFrontImage(initialFrontImage || null);
    setSideImage(initialSideImage || null);
    setError(null);
    setIsProcessing(false);
    setIsModelLoading(false);
    
    if (fileInputFront.current) fileInputFront.current.value = '';
    if (fileInputSide.current) fileInputSide.current.value = '';
    
    // Call the onReset prop
    onResetProp();
  };

  // Effect to handle model loading state
  useEffect(() => {
    if (modelUrl) {
      setIsModelLoading(true);
      const timer = setTimeout(() => {
        setIsModelLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [modelUrl]);

  // Wrap the component in ErrorBoundary
  return (
    <ErrorBoundary 
      errorMessage={errorMessages.default}
      resetButtonText={startOverButton}
      onReset={handleReset}
    >
      <Box 
        p={{ base: 4, md: 6 }} 
        maxW="1200px" 
        mx="auto" 
        className="virtual-tryon-container"
        {...containerProps}
      >
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" className="upload-instructions">
            <Text 
              as="h1"
              fontSize={{ base: '2xl', md: '3xl' }} 
              fontWeight="bold" 
              mb={3}
              bgGradient="linear(to-r, blue.500, purple.600)"
              bgClip="text"
            >
              {title}
            </Text>
            <Text color="gray.600" maxW="600px" mx="auto" fontSize={{ base: 'md', md: 'lg' }}>
              {subtitle}
            </Text>
          </Box>
        
        {!modelUrl ? (
          // Upload View
          <VStack spacing={6} align="stretch">
            {/* Error Message */}
            {error && (
              <Box 
                p={4} 
                bg="red.50" 
                borderLeft="4px" 
                borderColor="red.500"
                rounded="md"
                role="alert"
                aria-live="assertive"
              >
                <Text color="red.700" fontWeight="medium">{error}</Text>
              </Box>
            )}

            {/* Image Upload Sections */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Front Image Upload */}
              <Box 
                className={`upload-zone ${frontImage ? 'active' : ''}`}
                onClick={() => fileInputFront.current?.click()}
                p={6}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'blue.300' }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'front')}
                  ref={fileInputFront}
                  style={{ display: 'none' }}
                  disabled={isProcessing}
                />
                {frontImage ? (
                  <Box className="upload-preview" position="relative">
                    <img 
                      src={frontImage} 
                      alt="Front view preview"
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: '0.375rem'
                      }} 
                    />
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="white"
                      p={1}
                      borderRadius="full"
                      boxShadow="md"
                    >
                      <FaCamera color="#4A5568" />
                    </Box>
                  </Box>
                ) : (
                  <VStack spacing={3}>
                    <Box
                      p={4}
                      bg="blue.50"
                      borderRadius="full"
                      display="inline-flex"
                    >
                      <FaUpload size={24} color="#3182ce" />
                    </Box>
                    <Text fontWeight="medium">{frontViewLabel}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {uploadInstructions}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {frontViewPlaceholder}
                    </Text>
                  </VStack>
                )}
              </Box>

              {/* Side Image Upload */}
              <Box 
                className={`upload-zone ${sideImage ? 'active' : ''}`}
                onClick={() => fileInputSide.current?.click()}
                p={6}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'blue.300' }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'side')}
                  ref={fileInputSide}
                  style={{ display: 'none' }}
                  disabled={isProcessing}
                />
                {sideImage ? (
                  <Box className="upload-preview" position="relative">
                    <img 
                      src={sideImage} 
                      alt="Side view preview"
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: '0.375rem'
                      }} 
                    />
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="white"
                      p={1}
                      borderRadius="full"
                      boxShadow="md"
                    >
                      <FaCamera color="#4A5568" />
                    </Box>
                  </Box>
                ) : (
                  <VStack spacing={3}>
                    <Box
                      p={4}
                      bg="blue.50"
                      borderRadius="full"
                      display="inline-flex"
                    >
                      <FaUpload size={24} color="#3182ce" />
                    </Box>
                    <Text fontWeight="medium">{sideViewLabel}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {uploadInstructions}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {sideViewPlaceholder}
                    </Text>
                  </VStack>
                )}
              </Box>
            </SimpleGrid>

            {/* Action Buttons */}
            <HStack spacing={4} justify="center" mt={6} className="action-buttons">
              <Button
            <Box 
              mt={8} 
              p={4} 
              bg="blue.50" 
              borderRadius="md"
              borderLeft="4px"
              borderColor="blue.200"
            >
              <HStack spacing={3} align="flex-start">
                <Box color="blue.500" mt={1}>
                  <FaInfoCircle size={20} />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={2} color="blue.800">
                    Tips for Best Results
                  </Text>
                  <VStack align="flex-start" spacing={2} color="blue.700">
                    <Text fontSize="sm">• Wear form-fitting clothing or a swimsuit</Text>
                    <Text fontSize="sm">• Stand straight with good posture</Text>
                    <Text fontSize="sm">• Ensure good lighting with minimal shadows</Text>
                    <Text fontSize="sm">• Keep arms slightly away from your body (front view)</Text>
                    <Text fontSize="sm">• Keep arms at your sides (side view)</Text>
                  </VStack>
                </Box>
              </HStack>
            </Box>
          </VStack>
        ) : (
          // 3D Model View
          <VStack spacing={8} align="stretch">
            {/* 3D Model Viewer */}
            <Box 
              className="model-container" 
              h={{ base: '400px', md: '600px' }}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
            >
              {isModelLoading ? (
                <Box className="loading-overlay">
                  <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <Text>Loading 3D model...</Text>
                  </VStack>
                </Box>
              ) : (
                <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <Suspense fallback={null}>
                    <ModelViewer modelUrl={modelUrl} />
                  </Suspense>
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 1.5}
                  />
                </Canvas>
              )}
            </Box>

            {/* Measurements */}
            {measurements && (
              <Box mt={8}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Your Body Measurements
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} className="measurements-grid">
                  {Object.entries(measurements).map(([key, value]) => (
                    <Box 
                      key={key} 
                      className="measurement-card"
                      p={4}
                      bg="white"
                      borderRadius="md"
                      boxShadow="sm"
                      _hover={{ boxShadow: 'md' }}
                    >
                      <Text fontSize="sm" color="gray.500" className="measurement-label">
                        {key.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" className="measurement-value">
                        {value} cm
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Action Buttons */}
            <HStack spacing={4} justify="center" mt={8} className="action-buttons">
              <Button
                onClick={handleReset}
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaRedo />}
                size="lg"
              >
                Start Over
              </Button>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={() => {
                  // TODO: Implement try on functionality
                  toast({
                    title: 'Coming Soon',
                    description: 'Virtual try-on feature will be available soon!',
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                  });
                }}
              >
                Try On Clothes
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default VirtualTryOn;
