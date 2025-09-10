<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Storefronts API
    Route::apiResource('storefronts', StorefrontController::class);
    
    // Products API
    Route::apiResource('products', ProductController::class);
    
    // Product variations
    Route::prefix('products/{product}/variations')->group(function () {
        Route::get('/', [ProductController::class, 'variationsIndex']);
        Route::post('/', [ProductController::class, 'storeVariation']);
        Route::put('/{variation}', [ProductController::class, 'updateVariation']);
        Route::delete('/{variation}', [ProductController::class, 'destroyVariation']);
        Route::post('/{variation}/set-default', [ProductController::class, 'setDefaultVariation']);
    });
    
    // Price history
    Route::get('price-history/{type}/{id}', [ProductController::class, 'priceHistory']);
});
