import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Types
type FaceLandmarkerResult = {
  faceLandmarks: Array<{ x: number; y: number; z: number }>;
};

type FaceMeshProps = {
  onFaceDetected: (landmarks: any) => void;
};

// Face Mesh Component
const FaceMesh = ({ onFaceDetected }: FaceMeshProps) => {
  const { camera } = useThree();
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFaceTracking = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        );

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            outputFaceBlendshapes: true,
            outputFacialTransformationMatrixes: true,
            numFaces: 1
          }
        );

        // Set up video stream
        const video = document.createElement('video');
        videoRef.current = video;

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
          audio: false
        });

        video.srcObject = stream;
        await video.play();
        setIsReady(true);
        
        // Start detection loop
        detectFace();
      } catch (err) {
        console.error('Error initializing face tracking:', err);
        setError('Failed to initialize camera and face tracking. Please ensure you have granted camera permissions.');
      }
    };

    initializeFaceTracking();

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      faceLandmarkerRef.current?.close();
    };
  }, []);

  const detectFace = async () => {
    if (!faceLandmarkerRef.current || !videoRef.current || !isReady) {
      requestAnimationFrame(detectFace);
      return;
    }

    try {
      const results = await faceLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      );

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        onFaceDetected(results.faceLandmarks[0]);
      }
    } catch (err) {
      console.error('Error detecting face:', err);
    }

    requestAnimationFrame(detectFace);
  };

  if (error) {
    return <Text color="red" position={[0, 0, -2]}>{error}</Text>;
  }

  if (!isReady) {
    return <Text color="white" position={[0, 0, -2]}>Initializing camera...</Text>;
  }

  return null;
};

// Sunglasses Component
const Sunglasses = ({ landmarks }: { landmarks: any }) => {
  const glassesRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!glassesRef.current || !landmarks) return;
    
    // Get the positions of the eyes
    const leftEye = new THREE.Vector3(
      landmarks[33].x * 2 - 1,
      -landmarks[33].y * 2 + 1,
      -landmarks[33].z * 2
    );
    
    const rightEye = new THREE.Vector3(
      landmarks[263].x * 2 - 1,
      -landmarks[263].y * 2 + 1,
      -landmarks[263].z * 2
    );
    
    // Calculate center point between eyes
    const center = new THREE.Vector3().addVectors(leftEye, rightEye).multiplyScalar(0.5);
    
    // Position the sunglasses
    glassesRef.current.position.copy(center);
    
    // Calculate rotation to align with face
    const direction = new THREE.Vector3().subVectors(rightEye, leftEye).normalize();
    const target = new THREE.Vector3(0, 0, -1);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(target, direction);
    glassesRef.current.quaternion.copy(quaternion);
  });
  
  return (
    <group ref={glassesRef}>
      <mesh>
        <boxGeometry args={[0.5, 0.1, 0.05]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.3, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
};

// Main AR Try-On Component
export const ARTryOn = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [landmarks, setLandmarks] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for WebXR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsSupported(supported);
        if (!supported) {
          setError('WebXR AR is not supported on this device or browser.');
        }
      }).catch((err) => {
        console.error('Error checking WebXR support:', err);
        setError('Error checking WebXR support. Please try a different browser.');
        setIsSupported(false);
      });
    } else {
      setError('WebXR is not available in this browser. Please try a different browser like Chrome or Edge.');
      setIsSupported(false);
    }
  }, []);

  const toggleARSession = () => {
    setIsSessionStarted(!isSessionStarted);
  };

  if (isSupported === null) {
    return <div>Checking AR support...</div>;
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        {error || 'WebXR AR is not supported on this device or browser.'}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] bg-black rounded-lg overflow-hidden">
      {isSessionStarted ? (
        <>
          <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
            <XR>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <FaceMesh onFaceDetected={setLandmarks} />
                {landmarks && <Sunglasses landmarks={landmarks} />}
              </Suspense>
            </XR>
          </Canvas>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={toggleARSession}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Exit AR
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-white text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Try On Sunglasses in AR</h2>
          <p className="mb-8 max-w-md">
            Experience how these sunglasses will look on you using augmented reality.
            Your camera feed will be used to track your face and place the sunglasses.
          </p>
          <button
            onClick={toggleARSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors"
          >
            Start AR Experience
          </button>
          <p className="mt-4 text-sm text-gray-300">
            You'll need to allow camera access to use this feature.
          </p>
        </div>
      )}
    </div>
  );
};

export default ARTryOn;
