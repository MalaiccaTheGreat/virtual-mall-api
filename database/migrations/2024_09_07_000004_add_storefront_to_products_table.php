<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('storefront_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('attributes')->nullable();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['storefront_id']);
            $table->dropColumn(['storefront_id', 'is_featured', 'is_active', 'attributes']);
        });
    }
};
