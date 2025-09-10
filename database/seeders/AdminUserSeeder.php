<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create store owner user
        $storeOwner = User::firstOrCreate(
            ['email' => 'store.owner@example.com'],
            [
                'name' => 'Store Owner',
                'password' => Hash::make('password'),
                'role' => 'store_owner',
                'is_admin' => false,
                'email_verified_at' => now(),
            ]
        );

        // Create a default storefront for the store owner
        if ($storeOwner) {
            $this->call(StorefrontSeeder::class);
            
            // Update the store owner with the main storefront
            $mainStorefront = \App\Models\Storefront::where('slug', 'fashion-hub')->first();
            if ($mainStorefront) {
                $storeOwner->storefront_id = $mainStorefront->id;
                $storeOwner->save();
            }
        }

        $this->command->info('Admin and store owner users created successfully!');
        $this->command->info('Admin email: admin@example.com');
        $this->command->info('Store Owner email: store.owner@example.com | Store: fashion-hub');
        $this->command->info('Password for both: password');
    }
}
