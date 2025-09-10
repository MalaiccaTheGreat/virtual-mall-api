import { Vector3 } from 'three';

export interface ProcessedPose {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export const processPoseLandmarks = (landmarks: any[] | undefined): ProcessedPose | null => {
  if (!landmarks || landmarks.length === 0) return null;

  // Extract key points for garment positioning
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const nose = landmarks[0];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !nose) {
    return null;
  }

  // Calculate torso orientation
  const shoulderCenter = new Vector3(
    (leftShoulder.x + rightShoulder.x) / 2,
    (leftShoulder.y + rightShoulder.y) / 2,
    (leftShoulder.z + rightShoulder.z) / 2
  );

  const hipCenter = new Vector3(
    (leftHip.x + rightHip.x) / 2,
    (leftHip.y + rightHip.y) / 2,
    (leftHip.z + rightHip.z) / 2
  );

  // Calculate forward vector (from shoulders to nose)
  const forward = new Vector3(
    nose.x - shoulderCenter.x,
    nose.y - shoulderCenter.y,
    nose.z - shoulderCenter.z
  ).normalize();

  // Calculate up vector (perpendicular to shoulder line)
  const shoulderDirection = new Vector3(
    rightShoulder.x - leftShoulder.x,
    rightShoulder.y - leftShoulder.y,
    rightShoulder.z - leftShoulder.z
  ).normalize();

  const up = new Vector3(0, 1, 0);
  const right = new Vector3().crossVectors(shoulderDirection, up).normalize();
  const correctedUp = new Vector3().crossVectors(right, shoulderDirection).normalize();

  // Calculate scale based on shoulder width
  const shoulderWidth = new Vector3().subVectors(
    new Vector3(rightShoulder.x, rightShoulder.y, rightShoulder.z),
    new Vector3(leftShoulder.x, leftShoulder.y, leftShoulder.z)
  ).length();

  return {
    position: [shoulderCenter.x, shoulderCenter.y, shoulderCenter.z],
    rotation: [
      Math.atan2(shoulderDirection.y, shoulderDirection.x),
      Math.atan2(forward.y, forward.x),
      Math.atan2(correctedUp.z, correctedUp.y)
    ],
    scale: shoulderWidth
  };
};
