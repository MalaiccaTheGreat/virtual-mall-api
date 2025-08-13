const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkAndGenerateFavicons() {
  const publicDir = path.join(__dirname, '../public');
  const sourceFavicon = path.join(publicDir, 'favicon-96x96.png');

  try {
    // Check if source favicon exists
    if (!fs.existsSync(sourceFavicon)) {
      console.error('Source favicon (favicon-96x96.png) not found!');
      return;
    }

    // Generate missing favicon sizes
    const sizes = {
      'favicon-16x16.png': 16,
      'favicon-32x32.png': 32,
      'pwa-192x192.png': 192,
      'pwa-512x512.png': 512,
    };

    for (const [filename, size] of Object.entries(sizes)) {
      const outputPath = path.join(publicDir, filename);
      if (!fs.existsSync(outputPath)) {
        console.log(`Generating ${filename}...`);
        await sharp(sourceFavicon).resize(size, size).toFile(outputPath);
      }
    }

    // Generate favicon.ico
    const icoPath = path.join(publicDir, 'favicon.ico');
    if (!fs.existsSync(icoPath)) {
      console.log('Generating favicon.ico...');
      await sharp(sourceFavicon).resize(48, 48).toFile(icoPath);
    }

    console.log('All favicon files are in place!');
  } catch (error) {
    console.error('Error checking/generating favicons:', error);
  }
}

checkAndGenerateFavicons();
