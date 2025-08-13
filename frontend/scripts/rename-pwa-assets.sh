#!/bin/bash

# Move to the public directory
cd public

# Rename favicon files to match PWA configuration
mv web-app-manifest-192x192.png pwa-192x192.png
mv web-app-manifest-512x512.png pwa-512x512.png

# Generate missing favicon sizes if they don't exist
if [ ! -f favicon-16x16.png ]; then
    convert favicon-96x96.png -resize 16x16 favicon-16x16.png
fi

if [ ! -f favicon-32x32.png ]; then
    convert favicon-96x96.png -resize 32x32 favicon-32x32.png
fi

# Ensure favicon.ico exists
if [ ! -f favicon.ico ]; then
    convert favicon-96x96.png -define icon:auto-resize=48,32,16 favicon.ico
fi

echo "PWA assets have been configured successfully!" 