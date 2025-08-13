const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define the public directory
const publicDir = path.join(__dirname, '..', 'public');

// Define the favicon sizes
const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'pwa-192x192.png': 192,
  'pwa-512x512.png': 512,
  'android-chrome-192x192.png': 192,
};

// Royal blue color (hex: #1B3C73)
const royalBlue = { r: 27, g: 60, b: 115, alpha: 1 };

// Generate favicons
async function generateFavicons() {
  const sourceFile = path.join(__dirname, '../public/favicon-96x96.png');
  const outputDir = path.join(__dirname, '../public');

  try {
    // Ensure the public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate each favicon size
    for (const [filename, size] of Object.entries(sizes)) {
      await sharp(sourceFile)
        .resize(size, size)
        .toFile(path.join(outputDir, filename));
      console.log(`Generated ${filename}`);
    }

    // Update manifest.json
    const manifestPath = path.join(publicDir, 'manifest.json');
    const manifest = {
      name: 'Pulse & Threads',
      short_name: 'PulseThreads',
      description: 'Your Virtual Shopping Experience',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#1B3C73',
      icons: [
        {
          src: '/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          src: '/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Updated manifest.json');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
