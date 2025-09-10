<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('email_verified_at');
            $table->foreignId('storefront_id')
                  ->nullable()
                  ->after('role')
                  ->constrained('storefronts')
                  ->onDelete('set null');
            $table->boolean('is_admin')->default(false)->after('storefront_id');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['storefront_id']);
            $table->dropColumn(['role', 'storefront_id', 'is_admin']);
        });
    }
};
