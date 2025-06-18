<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price_kwacha', 10, 2);
            $table->decimal('price_usd', 10, 2);
            $table->string('category');
            $table->string('brand')->nullable();
            $table->boolean('is_virtual_try_on_enabled')->default(false);
            $table->json('virtual_try_on_settings')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
}; 