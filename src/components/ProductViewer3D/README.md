# 3D Product Viewer & Virtual Try-On

A React component for displaying 3D products with virtual try-on capabilities using Three.js, React Three Fiber, and Cannon.js.

## Features

- Display 3D product models (GLB format)
- Virtual try-on simulation with physics
- Color customization
- Interactive camera controls
- Responsive design
- Loading and error states
- Customizable UI

## Installation

First, make sure you have the required dependencies installed:

```bash
npm install @react-three/fiber @react-three/drei @react-three/cannon three @react-spring/three @react-spring/web
```

## Usage

```jsx
import ProductViewer3D from './components/ProductViewer3D';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ProductViewer3D 
        garmentUrl="/path/to/garment.glb"
        avatarUrl="/path/to/avatar.glb"
        colors={['#FF0000', '#00FF00', '#0000FF']}
        onLoaded={() => console.log('3D models loaded')}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `garmentUrl` | string | Yes | - | URL to the 3D model of the garment (GLB format) |
| `avatarUrl` | string | Yes | - | URL to the 3D model of the avatar (GLB format) |
| `colors` | string[] | No | `['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']` | Array of color values to cycle through |
| `onLoaded` | function | No | `() => {}` | Callback when the 3D models are loaded |
| `onError` | function | No | `(error) => console.error('3D Viewer Error:', error)` | Callback when there's an error loading the models |
| `style` | object | No | `{}` | Additional styles for the container |
| `className` | string | No | `''` | Additional class name for the container |

## Customization

You can customize the appearance by passing style props to the component:

```jsx
<ProductViewer3D 
  garmentUrl="/garment.glb"
  avatarUrl="/avatar.glb"
  style={{
    width: '800px',
    height: '600px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }}
/>
```

## Styling

The component uses Chakra UI for styling. You can customize the appearance by:

1. Using Chakra's style props
2. Overriding the default styles with CSS-in-JS
3. Using the `className` prop to apply custom CSS

## Browser Support

This component requires a modern browser with WebGL 2.0 support.

## License

MIT
