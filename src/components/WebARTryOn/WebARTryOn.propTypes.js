import PropTypes from 'prop-types';

export const WebARTryOnPropTypes = {
  /** URL to the 3D model of the sunglasses (GLB format) */
  modelUrl: PropTypes.string.isRequired,
  
  /** Callback when an error occurs */
  onError: PropTypes.func,
  
  /** Additional styles */
  style: PropTypes.object,
  
  /** Additional class name */
  className: PropTypes.string,
};

export const WebARTryOnDefaultProps = {
  onError: (error) => console.error('WebAR Error:', error),
  style: {},
  className: '',
};
