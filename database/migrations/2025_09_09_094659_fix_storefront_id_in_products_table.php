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
        $table = 'products';
        $column = 'storefront_id';
        
        $columnExists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.COLUMNS " .
            "WHERE TABLE_SCHEMA = '{$db}' " .
            "AND TABLE_NAME = '{$table}' " .
            "AND COLUMN_NAME = '{$column}'"
        );
        
        if ($columnExists[0]->count == 0) {
            DB::statement('ALTER TABLE products ADD COLUMN storefront_id BIGINT UNSIGNED NULL AFTER id');
            DB::statement('ALTER TABLE products ADD CONSTRAINT products_storefront_id_foreign FOREIGN KEY (storefront_id) REFERENCES storefronts(id) ON DELETE SET NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // Use raw SQL to drop the column if it exists
        $db = config('database.connections.mysql.database');
        $table = 'products';
        $column = 'storefront_id';
        
        $constraintExists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS " .
            "WHERE CONSTRAINT_SCHEMA = '{$db}' " .
            "AND TABLE_NAME = '{$table}' " .
            "AND CONSTRAINT_NAME = 'products_storefront_id_foreign'"
        );
        
        if ($constraintExists[0]->count > 0) {
            DB::statement('ALTER TABLE products DROP FOREIGN KEY products_storefront_id_foreign');
        }
        
        $columnExists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.COLUMNS " .
            "WHERE TABLE_SCHEMA = '{$db}' " .
            "AND TABLE_NAME = '{$table}' " .
            "AND COLUMN_NAME = '{$column}'"
        );
        
        if ($columnExists[0]->count > 0) {
            DB::statement('ALTER TABLE products DROP COLUMN storefront_id');
        }
    }
};
