<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Only add columns that don't already exist
            $table->string('seo_title')->nullable()->after('is_active');
            $table->text('seo_description')->nullable()->after('seo_title');
            $table->text('seo_keywords')->nullable()->after('seo_description');
            $table->string('slug')->unique()->nullable()->after('seo_keywords');
            $table->decimal('sale_price_kwacha', 10, 2)->nullable()->after('price_usd');
            $table->decimal('sale_price_usd', 10, 2)->nullable()->after('sale_price_kwacha');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'seo_title',
                'seo_description',
                'seo_keywords',
                'slug',
                'sale_price_kwacha',
                'sale_price_usd'
            ]);
        });
    }
};
