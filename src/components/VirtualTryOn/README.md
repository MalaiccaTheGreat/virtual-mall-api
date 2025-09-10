# Virtual Try-On Component

A React component that enables users to create a 3D avatar by uploading front and side profile photos, which can then be used for virtual try-on of clothing items.

## Features

- 📸 **Image Upload**: Upload front and side profile photos with preview
- 🔄 **Real-time Processing**: Get instant 3D model generation
- 🎮 **3D Interaction**: Rotate, zoom, and pan the 3D model
- 📏 **Body Measurements**: View detailed body measurements
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🛠 **Error Handling**: Comprehensive error states and validations
- 🎨 **Customizable**: Easy to style and extend

## Installation

1. Install the required dependencies:

```bash
npm install @react-three/fiber @react-three/drei three axios @chakra-ui/react @emotion/react @emotion/styled framer-motion react-icons
```

2. Set up your environment variables in `.env`:

```env
REACT_APP_SIZESTREAM_API_KEY=your_sizestream_api_key_here
```

## Usage

### Basic Usage

```jsx
import { ChakraProvider } from '@chakra-ui/react';
import VirtualTryOn from './components/VirtualTryOn';

function App() {
  return (
    <ChakraProvider>
      <VirtualTryOn />
    </ChakraProvider>
  );
}
```

### With Custom Styling

```jsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import VirtualTryOn from './components/VirtualTryOn';

const theme = extendTheme({
  colors: {
    brand: {
      500: '#3182ce',
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <VirtualTryOn />
    </ChakraProvider>
  );
}
```

## Component Structure

```
VirtualTryOn/
├── VirtualTryOn.jsx    # Main component
├── api.js             # API integration
├── styles.css         # Component styles
└── index.js           # Component export
```

## API Integration

The component integrates with the SizeStream API for 3D model generation:

### Request

```
POST https://api.sizestream.com/v1/scan
Content-Type: multipart/form-data

{
  front_image: File,    // Front view image
  side_image: File,    // Side view image
  api_key: string      // Your SizeStream API key
}
```

### Response

```json
{
  "model_url": "https://api.sizestream.com/models/abc123.glb",
  "measurements": {
    "height": 175,
    "chest": 95,
    "waist": 80,
    "hips": 100,
    "inseam": 81,
    "sleeve_length": 63
  }
}
```

## Error Handling

The component handles various error cases:

- ❌ Missing API key
- ❌ Invalid file types (only JPG, PNG, WebP allowed)
- ❌ File size too large (max 5MB)
- ❌ Image dimensions too small (min 500x500px)
- ❌ Missing required images
- ❌ API request failures

## Customization

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onSuccess | function | - | Callback when model is successfully generated |
| onError | function | - | Callback when an error occurs |
| theme | object | - | Custom theme object |

### Styling

You can customize the component's appearance by:

1. Overriding the default Chakra UI theme
2. Using the `sx` prop for inline styles
3. Importing and modifying the `styles.css` file

## Dependencies

- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for Three.js
- **three**: 3D library
- **axios**: HTTP client for API requests
- **@chakra-ui/react**: UI component library
- **react-icons**: Icons for the UI
- **framer-motion**: Animation library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome for Android

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For support, please open an issue in the repository.
