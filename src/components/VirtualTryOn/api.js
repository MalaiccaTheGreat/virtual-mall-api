import axios from 'axios';

const SIZESTREAM_API_URL = 'https://api.sizestream.com/v1/scan';
const API_KEY = process.env.REACT_APP_SIZESTREAM_API_KEY;

/**
 * Convert data URI to Blob
 * @param {string} dataURI - The data URI to convert
 * @returns {Blob} - The converted Blob
 */
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

/**
 * Process images through SizeStream API
 * @param {string} frontImage - Data URL of the front image
 * @param {string} sideImage - Data URL of the side image
 * @returns {Promise<Object>} - Response data with model URL and measurements
 */
export const processBodyScan = async (frontImage, sideImage) => {
  if (!API_KEY) {
    throw new Error('SizeStream API key is not configured');
  }

  const formData = new FormData();
  formData.append('front_image', dataURItoBlob(frontImage), 'front.jpg');
  formData.append('side_image', dataURItoBlob(sideImage), 'side.jpg');
  formData.append('api_key', API_KEY);

  try {
    const response = await axios.post(SIZESTREAM_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute timeout
    });

    if (!response.data || !response.data.model_url) {
      throw new Error('Invalid response from SizeStream API');
    }

    return {
      modelUrl: response.data.model_url,
      measurements: response.data.measurements || {},
    };
  } catch (error) {
    console.error('SizeStream API Error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to process body scan. Please try again.'
    );
  }
};

/**
 * Fetch the 3D model from a URL
 * @param {string} url - URL of the 3D model
 * @returns {Promise<Object>} - The GLTF model
 */
export const fetchModel = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error loading 3D model:', error);
    throw error;
  }
};
