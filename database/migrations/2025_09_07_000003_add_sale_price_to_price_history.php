<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('price_history', function (Blueprint $table) {
            $table->decimal('old_sale_price', 10, 2)->nullable()->after('new_price');
            $table->decimal('new_sale_price', 10, 2)->nullable()->after('old_sale_price');
            
            // Make changed_by nullable for system changes
            $table->foreignId('changed_by')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('price_history', function (Blueprint $table) {
            $table->dropColumn(['old_sale_price', 'new_sale_price']);
            
            // Revert changed_by to not nullable
            $table->foreignId('changed_by')->nullable(false)->change();
        });
    }
};
