
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('try_on_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('try_on_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('clothing_category');
            $table->json('position_data')->nullable();
            $table->string('size')->nullable();
            $table->string('color_variant')->nullable();
            $table->timestamps();

            $table->index(['try_on_session_id', 'clothing_category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('try_on_items');
    }
};
