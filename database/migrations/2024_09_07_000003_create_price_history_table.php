<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('price_history', function (Blueprint $table) {
            $table->id();
            $table->morphs('priceable'); // Can be either product or variation
            $table->decimal('old_price', 10, 2);
            $table->decimal('new_price', 10, 2);
            $table->foreignId('changed_by')->constrained('users');
            $table->timestamp('changed_at');
            $table->text('reason')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('price_history');
    }
};
