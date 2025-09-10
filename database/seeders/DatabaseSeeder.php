<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing data
        \DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Clear existing users
        \App\Models\User::truncate();
        \App\Models\Storefront::truncate();
        
        // Reset auto-increment counters
        \DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');
        \DB::statement('ALTER TABLE storefronts AUTO_INCREMENT = 1');
        
        // Enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        // Create admin, store owner users, and products
        $this->call([
            AdminUserSeeder::class,
            ProductSeeder::class,
            // Add other seeders here as needed
        ]);
    }
}
