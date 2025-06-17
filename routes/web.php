<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\VirtualAssistantController;
use App\Http\Controllers\VirtualTryOnController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Public Product Routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->where('product', '[0-9]+')->name('products.show');
Route::post('/products/{product}/add-to-cart', [ProductController::class, 'addToCart'])->where('product', '[0-9]+')->name('products.add-to-cart');

// Virtual Assistant Route
Route::post('/api/virtual-assistant', [VirtualAssistantController::class, 'respond']);

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
Route::get('/api/user', [AuthController::class, 'user'])->middleware('auth');

// Protected Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => view('app'))->name('dashboard'); // Let React route internally

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('products', ProductController::class)->except(['show']);

    Route::prefix('products')->group(function () {
        Route::post('/{product}/images', [ProductController::class, 'storeImages'])->where('product', '[0-9]+')->name('products.images.store');
        Route::delete('/{product}/images/{media}', [ProductController::class, 'destroyImage'])->where(['product' => '[0-9]+', 'media' => '[0-9]+'])->name('products.images.destroy');
    });

    Route::get('/api/cart', [CartController::class, 'index']);
    Route::post('/api/cart/add', [CartController::class, 'add']);
    Route::delete('/api/cart/remove/{id}', [CartController::class, 'remove'])->where('id', '[0-9]+');
    Route::delete('/api/cart/clear', [CartController::class, 'clear']);
    Route::patch('/api/cart/quantity/{id}', [CartController::class, 'updateQuantity'])->where('id', '[0-9]+');

    Route::get('/virtual-try-on', [VirtualTryOnController::class, 'index'])->name('virtual-try-on');
});

// Public product view
Route::get('/products/{product}/view', [ProductController::class, 'publicShow'])->where('product', '[0-9]+')->name('products.public.show');

// React SPA fallback route
Route::view('/{any}', 'app')->where('any', '.*'); // Added catch-all route

// Debug/Test Route
Route::get('/test-auth', [AuthController::class, 'test']);

// Auth scaffolding (if used)
require __DIR__.'/auth.php';