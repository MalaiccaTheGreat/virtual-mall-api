<?php

namespace Database\Seeders;

use App\Models\Storefront;
use App\Models\User;
use Illuminate\Database\Seeder;

class StorefrontSeeder extends Seeder
{
    public function run()
    {
        // Get the store owner user
        $storeOwner = User::where('email', 'store.owner@example.com')->firstOrFail();
        
        // Create a default storefront
        $storefront = Storefront::firstOrCreate(
            ['slug' => 'fashion-hub'],
            [
                'name' => 'Fashion Hub',
                'description' => 'Your one-stop shop for the latest fashion trends',
                'owner_id' => $storeOwner->id,
                'primary_color' => '#4f46e5',
                'secondary_color' => '#7c3aed',
                'is_active' => true,
                'theme_settings' => [
                    'font_family' => 'Inter',
                    'button_style' => 'rounded',
                    'header_style' => 'sticky',
                ],
            ]
        );

        // Create additional storefronts for testing
        $storefronts = [
            [
                'name' => 'Tech Gadgets',
                'slug' => 'tech-gadgets',
                'description' => 'Latest technology and gadgets at your fingertips',
                'owner_id' => $storeOwner->id,
                'primary_color' => '#2563eb',
                'secondary_color' => '#1d4ed8',
                'is_active' => true,
            ],
            [
                'name' => 'Home & Living',
                'slug' => 'home-living',
                'description' => 'Everything you need for your home',
                'owner_id' => $storeOwner->id,
                'primary_color' => '#059669',
                'secondary_color' => '#047857',
                'is_active' => true,
            ],
        ];

        foreach ($storefronts as $storeData) {
            Storefront::firstOrCreate(
                ['slug' => $storeData['slug']],
                array_merge($storeData, [
                    'theme_settings' => [
                        'font_family' => 'Inter',
                        'button_style' => 'rounded',
                        'header_style' => 'sticky',
                    ],
                ])
            );
        }

        $this->command->info('Storefronts created successfully!');
    }
}
