<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TwoFactorAuthController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductController;

Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Two-Factor Authentication Routes
Route::prefix('2fa')->group(function () {
    Route::post('/send-verification', [TwoFactorAuthController::class, 'sendVerificationCode']);
    Route::post('/verify', [TwoFactorAuthController::class, 'verifyCode']);
    Route::post('/send-code', [TwoFactorAuthController::class, 'sendTwoFactorCode']);
    Route::post('/verify-code', [TwoFactorAuthController::class, 'verifyTwoFactorCode']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::post('/products/{product}/add-to-cart', [ProductController::class, 'addToCart']);

// Virtual Assistant Route
Route::post('/chat', [App\Http\Controllers\VirtualAssistantController::class, 'handleMessage']);
