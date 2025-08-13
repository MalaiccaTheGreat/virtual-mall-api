 <?php
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#1B3C73">
    <meta name="description" content="Pulse & Threads - Your Virtual Shopping Experience">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Pulse & Threads Virtual Mall') }}</title>

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/favicon-16x16.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('images/favicon-96x96.png') }}">
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('images/android-chrome-192x192.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/apple-touch-icon.png') }}">
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'], 'build')
    <link rel="preload" href="{{ asset('build/assets/app-WaJiU3aO.css') }}" as="style">
    <link rel="preload" href="{{ asset('build/assets/app-CSWTXqOx.js') }}" as="script">
</head>
<body class="font-sans antialiased">
    <div id="app">
        <!-- Other form markup… -->

        <!-- Your Vue modal component will live here -->
        <product-modal
            v-if="showProductModal"
            @close="showProductModal = false"
        />
    </div>

    <!-- Pass the “just-created” flag into