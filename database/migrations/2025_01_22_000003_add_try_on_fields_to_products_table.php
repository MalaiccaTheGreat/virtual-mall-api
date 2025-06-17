
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('clothing_category')->nullable()->after('category');
            $table->json('available_sizes')->nullable()->after('clothing_category');
            $table->json('color_variants')->nullable()->after('available_sizes');
            $table->string('try_on_model_path')->nullable()->after('color_variants');
            $table->boolean('is_try_on_enabled')->default(false)->after('try_on_model_path');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'clothing_category',
                'available_sizes', 
                'color_variants',
                'try_on_model_path',
                'is_try_on_enabled'
            ]);
        });
    }
};
