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
        $table = 'product_variations';
        $column = 'is_default';
        
        $columnExists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.COLUMNS " .
            "WHERE TABLE_SCHEMA = '{$db}' " .
            "AND TABLE_NAME = '{$table}' " .
            "AND COLUMN_NAME = '{$column}'"
        );
        
        if ($columnExists[0]->count == 0) {
            DB::statement('ALTER TABLE product_variations ADD COLUMN is_default TINYINT(1) NOT NULL DEFAULT 0 AFTER barcode');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        // Use raw SQL to drop the column if it exists
        $db = config('database.connections.mysql.database');
        $table = 'product_variations';
        $column = 'is_default';
        
        $columnExists = DB::select(
            "SELECT COUNT(*) as count FROM information_schema.COLUMNS " .
            "WHERE TABLE_SCHEMA = '{$db}' " .
            "AND TABLE_NAME = '{$table}' " .
            "AND COLUMN_NAME = '{$column}'"
        );
        
        if ($columnExists[0]->count > 0) {
            DB::statement('ALTER TABLE product_variations DROP COLUMN is_default');
        }
    }
};
