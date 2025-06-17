const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function renameAndGenerateAssets() {
  const publicDir = path.join(__dirname, '../public');

  try {
    // Rename files
    if (fs.existsSync(path.join(publicDir, 'web-app-manifest-192x192.png'))) {
      fs.renameSync(
        path.join(publicDir, 'web-app-manifest-192x192.png'),
        path.join(publicDir, 'pwa-192x192.png')
      );
    }

    if (fs.existsSync(path.join(publicDir, 'web-app-manifest-512x512.png'))) {
      fs.renameSync(
        path.join(publicDir, 'web-app-manifest-512x512.png'),
        path.join(publicDir, 'pwa-512x512.png')
      );
    }

    // Generate missing favicon sizes
    const sourceFavicon = path.join(publicDir, 'favicon-96x96.png');

    if (fs.existsSync(sourceFavicon)) {
      // Generate 16x16
      await sharp(sourceFavicon)
        .resize(16, 16)
        .toFile(path.join(publicDir, 'favicon-16x16.png'));

      // Generate 32x32
      await sharp(sourceFavicon)
        .resize(32, 32)
        .toFile(path.join(publicDir, 'favicon-32x32.png'));

      // Generate favicon.ico
      await sharp(sourceFavicon)
        .resize(48, 48)
        .toFile(path.join(publicDir, 'favicon.ico'));
    }

    console.log('PWA assets have been configured successfully!');
  } catch (error) {
    console.error('Error configuring PWA assets:', error);
  }
}

renameAndGenerateAssets();
