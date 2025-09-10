import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense } from 'react';
import * as THREE from 'three';
import { MediaPipePose } from '../../utils/MediaPipePose';
import { processPoseLandmarks } from '../../utils/poseUtils';
import { GarmentModel } from './GarmentModel';

export interface ARVirtualTryOnProps {
  onError?: (error: Error) => void;
  garmentModelUrl: string;
  onClose?: () => void;
}

export const ARVirtualTryOn: React.FC<ARVirtualTryOnProps> = ({ 
  onError, 
  garmentModelUrl,
  onClose
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [pose, setPose] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facing, setFacing] = useState(CameraType.front);
  const [error, setError] = useState<string | null>(null);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (err) {
        const error = err as Error;
        setError(`Camera permission error: ${error.message}`);
        onError?.(error);
      }
    })();
  }, []);

  // Initialize MediaPipe
  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        await MediaPipePose.initialize();
        setIsReady(true);
      } catch (error) {
        const err = error as Error;
        setError(`Failed to initialize AR: ${err.message}`);
        onError?.(err);
      }
    };

    if (hasPermission) {
      initMediaPipe();
    }

    return () => {
      MediaPipePose.cleanup();
    };
  }, [hasPermission, onError]);

  // Process camera frames
  const processFrame = async () => {
    if (!cameraRef.current || isProcessing || !isReady) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
        exif: false,
      });

      if (photo.base64) {
        const landmarks = await MediaPipePose.detectPose(photo.base64);
        if (landmarks) {
          setPose(processPoseLandmarks(landmarks));
        }
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error processing frame:', err);
      setError(`Error processing frame: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process frames at 15fps
  useEffect(() => {
    if (!isReady) return;

    const frameInterval = setInterval(() => {
      processFrame();
    }, 1000 / 15); // 15 FPS

    return () => clearInterval(frameInterval);
  }, [isReady, isProcessing]);

  const toggleCameraFacing = () => {
    setFacing(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={facing}
        onCameraReady={() => setIsReady(true)}
      >
        <GLView style={styles.canvasContainer}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <GarmentModel 
                modelUrl={garmentModelUrl}
                pose={pose}
                scale={0.5}
              />
            </Suspense>
          </Canvas>
        </GLView>
      </Camera>
      
      <View style={styles.controls}>
        <View style={styles.buttonContainer}>
          <Button title="Flip Camera" onPress={toggleCameraFacing} />
          {onClose && <Button title="Close" onPress={onClose} />}
        </View>
        <Text style={styles.instruction}>
          Position yourself in the frame to try on the garment
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ARVirtualTryOn;
