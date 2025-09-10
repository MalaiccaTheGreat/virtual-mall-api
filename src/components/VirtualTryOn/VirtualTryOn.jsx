import React, { useState, useRef, Suspense, useEffect } from 'react';
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
  IconButton, 
  Tooltip, 
  SimpleGrid, 
  Spinner,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaRedo, FaUpload, FaInfoCircle, FaCamera } from 'react-icons/fa';

// API Configuration
const SIZESTREAM_API_KEY = process.env.REACT_APP_SIZESTREAM_API_KEY || 'your-sizestream-api-key';
const SIZESTREAM_API_URL = 'https://api.sizestream.com/v1/scan';

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
const VirtualTryOn = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [sideImage, setSideImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputFront = useRef(null);
  const fileInputSide = useRef(null);
  const toast = useToast();
  
  // Check for API key on component mount
  useEffect(() => {
    if (!SIZESTREAM_API_KEY || SIZESTREAM_API_KEY === 'your-sizestream-api-key') {
      console.warn('SizeStream API key is not configured. Please set REACT_APP_SIZESTREAM_API_KEY in your environment variables.');
    }
  }, []);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
      setError('Please upload a valid image file (JPEG, JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      if (type === 'front') setFrontImage(null);
      else setSideImage(null);
    };
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Validate image dimensions
        const minDimension = 500; // Minimum dimension in pixels
        if (img.width < minDimension || img.height < minDimension) {
          setError(`Image dimensions should be at least ${minDimension}x${minDimension} pixels`);
          return;
        }
        
        // Set the image
        if (type === 'front') {
          setFrontImage(e.target.result);
        } else {
          setSideImage(e.target.result);
        }
      };
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      setError('Failed to read the image file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!frontImage || !sideImage) {
      setError('Please upload both front and side images');
      return;
    }

    if (!SIZESTREAM_API_KEY || SIZESTREAM_API_KEY === 'your-sizestream-api-key') {
      setError('SizeStream API key is not configured');
      toast({
        title: 'Configuration Error',
        description: 'Please configure the SizeStream API key in your environment variables.',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Process the body scan using the API utility
      const result = await processBodyScan(frontImage, sideImage);
      
      // Set the model URL and measurements
      setModelUrl(result.modelUrl);
      setMeasurements(result.measurements);
      setActiveTab('preview');
      
      toast({
        title: 'Success',
        description: '3D model generated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error processing body scan:', err);
      setError(err.message || 'Failed to process body scan. Please try again.');
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to process body scan. Please try again.',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  const resetForm = () => {
    setFrontImage(null);
    setSideImage(null);
    setModelUrl(null);
    setMeasurements(null);
    setError(null);
    if (fileInputFront.current) fileInputFront.current.value = '';
    if (fileInputSide.current) fileInputSide.current.value = '';
  };

  // Render the upload form
  const renderUploadForm = () => (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} align="stretch">
        <HStack>
          <Text fontSize="xl" fontWeight="bold">Upload Body Photos</Text>
          <Tooltip 
            label="For best results, wear fitted clothing and stand straight with arms slightly away from your body."
            fontSize="md"
            hasArrow
            placement="right"
          >
            <Box display="inline-flex" alignItems="center" ml={2}>
              <FaInfoCircle color="gray" />
            </Box>
          </Tooltip>
        </HStack>
        <Text color="gray.600">Upload front and side photos to generate your 3D avatar</Text>
      </VStack>
      
      <HStack spacing={6} align="start">
        {/* Front Image Upload */}
        <Box flex={1} borderWidth="1px" borderRadius="lg" p={4}>
          <VStack spacing={4}>
            <Text fontWeight="medium">Front View</Text>
            <Box 
              borderWidth={2} 
              borderStyle="dashed" 
              borderRadius="md" 
              p={6} 
              textAlign="center"
              cursor="pointer"
              onClick={() => fileInputFront.current?.click()}
              _hover={{ borderColor: 'blue.400' }}
              borderColor={frontImage ? 'green.400' : 'gray.300'}
            >
              {frontImage ? (
                <Box position="relative">
                  <img 
                    src={frontImage} 
                    alt="Front view preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px',
                      borderRadius: '0.375rem'
                    }} 
                  />
                  <IconButton
                    aria-label="Change front image"
                    icon={<FaRedo />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputFront.current.value = '';
                      setFrontImage(null);
                    }}
                  />
                </Box>
              ) : (
                <VStack spacing={2}>
                  <FaUpload size={32} />
                  <Text>Click to upload front view</Text>
                  <Text fontSize="sm" color="gray.500">JPEG, JPG, PNG, or WebP (max 5MB)</Text>
                </VStack>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'front')}
                ref={fileInputFront}
                disabled={isLoading}
                style={{ display: 'none' }}
                capture="environment"
              />
            </Box>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Stand straight, arms at sides, feet shoulder-width apart
            </Text>
          </VStack>
        </Box>
        
        {/* Side Image Upload */}
        <Box flex={1} borderWidth="1px" borderRadius="lg" p={4}>
          <VStack spacing={4}>
            <Text fontWeight="medium">Side View</Text>
            <Box 
              borderWidth={2} 
              borderStyle="dashed" 
              borderRadius="md" 
              p={6} 
              textAlign="center"
              cursor="pointer"
              onClick={() => fileInputSide.current?.click()}
              _hover={{ borderColor: 'blue.400' }}
              borderColor={sideImage ? 'green.400' : 'gray.300'}
            >
              {sideImage ? (
                <Box position="relative">
                  <img 
                    src={sideImage} 
                    alt="Side view preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px',
                      borderRadius: '0.375rem'
                    }} 
                  />
                  <IconButton
                    aria-label="Change side image"
                    icon={<FaRedo />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputSide.current.value = '';
                      setSideImage(null);
                    }}
                  />
                </Box>
              ) : (
                <VStack spacing={2}>
                  <FaUpload size={32} />
                  <Text>Click to upload side view</Text>
                  <Text fontSize="sm" color="gray.500">JPEG, JPG, PNG, or WebP (max 5MB)</Text>
                </VStack>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'side')}
                ref={fileInputSide}
                disabled={isLoading}
                style={{ display: 'none' }}
                capture="environment"
              />
            </Box>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Turn 90 degrees, keep arms at sides, look straight ahead
            </Text>
          </VStack>
        </Box>
      </HStack>
      
      {error && (
        <Box 
          p={4} 
          bg="red.50" 
          borderLeftWidth={4} 
          borderLeftColor="red.500"
          borderRadius="md"
        >
          <Text color="red.700">{error}</Text>
        </Box>
      )}
      
      <Box>
        <Button 
          colorScheme="blue" 
          size="lg" 
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Generating 3D Model..."
          isDisabled={!frontImage || !sideImage || isLoading}
          width="full"
        >
          Generate 3D Model
        </Button>
      </Box>
    </VStack>
  );

  // Render the 3D model viewer
  const renderModelViewer = () => (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">Your 3D Avatar</Text>
        <Button 
          leftIcon={<FaRedo />} 
          variant="outline" 
          size="sm" 
          onClick={resetForm}
        >
          Start Over
        </Button>
      </HStack>
      
      <Box 
        h="500px" 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        position="relative"
      >
        <Canvas 
          camera={{ position: [0, 1.5, 2.5], fov: 50 }} 
          style={{ background: '#f8fafc' }}
        >
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            {modelUrl && <ModelViewer modelUrl={modelUrl} />}
          </Suspense>
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
        {isModelLoading && (
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bg="rgba(255, 255, 255, 0.8)"
          >
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading 3D model...</Text>
            </VStack>
          </Box>
        )}
      </Box>
      
      {measurements && (
        <Box 
          borderWidth="1px" 
          borderRadius="lg" 
          p={4}
          bg="white"
          boxShadow="sm"
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>Your Body Measurements</Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {Object.entries(measurements).map(([key, value]) => (
              <Box 
                key={key} 
                p={3} 
                bg="gray.50" 
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="blue.500"
              >
                <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                  {key.replace(/_/g, ' ')}
                </Text>
                <Text fontWeight="bold">{value} cm</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );

  // Handle model loading state
  useEffect(() => {
    if (modelUrl) {
      setIsModelLoading(true);
      // Simulate model loading delay
      const timer = setTimeout(() => {
        setIsModelLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [modelUrl]);

  // Get responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [sideImage, setSideImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputFront = useRef(null);
  const fileInputSide = useRef(null);

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        // Validate image dimensions
        if (img.width < 500 || img.height < 500) {
          setError('Image dimensions should be at least 500x500 pixels');
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
      setError('Please upload both front and side photos');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processBodyScan({
        frontImage,
        sideImage,
        apiKey: process.env.REACT_APP_SIZESTREAM_API_KEY
      });
      
      setModelUrl(result.model_url);
      setMeasurements(result.measurements);
      
      toast({
        title: '3D Model Generated',
        description: 'Your 3D avatar has been created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error processing images:', err);
      setError('Failed to generate 3D model. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to generate 3D model. Please try again.',
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
    setModelUrl(null);
    setMeasurements(null);
    setFrontImage(null);
    setSideImage(null);
    setError(null);
    if (fileInputFront.current) fileInputFront.current.value = '';
    if (fileInputSide.current) fileInputSide.current.value = '';
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

  // Main render
  return (
    <Box p={{ base: 4, md: 6 }} maxW="1200px" mx="auto" className="virtual-tryon-container">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" className="upload-instructions">
          <Text 
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }} 
            fontWeight="bold" 
            mb={3}
            bgGradient="linear(to-r, blue.500, purple.600)"
            bgClip="text"
          >
            Virtual Fitting Room
          </Text>
          <Text color="gray.600" maxW="600px" mx="auto" fontSize={{ base: 'md', md: 'lg' }}>
            Upload front and side photos to create your personalized 3D avatar and try on clothes virtually
          </Text>
        </Box>
        
        {!modelUrl ? (
          <>
            <VStack spacing={6} align="stretch">
              {/* Error Message */}
              {error && (
                <Box 
                  p={4} 
                  bg="red.50" 
                  borderLeft="4px" 
                  borderColor="red.500"
                  rounded="md"
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
                      <Text fontWeight="medium">Front View</Text>
                      <Text fontSize="sm" color="gray.500">
                        Click to upload a front view photo
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Recommended: Full body, arms slightly away from body
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
                      <Text fontWeight="medium">Side View</Text>
                      <Text fontSize="sm" color="gray.500">
                        Click to upload a side view photo
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Recommended: Full body, arms at sides
                      </Text>
                    </VStack>
                  )}
                </Box>
              </SimpleGrid>

              {/* Action Buttons */}
              <HStack spacing={4} justify="center" mt={6} className="action-buttons">
                <Button
                  onClick={handleSubmit}
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<FaCamera />}
                  isLoading={isProcessing}
                  loadingText="Processing..."
                  isDisabled={!frontImage || !sideImage || isProcessing}
                >
                  Create 3D Avatar
                </Button>
                
                {(frontImage || sideImage) && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    isDisabled={isProcessing}
                  >
                    Clear All
                  </Button>
                )}
              </HStack>

              {/* Help Text */}
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
          </>
        ) : (
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
        ) : (
          <VStack spacing={8} align="stretch">
            {/* Image Upload */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Upload Your Photos
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
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
                          borderRadius: '0.375rem',
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
                      <Text fontWeight="medium">Front View</Text>
                      <Text fontSize="sm" color="gray.500">
                        Click to upload a front view photo
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Recommended: Full body, arms at sides
                      </Text>
                    </VStack>
                  )}
                </Box>
                <Box>
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
                          borderRadius: '0.375rem',
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
                      <Text fontWeight="medium">Side View</Text>
                      <Text fontSize="sm" color="gray.500">
                        Click to upload a side view photo
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Recommended: Full body, arms at sides
                      </Text>
                    </VStack>
                  )}
                </Box>
              </SimpleGrid>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={4} justify="center" mt={8} className="action-buttons">
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Processing..."
                disabled={!frontImage || !sideImage || isLoading}
              >
                Generate 3D Model
              </Button>
              
              {error && (
                <Text color="red.500" mt={2}>
                  {error}
                </Text>
              )}
            </VStack>
          </>
        ) : (
          <VStack spacing={4} align="stretch">
            <Box h="500px" borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Suspense fallback={null}>
                  <ModelViewer modelUrl={modelUrl} />
                </Suspense>
                <OrbitControls />
              </Canvas>
            </Box>
            
            {measurements && (
              <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontSize="lg" fontWeight="bold" mb={2}>Body Measurements</Text>
                <VStack align="start" spacing={2}>
                  {Object.entries(measurements).map(([key, value]) => (
                    <Box key={key} display="flex" justifyContent="space-between" width="100%">
                      <Text textTransform="capitalize">{key.replace(/_/g, ' ')}:</Text>
                      <Text fontWeight="bold">{value} cm</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
            
            <Button mt={4} onClick={resetForm} colorScheme="blue" variant="outline">
              Start Over
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default VirtualTryOn;
