<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Use raw SQL to check if column exists and add if it doesn't
        $db = config('database.connections.mysql.database');
        $table = 'storefronts';
        $column = 'owner_id';
        
        $columnExists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.COLUMNS " .
            "WHERE TABLE_SCHEMA = '{$db}' " .
            "AND TABLE_NAME = '{$table}' " .
            "AND COLUMN_NAME = '{$column}'"
        );
        
        if ($columnExists[0]->count == 0) {
            DB::statement('ALTER TABLE storefronts ADD COLUMN owner_id BIGINT UNSIGNED NULL AFTER description');
            DB::statement('ALTER TABLE storefronts ADD CONSTRAINT storefronts_owner_id_foreign FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('storefronts', function (Blueprint $table) {
            if (Schema::hasColumn('storefronts', 'owner_id')) {
                $table->dropForeign(['owner_id']);
                $table->dropColumn('owner_id');
            }
        });
    }
};
