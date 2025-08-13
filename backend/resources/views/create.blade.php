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
<body class="font-sans antialiased bg-dark text-white">
    <div id="app" class="max-w-xl mx-auto mt-10 p-6 rounded shadow">
        @if(session('success'))
            <div class="bg-green-700 p-3 rounded mb-4">{{ session('success') }}</div>
        @endif

        <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data" class="mb-8">
            @csrf
            <label class="block mb-2">Product Name</label>
            <input type="text" name="name" class="w-full mb-4 p-2 text-black rounded" required>

            <label class="block mb-2">Price</label>
            <input type="number" step="0.01" name="price" class="w-full mb-4 p-2 text-black rounded" required>

            <label class="block mb-2">Product Image</label>
            <input type="file" name="image" class="w-full mb-4" required>

            <button type="submit" class="bg-royal text-white px-6 py-2 rounded hover:scale-105 transition">
                Upload Product
            </button>
        </form>

        <!-- Vue Product Modal Component -->
        <product-modal
            v-if="showProductModal"
            @close="showProductModal = false"
        />
    </div>

    <!-- Pass the “just-created” flag into JS for Vue -->
    <script>
        window.showProductModal = @json(session('success') ? true : false);
    </script>
</body>
</html>