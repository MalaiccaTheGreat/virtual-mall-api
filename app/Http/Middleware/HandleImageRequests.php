<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Storage;

class HandleImageRequests
{
    private function getMimeType(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
        ];
        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->path();
        
        // Check if the request is for an image
        if (preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $path)) {
            // Try to find the image in different locations
            $locations = [
                public_path($path),
                public_path('images/' . basename($path)),
                storage_path('app/public/' . $path),
                resource_path('js/assets/' . $path)
            ];

            foreach ($locations as $location) {
                if (file_exists($location)) {
                    return response()->file($location, [
                        'Content-Type' => $this->getMimeType($location),
                        'Cache-Control' => 'public, max-age=31536000',
                    ]);
                }
            }

            // If image not found, return fallback image or 404
            $fallback = public_path('images/fallback-logo.png');
            if (file_exists($fallback)) {
                return response()->file($fallback, [
                    'Content-Type' => 'image/png',
                    'Cache-Control' => 'public, max-age=31536000',
                ]);
            }

            // If no fallback, return 404
            return response()->json(['error' => 'Image not found'], 404);
        }

        return $next($request);
    }
} 