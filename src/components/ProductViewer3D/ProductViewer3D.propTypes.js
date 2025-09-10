import PropTypes from 'prop-types';

export const ProductViewer3DPropTypes = {
  /** URL to the 3D model of the garment (GLB format) */
  garmentUrl: PropTypes.string.isRequired,
  
  /** URL to the 3D model of the avatar (GLB format) */
  avatarUrl: PropTypes.string.isRequired,
  
  /** Array of color values to cycle through */
  colors: PropTypes.arrayOf(PropTypes.string),
  
  /** Callback when the 3D models are loaded */
  onLoaded: PropTypes.func,
  
  /** Callback when there's an error loading the models */
  onError: PropTypes.func,
  
  /** Additional styles for the container */
  style: PropTypes.object,
  
  /** Additional class name for the container */
  className: PropTypes.string,
};

export const ProductViewer3DDefaultProps = {
  colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
  onLoaded: () => {},
  onError: (error) => console.error('3D Viewer Error:', error),
  style: {},
  className: '',
};
