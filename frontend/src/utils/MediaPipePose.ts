import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

class MediaPipePoseDetector {
  private static instance: MediaPipePoseDetector;
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitialized = false;

  static getInstance(): MediaPipePoseDetector {
    if (!MediaPipePoseDetector.instance) {
      MediaPipePoseDetector.instance = new MediaPipePoseDetector();
    }
    return MediaPipePoseDetector.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );
      
      this.poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numPoses: 1
        }
      );
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize MediaPipe Pose:', error);
      throw error;
    }
  }

  async detectPose(imageData: string): Promise<any> {
    if (!this.poseLandmarker || !this.isInitialized) {
      throw new Error('Pose detector not initialized');
    }

    try {
      const result = this.poseLandmarker.detectForVideo(
        { data: new Uint8Array(Buffer.from(imageData, 'base64')), width: 0, height: 0 },
        performance.now()
      );
      return result.landmarks[0]; // Return first detected pose
    } catch (error) {
      console.error('Error detecting pose:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    this.isInitialized = false;
  }
}

export const MediaPipePose = MediaPipePoseDetector.getInstance();
