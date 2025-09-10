import PropTypes from 'prop-types';

export const VirtualTryOnPropTypes = {
  // API Configuration
  apiKey: PropTypes.string,
  apiUrl: PropTypes.string,
  
  // Callbacks
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  
  // Styling
  containerProps: PropTypes.object,
  
  // Initial State
  initialFrontImage: PropTypes.string,
  initialSideImage: PropTypes.string,
  
  // Localization
  strings: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    frontViewLabel: PropTypes.string,
    sideViewLabel: PropTypes.string,
    uploadInstructions: PropTypes.string,
    frontViewPlaceholder: PropTypes.string,
    sideViewPlaceholder: PropTypes.string,
    createButton: PropTypes.string,
    resetButton: PropTypes.string,
    startOverButton: PropTypes.string,
    tryOnButton: PropTypes.string,
    loadingText: PropTypes.string,
    errorMessages: PropTypes.shape({
      fileType: PropTypes.string,
      fileSize: PropTypes.string,
      dimensions: PropTypes.string,
      missingImages: PropTypes.string,
      modelGeneration: PropTypes.string,
      default: PropTypes.string,
    }),
    measurements: PropTypes.shape({
      title: PropTypes.string,
      unit: PropTypes.string,
    }),
    tips: PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

export const VirtualTryOnDefaultProps = {
  apiKey: process.env.REACT_APP_SIZESTREAM_API_KEY || '',
  apiUrl: 'https://api.sizestream.com/v1/scan',
  onSuccess: () => {},
  onError: (error) => console.error('VirtualTryOn Error:', error),
  onReset: () => {},
  containerProps: {},
  strings: {
    title: 'Virtual Fitting Room',
    subtitle: 'Upload front and side photos to create your personalized 3D avatar and try on clothes virtually',
    frontViewLabel: 'Front View',
    sideViewLabel: 'Side View',
    uploadInstructions: 'Click to upload a photo',
    frontViewPlaceholder: 'Full body, arms slightly away from body',
    sideViewPlaceholder: 'Full body, arms at sides',
    createButton: 'Create 3D Avatar',
    resetButton: 'Clear All',
    startOverButton: 'Start Over',
    tryOnButton: 'Try On Clothes',
    loadingText: 'Processing...',
    errorMessages: {
      fileType: 'Please upload a valid image file (JPEG, PNG, WebP)',
      fileSize: 'Image size should be less than 5MB',
      dimensions: 'Image dimensions should be at least 500x500 pixels',
      missingImages: 'Please upload both front and side photos',
      modelGeneration: 'Failed to generate 3D model. Please try again.',
      default: 'An error occurred. Please try again.',
    },
    measurements: {
      title: 'Your Body Measurements',
      unit: 'cm',
    },
    tips: {
      title: 'Tips for Best Results',
      items: [
        'Wear form-fitting clothing or a swimsuit',
        'Stand straight with good posture',
        'Ensure good lighting with minimal shadows',
        'Keep arms slightly away from your body (front view)',
        'Keep arms at your sides (side view)',
      ],
    },
  },
};
