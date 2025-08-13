import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};

const sourceLogo = join(__dirname, '../public/images/Logo.jpg');
const outputDir = join(__dirname, '../public/images');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate each favicon size
for (const [filename, size] of Object.entries(sizes)) {
  try {
    await sharp(sourceLogo)
      .resize(size, size)
      .toFile(join(outputDir, filename));
    console.log(`Generated ${filename}`);
  } catch (err) {
    console.error(`Error generating ${filename}:`, err);
  }
}
