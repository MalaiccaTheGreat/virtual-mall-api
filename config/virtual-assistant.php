<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Virtual Assistant Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration settings for the virtual assistant.
    |
    */

    'name' => env('VIRTUAL_ASSISTANT_NAME', 'Pulse & Threads Assistant'),
    
    'brand_colors' => [
        'primary' => env('VIRTUAL_ASSISTANT_BRAND_COLOR_PRIMARY', '#1e3a8a'),
        'secondary' => env('VIRTUAL_ASSISTANT_BRAND_COLOR_SECONDARY', '#FFD700'),
    ],

    'ai' => [
        'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
        'max_tokens' => env('OPENAI_MAX_TOKENS', 150),
        'temperature' => env('OPENAI_TEMPERATURE', 0.7),
    ],
]; 