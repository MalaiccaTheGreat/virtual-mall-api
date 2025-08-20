<?php

return [
    'build_path' => 'build',
    'assets_path' => 'resources',
    'pipeline' => 'vite',
    'manifest' => [
        'name' => 'manifest.json',
        'path' => 'build/manifest.json',
    ],
    'dev_server' => [
        'url' => env('VITE_DEV_SERVER_URL', 'http://localhost:3000'),
        'ping_url' => null,
        'ping_timeout' => 1,
    ],
];
