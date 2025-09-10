# WebAR Try-On Component

A React component that enables augmented reality try-on experiences for sunglasses using WebXR and Three.js.

## Features

- WebXR-based AR experience
- 3D model rendering with Three.js
- Device camera integration
- Responsive design
- Error handling and loading states
- User-friendly interface with instructions

## Prerequisites

- React 16.8+
- Three.js
- @react-three/fiber
- @react-three/xr
- A device with WebXR support (mobile recommended)

## Installation

1. Install the required dependencies:

```bash
npm install @react-three/fiber @react-three/xr @react-three/drei three
```

## Usage

```jsx
import WebARTryOn from './components/WebARTryOn';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <WebARTryOn 
        modelUrl="/path/to/sunglasses.glb"
        onError={(error) => console.error('AR Error:', error)}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modelUrl` | string | Yes | - | URL to the 3D model of the sunglasses (GLB format) |
| `onError` | function | No | `(error) => console.error('WebAR Error:', error)` | Callback when an error occurs |
| `style` | object | No | `{}` | Additional styles for the container |
| `className` | string | No | `''` | Additional class name for the container |

## Browser Support

This component requires a browser with WebXR support. Currently supported in:

- Chrome for Android (version 81+)
- Safari on iOS 13+ (with some limitations)
- Chrome for Desktop (with flags enabled)
- Microsoft Edge (version 79+)

## Best Practices

1. **Model Optimization**:
   - Keep your 3D models under 5MB
   - Use compressed GLB format
   - Optimize textures (recommended max 2048x2048)

2. **Lighting**:
   - Use environment lighting for more realistic rendering
   - Consider adding a light probe for better material rendering

3. **Performance**:
   - Limit the number of polygons in your 3D models
   - Use LOD (Level of Detail) for complex models
   - Optimize textures with compression

## Troubleshooting

### AR Not Working
- Ensure your device supports WebXR
- Check if the camera permission is granted
- Try a different browser (Chrome for Android recommended)

### 3D Model Not Loading
- Verify the model URL is correct
- Check the browser console for loading errors
- Ensure the model is in GLB format

### Performance Issues
- Reduce polygon count of 3D models
- Use smaller texture sizes
- Close other AR applications running in the background

## License

MIT
